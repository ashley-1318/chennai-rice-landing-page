import { ReactNode } from "react";

type Tone = "maroon" | "gold" | "success" | "warning" | "danger" | "neutral";

const tones: Record<Tone, string> = {
  maroon: "bg-maroon text-ivory",
  gold: "bg-gold/15 text-maroon-dark border border-gold/40",
  success: "bg-emerald-50 text-emerald-800 border border-emerald-200",
  warning: "bg-amber-50 text-amber-800 border border-amber-200",
  danger: "bg-red-50 text-red-800 border border-red-200",
  neutral: "bg-ink/5 text-ink/70 border border-ink/10",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
