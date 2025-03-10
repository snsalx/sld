import {
  ArrowPathIcon,
  ChevronUpDownIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/16/solid";
import { Slide, SlideObject } from "../../common";
import { Fragment, MouseEvent, ReactNode, useEffect, useRef } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function Canvas({
  slide,
  projectId,
  setSlide,
  onSave,
}: {
  slide: Slide;
  projectId: string;
  setSlide?: (update: Slide) => void;
  onSave?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouse(
    target: SlideObject,
    type: "move" | "resize" | "rotate" | "release",
    x: number,
    y: number,
    objectRef: any,
  ) {
    if (!ref || !ref.current || !setSlide || !onSave) {
      return;
    }

    if (type === "release") {
      onSave();
      return;
    }

    const screen = ref.current.getBoundingClientRect();
    const oldGeo = target.geometry;

    let angle = oldGeo.rotation || 0;

    if (type !== "rotate") {
      // apply rotation
      const realGeo = objectRef.current;
      const initialButtonAngle = Math.atan(
        realGeo.clientWidth / realGeo.clientHeight,
      );
      const radians = -angle / (180 / Math.PI) + initialButtonAngle;

      const center = {
        x: x - realGeo.clientWidth / 2,
        y: y - realGeo.clientHeight / 2,
      };
      const radius =
        Math.sqrt(realGeo.clientWidth ** 2 + realGeo.clientHeight ** 2) / 2;
      const button = {
        x: center.x + radius * Math.sin(radians),
        y: center.y + radius * Math.cos(radians),
      };
      x = button.x;
      y = button.y;

      x = (x / screen.width) * 100;
      y = (y / screen.height) * 100;
    } else {
      x -= (screen.width * (oldGeo.left + oldGeo.width / 2)) / 100;
      y -= (screen.height * (oldGeo.top + oldGeo.height / 2)) / 100;

      const cornerX = (screen.width * (oldGeo.left + oldGeo.width)) / 100;
      const cornerY = (screen.width * oldGeo.top) / 100;

      const arctan = Math.floor(Math.atan(x / y) * (180 / Math.PI));
      const corner = Math.floor(Math.atan(cornerX / cornerY) * (180 / Math.PI));
      angle = y <= 0 ? -arctan : 180 - arctan;
      angle -= corner;
    }

    console.log(Math.tan(angle / (180 / Math.PI)));

    const update: SlideObject = {
      ...target,
      geometry: {
        left: snapToGrid(type === "move" ? x : oldGeo.left),
        top: snapToGrid(type === "move" ? y : oldGeo.top),
        width: snapToGrid(type === "resize" ? x - oldGeo.left : oldGeo.width),
        height: snapToGrid(type === "resize" ? y - oldGeo.top : oldGeo.height),
        borderRadius: oldGeo.borderRadius,
        rotation: angle,
      },
    };

    const rest = slide.objects.filter((obj) => obj.id !== target.id);
    setSlide({ ...slide, objects: [...rest, update] });
  }

  function handleClick(event: MouseEvent, target: SlideObject) {
    if (!setSlide || !onSave) {
      return;
    }

    let objects = slide.objects;

    if (!event.shiftKey) {
      objects = slide.objects.map(
        (object): SlideObject => ({ ...object, selected: false }),
      );
    }

    const rest = objects.filter((obj) => obj.id !== target.id);
    setSlide({ ...slide, objects: [...rest, { ...target, selected: true }] });
  }

  // bug: no unselect support

  function handleObjectUpdate(target: SlideObject) {
    if (!setSlide || !onSave) {
      return;
    }

    const rest = slide.objects.filter((obj) => obj.id !== target.id);
    setSlide({ ...slide, objects: [...rest, target] });
    onSave();
  }

  return (
    <div ref={ref} className="relative h-full">
      {slide.objects.map((object) => (
        <ObjectComponent
          {...object}
          projectId={projectId}
          onMouse={(type, x, y, ref) => handleMouse(object, type, x, y, ref)}
          onClick={
            setSlide && onSave
              ? (event) => handleClick(event, object)
              : undefined
          }
          onUpdate={handleObjectUpdate}
          key={object.id}
        />
      ))}
    </div>
  );
}

const gridCellInPercent = 2; // lower number means finer grid
function snapToGrid(coordinate: number) {
  return Math.floor(coordinate / gridCellInPercent) * gridCellInPercent;
}

export function ObjectComponent(
  props: SlideObject & {
    projectId: string;
    onMouse: (
      type: "move" | "resize" | "rotate" | "release",
      x: number,
      y: number,
      ref: any,
    ) => void;
    onClick?: (event: MouseEvent<HTMLDivElement>) => void;
    onUpdate: (update: SlideObject) => void;
  },
) {
  const geometryEntries = Object.entries(props.geometry).map(([k, v]) => [
    k,
    `${v}%`,
  ]);
  const geometry = Object.fromEntries(geometryEntries);
  if (props.geometry.rotation) {
    geometry.transform = "rotate(" + props.geometry.rotation + "deg)";
  }
  const contentRef = useRef<any>(null);
  const containerRef = useRef<any>(null);

  useEffect(() => {
    if (props.selected) {
      contentRef?.current?.focus();
    }
  }, [contentRef]);

  function startTracking(type: "move" | "resize" | "rotate") {
    const controller = new AbortController();
    window.addEventListener(
      "touchend",
      () => {
        controller.abort();
        props.onMouse("release", 0, 0, null);
      },
      { signal: controller.signal },
    );
    window.addEventListener(
      "mouseup",
      () => {
        controller.abort();
        props.onMouse("release", 0, 0, null);
        contentRef?.current?.focus();
      },
      { signal: controller.signal },
    );

    window.addEventListener(
      "touchmove",
      (event) => {
        const touch = event.touches[0];
        props.onMouse(type, touch.clientX, touch.clientY, contentRef);
      },
      { signal: controller.signal },
    );
    window.addEventListener(
      "mousemove",
      (event) => {
        props.onMouse(type, event.clientX, event.clientY, contentRef);
      },
      { signal: controller.signal },
    );
  }

  let body;
  const content = props.content;
  switch (content.kind) {
    case "text":
      body = (
        <textarea
          ref={contentRef}
          className="h-full w-full resize-none rounded-[inherit] bg-surface1 p-2 focus:outline-none"
          onChange={(event) =>
            props.onUpdate({
              ...props,
              content: { ...content, body: event.target.value },
            })
          }
          value={content.body}
        />
      );
      break;
    case "arrow":
      const { width, height } = contentRef.current
        ? contentRef.current.getBoundingClientRect()
        : { width: 0, height: 0 };

      body = (
        <svg
          viewBox={"0 0 " + width + " " + height}
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          ref={contentRef}
        >
          {/* originally from MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/marker */}

          <defs>
            {/* A marker to be used as an arrowhead */}
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              className="fill-lavender"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>

          {/* A line with a marker */}
          <line
            x1={0}
            y1={height / 2}
            x2={width - 10}
            y2={height / 2}
            className="stroke-lavender stroke-[4]"
            markerEnd="url(#arrow)"
          />
        </svg>
      );
      break;
    case "image":
      body = (
        <img
          src={content.src}
          ref={contentRef}
          className={`h-full w-full select-none rounded-[inherit] bg-surface1 ${content.fit === "cover" ? "object-cover" : "object-contain"}`}
        />
      );
      break;
    case "button":
      body = (
        <div
          ref={contentRef}
          className="h-full w-full select-none rounded-[inherit] bg-text opacity-50"
        />
      );
      break;
  }

  const Wrapper: ({ children }: { children: ReactNode }) => ReactNode =
    props.onClick || !props.link
      ? Fragment
      : ({ children }) => (
          <Link
            href={
              props.link!.kind === "url"
                ? "/external?url=" + props.link!.value
                : "/" + props.projectId + "/" + props.link!.value
            }
            className="rounded-[inherit]"
          >
            {children}
          </Link>
        );

  return (
    <div
      style={geometry}
      className={
        "absolute rounded-lg border-2" +
        (props.selected
          ? " border-sky"
          : props.link
            ? " select-none border-green"
            : " select-none dark:border-crust")
      }
      ref={containerRef}
      onMouseDown={props.onClick}
    >
      {props.selected && (
        <>
          <button
            onMouseDown={() => startTracking("move")}
            onTouchStart={() => startTracking("move")}
            className="absolute z-50 flex h-16 w-16 cursor-grab items-center justify-center rounded-full bg-base fill-text opacity-50 transition hover:bg-blue hover:fill-base hover:opacity-100 active:cursor-grabbing active:bg-blue active:fill-base active:opacity-100"
            style={{ top: 0, left: 0, transform: "translate(-50%, -50%)" }}
          >
            <ViewfinderCircleIcon className="size-8 rotate-45 fill-inherit text-base" />
          </button>
          <button
            onMouseDown={() => startTracking("rotate")}
            onTouchStart={() => startTracking("rotate")}
            className="absolute z-50 flex hidden h-16 w-16 cursor-grab items-center justify-center rounded-full bg-base fill-text opacity-50 transition hover:bg-sky hover:fill-base hover:opacity-100 active:cursor-grabbing active:bg-sky active:fill-base active:opacity-100"
            style={{ top: 0, right: 0, transform: "translate(50%, -50%)" }}
          >
            <ArrowPathIcon className="size-8 fill-inherit text-base" />
          </button>
          <button
            onMouseDown={() => startTracking("resize")}
            onTouchStart={() => startTracking("resize")}
            className="absolute z-50 flex h-16 w-16 cursor-se-resize items-center justify-center rounded-full bg-base fill-text opacity-50 transition hover:bg-green hover:fill-base hover:opacity-100 active:cursor-grabbing active:bg-green active:fill-base active:opacity-100"
            style={{ bottom: 0, right: 0, transform: "translate(50%, 50%)" }}
          >
            <ChevronUpDownIcon className="size-8 -rotate-45 fill-inherit text-base" />
          </button>
        </>
      )}
      <Wrapper>{body}</Wrapper>
    </div>
  );
}
