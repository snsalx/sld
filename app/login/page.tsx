"use client";

import { redirect } from "next/navigation";
import PocketBase from "pocketbase";
import { FormEvent, useEffect } from "react";

export default function LoginPage() {
  const pb = new PocketBase("http://localhost:8090");

  useEffect(() => {
    if (pb.authStore.isValid) {
      redirect("/");
    }
  }, []);

  async function handleSubmit(formData: FormData) {
    const data: any = Object.fromEntries(formData.entries());

    await pb.collection("users").authWithPassword(data.email, data.password);
    redirect("/");

    // TODO add error handling
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-mantle">
      <form className="grid w-80 gap-2 bg-base p-2" action={handleSubmit}>
        <label>
          E-mail
          <input
            name="email"
            type="email"
            className="rounded-lg bg-mantle p-2"
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            className="rounded-lg bg-mantle p-2"
          />
        </label>

        <button className="rounded-lg bg-blue p-2 text-base">Log in</button>
        <p>
          Don't have an account? <a href="/login">Register</a>
        </p>
      </form>
    </div>
  );
}
