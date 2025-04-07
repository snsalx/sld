import { Button } from "@/components/ui/button";
import {
  ArrowUturnLeftIcon,
  QuestionMarkCircleIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/16/solid";
import Link from "next/link";

// like Toolbar, but for view mode

export default function Navbar(props: {
  title: string;
  projectLink: string;
  hideAbout?: boolean;
}) {
  return (
    <footer className="z-40">
      <div className="flex justify-between gap-6 overflow-auto bg-mantle p-4">
        <h1 className="h-16 w-fit overflow-hidden text-ellipsis text-nowrap rounded-lg border-2 border-crust bg-base p-4 text-lg font-bold">
          {props.title}
        </h1>

        <div className="flex gap-3">
          {props.hideAbout || (
            <>
          <Button asChild
            variant="blue"
                title="About"
            >
              <Link
                href="/about"
              >
                <QuestionMarkCircleIcon />
              </Link>
            </Button>
          <Button asChild
            variant="teal"
                title="All slides"
            >
              <Link
                href={props.projectLink + "?viewing"}
              >
                <Square3Stack3DIcon />
              </Link>
            </Button>
            </>
          )}
          <Button
            variant="yellow"
            onClick={() => history.back()}
            title="Go back"
          >
            <ArrowUturnLeftIcon />
          </Button>
        </div>
      </div>
    </footer>
  );
}
