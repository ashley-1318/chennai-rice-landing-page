"use client";

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

        <div className="flex items-center gap-4">
          {user && (
            <span className="hidden sm:inline">
              {/* business type badge shown here for quick glance, dropdown carries full detail */}
              <span className="text-[10px] uppercase tracking-wide bg-gold/15 text-maroon-dark border border-gold/40 px-2.5 py-1 rounded-full font-semibold">
                {BUSINESS_TYPE_TERMS[user.businessType].label}
              </span>
            </span>
          )}
          <ProfileDropdown />
        </div>
      </nav>
    </header>
  );
}
