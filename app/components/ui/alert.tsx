import type { HTMLAttributes } from "react";

type AlertVariant = "error" | "info" | "success";

const variantClasses: Record<AlertVariant, string> = {
  error: "border-danger/30 bg-danger/10 text-danger",
  info: "border-brand/30 bg-brand-soft text-foreground",
  success: "border-success/30 bg-success/10 text-success",
};

type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant;
  title?: string;
};

export function Alert({
  className = "",
  variant = "info",
  title,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm ${variantClasses[variant]} ${className}`}
      role="alert"
      {...props}
    >
      {title ? <p className="mb-1 font-medium">{title}</p> : null}
      <div>{children}</div>
    </div>
  );
}
