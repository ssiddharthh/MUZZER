type SpinnerProps = {
  label?: string;
  className?: string;
};

export function Spinner({ label = "Loading", className = "" }: SpinnerProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-10 text-muted ${className}`}
      role="status"
      aria-live="polite"
    >
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-r-transparent" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
