"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";

export function PrivatePageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 pt-10 pb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="animate-slide-up">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-ink/55 hover:text-maroon-dark transition-colors duration-150 mb-3"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back
        </button>
        <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold mb-2">{eyebrow}</p>
        <h1 className="font-serif-display text-3xl text-maroon-dark mb-1">{title}</h1>
        {description && <p className="text-sm text-ink/55 max-w-xl">{description}</p>}
      </div>
      {action}
    </div>
  );
}
