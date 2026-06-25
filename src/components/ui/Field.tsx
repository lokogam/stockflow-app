interface FieldProps {
  label: string;
  name: string;
  value: string;
  error?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export function Field({ label, name, value, error, placeholder, onChange }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium text-zinc-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none transition focus:border-zinc-500"
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
