"use client";

import { useContext, useEffect, useState } from "react";
import { BackendContext } from "./Backend";
import { redirect } from "next/navigation";
import { Project } from "./common";
import {
  FireIcon,
  PaperAirplaneIcon,
  PlayCircleIcon,
  PlayIcon,
} from "@heroicons/react/16/solid";
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

  if (!backend.authStore.isValid) {
    console.log("invalid auth", backend.authStore);
    redirect("/login");
  }

  return (
    <div className="flex h-screen items-center justify-center bg-base">
      <div className="flex flex-col gap-4 rounded-lg p-2">
        <h1 className="text-center text-3xl text-blue underline underline-offset-2">
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
        <p className="group text-center text-subtext0">
          <FireIcon className="me-2 inline size-3 transition group-hover:text-peach" />
          Powered by{" "}
          <Link
            href="https://snsalx.github.io/land/sld"
            className="group-hover:text-peach group-hover:underline"
          >
            snsalx/SLD
          </Link>
        </p>
      </div>
    </div>
  );
}
