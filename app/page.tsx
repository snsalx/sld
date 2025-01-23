"use client";

import { useState } from "react";
import Toolbar from "./Toolbar";
import { createEmptySlide } from "./common";

const initialSlide = createEmptySlide();

export default function Home() {
  const [slides, setSlides] = useState([initialSlide]);
  const [currentSlide, setCurrentSlide] = useState(initialSlide.id);

  console.log({ slides, currentSlide });

  return (
    <div className="flex flex-col h-screen text-slate-100">
      <main className="bg-slate-900 h-full">todo canvas</main>

      <Toolbar
        currentSlideId={currentSlide}
        setCurrentSlideId={setCurrentSlide}
        slides={slides}
        updateCurrentSlide={(update) => {
          const rest = slides.filter((slide) => slide.id !== currentSlide);

          setSlides([...rest, update]);
        }}
      />
    </div>
  );
}
