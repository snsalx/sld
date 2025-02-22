"use client";
import { useContext, useEffect, useState } from "react";
import ProfileButton from "../ProfileButton";
import { Project } from "../common";
import { BackendContext } from "../Backend";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/16/solid";

export default function ProjectPage({ id }: { id: string }) {
  const backend = useContext(BackendContext);
  const [project, setProject] = useState<Project | undefined>();

  useEffect(() => {
    fetchData();

    async function fetchData() {
      const project = await backend!
        .collection("projects")
        .getOne<Project & { expand: any }>(id, { expand: "slides" });
      setProject({ ...project, slides: project.expand!.slides });
    }
  }, [id]);

  if (!project) {
    return <div>Loading...</div>;
  }

  async function createSlide() {
    const name = prompt("Name the new slide", "Untitled");
    if (!name) return;

    const slide = await backend!
      .collection("slides")
      .create({ name, objects: [] });
    await backend!.collection("projects").update(project!.id, {
      slides: [...project!.slides.map((slide) => slide.id), slide.id],
    });
  }

  return (
    <div className="flex h-screen flex-col">
      <main className="h-full border-b-2 border-b-crust bg-base">
        TODO make it a tree
        <ul className="list-disc pl-6 text-blue underline">
          {project.slides.map((slide) => (
            <li key={slide.id} className="hover:text-sky">
              <a href={`/${id}/${slide.id}`}>{slide.name}</a>
            </li>
          ))}
        </ul>
      </main>

      <footer className="flex justify-between bg-base p-4">
        <div className="flex gap-4">
          <ProfileButton />
          <input
            className="h-16 w-96 rounded-lg border-2 border-text bg-transparent p-4 text-lg focus:border-green focus:outline-none"
            placeholder="Slide title"
            value={project.name}
            // onChange={(event) => setName(event.target.value)}
          />
          <button
            className="flex h-16 w-16 items-center justify-center rounded-lg bg-green text-base transition hover:scale-95"
            onClick={createSlide}
          >
            <PlusIcon className="size-8" />
          </button>
        </div>
      </footer>
    </div>
  );
}
