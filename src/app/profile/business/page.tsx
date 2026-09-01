"use client";

import { useState } from "react";
import { PrivateLayout } from "@/components/layout/private-layout";
import { PrivatePageHeader } from "@/components/layout/private-page-header";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";
import { BUSINESS_TYPE_TERMS } from "@/mock/customers";

export default function BusinessProfilePage() {
  const { profile, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);

  if (!profile || !form) return null;
  const terms = BUSINESS_TYPE_TERMS[profile.businessType];

  const startEdit = () => {
    setForm(profile);
    setEditing(true);
    setSaved(false);
  };

  const cancelEdit = () => {
    setForm(profile);
    setEditing(false);
  };

  const save = async () => {
    await updateProfile(form);
    setEditing(false);
    setSaved(true);
  };

  return (
    <PrivateLayout>
      <PrivatePageHeader
        eyebrow="Your Account"
        title="Business Profile"
        description={`${terms.label} account · ${terms.discountLabel}`}
        action={
          editing ? (
            <div className="flex gap-3">
              <Button variant="ghost" size="sm" onClick={cancelEdit}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={save}>
                Save Changes
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={startEdit}>
              Edit Profile
            </Button>
          )
        }
      />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 pb-16 flex flex-col gap-6">
        {saved && (
          <p className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-sm px-4 py-3 animate-slide-up" role="status">
            Your business profile has been updated.
          </p>
        )}

        <Card className="animate-slide-up">
          <CardHeader>
            <h2 className="font-serif-display text-lg text-maroon-dark">Business Information</h2>
          </CardHeader>
          <CardBody className="grid sm:grid-cols-2 gap-5">
            {editing ? (
              <>
                <Input
                  label="Registered Business Name"
                  value={form.registeredBusinessName}
                  onChange={(e) => setForm({ ...form, registeredBusinessName: e.target.value })}
                />
                <Input label="Business Type" value={terms.label} disabled />
                <Input label="GSTIN" value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} />
                <Input label="TIN" value={form.tin} onChange={(e) => setForm({ ...form, tin: e.target.value })} />
                <Input label="Shop / Outlet Name" value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} />
                <Input
                  label="Number of Outlets"
                  type="number"
                  min={1}
                  value={form.numberOfOutlets}
                  onChange={(e) => setForm({ ...form, numberOfOutlets: Number(e.target.value) })}
                />
              </>
            ) : (
              <>
                <ReadField label="Registered Business Name" value={profile.registeredBusinessName} />
                <ReadField label="Business Type" value={terms.label} />
                <ReadField label="GSTIN" value={profile.gstin} />
                <ReadField label="TIN" value={profile.tin} />
                <ReadField label="Shop / Outlet Name" value={profile.shopName} />
                <ReadField label="Number of Outlets" value={String(profile.numberOfOutlets)} />
              </>
            )}
          </CardBody>
        </Card>

        <Card className="animate-slide-up [animation-delay:60ms]">
          <CardHeader>
            <h2 className="font-serif-display text-lg text-maroon-dark">Contact Information</h2>
          </CardHeader>
          <CardBody className="grid sm:grid-cols-2 gap-5">
            {editing ? (
              <>
                <Input
                  label="Representative Contact"
                  value={form.representativeContact}
                  onChange={(e) => setForm({ ...form, representativeContact: e.target.value })}
                />
                <Input label="Mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
                <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </>
            ) : (
              <>
                <ReadField label="Representative Contact" value={profile.representativeContact} />
                <ReadField label="Mobile" value={profile.mobile} />
                <ReadField label="Email" value={profile.email} />
              </>
            )}
          </CardBody>
        </Card>

        <Card className="animate-slide-up [animation-delay:120ms]">
          <CardHeader>
            <h2 className="font-serif-display text-lg text-maroon-dark">Business Address</h2>
          </CardHeader>
          <CardBody className="grid sm:grid-cols-2 gap-5">
            {editing ? (
              <>
                <div className="sm:col-span-2">
                  <Input
                    label="Address"
                    value={form.address.address}
                    onChange={(e) => setForm({ ...form, address: { ...form.address, address: e.target.value } })}
                  />
                </div>
                <Input
                  label="City"
                  value={form.address.city}
                  onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })}
                />
                <Input
                  label="District"
                  value={form.address.district}
                  onChange={(e) => setForm({ ...form, address: { ...form.address, district: e.target.value } })}
                />
                <Input
                  label="State"
                  value={form.address.state}
                  onChange={(e) => setForm({ ...form, address: { ...form.address, state: e.target.value } })}
                />
                <Input
                  label="Pincode"
                  value={form.address.pincode}
                  onChange={(e) => setForm({ ...form, address: { ...form.address, pincode: e.target.value } })}
                />
              </>
            ) : (
              <>
                <ReadField label="Address" value={profile.address.address || "—"} />
                <ReadField label="City" value={profile.address.city || "—"} />
                <ReadField label="District" value={profile.address.district || "—"} />
                <ReadField label="State" value={profile.address.state || "—"} />
                <ReadField label="Pincode" value={profile.address.pincode || "—"} />
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </PrivateLayout>
  );
}

function ReadField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-ink/45 mb-1">{label}</p>
      <p className="text-sm text-ink/85 font-medium">{value}</p>
    </div>
  );
}
