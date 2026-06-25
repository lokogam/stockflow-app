import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

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
    <div className="flex flex-col gap-2">
      <Label htmlFor={name} className="text-muted-foreground text-[10px] uppercase tracking-[0.12em]">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
