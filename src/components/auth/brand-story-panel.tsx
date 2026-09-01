import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

const CURVE_PATH =
  "M0,0 H1 V0.3 C0.95,0.36 0.92,0.42 0.94,0.48 C0.96,0.54 1,0.58 0.98,0.65 C0.96,0.74 0.9,0.8 0.87,0.88 C0.85,0.93 0.85,0.97 0.87,1 H0 Z";

export function BrandStoryPanel({
  heading,
  subheading,
  steps,
  children,
}: {
  heading: ReactNode;
  subheading: string;
  steps?: string[];
  children?: ReactNode;
}) {
  return (
    <div
      className="relative hidden lg:flex flex-col justify-between text-ivory p-12 xl:p-16 overflow-hidden"
      style={{ clipPath: "url(#brand-panel-curve)" }}
    >
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <clipPath id="brand-panel-curve" clipPathUnits="objectBoundingBox">
          <path d={CURVE_PATH} />
        </clipPath>
      </svg>

      <Image
        src="/images/hero/mill-silhouette-bg.png"
        alt=""
        fill
        priority
        sizes="55vw"
        className="object-cover animate-fade-scale z-[1]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-maroon-dark/70 via-maroon-dark/55 to-maroon-dark/85 z-[1]" />

      {/* gold curve stroke, drawn along the exact same path as the clip so the edge reads as a hairline */}
      <svg
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full z-[2] pointer-events-none"
        aria-hidden="true"
      >
        <path d={CURVE_PATH} fill="none" stroke="#C99527" strokeWidth={0.006} vectorEffect="non-scaling-stroke" />
      </svg>

      <Link
        href="/"
        aria-label="Chennai Rice Industries — Home"
        className="relative z-[6] inline-flex items-center gap-4 group animate-slide-up"
      >
        <Image
          src="/images/chennai-rice-logo.png"
          alt="Chennai Rice Industries India (P) Ltd. logo"
          width={100}
          height={100}
          className="w-[90px] h-[90px] xl:w-[104px] xl:h-[104px] transition-transform duration-300 group-hover:scale-105"
          priority
        />
        <span className="flex flex-col leading-tight">
          <span className="font-serif-display text-2xl xl:text-[28px] text-ivory tracking-wide">Chennai Rice</span>
          <span className="text-xs xl:text-[13px] uppercase tracking-[0.14em] text-ivory/60 mb-1.5">
            Industries India (P) Ltd.
          </span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-gold font-semibold">
            Mill Direct &middot; Since 1950
          </span>
        </span>
      </Link>

      <div className="relative z-[4]">
        <h1 className="font-serif-display text-4xl xl:text-5xl leading-[1.1] mb-6 max-w-lg animate-slide-up [animation-delay:0.1s] [animation-fill-mode:both]">
          {heading}
        </h1>
        <p className="text-ivory/65 leading-relaxed max-w-md mb-8 animate-slide-up [animation-delay:0.2s] [animation-fill-mode:both]">
          {subheading}
        </p>

        {steps && steps.length > 0 && (
          <ol className="flex flex-col gap-3.5 mb-2 stagger-in">
            {steps.map((step, i) => (
              <li key={step} className="flex items-center gap-3 text-sm text-ivory/85">
                <span className="flex-none w-6 h-6 rounded-full bg-gold text-maroon-dark text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        )}

        {children}
      </div>

      <div className="relative z-[5] h-[340px] xl:h-[400px] w-[560px] xl:w-[640px] -mx-12 xl:-mx-16 -mb-12 xl:-mb-16 animate-slide-up [animation-delay:0.3s] [animation-fill-mode:both]">
        <Image
          src="/images/hero/rice-sack-bowl-paddy.png"
          alt="Traditional sack of rice, wooden bowl of polished rice, and golden paddy stalks"
          fill
          sizes="640px"
          className="object-contain object-left-bottom"
        />
      </div>

      <div className="relative z-[4] max-w-[46%] pt-6 border-t border-ivory/10">
        <div className="flex items-center gap-3 text-xs text-ivory/40 flex-wrap">
          <span aria-hidden="true">&#10058;</span>
          <p>&copy; {new Date().getFullYear()} Chennai Rice Industries India (P) Ltd.</p>
          <span aria-hidden="true">|</span>
          <p>Chennai, Tamil Nadu, India</p>
          <span aria-hidden="true">|</span>
          <p>ESTD. 1950</p>
        </div>
      </div>
    </div>
  );
}
