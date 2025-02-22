import { HomeIcon } from "@heroicons/react/24/solid";
import { useContext } from "react";

export default function ProfileButton() {
  return (
    <a
      className="bg-base text-text hover:scale-95 hover:border-sky transition p-4 border-2 border-crust text-lg rounded-lg h-16 w-16"
      href="/"
      title="Home"
    >
      <HomeIcon />
    </a>
  );
}
