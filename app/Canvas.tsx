import { ArrowsPointingOutIcon, ChevronUpDownIcon, ViewfinderCircleIcon } from "@heroicons/react/16/solid";
import IconButton from "./Button";
import { Geometry, Slide, SlideObject } from "./common";
import { useRef } from "react";

export default function Canvas({slide, setSlide}: {slide: Slide, setSlide: (update: Slide) => void}) {
  const ref = useRef<HTMLDivElement>(null)

  function handleMouse(target: SlideObject, type: 'move' | 'resize', x: number, y: number) {
    if (!ref || !ref.current) {
      return
    }

    const box = ref.current.getBoundingClientRect();
    const oldGeo = target.geometry;

    const update: SlideObject = {
      ...target,
      geometry: {
        left: type === "move" ? x / box.width * 100 : oldGeo.left,
        top: type === "move" ? y / box.height * 100 : oldGeo.top,
        width: type === "resize" ? x / box.width * 100 - oldGeo.left : oldGeo.width,
        height: type === "resize" ? y / box.height * 100 - oldGeo.top : oldGeo.height,
        borderRadius: oldGeo.borderRadius,
      },
    }

    const rest = slide.objects.filter((obj) => obj.id !== target.id);
    setSlide({...slide, objects: [...rest, update]})
  }
  
  return <div ref={ref} className="h-full relative">
    {slide.objects.map(object => (
      <ObjectComponent
        {...object}
        onMouse={(type, x, y) => handleMouse(object, type, x, y)}
        key={object.id} />
    ))}
  </div>
}

export function ObjectComponent(props: SlideObject & {onMouse: (type: 'move' | 'resize', x: number, y: number) => void}) {
  const geometryEntries = Object.entries(props.geometry).map(([k, v]) => [k, `${v}%`])
  const geometry = Object.fromEntries(geometryEntries);

  function startTracking(type: "move" | "resize") {
    const controller = new AbortController();
    window.addEventListener('mouseup', () => controller.abort());

    window.addEventListener('mousemove', (event) => {
      props.onMouse(type, event.clientX, event.clientY)
    }, {signal: controller.signal})
  }

  let body;
  switch (props.kind) {
    case "text":
      body = <p>{props.content}</p>
      break;
    case "image":
      body = <img src={props.src} className={`w-full h-full object-${props.fit}`} />
      break;
    case "button":
      body = <button className="bg-green">{props.label}</button>
      break;
  }

  return <div style={geometry} className="absolute bg-surface0 p-2">
    <button onMouseDown={() => startTracking("move")} className="absolute w-16 h-16 bg-blue rounded-full flex justify-center items-center hover:bg-teal transition" style={{top: 0, left: 0, transform: "translate(-50%, -50%)"}}>
      <ViewfinderCircleIcon className="text-base rotate-45 size-8" />
    </button>
    <button onMouseDown={() => startTracking("resize")} className="absolute w-16 h-16 bg-green rounded-full flex justify-center items-center hover:bg-teal transition" style={{bottom: 0, right: 0, transform: "translate(50%, 50%)"}}>
      <ChevronUpDownIcon className="text-base -rotate-45 size-8" />
    </button>
    {body}
  </div>
}
