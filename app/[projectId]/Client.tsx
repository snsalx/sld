"use client";
import { useContext, useEffect, useState } from "react";
import HomeButton from "../ProfileButton";
import { Project, Slide } from "../common";
import { BackendContext, handleBackendError } from "../Backend";
import Link from "next/link";
import {
  InformationCircleIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import { redirect, useSearchParams } from "next/navigation";

export default function ProjectPage({ id }: { id: string }) {
  const backend = useContext(BackendContext);
  const [project, setProject] = useState<Project | undefined>();
  const params = useSearchParams();

  useEffect(() => {
    refetch();
  }, [id]);

  let viewing = params.get("viewing") !== null;

  if (!backend!.authStore.isValid) {
    viewing = true;
  }

  async function refetch() {
    const project = await backend!
      .collection("projects")
      .getOne<Project & { expand: any }>(id, { expand: "slides" })
      .catch(handleBackendError);
    setProject({ ...project, slides: project.expand!.slides || [] });
  }

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

    redirect("/" + id + "/" + slide.id);
  }

  async function setName(name: string) {
    await backend!.collection("projects").update(project!.id, { name });
  }

  async function handleDelete(slide: Slide) {
    if (!confirm("Delete " + slide.name + "?")) return;

    const slides = project?.slides
      .map((slide) => slide.id)
      .filter((id) => id !== slide.id);

    await backend!.collection("projects").update(project!.id, { slides });
    await refetch();
  }

  return (
    <div className="flex h-screen flex-col">
      <ul className="m-auto flex h-full w-fit flex-col gap-4 overflow-auto rounded-lg p-2">
        <h1 className="mt-auto text-center text-3xl text-blue underline underline-offset-2">
          Slides
        </h1>
        {project.slides.map((slide) => (
          <li key={slide.id} className="flex gap-4">
            <Link
              href={`/${id}/${slide.id}` + (viewing ? "?viewing" : "")}
              className="flex w-full items-center justify-between gap-2 rounded-lg border-2 border-crust bg-mantle p-4 text-xl transition hover:scale-[98%] hover:border-sky"
            >
              {slide.name}
            </Link>
            {viewing || (
              <button
                className={`flex h-16 w-16 min-w-16 items-center justify-center rounded-lg border-2 border-crust bg-mantle text-base text-red transition hover:scale-95 hover:border-red`}
                title="Delete slide"
                onClick={() => handleDelete(slide)}
              >
                <TrashIcon className="size-8" />
              </button>
            )}
          </li>
        ))}
        {viewing || (
          <button
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-crust bg-mantle p-4 text-xl text-green transition hover:scale-[98%] hover:border-sky"
            onClick={createSlide}
          >
            Create
            <PlusIcon className="size-8" />
          </button>
        )}
        <p className="group mb-auto w-[40ch] text-center text-subtext0">
          <InformationCircleIcon className="me-2 inline size-3" />
          Note: this will be a hierarchical tree showing links in the next
          version
        </p>
      </ul>

      <footer className="flex justify-between bg-mantle p-4">
        <div className="flex gap-4">
          <HomeButton />
          <input
            className="h-16 w-96 rounded-lg border-2 border-crust bg-base p-4 text-lg transition hover:border-sky focus:outline-none"
            placeholder="Slide title"
            defaultValue={project.name}
            onBlur={(event) => setName(event.target.value)}
          />
        </div>
      </footer>
    </div>
  );
}
