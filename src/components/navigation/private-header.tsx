"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/branding/logo";
import { ProfileDropdown } from "@/components/navigation/profile-dropdown";
import { useAuth } from "@/lib/auth/auth-context";
import { BUSINESS_TYPE_TERMS } from "@/mock/customers";

const LINKS = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/orders", label: "Orders" },
  { href: "/payments", label: "Invoices" },
  { href: "/support", label: "Support" },
];

export function PrivateHeader() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-md border-b border-ink/8">
      <nav className="max-w-[1440px] mx-auto flex items-center justify-between px-6 lg:px-10 h-20">
        <div className="flex items-center gap-10">
          <Logo showWordmark={false} />
          <ul className="hidden md:flex items-center gap-6">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors duration-150 hover:text-maroon ${
                    pathname.startsWith(link.href) ? "text-maroon" : "text-ink/70"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {user && (
            <span className="hidden sm:inline">
              {/* business type badge shown here for quick glance, dropdown carries full detail */}
              <span className="text-[10px] uppercase tracking-wide bg-gold/15 text-maroon-dark border border-gold/40 px-2.5 py-1 rounded-full font-semibold">
                {BUSINESS_TYPE_TERMS[user.businessType].label}
              </span>
            </span>
          )}
          <ProfileDropdown />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="md:hidden flex items-center justify-center w-11 h-11 -mr-2 text-ink/70 hover:text-maroon transition-colors duration-150"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t border-ink/8 bg-ivory">
          <ul className="max-w-[1440px] mx-auto px-6 py-3 flex flex-col">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block py-3 text-base font-medium tracking-wide transition-colors duration-150 ${
                    pathname.startsWith(link.href) ? "text-maroon" : "text-ink/70"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
