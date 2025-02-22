import Select from "../../Select";
import { Slide, SlideObject } from "../../common";
import ProfileButton from "../../ProfileButton";
import {
  ArrowTopRightOnSquareIcon,
  Bars3CenterLeftIcon,
  MapPinIcon,
  PhotoIcon,
  PlusIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/16/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Toolbar({
  slide,
  projectSlides,
  onChange,
  onRename,
  onAddText,
}: {
  slide: Slide;
  projectSlides: Slide[];
  onChange: (update: Slide) => void;
  onRename: (name: string) => void;
  onAddText: () => void;
}) {
  const pathName = usePathname().split("/");
  const linkUp = "/" + pathName.at(-2)!;

  const selectedObjects = slide.objects.filter((obj) => obj.selected);
  const unselectedObjects = slide.objects.filter((obj) => !obj.selected);

  return (
    <footer className="flex justify-between bg-mantle p-4">
      <div className="flex gap-4">
        <ProfileButton />
        <Link
          href={linkUp}
          className={`flex h-16 w-16 items-center justify-center rounded-lg border-2 border-crust bg-base text-base text-text transition hover:scale-95 hover:border-sky`}
          title="All slides"
        >
          <Square3Stack3DIcon className="size-8" />
        </Link>
        <input
          className="h-16 w-96 rounded-lg border-2 border-crust bg-base p-4 text-lg transition hover:border-sky focus:outline-none"
          placeholder="Slide title"
          defaultValue={slide.name}
          onBlur={(event) => onRename(event.target.value)}
        />
        <button
          className={`flex h-16 w-16 items-center justify-center rounded-lg border-2 border-crust bg-base text-base text-blue transition hover:scale-95 hover:border-sky`}
          title="Add text"
          onClick={onAddText}
        >
          <Bars3CenterLeftIcon className="size-8" />
        </button>
        <button
          className={`flex h-16 w-16 items-center justify-center rounded-lg border-2 border-crust bg-base text-base text-sapphire transition hover:scale-95 hover:border-sky`}
          title="Add image"
        >
          <PhotoIcon className="size-8" />
        </button>
        <button
          className={`flex h-16 w-16 items-center justify-center rounded-lg border-2 border-crust bg-base text-base text-sky transition hover:scale-95 hover:border-sky`}
          title="Add button"
        >
          <ArrowTopRightOnSquareIcon className="size-8" />
        </button>
        <button
          className={`flex h-16 w-16 cursor-not-allowed items-center justify-center rounded-lg border-2 border-crust bg-base text-base text-teal`}
          title="Add map (not yet implemented)"
        >
          <MapPinIcon className="size-8" />
        </button>
      </div>

      <ObjectProperties
        objects={selectedObjects}
        slideList={projectSlides}
        onUpdate={(update) =>
          onChange({
            ...slide,
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
          className="h-16 w-96 rounded-lg border-2 border-crust bg-base p-4 text-lg transition hover:border-sky focus:outline-none"
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
