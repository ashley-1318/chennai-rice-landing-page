import { ReactNode } from "react";
import { PrivateHeader } from "@/components/navigation/private-header";
import { SiteFooter } from "@/components/footer/site-footer";
import { AuthGuard } from "@/components/layout/auth-guard";

export function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <PrivateHeader />
      <main className="flex-1 bg-ivory">{children}</main>
      <SiteFooter />
    </AuthGuard>
  );
}
