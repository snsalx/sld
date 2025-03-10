"use client";

import {
  BoltIcon,
  CodeBracketIcon,
  LightBulbIcon,
} from "@heroicons/react/16/solid";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="m-auto w-[65ch] py-4">
      <h1 className="text-3xl text-blue underline">About</h1>

      <p className="py-4">
        <em className="not-italic text-sky">SLD</em> (short for SLIDE) is an{" "}
        <Link
          className="text-teal hover:underline"
          href="https://github.com/snsalx/sld"
        >
          open-source
          <CodeBracketIcon className="ml-2 inline size-4" />
        </Link>{" "}
        tool for making presentations with complexly nested slides.
      </p>

      <button
        onClick={() => history.back()}
        className="mb-4 block text-peach underline"
      >
        Back to the app
      </button>

      <h2 className="pt-4 text-3xl text-blue underline">Documentation</h2>
      <p className="py-4">
        Docs are coming this month. Ideally, I&apos;d want the user interface to
        be self-explanatory, but we&apos;re far from that.
      </p>

      <h2 className="pt-4 text-3xl text-blue underline">Contributors</h2>
      <ul className="py-4">
        <li>
          <span className="text-sky">
            <LightBulbIcon className="mr-2 inline size-4" />
            idea:{" "}
          </span>
          <Link className="underline" href="https://kubstu.ru/s-651">
            KubSTU IFN
          </Link>{" "}
          director (Bochkareva Anna Stanislavovna)
        </li>
        <li>
          <span className="text-teal">
            <BoltIcon className="mr-2 inline size-4" />
            execution:{" "}
          </span>
          <Link className="underline" href="https://snlx.net">
            snlx.net
          </Link>{" "}
          (Alex)
        </li>
      </ul>
    </div>
  );
}
