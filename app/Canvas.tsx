import {
  ChevronUpDownIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/16/solid";
import { Slide, SlideObject } from "./common";
import { MouseEvent, MouseEventHandler, useRef, useState } from "react";

export default function Canvas({
  slide,
  setSlide,
}: {
  slide: Slide;
  setSlide: (update: Slide) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouse(
    target: SlideObject,
    type: "move" | "resize",
    x: number,
    y: number,
  ) {
    if (!ref || !ref.current) {
      return;
    }

    const box = ref.current.getBoundingClientRect();
    const oldGeo = target.geometry;

    const correctForMovement = Number(type === "move");
    if (x < 0) x = 0;
    if (x + (oldGeo.width / 100) * box.width * correctForMovement > box.width)
      x = box.width - (oldGeo.width / 100) * box.width * correctForMovement;
    if (y < 0) y = 0;
    if (
      y + (oldGeo.height / 100) * box.height * correctForMovement >
      box.height
    )
      y = box.height - (oldGeo.height / 100) * box.height * correctForMovement;

    const update: SlideObject = {
      ...target,
      geometry: {
        left: snapToGrid(type === "move" ? (x / box.width) * 100 : oldGeo.left),
        top: snapToGrid(type === "move" ? (y / box.height) * 100 : oldGeo.top),
        width: snapToGrid(
          type === "resize"
            ? (x / box.width) * 100 - oldGeo.left
            : oldGeo.width,
        ),
        height: snapToGrid(
          type === "resize"
            ? (y / box.height) * 100 - oldGeo.top
            : oldGeo.height,
        ),
        borderRadius: oldGeo.borderRadius,
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
    <div ref={ref} className="h-full relative">
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
    onMouse: (type: "move" | "resize", x: number, y: number) => void;
    onClick?: (event: MouseEvent<HTMLDivElement>) => void;
    onUpdate: (update: SlideObject) => void;
  },
) {
  const geometryEntries = Object.entries(props.geometry).map(([k, v]) => [
    k,
    `${v}%`,
  ]);
  const geometry = Object.fromEntries(geometryEntries);

  function startTracking(type: "move" | "resize") {
    const controller = new AbortController();
    window.addEventListener("mouseup", () => controller.abort());

    window.addEventListener(
      "mousemove",
      (event) => {
        props.onMouse(type, event.clientX, event.clientY);
      },
      { signal: controller.signal },
    );
  }

  let body;
  switch (props.kind) {
    case "text":
      body = (
        <textarea
          className="w-full h-full resize-none bg-transparent focus:outline-none p-2"
          onChange={(event) =>
            props.onUpdate({ ...props, content: event.target.value })
          }
          value={props.content}
        />
      );
      break;
    case "image":
      body = (
        <img src={props.src} className={`w-full h-full object-${props.fit}`} />
      );
      break;
    case "button":
      body = <button className="bg-green">{props.label}</button>;
      break;
  }

  return (
    <div
      style={geometry}
      className={
        "absolute bg-surface0 border-2 rounded-lg" +
        (props.selected ? " border-lavender" : " border-crust")
      }
      onMouseDown={props.onClick}
    >
      {props.selected && (
        <>
          <button
            onMouseDown={() => startTracking("move")}
            className="opacity-50 hover:opacity-100 absolute w-16 h-16 bg-base fill-text hover:fill-base hover:bg-blue rounded-full flex justify-center items-center transition"
            style={{ top: 0, left: 0, transform: "translate(-50%, -50%)" }}
          >
            <ViewfinderCircleIcon className="text-base rotate-45 size-8 fill-inherit" />
          </button>
          <button
            onMouseDown={() => startTracking("resize")}
            className="opacity-50 hover:opacity-100 absolute w-16 h-16 bg-base fill-text hover:fill-base hover:bg-green rounded-full flex justify-center items-center transition"
            style={{ bottom: 0, right: 0, transform: "translate(50%, 50%)" }}
          >
            <ChevronUpDownIcon className="text-base -rotate-45 size-8 fill-inherit" />
          </button>
        </>
      )}
      {body}
    </div>
  );
}
