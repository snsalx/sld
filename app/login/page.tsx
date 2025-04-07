"use client";

import { CheckIcon, UserPlusIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FormEvent, useContext, useEffect } from "react";
import { BackendContext } from "../Backend";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
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
    const data: any = Object.fromEntries(formData.entries());

    pb.collection("users")
      .authWithPassword(data.email, data.password)
      .then(
        () => redirect("/"),
        () => alert("E-Mail or password incorrect. Did you register?"),
      );
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <h1 className="text-center text-3xl text-blue underline">Log In</h1>

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

        <Button variant="green" size="fill" className="bg-mantle">
          Verify
          <CheckIcon className="ml-2 size-8" />
        </Button>

        <p className="text-center text-subtext0">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-peach hover:text-sky hover:underline group-hover:text-lavender"
          >
            Register
            <UserPlusIcon className="ml-2 inline size-3" />
          </Link>
        </p>
      </form>
    </div>
  );
}
