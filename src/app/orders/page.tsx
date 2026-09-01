"use client";

import { useMemo, useState } from "react";
import { PrivateLayout } from "@/components/layout/private-layout";
import { PrivatePageHeader } from "@/components/layout/private-page-header";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/orders/order-status-badge";
import { EmptyState, LoadingState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { fetchOrders } from "@/lib/services/orders";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { OrderStatus } from "@/mock/types";

const FILTERS: { key: OrderStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

export default function OrdersPage() {
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const { data: allOrders, isLoading, error } = useAsyncData(fetchOrders, []);

  const orders = useMemo(() => {
    return (allOrders ?? [])
      .filter((o) => filter === "all" || o.status === filter)
      .filter((o) => o.orderNumber.toLowerCase().includes(search.toLowerCase()));
  }, [allOrders, filter, search]);

  return (
    <PrivateLayout>
      <PrivatePageHeader eyebrow="Your Account" title="Order History" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 pb-16">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter orders by status">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                role="tab"
                aria-selected={filter === f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-150 ${
                  filter === f.key
                    ? "bg-maroon text-ivory border-maroon"
                    : "border-ink/15 text-ink/60 hover:border-maroon/40"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <label className="relative">
            <span className="sr-only">Search orders</span>
            <input
              type="search"
              placeholder="Search order number…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 text-sm bg-ivory border border-ink/15 rounded-sm outline-none focus:border-maroon w-56"
            />
          </label>
        </div>

        {isLoading ? (
          <LoadingState label="Loading your orders…" />
        ) : error ? (
          <EmptyState title="Couldn't load your orders." description={error} />
        ) : orders.length === 0 ? (
          <EmptyState title="No orders yet." description="Orders you place from the catalogue will appear here." action={<Button href="/catalogue" variant="primary">Browse Catalogue</Button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[820px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-ink/45 border-b border-ink/10">
                  <th className="py-3 pr-4 font-medium">Order Number</th>
                  <th className="py-3 pr-4 font-medium">Date</th>
                  <th className="py-3 pr-4 font-medium">Items</th>
                  <th className="py-3 pr-4 font-medium">Weight</th>
                  <th className="py-3 pr-4 font-medium">Amount</th>
                  <th className="py-3 pr-4 font-medium">Payment</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr
                    key={order.id}
                    className="border-b border-ink/6 hover:bg-cream/50 transition-colors animate-slide-up"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <td className="py-4 pr-4 font-medium text-ink/85">{order.orderNumber}</td>
                    <td className="py-4 pr-4 text-ink/60">{order.date}</td>
                    <td className="py-4 pr-4 text-ink/60">{order.items.length}</td>
                    <td className="py-4 pr-4 text-ink/60">{order.totalWeightKg.toLocaleString("en-IN")} KG</td>
                    <td className="py-4 pr-4 font-medium text-ink/85">₹{order.total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td>
                    <td className="py-4 pr-4"><PaymentStatusBadge status={order.paymentStatus} /></td>
                    <td className="py-4 pr-4"><OrderStatusBadge status={order.status} /></td>
                    <td className="py-4">
                      <div className="flex gap-3">
                        <Button href={`/orders/${order.id}`} variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PrivateLayout>
  );
}
