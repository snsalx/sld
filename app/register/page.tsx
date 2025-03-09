"use client";

import { CheckIcon, UserCircleIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { redirect } from "next/navigation";
import PocketBase from "pocketbase";
import { FormEvent, useContext, useEffect } from "react";
import { BackendContext } from "../Backend";

export default function RegisterPage() {
  const pb = useContext(BackendContext)!;

  useEffect(() => {
    if (pb.authStore.isValid) {
      redirect("/");
    }
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    const formData = new FormData(event.currentTarget);
    const data: any = {
      ...Object.fromEntries(formData.entries()),
      emailVisibility: false,
      verified: false,
    };

    if (data.password !== data.passwordConfirm) {
      alert("Passwords don't match");

      return;
    }

    reg();

    async function reg() {
      await pb
        .collection("users")
        .create(data)
        .catch(() => alert("User already exists, attempting to log in"));
      await pb
        .collection("users")
        .authWithPassword(data.email, data.password)
        .catch((e) => {
          alert("Failed to log in, please try again");
          throw new Error(e);
        });
      redirect("/");
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <h1 className="text-center text-3xl text-blue underline">Register</h1>

        <input
          name="name"
          placeholder="Your Name"
          className="block h-16 w-96 rounded-lg border-2 border-crust bg-base bg-mantle p-4 text-lg transition hover:border-sky focus:outline-none"
        />

        <input
          name="email"
          type="email"
          placeholder="E-Mail"
          className="block h-16 w-96 rounded-lg border-2 border-crust bg-base bg-mantle p-4 text-lg transition hover:border-sky focus:outline-none"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="block h-16 w-96 rounded-lg border-2 border-crust bg-base bg-mantle p-4 text-lg transition hover:border-sky focus:outline-none"
        />

        <input
          name="passwordConfirm"
          type="password"
          placeholder="Password (Confirmation)"
          className="block h-16 w-96 rounded-lg border-2 border-crust bg-base bg-mantle p-4 text-lg transition hover:border-sky focus:outline-none"
        />

        <button className="flex h-16 w-full items-center justify-center rounded-lg border-2 border-crust bg-mantle text-base text-lg text-green transition hover:scale-95 hover:border-sky">
          Confirm
          <CheckIcon className="ml-2 size-8" />
        </button>

        <p className="group text-center text-subtext0">
          Already have an account?{" "}
          <Link
            href="/login"
            className="group-hover:text-sky group-hover:underline"
          >
            Log In
            <UserCircleIcon className="ml-2 inline size-3 transition group-hover:text-sky" />
          </Link>
        </p>
      </form>
    </div>
  );
}
