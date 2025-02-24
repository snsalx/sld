import {
    ArrowPathIcon,
  ChevronUpDownIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/16/solid";
import { Slide, SlideObject } from "../../common";
import { MouseEvent, useRef } from "react";

export default function Canvas({
  slide,
  setSlide,
  onSave,
}: {
  slide: Slide;
  setSlide: (update: Slide) => void;
  onSave: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouse(
    target: SlideObject,
    type: "move" | "resize" | "rotate" | "release",
    x: number,
    y: number,
  ) {
    if (!ref || !ref.current) {
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
      const isAtTop = Number(type === "move");
      const isAtLeft = Number(type === "move");
      if (x < 0) x = 0;
      if (x + (oldGeo.width / 100) * screen.width * isAtLeft > screen.width)
        x = screen.width - (oldGeo.width / 100) * screen.width * isAtLeft;
      if (y < 0) y = 0;
      if (
        y + (oldGeo.height / 100) * screen.height * isAtTop >
        screen.height
      )
        y = screen.height - (oldGeo.height / 100) * screen.height * isAtTop;
    } else {
      x -= screen.width * (oldGeo.left + oldGeo.width/2) / 100;
      y -= screen.height * (oldGeo.top + oldGeo.height/2) / 100;

      const cornerX = screen.width * (oldGeo.left + oldGeo.width) / 100;
      const cornerY = screen.width * oldGeo.top / 100;

      const arctan = Math.floor(Math.atan(x/y) * (180 / Math.PI))
      const corner = Math.floor(Math.atan(cornerX/cornerY) * (180 / Math.PI))
      angle = y <= 0 ? -arctan : 180-arctan;
      angle -= corner;
    }

    console.log(Math.tan(angle / (180 / Math.PI)))

    const update: SlideObject = {
      ...target,
      geometry: {
        left: snapToGrid(type === "move" ? (x / screen.width) * 100  - oldGeo.width * Math.sin(angle / (180 / Math.PI)) : oldGeo.left),
        top: snapToGrid(type === "move" ? (y / screen.height) * 100 - oldGeo.height / 2 - 0*oldGeo.height * Math.sin(angle / (180 / Math.PI)) : oldGeo.top),
        width: snapToGrid(
          type === "resize"
            ? (x / screen.width) * 100 - oldGeo.left
            : oldGeo.width,
        ),
        height: snapToGrid(
          type === "resize"
            ? (y / screen.height) * 100 - oldGeo.top
            : oldGeo.height,
        ),
        borderRadius: oldGeo.borderRadius,
        rotation: angle,
      },
    };

    const rest = slide.objects.filter((obj) => obj.id !== target.id);
    setSlide({ ...slide, objects: [...rest, update] });
  }

  function handleClick(event: MouseEvent, target: SlideObject) {
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
    const rest = slide.objects.filter((obj) => obj.id !== target.id);
    setSlide({ ...slide, objects: [...rest, target] });
  }

  return (
    <div ref={ref} className="relative h-full">
      {slide.objects.map((object) => (
        <ObjectComponent
          {...object}
          onMouse={(type, x, y) => handleMouse(object, type, x, y)}
          onClick={(event) => handleClick(event, object)}
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
    onMouse: (
      type: "move" | "resize" | "rotate" | "release",
      x: number,
      y: number,
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
  const ref = useRef<any>(null);

  function startTracking(type: "move" | "resize" | "rotate") {
    const controller = new AbortController();
    window.addEventListener(
      "mouseup",
      () => {
        controller.abort();
        props.onMouse("release", 0, 0);
      },
      { signal: controller.signal },
    );

    window.addEventListener(
      "mousemove",
      (event) => {
        props.onMouse(type, event.clientX, event.clientY);
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
          ref={ref}
          className="h-full w-full resize-none rounded-[inherit] bg-surface1 bg-transparent p-2 focus:outline-none"
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
      const { width, height } = ref.current
        ? ref.current.getBoundingClientRect()
        : { width: 0, height: 0 };

      body = (
        <svg
          viewBox={"0 0 " + width + " " + height}
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          ref={ref}
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
          ref={ref}
          className={`h-full w-full rounded-[inherit] bg-surface1 ${content.fit === "cover" ? "object-cover" : "object-contain"}`}
        />
      );
      break;
    case "button":
      body = (
        <div
          ref={ref}
          className="h-full w-full rounded-[inherit] bg-text opacity-50"
        />
      );
      break;
  }

  return (
    <div
      style={geometry}
      className={
        "absolute rounded-lg border-2" +
        (props.selected ? " border-lavender" : " border-crust")
      }
      onMouseDown={props.onClick}
    >
      {props.selected && (
        <>
          <button
            onMouseDown={() => startTracking("move")}
            className="absolute flex h-16 w-16 cursor-grab items-center justify-center rounded-full bg-base fill-text opacity-50 transition hover:bg-blue hover:fill-base hover:opacity-100 active:cursor-grabbing"
            style={{ top: 0, left: 0, transform: "translate(-50%, -50%)" }}
          >
            <ViewfinderCircleIcon className="size-8 rotate-45 fill-inherit text-base" />
          </button>
          <button
            onMouseDown={() => startTracking("rotate")}
            className="absolute flex h-16 w-16 cursor-grab items-center justify-center rounded-full bg-base fill-text opacity-50 transition hover:bg-sky hover:fill-base hover:opacity-100 active:cursor-grabbing"
            style={{ top: 0, right: 0, transform: "translate(50%, -50%)" }}
          >
            <ArrowPathIcon className="size-8 fill-inherit text-base" />
          </button>
          <button
            onMouseDown={() => startTracking("resize")}
            className="absolute flex h-16 w-16 cursor-se-resize items-center justify-center rounded-full bg-base fill-text opacity-50 transition hover:bg-green hover:fill-base hover:opacity-100 active:cursor-grabbing"
            style={{ bottom: 0, right: 0, transform: "translate(50%, 50%)" }}
          >
            <ChevronUpDownIcon className="size-8 -rotate-45 fill-inherit text-base" />
          </button>
        </>
      )}
      {body}
    </div>
  );
}
