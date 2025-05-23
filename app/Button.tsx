import {
  ArrowUturnLeftIcon,
  ListBulletIcon,
  PlusIcon,
  Square3Stack3DIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";

const icons = {
  close: XMarkIcon,
  back: ArrowUturnLeftIcon,
  list: ListBulletIcon,
  tree: Square3Stack3DIcon,
  add: PlusIcon,
};

const colors = {
  red: "red",
  green: "green",
  orange: "peach",
  blue: "blue",
};

type Actions = keyof typeof icons;
type Colors = keyof typeof colors;

export default function IconButton({
  color,
  action,
  onClick,
}: {
  color: Colors;
  action: Actions;
  onClick?: () => void;
}) {
  const Icon = icons[action];

  return (
    <button
      className={`h-16 w-16 text-base bg-${colors[color]} flex items-center justify-center rounded-lg transition hover:scale-95`}
      onClick={onClick}
    >
      <Icon className="size-8" />
    </button>
  );
}
