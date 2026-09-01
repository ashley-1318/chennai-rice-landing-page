import { Address } from "@/mock/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}) {
  return (
    <div className="border border-ink/10 rounded-sm p-6 bg-ivory animate-slide-up flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif-display text-lg text-maroon-dark">{address.label}</h3>
          {address.isDefault && <Badge tone="gold">Default</Badge>}
        </div>
      </div>

      <div className="text-sm text-ink/65 leading-relaxed">
        <p className="font-medium text-ink/80">{address.contactPerson}</p>
        <p>{address.mobile}</p>
        <p className="mt-2">
          {address.addressLine1}
          {address.addressLine2 ? `, ${address.addressLine2}` : ""}
        </p>
        <p>
          {address.city}, {address.district}, {address.state} — {address.pincode}
        </p>
        {address.landmark && <p className="text-ink/45 mt-1">Landmark: {address.landmark}</p>}
      </div>

      <div className="flex flex-wrap gap-3 pt-2 border-t border-ink/8">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete} className="!text-red-700 hover:!bg-red-50">
          Delete
        </Button>
        {!address.isDefault && (
          <Button variant="outline" size="sm" onClick={onSetDefault}>
            Set as Default
          </Button>
        )}
      </div>
    </div>
  );
}
