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
      className="bg-base text-text p-4 text-lg focus:outline-none hover:border-sky transition border-2 border-crust rounded-lg h-16 w-40"
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
