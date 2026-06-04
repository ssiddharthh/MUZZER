import type { HTMLAttributes } from "react";

type BadgeVariant = "default" | "brand" | "spotify" | "youtube" | "success";

const variantClasses: Record<BadgeVariant, string> = {
  default: "border-border bg-surface-elevated text-muted",
  brand: "border-brand/30 bg-brand-soft text-brand",
  spotify: "border-spotify/30 bg-spotify/10 text-spotify",
  youtube: "border-youtube/30 bg-youtube/10 text-youtube",
  success: "border-success/30 bg-success/10 text-success",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({
  className = "",
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
