export default function Select({
  options,
  autoClick,
  onChange,
}: {
  options: Record<string, string>;
  autoClick?: boolean;
  onChange?: (key: string) => void;
}) {
  return (
    <select
      className="bg-slate-700 p-4 text-lg focus:outline-none focus:bg-slate-600 h-16 w-full"
      onChange={(event) => onChange?.(event.target.value)}
      autoFocus={autoClick}
    >
      {Object.entries(options).map(([key, value]) => (
        <option key={key} value={key}>
          {value}
        </option>
      ))}
    </select>
  );
}
