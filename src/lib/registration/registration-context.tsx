"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { BusinessType } from "@/mock/types";

interface RegistrationState {
  businessType: BusinessType | null;
  setBusinessType: (type: BusinessType) => void;
}

const RegistrationContext = createContext<RegistrationState | undefined>(undefined);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [businessType, setBusinessType] = useState<BusinessType | null>(null);

  const value = useMemo(() => ({ businessType, setBusinessType }), [businessType]);

  return <RegistrationContext.Provider value={value}>{children}</RegistrationContext.Provider>;
}

export function useRegistration() {
  const ctx = useContext(RegistrationContext);
  if (!ctx) throw new Error("useRegistration must be used within RegistrationProvider");
  return ctx;
}
