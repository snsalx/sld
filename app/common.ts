export type Slide = {
  id: string;
  name: string;

  objects: SlideObject[];
};

export type SlideObject =
  | {
      kind: "image";
      id: string;
      selected?: boolean;
      fit: "cover" | "contain";
      geometry: Geometry;
      src: string;
      link?: SlideLink;
    }
  | {
      kind: "text";
      geometry: Geometry;
      selected?: boolean;
      id: string;
      content: string;
      link?: SlideLink;
    }
  | {
      kind: "button";
      label: string;
      selected?: boolean;
      id: string;
      geometry: Geometry;
      link?: SlideLink;
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
        kind: "text",
        id: crypto.randomUUID(),
        content: "Hello, world!",
        geometry: {
          left: 20,
          top: 10,
          width: 10,
          height: 5,
        },
      },
      {
        kind: "image",
        id: crypto.randomUUID(),
        src: "https://upload.wikimedia.org/wikipedia/commons/3/30/React_Logo_SVG.svg",
        fit: "contain",
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
