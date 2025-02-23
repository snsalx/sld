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
  const [deletedObjects, setDeletedObjects] = useState<string[]>([]);
  const [sendOnRerender, setSendOnRerender] = useState(false);
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
      const updatedObject = update.objects.find(
        (potential) => potential.id === object.id,
      );

      if (!updatedObject) {
        deletedObjects.push(object.id);
      }
    });

    setDeletedObjects(deletedObjects);
    setCurrentSlide(update);
  }

  async function sendToServer() {
    setSendOnRerender(true);
  }

  if (sendOnRerender) {
    if (!currentSlide) return;

    console.log(currentSlide);

    const updatePromises = currentSlide.objects
      .filter((object) => object.selected)
      .map((object) => backend.collection("objects").update(object.id, object));

    const deletePromises = deletedObjects.map((id) =>
      backend.collection("objects").delete(id),
    );

    const sendListPromise = backend.collection("slides").update(props.slideId, {
      objects: currentSlide.objects
        .map((obj) => obj.id)
        .filter((obj) => !deletedObjects.includes(obj)),
    });

    Promise.allSettled([...updatePromises, ...deletePromises, sendListPromise]);

    setSendOnRerender(false);
    setDeletedObjects([]);
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
        <Canvas
          slide={currentSlide}
          setSlide={updateCurrentSlide}
          onSave={sendToServer}
        />
      </main>

      <Toolbar
        slide={currentSlide}
        projectSlides={slides}
        projectId={props.projectId}
        onChange={updateCurrentSlide}
        onRename={renameSlide}
        onAddText={() => createObject({ kind: "text", body: "" })}
        onAddImage={() => {
          if (!upload.current) return;

          upload.current.click();
        }}
        onAddButton={() => createObject({ kind: "button" })}
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
