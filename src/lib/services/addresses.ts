import { supabase } from "@/lib/supabase/client";
import { Address } from "@/mock/types";
import type { Database } from "@/lib/supabase/database.types";

type AddressRow = Database["public"]["Tables"]["addresses"]["Row"];

function rowToAddress(row: AddressRow): Address {
  return {
    id: row.id,
    label: row.label,
    contactPerson: row.contact_person,
    mobile: row.mobile,
    addressLine1: row.address_line1,
    addressLine2: row.address_line2 ?? undefined,
    city: row.city,
    district: row.district,
    state: row.state,
    pincode: row.pincode,
    landmark: row.landmark ?? undefined,
    isDefault: row.is_default,
  };
}

export async function fetchAddresses(): Promise<Address[]> {
  const { data, error } = await supabase.from("addresses").select("*").order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToAddress);
}

export async function fetchAddressesByIds(ids: string[]): Promise<Address[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase.from("addresses").select("*").in("id", ids);
  if (error) throw error;
  return (data ?? []).map(rowToAddress);
}

export interface UpsertAddressInput {
  businessId: string;
  label: Address["label"];
  contactPerson: string;
  mobile: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
}

export async function createAddress(input: UpsertAddressInput): Promise<Address> {
  if (input.isDefault) {
    await supabase.from("addresses").update({ is_default: false }).eq("business_id", input.businessId);
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert({
      business_id: input.businessId,
      label: input.label,
      contact_person: input.contactPerson,
      mobile: input.mobile,
      address_line1: input.addressLine1,
      address_line2: input.addressLine2 ?? null,
      city: input.city,
      district: input.district,
      state: input.state,
      pincode: input.pincode,
      landmark: input.landmark ?? null,
      is_default: input.isDefault,
    })
    .select("*")
    .single();

  if (error) throw error;
  return rowToAddress(data);
}

export async function updateAddress(id: string, businessId: string, input: UpsertAddressInput): Promise<void> {
  if (input.isDefault) {
    await supabase.from("addresses").update({ is_default: false }).eq("business_id", businessId);
  }

  const { error } = await supabase
    .from("addresses")
    .update({
      label: input.label,
      contact_person: input.contactPerson,
      mobile: input.mobile,
      address_line1: input.addressLine1,
      address_line2: input.addressLine2 ?? null,
      city: input.city,
      district: input.district,
      state: input.state,
      pincode: input.pincode,
      landmark: input.landmark ?? null,
      is_default: input.isDefault,
    })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteAddress(id: string): Promise<void> {
  const { error } = await supabase.from("addresses").delete().eq("id", id);
  if (error) throw error;
}

export async function setDefaultAddress(id: string, businessId: string): Promise<void> {
  await supabase.from("addresses").update({ is_default: false }).eq("business_id", businessId);
  const { error } = await supabase.from("addresses").update({ is_default: true }).eq("id", id);
  if (error) throw error;
}
