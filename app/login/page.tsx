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
    <div className="w-screen h-screen flex justify-center items-center bg-mantle">
      <form className="w-80 grid bg-base p-2 gap-2" action={handleSubmit}>
        <label>
          E-mail
          <input
            name="email"
            type="email"
            className="bg-mantle p-2 rounded-lg"
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            className="bg-mantle p-2 rounded-lg"
          />
        </label>

        <button className="p-2 bg-blue text-base rounded-lg">Log in</button>
        <p>
          Don't have an account? <a href="/login">Register</a>
        </p>
      </form>
    </div>
  );
}
