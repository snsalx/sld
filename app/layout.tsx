import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import BackendContextProvider, { BackendContext } from "./Backend";

const font = JetBrains_Mono({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic", "latin-ext"],
});

export const metadata: Metadata = {
  title: "SLD", // codename spagettiGallery
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.variable} ${font.variable} latte bg-base text-text antialiased dark:mocha selection:bg-lavender selection:text-base`}
        style={{ fontFamily: "JetBrains Mono" }}
      >
        <BackendContextProvider>{children}</BackendContextProvider>
      </body>
    </html>
  );
}
