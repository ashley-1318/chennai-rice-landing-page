import Image from "next/image";
import { BrandStoryPanel } from "@/components/auth/brand-story-panel";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Logo } from "@/components/branding/logo";

export default function HomePage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] bg-ivory">
      <BrandStoryPanel
        heading={
          <>
            Trade accounts only.
            <br />
            <span className="text-gold">Your price depends on how you sell.</span>
          </>
        }
        subheading="Register your firm once. We verify your GSTIN, set your buying tier, and the catalogue opens at your rates with your minimums and your credit terms."
        steps={[
          "Pick the tier that matches your business",
          "Enter GSTIN, TIN and firm details",
          "Catalogue opens at your tier pricing",
          "Order, and pay on your terms",
        ]}
      />
      <div className="relative flex flex-col justify-center px-6 py-16 sm:px-12 overflow-hidden">
        <div className="lg:hidden mb-10">
          <Logo />
        </div>
        <SignInForm />

        <div className="hidden lg:block absolute bottom-0 right-0 w-[420px] h-[280px] opacity-70 pointer-events-none animate-fade-in [animation-delay:0.5s] [animation-fill-mode:both]">
          <Image
            src="/images/hero/farmhouse-line-art-raw.png"
            alt=""
            fill
            sizes="420px"
            className="object-contain object-bottom-right"
          />
        </div>
      </div>
    </div>
  );
}
