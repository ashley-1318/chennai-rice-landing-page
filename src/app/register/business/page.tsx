"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/branding/logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRegistration } from "@/lib/registration/registration-context";
import { useAuth } from "@/lib/auth/auth-context";
import { BUSINESS_TYPE_TERMS } from "@/mock/customers";
import { RegisteredFirm } from "@/mock/types";
import { AccountCreatedPanel } from "@/components/registration/account-created-panel";

type FormState = Omit<RegisteredFirm, "businessType">;

const INITIAL_STATE: FormState = {
  registeredBusinessName: "",
  gstNo: "",
  tin: "",
  shopName: "",
  numberOfOutlets: 1,
  representativeContact: "",
  mobile: "",
  email: "",
  deliveryPincode: "",
  password: "",
};

const GST_PATTERN = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/;

function validate(form: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!form.registeredBusinessName.trim()) errors.registeredBusinessName = "Registered business name is required.";
  if (!GST_PATTERN.test(form.gstNo.trim().toUpperCase()))
    errors.gstNo = "Enter a valid 15-character GST number.";
  if (!form.tin.trim()) errors.tin = "TIN is required.";
  if (!form.shopName.trim()) errors.shopName = "Shop / outlet name is required.";
  if (!form.numberOfOutlets || form.numberOfOutlets < 1) errors.numberOfOutlets = "Enter at least 1 outlet.";
  if (!form.representativeContact.trim()) errors.representativeContact = "Representative contact is required.";
  if (!/^\+?\d{10,13}$/.test(form.mobile.replace(/[\s-]/g, "")))
    errors.mobile = "Enter a valid mobile number.";
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Enter a valid email address.";
  if (!/^\d{6}$/.test(form.deliveryPincode)) errors.deliveryPincode = "Enter a valid 6-digit pincode.";
  if (form.password.length < 8) errors.password = "Password must be at least 8 characters.";
  return errors;
}

export default function RegisterStepTwoPage() {
  const router = useRouter();
  const { businessType } = useRegistration();
  const { registerFirm } = useAuth();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [created, setCreated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  if (!businessType) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-cream px-6 text-center">
        <p className="text-ink/60">Please select a business type first.</p>
        <Button href="/register" variant="primary">
          Back to Step 1
        </Button>
      </div>
    );
  }

  if (created) {
    return <AccountCreatedPanel businessName={form.registeredBusinessName} businessType={businessType} />;
  }

  const terms = BUSINESS_TYPE_TERMS[businessType];

  const field = (key: keyof FormState) => ({
    value: String(form[key] ?? ""),
    error: errors[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({
        ...f,
        [key]: key === "numberOfOutlets" ? Number(e.target.value) : e.target.value,
      })),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    const result = await registerFirm({ ...form, businessType });
    if (result.ok) {
      setCreated(true);
    } else {
      setSubmitError(result.error);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream grain-overlay flex flex-col">
      <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-10 pt-10">
        <Logo />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full bg-ivory border border-ink/10 rounded-sm p-8 sm:p-12 animate-slide-up">
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-semibold mb-3">Step 2 of 2</p>
          <h1 className="font-serif-display text-3xl text-maroon-dark mb-2">Your Firm&apos;s Details</h1>
          <p className="text-sm text-ink/55 mb-8">
            Registering as <span className="font-semibold text-maroon">{terms.label}</span> —{" "}
            {terms.discountLabel}, {terms.paymentTerms}.
          </p>

          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5" noValidate>
            <div className="sm:col-span-2">
              <Input label="Registered Business Name" required {...field("registeredBusinessName")} />
            </div>
            <Input label="GST No" required placeholder="33AAFCR1234K1Z8" {...field("gstNo")} />
            <Input label="TIN" required {...field("tin")} />
            <Input label="Shop / Outlet Name" required {...field("shopName")} />
            <Input
              label="Number of Outlets"
              type="number"
              min={1}
              required
              {...field("numberOfOutlets")}
            />
            <Input label="Representative Contact" required {...field("representativeContact")} />
            <Input label="Mobile No" type="tel" required placeholder="+91 98765 43210" {...field("mobile")} />
            <Input label="Email" type="email" required {...field("email")} />
            <Input label="Delivery Pincode" required placeholder="600001" {...field("deliveryPincode")} />
            <div className="sm:col-span-2">
              <Input
                label="Password"
                type="password"
                required
                hint="At least 8 characters."
                {...field("password")}
              />
            </div>

            {submitError && (
              <p role="alert" className="sm:col-span-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-sm px-4 py-3">
                {submitError}
              </p>
            )}

            <div className="sm:col-span-2 flex justify-between mt-4">
              <Button type="button" variant="ghost" size="md" onClick={() => router.push("/register")}>
                ← Back
              </Button>
              <Button type="submit" variant="primary" size="lg" disabled={submitting}>
                {submitting ? "Creating Account…" : "Create Account"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
