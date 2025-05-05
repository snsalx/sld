"use client";

import { useContext, useEffect, useState } from "react";
import { BackendContext } from "./Backend";
import { redirect } from "next/navigation";
import { Project } from "./common";
import { FireIcon, PlusIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

type ProjectSkeleton = Omit<Project, "slides">;

export default function Home() {
  const [projects, setProjects] = useState<ProjectSkeleton[]>([]);

  const backend = useContext(BackendContext);

  useEffect(() => {
    console.log("request");
    backend
      ?.collection("projects")
      .getFullList<ProjectSkeleton>()
      .then(setProjects)
      .catch(console.warn);
  }, []);

  if (!backend) {
    return <h1>Something went extremely wrong</h1>;
  }

  if (typeof window !== "undefined" && !backend.authStore.isValid) {
    console.log("invalid auth", backend.authStore);
    redirect("/login");
  }

  async function handleCreate() {
    const name = prompt("Name the new project", "Untitled");
    const slideName = prompt("Name the first slide", "Untitled");
    if (!name) return;

    const project = await backend!
      .collection("projects")
      .create({ name, slides: [], author: backend?.authStore.record!.id });

    const slide = await backend!
      .collection("slides")
      .create({ name: slideName, objects: [] });

    await backend!.collection("projects").update(project.id, {
      slides: [slide.id],
    });

    redirect("/" + project.id + "/" + slide.id);
  }

  return (
    <div className="h-screen bg-base">
      <div className="m-auto flex h-full w-fit flex-col gap-4 overflow-auto rounded-lg p-2">
        <h1 className="mt-auto text-center text-3xl text-blue underline underline-offset-2">
          My Projects
        </h1>
        {projects.map((project) => (
          <a
            href={"/" + project.id}
            key={project.id}
            className="flex w-full items-center justify-between gap-2 rounded-lg border-2 border-crust bg-mantle p-4 text-xl transition hover:scale-[98%] hover:border-sky"
          >
            <h2>{project.name}</h2>
          </a>
        ))}
        <button
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-crust bg-mantle p-4 text-xl text-green transition hover:scale-[98%] hover:border-sky"
          onClick={handleCreate}
        >
          Create
          <PlusIcon className="size-8" />
        </button>
        <p className="group mb-auto text-center text-subtext0">
          <FireIcon className="me-2 inline size-3 transition group-hover:text-peach" />
          Powered by{" "}
          <Link
            href="/about"
            className="group-hover:text-peach group-hover:underline"
          >
            sld v0.3.0
          </Link>
        </p>
      </div>
    </div>
  );
}
