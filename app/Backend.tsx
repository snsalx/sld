"use client";

import Client from "pocketbase";
import { createContext, useEffect } from "react";
import PocketBase from "pocketbase";
import { redirect } from "next/navigation";

export function handleBackendError(error: any): never {
  if (error?.status === 404) redirect("/login");
  throw new Error(error);
}

export const BackendContext = createContext<Client | undefined>(undefined);

export default function BackendContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const url =
    typeof window === "undefined"
      ? "running on the server"
      : window.location.protocol + "//" + window.location.hostname + ":8090";
  const pb = new PocketBase(url);

  return (
    <BackendContext.Provider value={pb}>{children}</BackendContext.Provider>
  );
}
