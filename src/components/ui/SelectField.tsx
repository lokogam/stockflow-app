import { Label } from "@/components/ui/Label";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  error?: string;
  options: Option[];
  onChange: (value: string) => void;
}

export function SelectField({ label, name, value, error, options, onChange }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name} className="text-muted-foreground text-[10px] uppercase tracking-[0.12em]">
        {label}
      </Label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border-input bg-input-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 py-2 text-sm outline-none transition focus-visible:ring-[3px]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
