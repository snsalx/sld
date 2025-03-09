import Select from "../../Select";
import { Slide, SlideObject } from "../../common";
import HomeButton from "../../ProfileButton";
import {
  ArrowTopRightOnSquareIcon,
  ArrowUpRightIcon,
  Bars3CenterLeftIcon,
  CursorArrowRaysIcon,
  MapPinIcon,
  PhotoIcon,
  Square3Stack3DIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Toolbar({
  slide,
  projectSlides,
  projectId,
  onChange,
  onRename,
  onAddText,
  onAddArrow,
  onAddImage,
  onAddButton,
}: {
  slide: Slide;
  projectSlides: Slide[];
  projectId: string;
  onChange: (update: Slide) => void;
  onRename: (name: string) => void;
  onAddText: () => void;
  onAddArrow: () => void;
  onAddImage: () => void;
  onAddButton: () => void;
}) {
  const pathName = usePathname().split("/");
  const linkUp = "/" + pathName.at(-2)!;

  const selectedObjects = slide.objects.filter((obj) => obj.selected);
  const unselectedObjects = slide.objects.filter((obj) => !obj.selected);

  return (
    <footer className="z-40">
      <div className="flex justify-between gap-4 overflow-auto bg-mantle p-4">
        <div className="flex gap-4">
          <HomeButton />
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
            className={`flex hidden h-16 w-16 items-center justify-center rounded-lg border-2 border-crust bg-base text-base text-sapphire transition hover:scale-95 hover:border-sky`}
            title="Add arrow"
            onClick={onAddArrow}
          >
            <ArrowUpRightIcon className="size-8" />
          </button>
          <button
            className={`flex h-16 w-16 items-center justify-center rounded-lg border-2 border-crust bg-base text-base text-sky transition hover:scale-95 hover:border-sky`}
            title="Add image"
            onClick={onAddImage}
          >
            <PhotoIcon className="size-8" />
          </button>
          <button
            className={`flex h-16 w-16 items-center justify-center rounded-lg border-2 border-crust bg-base text-base text-teal transition hover:scale-95 hover:border-sky`}
            title="Add button"
            onClick={onAddButton}
          >
            <ArrowTopRightOnSquareIcon className="size-8" />
          </button>
          <button
            className={`flex hidden h-16 w-16 items-center justify-center rounded-lg border-2 border-crust bg-base text-base text-green transition hover:scale-95 hover:border-sky`}
            title="Add map (not yet implemented)"
          >
            <MapPinIcon className="size-8" />
          </button>
        </div>

        <ObjectProperties
          objects={selectedObjects}
          slideList={projectSlides}
          projectId={projectId}
          onUpdate={(update) =>
            onChange({
              ...slide,
              objects: [...unselectedObjects, ...update],
            })
          }
          onDelete={() => {
            onChange({ ...slide, objects: unselectedObjects });
          }}
        />
      </div>
    </footer>
  );
}

function ObjectProperties({
  objects,
  slideList,
  projectId,
  onUpdate,
  onDelete,
}: {
  objects: SlideObject[];
  slideList: Slide[];
  projectId: string;
  onUpdate: (update: SlideObject[]) => void;
  onDelete: () => void;
}) {
  if (objects.length === 0) {
    return <></>;
  }

  const object = objects[0];

  console.log(object.link);

  return (
    <div className="flex gap-4">
      <Select
        options={{ none: "No link", slide: "Slide", url: "URL" }}
        value={object.link?.kind || "none"}
        onChange={(kind) => {
          const defaultValue = kind === "slide" ? slideList[0].id : "";

          onUpdate(
            objects.map(
              (object): SlideObject => ({
                ...object,
                link:
                  kind === "none"
                    ? undefined
                    : { kind: kind, value: object.link?.value || defaultValue },
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
      {object.link?.kind === "slide" && (
        <Link
          href={"/" + projectId + "/" + object.link.value}
          title="Follow link"
          className={`flex h-16 w-16 items-center justify-center rounded-lg border-2 border-crust bg-base text-base text-green transition hover:scale-95 hover:border-sky`}
        >
          <CursorArrowRaysIcon className="size-8" />
        </Link>
      )}
      {object.link?.kind === "url" && (
        <Link
          href={object.link.value}
          title="Follow link"
          className={`flex h-16 w-16 items-center justify-center rounded-lg border-2 border-crust bg-base text-base text-green transition hover:scale-95 hover:border-sky`}
        >
          <CursorArrowRaysIcon className="size-8" />
        </Link>
      )}
      <button
        className={`flex h-16 w-16 items-center justify-center rounded-lg border-2 border-crust bg-base text-base text-red transition hover:scale-95 hover:border-red`}
        title="Delete object"
        onClick={onDelete}
      >
        <TrashIcon className="size-8" />
      </button>
    </div>
  );
}
