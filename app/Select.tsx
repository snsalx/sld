export default function Select<T extends Record<string, string>>({
  options,
  value,
  onChange,
}: {
  options: T;
  value: string;
  onChange?: (key: keyof T) => void;
}) {
  return (
    <select
      className="h-16 w-40 rounded-lg border-2 border-crust bg-base p-4 text-lg text-text transition hover:border-sky focus:outline-none"
      onChange={(event) => onChange?.(event.target.value)}
      value={value}
    >
      {Object.entries(options).map(([key, value]) => (
        <option key={key} value={key}>
          {value}
        </option>
      ))}
    </select>
  );
}
