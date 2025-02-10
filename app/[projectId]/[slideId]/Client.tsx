"use client";

import { useContext, useEffect, useState } from "react";
import Toolbar from "./Toolbar";
import { createDemoSlide, Slide, SlideObject } from "../../common";
import Canvas from "./Canvas";
import { usePathname } from "next/navigation";
import { BackendContext } from "@/app/Backend";

export default function SlideEditor( props : {
   projectId: string, slideId: string 
}) {
  const backend = useContext(BackendContext)!;
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState<Slide>();

  useEffect(() => {
    Promise.allSettled([list(), one()])

    async function list() {
      const project = await backend.collection('projects').getOne(props.projectId, {expand: 'slides'})

      setSlides(project.expand!.slides)
    }

    async function one() {
      const slide = await backend.collection('slides').getOne<Omit<Slide, "objects"> & {expand: any}>(props.slideId, {expand: 'objects'})

      setCurrentSlide({...slide, objects: slide.expand!.objects})
    }
  }, [props])

  if (!currentSlide) {
    return <div>Loading slide...</div>
  }

  function updateCurrentSlide(update: Slide) {
    update.objects.map(object => {
      if (currentSlide && currentSlide.objects.find(potential => potential === object)) {
        console.log('object', object, 'is unchanged, skipping')
        return
      }

      backend.collection('objects').update(object.id, object)
    })

    setCurrentSlide(update)
  }

  return (
    <div className="flex flex-col h-screen">
      <main className="bg-base h-full border-b-2 border-b-crust">
        <Canvas slide={currentSlide} setSlide={updateCurrentSlide} />
      </main>

      <Toolbar
        slide={currentSlide}
        projectSlides={slides}
        onRename={updateCurrentSlide}
      />
    </div>
  );
}

