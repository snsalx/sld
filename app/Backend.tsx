"use client";

import Client from "pocketbase";
import { createContext, useEffect } from "react";
import PocketBase from "pocketbase";
import { redirect } from "next/navigation";

export function handleBackendError(error: any): never {
  if (error?.status === 404) redirect("/login");
  throw new Error("Not logged in");
}

export const BackendContext = createContext<Client | undefined>(undefined);

export default function BackendContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pb = new PocketBase("http://localhost:8090");

  return (
    <BackendContext.Provider value={pb}>{children}</BackendContext.Provider>
  );
}
