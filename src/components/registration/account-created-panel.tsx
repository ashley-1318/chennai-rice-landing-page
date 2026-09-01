import { Logo } from "@/components/branding/logo";
import { Button } from "@/components/ui/button";
import { BUSINESS_TYPE_TERMS } from "@/mock/customers";
import { BusinessType } from "@/mock/types";

export function AccountCreatedPanel({
  businessName,
  businessType,
}: {
  businessName: string;
  businessType: BusinessType;
}) {
  const terms = BUSINESS_TYPE_TERMS[businessType];

  return (
    <div className="min-h-screen bg-cream grain-overlay flex flex-col">
      <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-10 pt-10">
        <Logo />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-lg w-full bg-ivory border border-gold/30 rounded-sm p-10 sm:p-14 text-center animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-maroon text-ivory flex items-center justify-center text-2xl mx-auto mb-6 animate-scale-in [animation-delay:100ms]">
            ✓
          </div>
          <h1 className="font-serif-display text-2xl sm:text-3xl text-maroon-dark mb-3">
            Your trade account has been created.
          </h1>
          <p className="text-ink/65 leading-relaxed mb-2">
            Welcome to Chennai Rice Industries, <span className="font-semibold">{businessName}</span>.
          </p>
          <p className="text-ink/60 leading-relaxed mb-8">
            Your account details are ready. Once verified, your trade catalogue will open
            according to your buying tier —{" "}
            <span className="font-semibold text-maroon">{terms.label}</span> ({terms.discountLabel}).
          </p>
          <Button href="/signin" size="lg" variant="primary">
            Continue to Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
