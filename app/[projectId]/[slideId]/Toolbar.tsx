import Select from "../../Select";
import { Slide, SlideObject } from "../../common";
import HomeButton from "../../ProfileButton";
import {
  ArrowTopRightOnSquareIcon,
  ArrowUpRightIcon,
  ArrowUturnLeftIcon,
  Bars3CenterLeftIcon,
  CursorArrowRaysIcon,
  MapPinIcon,
  PhotoIcon,
  Square3Stack3DIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";

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
      <div className="flex justify-between gap-6 overflow-auto bg-mantle p-4">
        <div className="flex gap-3">
          <Button
            variant="blue"
            title="Add text"
            onClick={onAddText}
          >
            <Bars3CenterLeftIcon />
          </Button>
          <Button
            className="hidden"
            variant="sapphire"
            title="Add arrow"
            onClick={onAddArrow}
          >
            <ArrowUpRightIcon />
          </Button>
          <Button
            variant="sky"
            title="Add image"
            onClick={onAddImage}
          >
            <PhotoIcon />
          </Button>
          <Button
            variant="teal"
            title="Add button"
            onClick={onAddButton}
          >
            <ArrowTopRightOnSquareIcon />
          </Button>
          <Button
            className="hidden"
            variant="green"
            title="Add map (not yet implemented)"
          >
            <MapPinIcon />
          </Button>
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
            if (
              confirm("Are you sure you want to delete the object permanently?")
            ) {
              onChange({ ...slide, objects: unselectedObjects });
            }
          }}
        />

        <div className="flex gap-3">
          <input
            className="h-16 w-64 rounded-lg border-2 border-crust bg-base p-4 text-lg transition hover:border-sky focus:outline-none"
            placeholder="Slide title"
            defaultValue={slide.name}
            onBlur={(event) => onRename(event.target.value)}
          />
          <Button asChild
            variant="peach"
              title="All slides"
            >
            <Link
              href={linkUp}
            >
              <Square3Stack3DIcon />
            </Link>
          </Button>
          <Button
            onClick={() => history.back()}
            variant="yellow"
            title="Go back"
          >
            <ArrowUturnLeftIcon />
          </Button>
        </div>
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
    return (
      <div className="flex h-16 min-w-fit select-none items-center justify-center rounded-lg border-2 border-crust bg-base px-4 text-lg text-subtext0">
        No Object Selected
      </div>
    );
  }

  const object = objects[0];

  console.log(object.link);

  return (
    <div className="flex gap-3">
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
          <Button asChild
            variant="green"
          title="Follow link"
            >
        <Link
          href={"/" + projectId + "/" + object.link.value}
        >
          <CursorArrowRaysIcon />
        </Link>
      </Button>
      )}
      {object.link?.kind === "url" && (
          <Button asChild
            variant="green"
          title="Follow link"
            >
        <Link
          href={
            "/external?url=" + object.link.value + "&backLink=/" + projectId
          }
        >
          <CursorArrowRaysIcon />
        </Link>
      </Button>
      )}
      <Button
        variant="red"
        title="Delete object"
        onClick={onDelete}
      >
        <TrashIcon />
      </Button>
    </div>
  );
}
