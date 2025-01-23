import Select from "./Select";
import IconButton from "./Button";
import { Slide } from "./common";
import { useState } from "react";

export default function Toolbar({
  currentSlideId,
  setCurrentSlideId,
  slides,
  updateCurrentSlide,
}: {
  currentSlideId: string;
  setCurrentSlideId: (slide: string) => void;
  slides: Slide[];
  updateCurrentSlide: (update: Slide) => void;
}) {
  const currentSlide = slides.find((slide) => slide.id === currentSlideId);

  if (!currentSlide) {
    throw new Error("No slide selected (Toolbar.tsx)");
  }

  return (
    <footer className="bg-slate-800 p-4 flex justify-between">
      <div className="flex gap-4">
        <div className="w-16 h-16 bg-blue-400 text-center">todo logo</div>
        <SlideSelector
          currentSlide={currentSlide}
          updateCurrent={updateCurrentSlide}
          setCurrent={setCurrentSlideId}
          slides={slides}
        />
      </div>

      <div className="flex gap-4">
        <Select options={{ section: "Slide", url: "URL" }} />
      </div>

      <div className="flex gap-4 text-slate-800 font-bold">
        <IconButton action="back" color="orange" />
        <IconButton action="close" color="red" />
      </div>
    </footer>
  );
}

function SlideSelector({
  slides,
  currentSlide,
  setCurrent,
  updateCurrent,
}: {
  slides: Slide[];
  currentSlide: Slide;
  setCurrent: (id: string) => void;
  updateCurrent: (id: Slide) => void;
}) {
  const [selecting, setSelecting] = useState(false);
  const options = Object.fromEntries(
    slides.map((slide) => [slide.id, slide.name || slide.id]),
  );

  function setCurrentName(event: any) {
    updateCurrent({ ...currentSlide, name: event.target.value });
  }

  return (
    <div className="flex bg-slate-600">
      {selecting ? (
        <div className="w-96 h-16">
          <Select options={options} onChange={setCurrent} autoClick />
        </div>
      ) : (
        <input
          className="p-4 bg-slate-700 text-lg w-96 h-16 focus:outline-none focus:bg-slate-600"
          placeholder="Slide title"
          value={currentSlide.name}
          onChange={setCurrentName}
        />
      )}
      <IconButton action="list" color="gray" onClick={() => setSelecting(!selecting)} />
    </div>
  );
}
