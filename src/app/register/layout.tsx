import { ReactNode } from "react";
import { RegistrationProvider } from "@/lib/registration/registration-context";

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return <RegistrationProvider>{children}</RegistrationProvider>;
}
