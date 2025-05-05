import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import BackendContextProvider, { BackendContext } from "./Backend";
import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";
import { unstable_noStore } from "next/cache";

const font = JetBrains_Mono({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic", "latin-ext"],
});

export const metadata: Metadata = {
  title: "SLD (alpha)",
  description: "A tool to make presentations with complexly nested slides",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  unstable_noStore();
  const backendUrl = process.env.BACKEND_URL || "";

  if (!backendUrl) {
    return (
      <html lang="en">
        <body
          className={`${font.variable} ${font.variable} latte flex h-screen w-screen items-center justify-center gap-4 bg-base text-3xl text-red antialiased dark:mocha selection:bg-sky selection:text-base`}
          style={{ fontFamily: "JetBrains Mono" }}
        >
          <ExclamationTriangleIcon className="size-16" />
          Misconfigured server
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body
        className={`${font.variable} ${font.variable} latte bg-base text-text antialiased dark:mocha selection:bg-sky selection:text-base`}
        style={{ fontFamily: "JetBrains Mono" }}
      >
        <BackendContextProvider url={backendUrl}>
          {children}
        </BackendContextProvider>
      </body>
    </html>
  );
}
