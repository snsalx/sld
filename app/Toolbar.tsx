import Select from "./Select";
import IconButton from "./Button";
import { Slide, SlideLink, SlideObject } from "./common";
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

  const setName = (name: string) =>
    updateCurrentSlide({ ...currentSlide, name });

  const selectedObjects = currentSlide.objects.filter((obj) => obj.selected);
  const unselectedObjects = currentSlide.objects.filter((obj) => !obj.selected);

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

      <ObjectProperties
        objects={selectedObjects}
        slideList={slides}
        onUpdate={(update) =>
          updateCurrentSlide({
            ...currentSlide,
            objects: [...unselectedObjects, ...update],
          })
        }
      />
    </footer>
  );
}

function ObjectProperties({
  objects,
  slideList,
  onUpdate,
}: {
  objects: SlideObject[];
  slideList: Slide[];
  onUpdate: (update: SlideObject[]) => void;
}) {
  if (objects.length === 0) {
    return <></>;
  }

  const object = objects[0];

  return (
    <div className="flex gap-4">
      <Select
        options={{ none: "No link", slide: "Slide", url: "URL" }}
        value={object.link?.kind || "none"}
        onChange={(value) => {
          onUpdate(
            objects.map(
              (object): SlideObject => ({
                ...object,
                link:
                  value === "none"
                    ? undefined
                    : { kind: value, value: object.link?.value || "" },
              }),
            ),
          );
        }}
      />

      {object.link?.kind === "url" && (
        <input
          className="p-4 bg-transparent text-lg w-96 h-16 focus:outline-none focus:border-green border-2 border-text rounded-lg"
          placeholder="https://example.com"
          type="url"
          value={object.link.value}
          onChange={(event) =>
            onUpdate(
              objects.map(
                (object): SlideObject => ({
                  ...object,
                  link: { kind: "url", value: event.target.value },
                }),
              ),
            )
          }
        />
      )}

      {object.link?.kind === "slide" && (
        <Select
          options={Object.fromEntries(
            slideList.map((slide) => [slide.id, slide.name]),
          )}
          onChange={(value) =>
            onUpdate(
              objects.map(
                (object): SlideObject => ({
                  ...object,
                  link: { kind: "slide", value: String(value) },
                }),
              ),
            )
          }
          value={object.link.value}
        />
      )}
    </div>
  );
}
