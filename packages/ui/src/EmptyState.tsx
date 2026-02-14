import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export function EmptyState({ title, description, icon: Icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/50 p-12 text-center animate-in fade-in zoom-in duration-500">
      {Icon ? (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 ring-1 ring-zinc-800 shadow-sm">
          <Icon className="h-8 w-8 text-zinc-400" />
        </div>
      ) : null}
      <h3 className="text-lg font-medium text-zinc-100">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-zinc-400 text-balance">
        {description}
      </p>
    </div>
  );
}
