import { HomeIcon } from "@heroicons/react/24/solid";
import { useContext } from "react";

export default function HomeButton() {
  return (
    <a
      className="h-16 w-16 rounded-lg border-2 border-crust bg-base p-4 text-lg text-text transition hover:scale-95 hover:border-sky"
      href="/"
      title="Home"
    >
      <HomeIcon />
    </a>
  );
}
