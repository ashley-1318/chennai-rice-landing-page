import { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 animate-fade-in">
      {icon && <div className="mb-4 text-4xl text-gold">{icon}</div>}
      <p className="font-serif-display text-lg text-maroon-dark mb-1">{title}</p>
      {description && <p className="text-sm text-ink/55 max-w-sm mb-5">{description}</p>}
      {action}
    </div>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 animate-fade-in">
      <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      <p className="text-sm text-ink/50">{label}</p>
    </div>
  );
}
