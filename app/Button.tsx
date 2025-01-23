import {
  ArrowUturnLeftIcon,
  ListBulletIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";

const icons = {
  close: XMarkIcon,
  back: ArrowUturnLeftIcon,
  list: ListBulletIcon,
};

const colors = {
  red: "red-300",
  orange: "orange-300",
  gray: "slate-600",
};

type Actions = keyof typeof icons;
type Colors = keyof typeof colors;

export default function IconButton({
  color,
  action,
  onClick,
  radius,
}: {
  color: Colors;
  action: Actions;
  radius?: number;
  onClick?: () => void;
}) {
  const Icon = icons[action];

  return (
    <button
      className={`w-16 h-16 bg-${colors[color]} flex justify-center items-center rounded-[${radius || 0}px]`}
      onClick={onClick}
    >
      <Icon className="size-8" />
    </button>
  );
}
