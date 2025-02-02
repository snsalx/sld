import Select from "./Select";
import IconButton from "./Button";
import { Slide } from "./common";
import { useState } from "react";

export default function Toolbar({
  currentSlideId,
  setCurrentSlideId,
  slides,
  updateCurrentSlide,
  toggleTreeView,
}: {
  currentSlideId: string;
  setCurrentSlideId: (slide: string) => void;
  slides: Slide[];
  updateCurrentSlide: (update: Slide) => void;
  toggleTreeView: () => void;
}) {
  const currentSlide = slides.find((slide) => slide.id === currentSlideId);

  if (!currentSlide) {
    throw new Error("No slide selected (Toolbar.tsx)");
  }

  const setName = (name: string) => updateCurrentSlide({...currentSlide, name})

  return (
    <footer className="bg-base p-4 flex justify-between">
      <div className="flex gap-4">
        <input
          className="p-4 bg-transparent text-lg w-96 h-16 focus:outline-none focus:border-green border-2 border-text rounded-lg"
          placeholder="Slide title"
          value={currentSlide.name}
          onChange={(event) => setName(event.target.value)}
        />
        <IconButton action="tree" color="blue" onClick={toggleTreeView} />
        <IconButton action="add" color="green" />
      </div>

      <div className="flex gap-4">
        <Select options={{ none: "No link", section: "Slide", url: "URL" }} />
      </div>
    </footer>
  );
}

