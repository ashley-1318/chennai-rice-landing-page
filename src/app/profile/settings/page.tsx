"use client";

import { PrivateLayout } from "@/components/layout/private-layout";
import { PrivatePageHeader } from "@/components/layout/private-page-header";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";

export default function AccountSettingsPage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <PrivateLayout>
      <PrivatePageHeader eyebrow="Your Account" title="Account Settings" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 pb-16 flex flex-col gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <h2 className="font-serif-display text-lg text-maroon-dark">Login Email</h2>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input label="Email" type="email" defaultValue={user.email} disabled />
            <p className="text-xs text-ink/45">Contact support to change your login email.</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-serif-display text-lg text-maroon-dark">Change Password</h2>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input label="Current Password" type="password" />
            <Input label="New Password" type="password" />
            <Input label="Confirm New Password" type="password" />
            <Button variant="primary" size="md" className="self-start">
              Update Password
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-serif-display text-lg text-maroon-dark">Notifications</h2>
          </CardHeader>
          <CardBody className="flex flex-col gap-3">
            {["Order updates", "Invoice reminders", "Promotional offers"].map((label) => (
              <label key={label} className="flex items-center gap-2.5 text-sm text-ink/70">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-maroon" />
                {label}
              </label>
            ))}
          </CardBody>
        </Card>
      </div>
    </PrivateLayout>
  );
}
