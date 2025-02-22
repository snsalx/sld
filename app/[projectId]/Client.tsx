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
    await backend!
      .collection("projects")
      .update(project!.id, {
        slides: [...project!.slides.map((slide) => slide.id), slide.id],
      });
  }

  return (
    <div className="flex flex-col h-screen">
      <main className="bg-base h-full border-b-2 border-b-crust">
        TODO make it a tree
        <ul className="list-disc pl-6 underline text-blue">
          {project.slides.map((slide) => (
            <li key={slide.id} className="hover:text-sky">
              <a href={`/${id}/${slide.id}`}>{slide.name}</a>
            </li>
          ))}
        </ul>
      </main>

      <footer className="bg-base p-4 flex justify-between">
        <div className="flex gap-4">
          <ProfileButton />
          <input
            className="p-4 bg-transparent text-lg w-96 h-16 focus:outline-none focus:border-green border-2 border-text rounded-lg"
            placeholder="Slide title"
            value={project.name}
            // onChange={(event) => setName(event.target.value)}
          />
          <button
            className="w-16 h-16 text-base bg-green hover:scale-95 transition flex justify-center items-center rounded-lg"
            onClick={createSlide}
          >
            <PlusIcon className="size-8" />
          </button>
        </div>
      </footer>
    </div>
  );
}
