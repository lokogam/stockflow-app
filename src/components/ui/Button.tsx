import { cn } from "./utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "destructive";
}

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    default: "bg-primary text-primary-foreground hover:opacity-90",
    outline: "border border-input bg-input-background text-foreground hover:bg-accent",
    destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
  };

  return (
    <button
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
