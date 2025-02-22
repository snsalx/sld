"use client";

import { useContext, useEffect, useState } from "react";
import { BackendContext } from "./Backend";
import { redirect } from "next/navigation";
import { Project } from "./common";
import {
  PaperAirplaneIcon,
  PlayCircleIcon,
  PlayIcon,
} from "@heroicons/react/16/solid";

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

  if (!backend.authStore.isValid) {
    console.log("invalid auth", backend.authStore);
    redirect("/login");
  }

  return (
    <div className="flex h-screen items-center justify-center bg-mantle">
      <div className="flex flex-col gap-2 rounded-lg bg-base p-2">
        <h1 className="mb-4 text-center text-2xl">Projects</h1>
        {projects.map((project) => (
          <a
            href={"/" + project.id}
            key={project.id}
            className="flex w-full items-center justify-between gap-2 p-2 text-xl transition hover:text-blue"
          >
            <h2>{project.name}</h2>
            <PlayCircleIcon className="size-8" />
          </a>
        ))}
      </div>
    </div>
  );
}
