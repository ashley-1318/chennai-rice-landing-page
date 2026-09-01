"use client";

import { useRouter } from "next/navigation";
import { Logo } from "@/components/branding/logo";
import { Button } from "@/components/ui/button";
import { BusinessTypeCard } from "@/components/registration/business-type-card";
import { useRegistration } from "@/lib/registration/registration-context";
import { BUSINESS_TYPE_TERMS } from "@/mock/customers";
import { BusinessType } from "@/mock/types";

const ORDER: BusinessType[] = ["retailer", "wholesaler", "distributor"];

export default function RegisterStepOnePage() {
  const router = useRouter();
  const { businessType, setBusinessType } = useRegistration();

  return (
    <div className="min-h-screen bg-cream grain-overlay flex flex-col">
      <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-10 pt-10">
        <Logo />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl w-full animate-slide-up">
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-semibold mb-3 text-center">
            Step 1 of 2
          </p>
          <h1 className="font-serif-display text-3xl sm:text-4xl text-maroon-dark text-center mb-3">
            Register a Firm
          </h1>
          <p className="text-center text-ink/60 mb-12">How does your firm sell rice?</p>

          <div role="radiogroup" aria-label="Business type" className="grid sm:grid-cols-3 gap-6 mb-10">
            {ORDER.map((type) => (
              <BusinessTypeCard
                key={type}
                terms={BUSINESS_TYPE_TERMS[type]}
                selected={businessType === type}
                onSelect={() => setBusinessType(type)}
              />
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <Button size="lg" variant="ghost" onClick={() => router.push("/")}>
              ← Back
            </Button>
            <Button
              size="lg"
              variant="primary"
              disabled={!businessType}
              onClick={() => router.push("/register/business")}
            >
              Continue →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
