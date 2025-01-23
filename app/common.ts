export type Slide = {
  id: string;
  name: string;

  objects: SlideObject[];
};

export type SlideObject =
  | {
      kind: "image";
      src: string;
      link?: SlideLink;
      radius?: number;
    }
  | {
      kind: "text";
      content: string;
      link?: SlideLink;
      radius?: number;
    }
  | {
      kind: "button";
      link?: SlideLink;
      radius?: number;
    };

export type SlideLink = {
  kind: "slide" | "url";
  value: string;
};

export function createEmptySlide(): Slide {
  return {
    id: crypto.randomUUID(),
    name: "",
    objects: [],
  };
}
