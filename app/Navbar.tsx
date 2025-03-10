"use client";

import {
  ArrowUturnLeftIcon,
  QuestionMarkCircleIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/16/solid";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// like Toolbar, but for view mode

export default function Navbar(props: { title: string; projectLink: string }) {
  const params = useSearchParams();

  const viewing = params.get("viewing") !== null;

  return (
    <footer className="z-40">
      <div className="flex justify-between gap-6 overflow-auto bg-mantle p-4">
        <h1 className="h-16 w-fit overflow-hidden text-ellipsis text-nowrap rounded-lg border-2 border-crust bg-base p-4 text-lg font-bold">
          {props.title}
        </h1>

        <div className="flex gap-3">
          <Link
            href="/about"
            className={`flex h-16 w-16 items-center justify-center rounded-lg border-2 border-crust bg-base text-blue transition hover:scale-95 hover:border-blue`}
            title="About"
          >
            <QuestionMarkCircleIcon className="size-8" />
          </Link>
          <Link
            href={props.projectLink + (viewing ? "?viewing" : "")}
            className={`flex h-16 w-16 items-center justify-center rounded-lg border-2 border-crust bg-base text-teal transition hover:scale-95 hover:border-teal`}
            title="All slides"
          >
            <Square3Stack3DIcon className="size-8" />
          </Link>
          <button
            onClick={() => history.back()}
            className={`flex h-16 w-16 items-center justify-center rounded-lg border-2 border-crust bg-base text-yellow transition hover:scale-95 hover:border-yellow`}
            title="Go back"
          >
            <ArrowUturnLeftIcon className="size-8" />
          </button>
        </div>
      </div>
    </footer>
  );
}
