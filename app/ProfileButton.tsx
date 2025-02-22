import { HomeIcon } from "@heroicons/react/24/solid";
import { useContext } from "react";

export default function ProfileButton() {
  return (
    <a
      className="bg-surface0 text-text hover:scale-95 transition p-4 text-lg rounded-lg h-16 w-16"
      href="/"
      title="Home"
    >
      <HomeIcon />
    </a>
  );
}
