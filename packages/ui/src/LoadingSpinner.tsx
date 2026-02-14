interface LoadingSpinnerProps {
  label?: string;
}

export function LoadingSpinner({ label = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-6 text-zinc-400">
      <span className="inline-block size-4 animate-spin rounded-full border-2 border-zinc-500 border-t-transparent" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
