import Select from "../../Select";
import { Slide, SlideObject } from "../../common";
import ProfileButton from "../../ProfileButton";
import { ArrowTopRightOnSquareIcon, Bars3CenterLeftIcon, MapPinIcon, PhotoIcon, PlusIcon, Square3Stack3DIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Toolbar({
  slide,
  projectSlides,
  onChange,
  onRename,
}: {
  slide: Slide;
  projectSlides: Slide[];
  onChange: (update: Slide) => void;
  onRename: (name: string) => void;
}) {
  const pathName = usePathname().split("/");
  const linkUp = "/" + pathName.at(-2)!;

  const selectedObjects = slide.objects.filter((obj) => obj.selected);
  const unselectedObjects = slide.objects.filter((obj) => !obj.selected);

  return (
    <footer className="bg-base p-4 flex justify-between">
      <div className="flex gap-4">
        <ProfileButton />
        <Link
          href={linkUp}
          className={`w-16 h-16 text-base bg-surface0 text-text hover:scale-95 transition flex justify-center items-center rounded-lg`}
          title="All slides"
        >
          <Square3Stack3DIcon className="size-8" />
        </Link>
        <input
          className="p-4 bg-transparent text-lg w-96 h-16 focus:outline-none focus:border-green border-2 border-text rounded-lg"
          placeholder="Slide title"
          defaultValue={slide.name}
          onBlur={(event) => onRename(event.target.value)}
        />
        <button
          className={`w-16 h-16 text-base bg-blue hover:scale-95 transition flex justify-center items-center rounded-lg`}
          title="Add text"
        >
          <Bars3CenterLeftIcon className="size-8" />
        </button>
        <button
          className={`w-16 h-16 text-base bg-sapphire hover:scale-95 transition flex justify-center items-center rounded-lg`}
          title="Add image"
        >
          <PhotoIcon className="size-8" />
        </button>
        <button
          className={`w-16 h-16 text-base bg-sky hover:scale-95 transition flex justify-center items-center rounded-lg`}
          title="Add button"
        >
          <ArrowTopRightOnSquareIcon className="size-8" />
        </button>
        <button
          className={`w-16 h-16 text-base bg-teal cursor-not-allowed flex justify-center items-center rounded-lg`}
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
