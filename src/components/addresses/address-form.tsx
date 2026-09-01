"use client";

import { FormEvent, useState } from "react";
import { Address } from "@/mock/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FormValues = Omit<Address, "id" | "isDefault"> & { useAsDefault: boolean };

const EMPTY: FormValues = {
  label: "",
  contactPerson: "",
  mobile: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
  landmark: "",
  useAsDefault: false,
};

export function AddressForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Address;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormValues>(
    initial ? { ...initial, useAsDefault: initial.isDefault } : EMPTY
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const set = (key: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <Input label="Address Name" required value={form.label} onChange={set("label")} placeholder="e.g. Warehouse Address" />
      </div>
      <Input label="Contact Person" required value={form.contactPerson} onChange={set("contactPerson")} />
      <Input label="Mobile" required value={form.mobile} onChange={set("mobile")} />
      <div className="sm:col-span-2">
        <Input label="Address Line 1" required value={form.addressLine1} onChange={set("addressLine1")} />
      </div>
      <div className="sm:col-span-2">
        <Input label="Address Line 2" value={form.addressLine2} onChange={set("addressLine2")} />
      </div>
      <Input label="City" required value={form.city} onChange={set("city")} />
      <Input label="District" required value={form.district} onChange={set("district")} />
      <Input label="State" required value={form.state} onChange={set("state")} />
      <Input label="Pincode" required value={form.pincode} onChange={set("pincode")} />
      <div className="sm:col-span-2">
        <Input label="Landmark" value={form.landmark} onChange={set("landmark")} />
      </div>

      <label className="sm:col-span-2 flex items-center gap-2.5 text-sm text-ink/70 mt-1">
        <input
          type="checkbox"
          checked={form.useAsDefault}
          onChange={(e) => setForm((f) => ({ ...f, useAsDefault: e.target.checked }))}
          className="w-4 h-4 accent-maroon"
        />
        Use as default shipping address
      </label>

      <div className="sm:col-span-2 flex justify-end gap-3 mt-2">
        <Button type="button" variant="ghost" size="md" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="md">
          {initial ? "Save Changes" : "Add Address"}
        </Button>
      </div>
    </form>
  );
}
