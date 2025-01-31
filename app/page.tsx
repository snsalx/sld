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
    <div className="flex flex-col h-screen latte dark:mocha text-text">
      <main className="bg-base h-full border-b-2 border-b-crust">todo canvas</main>

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
