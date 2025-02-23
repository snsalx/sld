export type Project = {
  id: string;
  name: string;
  slides: Slide[];

  author: string;
  public: boolean;
  indexable: boolean;
};

export type Slide = {
  id: string;
  name: string;

  objects: SlideObject[];
};

export type SlideObject = {
  id: string;
  geometry: Geometry;
  content: ContentImage | ContentText | ContentButton | ContentArrow;
  selected?: boolean;
  link?: SlideLink;
};

export type ContentImage = {
  kind: "image";
  src: string;
  fit: "cover" | "contain";
};
export type ContentText = {
  kind: "text";
  body: string;
};
export type ContentButton = {
  kind: "button";
};
export type ContentArrow = {
  kind: "arrow";
  direction: "nw" | "ne" | "se" | "sw";
};

export type Geometry = {
  left: number;
  top: number;
  width: number;
  height: number;
  borderRadius?: number;
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

export function createDemoSlide(): Slide {
  return {
    id: crypto.randomUUID(),
    name: "Demo slide #" + crypto.randomUUID().at(-1),
    objects: [
      {
        id: crypto.randomUUID(),
        content: {
          kind: "text",
          body: "Hello, world!",
        },
        geometry: {
          left: 20,
          top: 10,
          width: 10,
          height: 5,
        },
      },
      {
        id: crypto.randomUUID(),
        content: {
          kind: "image",
          src: "https://upload.wikimedia.org/wikipedia/commons/3/30/React_Logo_SVG.svg",
          fit: "contain",
        },
        geometry: {
          left: 40,
          top: 40,
          width: 20,
          height: 20,
        },
      },
    ],
  };
}
