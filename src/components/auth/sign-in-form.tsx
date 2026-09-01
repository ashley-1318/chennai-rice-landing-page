"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";

export function SignInForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await signIn(email, password);
    if (result.ok) {
      router.push("/catalogue");
    } else {
      setError(result.error);
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <h2 className="font-serif-display text-3xl text-maroon-dark mb-2">Sign In</h2>
      <p className="text-sm text-ink/55 mb-8">Access your Chennai Rice trade account.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-sm px-4 py-3">
            {error}
          </p>
        )}

        <div className="flex justify-end -mt-2">
          <Link href="#" className="text-xs text-maroon/70 hover:text-maroon underline underline-offset-2">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" variant="primary" disabled={submitting} className="mt-1">
          {submitting ? "Signing In…" : "Sign In"}
        </Button>
      </form>

      <div className="mt-8 pt-8 border-t border-ink/10 text-center">
        <p className="text-sm text-ink/60 mb-4">Don&apos;t have a trade account?</p>
        <Button href="/register" variant="outline" size="md">
          Register Your Firm
        </Button>
      </div>
    </div>
  );
}
