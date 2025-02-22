"use client";

import { useContext, useEffect, useRef, useState } from "react";
import Toolbar from "./Toolbar";
import {
  ContentButton,
  ContentImage,
  ContentText,
  createDemoSlide,
  Slide,
  SlideObject,
} from "../../common";
import Canvas from "./Canvas";
import { usePathname } from "next/navigation";
import { BackendContext } from "@/app/Backend";

export default function SlideEditor(props: {
  projectId: string;
  slideId: string;
}) {
  const backend = useContext(BackendContext)!;
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState<Slide>();
  const upload = useRef<HTMLInputElement>(null);

  useEffect(() => {
    refetch();
  }, [props]);

  if (!currentSlide) {
    return <div>Loading slide...</div>;
  }

  function updateCurrentSlide(update: Slide) {
    if (!currentSlide) return;

    const deletedObjects: string[] = [];

    currentSlide.objects.map((object) => {
      if (update.objects.find((potential) => potential === object)) {
        console.log("object", object, "is unchanged, skipping");
        return;
      }

      const updatedObject = update.objects.find(
        (potential) => potential.id === object.id,
      );
      if (updatedObject) {
        backend.collection("objects").update(object.id, updatedObject);
      } else {
        backend.collection("objects").delete(object.id);
        deletedObjects.push(object.id);
      }
    });

    backend.collection("slides").update(props.slideId, {
      objects: currentSlide.objects
        .map((obj) => obj.id)
        .filter((obj) => !deletedObjects.includes(obj)),
    });

    setCurrentSlide(update);
  }

  async function renameSlide(name: string) {
    await backend.collection("slides").update(props.slideId, { name });
    refetch();
  }

  async function refetch() {
    const project = await backend
      .collection("projects")
      .getOne(props.projectId, { expand: "slides" });
    const slide = await backend
      .collection("slides")
      .getOne<
        Omit<Slide, "objects"> & { expand: any }
      >(props.slideId, { expand: "objects" });

    setCurrentSlide({ ...slide, objects: slide.expand!.objects || [] });
    setSlides(project.expand!.slides);
  }

  async function createObject(
    content: ContentImage | ContentText | ContentButton,
    file?: File,
  ) {
    if (!currentSlide) return;

    const request = {
      geometry: {
        top: 2,
        left: 2,
        height: 32,
        width: 32,
      },
      content,
      image: file,
    };

    const object = await backend
      .collection("objects")
      .create<SlideObject>(request);
    if (object.content.kind === "image") {
      object.content.src =
        backend.baseURL +
        "/api/files/objects/" +
        object.id +
        "/" +
        (object as any).image;
    }
    const objects = [...currentSlide.objects, object];

    await backend
      .collection("slides")
      .update(props.slideId, { objects: objects.map((obj) => obj.id) });

    setCurrentSlide({ ...currentSlide, objects });
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <main className="h-full bg-base">
        <Canvas slide={currentSlide} setSlide={updateCurrentSlide} />
      </main>

      <Toolbar
        slide={currentSlide}
        projectSlides={slides}
        onChange={updateCurrentSlide}
        onRename={renameSlide}
        onAddText={() => createObject({ kind: "text", body: "" })}
        onAddImage={() => {
          if (!upload.current) return;

          upload.current.click();
        }}
      />
      <input
        className="hidden"
        type="file"
        ref={upload}
        onChange={(event) => {
          if (!event.target.files) return;

          createObject(
            { kind: "image", src: "", fit: "cover" },
            event.target.files[0],
          );
        }}
      />
    </div>
  );
}
