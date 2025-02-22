"use client";

import { useContext, useEffect, useState } from "react";
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

  useEffect(() => {
    refetch();
  }, [props]);

  if (!currentSlide) {
    return <div>Loading slide...</div>;
  }

  function updateCurrentSlide(update: Slide) {
    update.objects.map((object) => {
      if (
        currentSlide &&
        currentSlide.objects.find((potential) => potential === object)
      ) {
        console.log("object", object, "is unchanged, skipping");
        return;
      }

      backend.collection("objects").update(object.id, object);
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
  ) {
    if (!currentSlide) return;

    const request: Omit<SlideObject, "id"> = {
      geometry: {
        top: 2,
        left: 2,
        height: 32,
        width: 32,
      },
      content,
    };

    const object = await backend
      .collection("objects")
      .create<SlideObject>(request);
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
      />
    </div>
  );
}
