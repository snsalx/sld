"use client";

import { useState } from "react";
import Toolbar from "./Toolbar";
import { createDemoSlide, createEmptySlide, Slide } from "./common";
import Canvas from "./Canvas";

const initialSlide = createDemoSlide();

export default function Home() {
  const [showTree, setShowTree] = useState(false);

  const [slides, setSlides] = useState([initialSlide]);
  const [currentSlide, setCurrentSlide] = useState(initialSlide.id);

  const objects = slides.find((slide) => slide.id === currentSlide);

  if (!objects) {
    return <div>Error in page: objects missing</div>;
  }

  function updateCurrentSlide(update: Slide) {
    const rest = slides.filter((slide) => slide.id !== currentSlide);

    setSlides([...rest, update]);
  }

  return (
    <div className="flex flex-col h-screen latte dark:mocha text-text">
      {showTree ? (
        <main className="bg-base h-full border-b-2 border-b-crust">Tree</main>
      ) : (
        <main className="bg-base h-full border-b-2 border-b-crust">
          <Canvas slide={objects} setSlide={updateCurrentSlide} />
        </main>
      )}

      <Toolbar
        currentSlideId={currentSlide}
        setCurrentSlideId={setCurrentSlide}
        slides={slides}
        updateCurrentSlide={updateCurrentSlide}
        toggleTreeView={() => setShowTree(!showTree)}
      />
    </div>
  );
}
