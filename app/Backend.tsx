"use client";

import Client from "pocketbase";
import { createContext, useEffect } from "react";
import PocketBase from "pocketbase";

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
