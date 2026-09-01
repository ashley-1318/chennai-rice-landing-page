"use client";

import { useState } from "react";
import { PrivateLayout } from "@/components/layout/private-layout";
import { PrivatePageHeader } from "@/components/layout/private-page-header";
import { AddressCard } from "@/components/addresses/address-card";
import { AddressForm } from "@/components/addresses/address-form";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { EmptyState, LoadingState } from "@/components/ui/empty-state";
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/lib/services/addresses";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { useAuth } from "@/lib/auth/auth-context";
import { Address } from "@/mock/types";

export default function AddressesPage() {
  const { user } = useAuth();
  const { data: addresses, isLoading, error, reload } = useAsyncData(fetchAddresses, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const editingAddress = addresses?.find((a) => a.id === editingId);

  if (!user) return null;

  const openAdd = () => {
    setEditingId(null);
    setActionError("");
    setModalOpen(true);
  };

  const openEdit = (id: string) => {
    setEditingId(id);
    setActionError("");
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAddress(id);
      reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not delete address.");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id, user.id);
      reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not update default address.");
    }
  };

  const handleSubmit = async (values: Omit<Address, "id" | "isDefault"> & { useAsDefault: boolean }) => {
    const { useAsDefault, ...rest } = values;
    try {
      if (editingId) {
        await updateAddress(editingId, user.id, { ...rest, businessId: user.id, isDefault: useAsDefault });
      } else {
        await createAddress({ ...rest, businessId: user.id, isDefault: useAsDefault });
      }
      setModalOpen(false);
      reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not save address.");
    }
  };

  return (
    <PrivateLayout>
      <PrivatePageHeader
        eyebrow="Your Account"
        title="Your Addresses"
        action={
          <Button variant="primary" size="sm" onClick={openAdd}>
            + Add New Address
          </Button>
        }
      />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 pb-16">
        {actionError && (
          <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-sm px-4 py-3 mb-6">
            {actionError}
          </p>
        )}

        {isLoading ? (
          <LoadingState label="Loading your addresses…" />
        ) : error ? (
          <EmptyState title="Couldn't load your addresses." description={error} />
        ) : !addresses || addresses.length === 0 ? (
          <EmptyState
            title="No saved addresses."
            description="Add a business, shipping or billing address to speed up checkout."
            action={
              <Button variant="primary" size="md" onClick={openAdd}>
                + Add New Address
              </Button>
            }
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={() => openEdit(address.id)}
                onDelete={() => handleDelete(address.id)}
                onSetDefault={() => handleSetDefault(address.id)}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAddress ? "Edit Address" : "Add New Address"}
      >
        <AddressForm
          initial={editingAddress}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </PrivateLayout>
  );
}
