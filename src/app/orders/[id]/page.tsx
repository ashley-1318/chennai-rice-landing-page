"use client";

import { useParams } from "next/navigation";
import { PrivateLayout } from "@/components/layout/private-layout";
import { PrivatePageHeader } from "@/components/layout/private-page-header";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/orders/order-status-badge";
import { OrderTimeline } from "@/components/orders/order-timeline";
import { Button } from "@/components/ui/button";
import { EmptyState, LoadingState } from "@/components/ui/empty-state";
import { fetchOrderById } from "@/lib/services/orders";
import { fetchAddressesByIds } from "@/lib/services/addresses";
import { useAsyncData } from "@/lib/hooks/use-async-data";

async function loadOrderDetails(id: string) {
  const order = await fetchOrderById(id);
  if (!order) return { order: null, shippingAddress: null, billingAddress: null };

  const addressIds = [order.shippingAddressId, order.billingAddressId].filter(Boolean);
  const addresses = await fetchAddressesByIds(addressIds);
  const shippingAddress = addresses.find((a) => a.id === order.shippingAddressId) ?? null;
  const billingAddress = addresses.find((a) => a.id === order.billingAddressId) ?? null;

  return { order, shippingAddress, billingAddress };
}

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, error } = useAsyncData(() => loadOrderDetails(params.id), [params.id]);

  if (isLoading) {
    return (
      <PrivateLayout>
        <LoadingState label="Loading order…" />
      </PrivateLayout>
    );
  }

  if (error || !data?.order) {
    return (
      <PrivateLayout>
        <EmptyState
          title="Order not found."
          description={error ?? "We couldn't find an order with that number."}
          action={
            <Button href="/orders" variant="primary">
              ← Back to Orders
            </Button>
          }
        />
      </PrivateLayout>
    );
  }

  const { order, shippingAddress, billingAddress } = data;

  return (
    <PrivateLayout>
      <PrivatePageHeader
        eyebrow="Order Details"
        title={order.orderNumber}
        description={`Placed on ${order.date}`}
        action={
          <div className="flex gap-3">
            <Button href="/orders" variant="ghost" size="sm">
              ← Back to Orders
            </Button>
            <Button variant="outline" size="sm">
              Download Invoice
            </Button>
            <Button variant="primary" size="sm">
              Reorder
            </Button>
          </div>
        }
      />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 pb-16 grid lg:grid-cols-[1fr_360px] gap-12 items-start">
        <div className="flex flex-col gap-8">
          <div className="flex gap-3">
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>

          <div className="border border-ink/10 rounded-sm overflow-x-auto">
            <table className="w-full text-sm min-w-[540px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-ink/45 bg-cream">
                  <th className="py-3 px-4 font-medium">Product</th>
                  <th className="py-3 px-4 font-medium">Pack Size</th>
                  <th className="py-3 px-4 font-medium">Quantity</th>
                  <th className="py-3 px-4 font-medium">Unit Price</th>
                  <th className="py-3 px-4 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={`${item.productId}-${item.packSize}`} className="border-t border-ink/8">
                    <td className="py-3 px-4 font-medium text-ink/85">{item.productName}</td>
                    <td className="py-3 px-4 text-ink/60">{item.packSize} KG</td>
                    <td className="py-3 px-4 text-ink/60">{item.quantity}</td>
                    <td className="py-3 px-4 text-ink/60">₹{item.unitPrice.toLocaleString("en-IN")}</td>
                    <td className="py-3 px-4 font-medium text-ink/85">₹{item.total.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {shippingAddress && (
              <div className="border border-ink/10 rounded-sm p-5">
                <h3 className="text-xs uppercase tracking-wide text-ink/45 mb-2">Shipping Address</h3>
                <p className="text-sm font-medium text-ink/85">{shippingAddress.contactPerson}</p>
                <p className="text-sm text-ink/60">
                  {shippingAddress.addressLine1}, {shippingAddress.city}, {shippingAddress.state} —{" "}
                  {shippingAddress.pincode}
                </p>
              </div>
            )}
            {billingAddress && (
              <div className="border border-ink/10 rounded-sm p-5">
                <h3 className="text-xs uppercase tracking-wide text-ink/45 mb-2">Billing Address</h3>
                <p className="text-sm font-medium text-ink/85">{billingAddress.contactPerson}</p>
                <p className="text-sm text-ink/60">
                  {billingAddress.addressLine1}, {billingAddress.city}, {billingAddress.state} —{" "}
                  {billingAddress.pincode}
                </p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-wide text-ink/45 mb-4">Order Timeline</h3>
            <OrderTimeline steps={order.timeline} />
          </div>
        </div>

        <div className="border border-ink/10 rounded-sm bg-ivory sticky top-24">
          <div className="px-6 py-5 border-b border-ink/8 bg-cream">
            <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">Order Summary</p>
          </div>
          <dl className="px-6 py-5 flex flex-col gap-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/55">Subtotal</dt>
              <dd className="font-medium text-ink/80">₹{order.subtotal.toLocaleString("en-IN")}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/55">Discount</dt>
              <dd className="font-medium text-emerald-700">−₹{order.discount.toLocaleString("en-IN")}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/55">GST</dt>
              <dd className="font-medium text-ink/80">₹{order.gst.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/55">Freight</dt>
              <dd className="font-medium text-ink/80">
                {order.freight === 0 ? "Free" : `₹${order.freight.toLocaleString("en-IN")}`}
              </dd>
            </div>
            <div className="flex justify-between pt-3 border-t border-ink/8 mt-1">
              <dt className="font-semibold text-ink/80">Total</dt>
              <dd className="font-serif-display text-lg text-maroon">
                ₹{order.total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </PrivateLayout>
  );
}
