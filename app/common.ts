export type Slide = {
  id: string;
  name: string;

  objects: SlideObject[];
};

export type SlideObject =
  | {
      kind: "image";
      id: string;
      fit: "cover" | "contain";
      geometry: Geometry;
      src: string;
      link?: SlideLink;
    }
  | {
      kind: "text";
      id: string;
      geometry: Geometry;
      content: string;
      link?: SlideLink;
    }
  | {
      kind: "button";
      id: string;
      label: string;
      geometry: Geometry;
      link?: SlideLink;
    };

export type Geometry = {
  left: number,
  top: number,
  width: number,
  height: number,
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
    name: "Demo slide",
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
        }
      },
      {
        kind: "image",
        id: crypto.randomUUID(),
        src: "https://upload.wikimedia.org/wikipedia/commons/3/30/React_Logo_SVG.svg",
        fit: 'contain',
        geometry: {
          left: 40,
          top: 40,
          width: 20,
          height: 20,
        }
      },
    ],
  };
}
