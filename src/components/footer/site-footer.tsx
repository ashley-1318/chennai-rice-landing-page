import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/branding/logo";

const COLUMNS = [
  {
    title: "Trade Portal",
    links: [
      { href: "/signin", label: "Sign In" },
      { href: "/register", label: "Register Your Firm" },
      { href: "/catalogue", label: "Catalogue" },
      { href: "/price-list", label: "My Price List" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/orders", label: "Order History" },
      { href: "/payments", label: "Payments & Invoices" },
      { href: "/profile/addresses", label: "Addresses" },
      { href: "/profile/business", label: "Business Profile" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/support#faqs", label: "FAQs" },
      { href: "/orders", label: "Track Order" },
      { href: "/support#shipping", label: "Shipping & Delivery" },
      { href: "/support#terms", label: "Terms & Conditions" },
    ],
  },
];

const SOCIALS = [
  { label: "Instagram", href: "#", path: "M8 2h8a6 6 0 016 6v8a6 6 0 01-6 6H8a6 6 0 01-6-6V8a6 6 0 016-6zm0 2a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4H8zm4 3.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 2a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM17.8 6a1 1 0 110 2 1 1 0 010-2z" },
  { label: "Facebook", href: "#", path: "M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v6h3v-6h3l1-3h-4v-2c0-.6.4-1 1-1z" },
  { label: "LinkedIn", href: "#", path: "M4 4.5A1.5 1.5 0 015.5 3h13A1.5 1.5 0 0120 4.5v15a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 19.5v-15zM8.5 9H6v9h2.5V9zM7.25 5.5a1.4 1.4 0 100 2.8 1.4 1.4 0 000-2.8zM18 13.2c0-2.4-1.28-3.5-3-3.5-1.38 0-2 .76-2.34 1.3V9H10v9h2.66v-5c0-.13.01-.27.05-.37.11-.27.36-.55.79-.55.55 0 .78.42.78 1.03V18H17v-4.8h1z" },
];

export function SiteFooter() {
  return (
    <footer className="bg-maroon-dark text-ivory mt-24">
      <div className="relative overflow-hidden">
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-10 pt-14 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-x-10 gap-y-10">
          <div className="lg:col-span-2 flex flex-col gap-3.5">
            <div className="[&_span]:text-ivory [&_span:last-child]:text-gold/70">
              <Logo size={56} />
            </div>
            <p className="text-sm text-ivory/65 max-w-xs leading-relaxed">
              Premium rice, carefully selected, processed and delivered with the trust of
              generations. Mill direct since 1950.
            </p>
            <p className="text-xs text-gold/70 tracking-wide">ESTD. 1950 &middot; Chennai, Tamil Nadu, India</p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs uppercase tracking-[0.15em] text-gold mb-4">{col.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ivory/70 hover:text-ivory transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xs uppercase tracking-[0.15em] text-gold mb-4">Stay Connected</h3>
            <p className="text-sm text-ivory/65 mb-4 leading-relaxed">Follow Chennai Rice on social media.</p>
            <div className="flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-11 h-11 flex items-center justify-center rounded-full border border-gold/30 text-gold/80 hover:text-maroon-dark hover:bg-gold hover:border-gold transition-colors duration-200"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="relative z-0 w-full h-40 sm:h-56 lg:h-72 -mb-2"
        >
          <Image
            src="/images/footer-illustration.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-bottom opacity-90"
          />
        </div>
      </div>

      <div className="relative z-10 border-t border-ivory/10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-5 flex items-center justify-center text-xs text-ivory/40">
          <p>&copy; {new Date().getFullYear()} Chennai Rice Industries India (P) Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
