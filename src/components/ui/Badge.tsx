import { cn } from "./utils";

interface BadgeProps extends React.ComponentProps<"span"> {
  variant?: "default" | "secondary";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        variant === "default" ? "border-transparent bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground border-transparent",
        className
      )}
      {...props}
    />
  );
}
