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

  async function handleSubmit(formData: FormData) {
    const data: any = {
      ...Object.fromEntries(formData.entries()),
      emailVisibility: false,
      verified: false,
    };

    await pb.collection("users").create(data);
    await pb.collection("users").authWithPassword(data.email, data.password);
    redirect("/");

    // TODO add error handling
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <form className="flex flex-col gap-4" action={handleSubmit}>
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
          <UserCircleIcon className="me-2 inline size-3 transition group-hover:text-sky" />
          Already have an account?{" "}
          <Link
            href="/login"
            className="group-hover:text-sky group-hover:underline"
          >
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}
