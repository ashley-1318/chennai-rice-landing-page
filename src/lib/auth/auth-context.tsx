"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { AuthenticatedUser, BusinessProfile, BusinessType, RegisteredFirm } from "@/mock/types";
import type { Database } from "@/lib/supabase/database.types";

type BusinessRow = Database["public"]["Tables"]["businesses"]["Row"];

interface AuthContextValue {
  user: AuthenticatedUser | null;
  profile: BusinessProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  signOut: () => Promise<void>;
  registerFirm: (firm: RegisteredFirm) => Promise<{ ok: true; user: AuthenticatedUser } | { ok: false; error: string }>;
  updateProfile: (updates: Partial<BusinessProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function businessRowToProfile(row: BusinessRow, address: BusinessProfile["address"]): BusinessProfile {
  return {
    registeredBusinessName: row.registered_business_name,
    businessType: row.business_type,
    gstin: row.gstin,
    tin: row.tin,
    shopName: row.shop_name,
    numberOfOutlets: row.number_of_outlets,
    representativeContact: row.representative_contact,
    mobile: row.mobile,
    email: row.email,
    address,
  };
}

function businessRowToUser(row: BusinessRow): AuthenticatedUser {
  return {
    id: row.id,
    name: row.representative_contact,
    businessName: row.registered_business_name,
    businessType: row.business_type,
    gstin: row.gstin,
    email: row.email,
  };
}

async function fetchDefaultAddress(businessId: string): Promise<BusinessProfile["address"]> {
  const { data } = await supabase
    .from("addresses")
    .select("address_line1, city, district, state, pincode")
    .eq("business_id", businessId)
    .eq("is_default", true)
    .maybeSingle();

  return {
    address: data?.address_line1 ?? "",
    city: data?.city ?? "",
    district: data?.district ?? "",
    state: data?.state ?? "Tamil Nadu",
    pincode: data?.pincode ?? "",
  };
}

async function loadUserAndProfile(userId: string): Promise<{ user: AuthenticatedUser; profile: BusinessProfile } | null> {
  const { data: business } = await supabase.from("businesses").select("*").eq("id", userId).maybeSingle();
  if (!business) return null;

  const address = await fetchDefaultAddress(userId);
  return { user: businessRowToUser(business), profile: businessRowToProfile(business, address) };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const hydrate = async (session: Session | null) => {
      if (!session) {
        if (active) {
          setUser(null);
          setProfile(null);
          setIsLoading(false);
        }
        return;
      }
      const result = await loadUserAndProfile(session.user.id);
      if (!active) return;
      setUser(result?.user ?? null);
      setProfile(result?.profile ?? null);
      setIsLoading(false);
    };

    supabase.auth.getSession().then(({ data }) => hydrate(data.session));

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoading(true);
      hydrate(session);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signIn: AuthContextValue["signIn"] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      return { ok: false, error: "Invalid email or password. Please try again." };
    }
    return { ok: true };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const registerFirm: AuthContextValue["registerFirm"] = async (firm) => {
    const { data, error } = await supabase.auth.signUp({
      email: firm.email.trim(),
      password: firm.password,
      options: {
        data: {
          registered_business_name: firm.registeredBusinessName,
          business_type: firm.businessType,
          gst_no: firm.gstNo,
          tin: firm.tin,
          shop_name: firm.shopName,
          number_of_outlets: firm.numberOfOutlets,
          representative_contact: firm.representativeContact,
          mobile: firm.mobile,
          delivery_pincode: firm.deliveryPincode,
        },
      },
    });

    if (error) {
      return { ok: false, error: error.message };
    }
    if (!data.user) {
      return { ok: false, error: "Account created, but sign-in requires email confirmation. Please check your inbox." };
    }

    const newUser: AuthenticatedUser = {
      id: data.user.id,
      name: firm.representativeContact,
      businessName: firm.registeredBusinessName,
      businessType: firm.businessType,
      gstin: firm.gstNo,
      email: firm.email,
    };
    return { ok: true, user: newUser };
  };

  const updateProfile: AuthContextValue["updateProfile"] = async (updates) => {
    if (!profile || !user) return;

    const { error } = await supabase
      .from("businesses")
      .update({
        registered_business_name: updates.registeredBusinessName,
        gstin: updates.gstin,
        tin: updates.tin,
        shop_name: updates.shopName,
        number_of_outlets: updates.numberOfOutlets,
        representative_contact: updates.representativeContact,
        mobile: updates.mobile,
        email: updates.email,
      })
      .eq("id", user.id);

    if (!error) {
      setProfile({ ...profile, ...updates });
    }
  };

  const value: AuthContextValue = {
    user,
    profile,
    isLoading,
    signIn,
    signOut,
    registerFirm,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export type { BusinessType };
