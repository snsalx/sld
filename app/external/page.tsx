"use client";

import { ArrowUturnLeftIcon } from "@heroicons/react/16/solid";
import { useSearchParams } from "next/navigation";

export default function ExternalContentViewer() {
  const params = useSearchParams();
  const url = params.get("url") || "";

  return (
    <div className="flex h-svh max-h-svh flex-col overflow-hidden">
      <main className="h-full bg-base p-4">
        <iframe className="h-full w-full rounded-lg bg-white" src={url} />
      </main>

      <footer className="flex flex-row-reverse bg-mantle p-4">
        {/*todo move into a component*/}
        <button
          onClick={() => history.back()}
          className={`flex h-16 w-16 items-center justify-center rounded-lg border-2 border-crust bg-base text-yellow transition hover:scale-95 hover:border-yellow`}
          title="Go back"
        >
          <ArrowUturnLeftIcon className="size-8" />
        </button>
      </footer>
    </div>
  );
}
