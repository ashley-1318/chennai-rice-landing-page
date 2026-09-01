"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { BUSINESS_TYPE_TERMS } from "@/mock/customers";

const MENU_ITEMS = [
  { href: "/profile/business", label: "Business Profile" },
  { href: "/profile/addresses", label: "Addresses" },
  { href: "/orders", label: "Order History" },
  { href: "/payments", label: "Payments & Invoices" },
  { href: "/support", label: "Support" },
  { href: "/profile/settings", label: "Account Settings" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProfileDropdown() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  if (!user) return null;
  const terms = BUSINESS_TYPE_TERMS[user.businessType];

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    router.push("/");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-ink/10 hover:border-gold/50 transition-colors duration-200"
      >
        <span className="w-8 h-8 rounded-full bg-maroon text-ivory text-xs font-semibold flex items-center justify-center">
          {initials(user.businessName)}
        </span>
        <span className="hidden xl:flex flex-col items-start leading-tight">
          <span className="text-xs font-medium text-ink/85">{user.businessName}</span>
          <span className="text-[10px] uppercase tracking-wide text-gold">{terms.label}</span>
        </span>
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-72 bg-ivory border border-ink/10 rounded-sm shadow-xl overflow-hidden animate-scale-in origin-top-right"
        >
          <div className="px-5 py-4 bg-maroon-dark text-ivory">
            <div className="w-9 h-9 rounded-full bg-gold text-maroon-dark text-sm font-bold flex items-center justify-center mb-2">
              {initials(user.businessName)}
            </div>
            <p className="font-serif-display text-base">{user.businessName}</p>
            <p className="text-xs text-gold-muted uppercase tracking-wide mt-0.5">{terms.label}</p>
            <p className="text-[11px] text-ivory/60 mt-1">GSTIN: {user.gstin}</p>
          </div>
          <div className="py-2">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center px-5 py-2.5 text-sm text-ink/80 hover:bg-maroon/5 hover:text-maroon transition-colors duration-150"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-ink/8 py-2">
            <button
              onClick={handleSignOut}
              role="menuitem"
              className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-red-700 hover:bg-red-50 transition-colors duration-150"
            >
              <span aria-hidden="true">↪</span>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
