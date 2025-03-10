"use client";

import { ArrowUturnLeftIcon } from "@heroicons/react/16/solid";
import { useSearchParams } from "next/navigation";
import Navbar from "../Navbar";

export default function ExternalContentViewer() {
  const params = useSearchParams();
  const url = params.get("url") || "";
  const backLink = params.get("backLink") || "";

  return (
    <div className="flex h-svh max-h-svh flex-col overflow-hidden">
      <main className="h-full bg-base p-4">
        <iframe className="h-full w-full rounded-lg bg-white" src={url} />
      </main>

      <Navbar title={url} projectLink={backLink} />
    </div>
  );
}
