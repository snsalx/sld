"use client";

import Client from "pocketbase";
import { createContext } from "react";
import PocketBase from "pocketbase";
import { redirect } from "next/navigation";

export function handleBackendError(error: any): never {
  if (error?.status === 404) redirect("/login");
  throw new Error(error);
}

export const BackendContext = createContext<Client | undefined>(undefined);

export default function BackendContextProvider({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) {
  const pb = new PocketBase(url);

  return (
    <BackendContext.Provider value={pb}>{children}</BackendContext.Provider>
  );
}
