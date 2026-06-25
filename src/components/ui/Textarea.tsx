import { cn } from "./utils";

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "border-input bg-input-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none transition focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
