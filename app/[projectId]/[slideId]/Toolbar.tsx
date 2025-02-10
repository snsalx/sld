import Select from "../../Select";
import { Slide, SlideObject } from "../../common";
import ProfileButton from "../../ProfileButton";
import { PlusIcon, Square3Stack3DIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Toolbar({
  slide,
  projectSlides,
  onRename,
}: {
  slide: Slide,
  projectSlides: Slide[],
  onRename: (update: Slide) => void;
}) {
  const pathName = usePathname().split('/');
  const linkUp = '/' + pathName.at(-2)!

  const setName = (name: string) =>
    onRename({ ...slide, name });

  const selectedObjects = slide.objects.filter((obj) => obj.selected);
  const unselectedObjects = slide.objects.filter((obj) => !obj.selected);

  return (
    <footer className="bg-base p-4 flex justify-between">
      <div className="flex gap-4">
        <ProfileButton />
        <input
          className="p-4 bg-transparent text-lg w-96 h-16 focus:outline-none focus:border-green border-2 border-text rounded-lg"
          placeholder="Slide title"
          value={slide.name}
          onChange={(event) => setName(event.target.value)}
        />
        <Link
          href={linkUp}
          className={`w-16 h-16 text-base bg-blue hover:scale-95 transition flex justify-center items-center rounded-lg`}
        >
          <Square3Stack3DIcon className="size-8" />
        </Link>
        <button
          className={`w-16 h-16 text-base bg-green hover:scale-95 transition flex justify-center items-center rounded-lg`}
        >
          <PlusIcon className="size-8" />
        </button>
      </div>

      <ObjectProperties
        objects={selectedObjects}
        slideList={projectSlides}
        onUpdate={(update) =>
          onRename({
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
