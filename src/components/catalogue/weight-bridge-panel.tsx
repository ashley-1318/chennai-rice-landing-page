"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { useAuth } from "@/lib/auth/auth-context";
import { getPriceForPack, GST_RATE, FREIGHT_FLAT, FREIGHT_FREE_THRESHOLD_KG } from "@/mock/pricing";
import { BusinessTypeTerms, Product } from "@/mock/types";
import { placeOrder } from "@/lib/services/orders";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export function WeightBridgePanel({ terms, products }: { terms: BusinessTypeTerms; products: Product[] }) {
  const { lines, setQuantity, clear } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState("");

  const summary = useMemo(() => {
    const items = lines
      .map((line) => {
        const product = products.find((p) => p.id === line.productId);
        if (!product) return null;
        const priced = getPriceForPack(product, line.packSize, terms.type);
        return {
          ...line,
          productName: product.name,
          unitPrice: priced.price,
          weightKg: line.packSize * line.quantity,
          total: priced.price * line.quantity,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    const totalWeightKg = items.reduce((sum, i) => sum + i.weightKg, 0);
    const goodsValue = items.reduce((sum, i) => sum + i.total, 0);
    const gst = goodsValue * GST_RATE;
    const freight = totalWeightKg >= FREIGHT_FREE_THRESHOLD_KG || totalWeightKg === 0 ? 0 : FREIGHT_FLAT;
    const orderTotal = goodsValue + gst + freight;

    return { items, totalWeightKg, goodsValue, gst, freight, orderTotal };
  }, [lines, terms.type, products]);

  const percent = (summary.totalWeightKg / terms.minimumOrderKg) * 100;
  const remainingKg = Math.max(0, terms.minimumOrderKg - summary.totalWeightKg);
  const meetsMinimum = summary.totalWeightKg >= terms.minimumOrderKg;

  const handlePlaceOrder = async () => {
    if (!user) return;
    setPlacing(true);
    setPlaceError("");
    try {
      const orderId = await placeOrder({
        businessId: user.id,
        items: summary.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          packSize: item.packSize,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
        })),
        totalWeightKg: summary.totalWeightKg,
        subtotal: summary.goodsValue,
        discount: 0,
        gst: summary.gst,
        freight: summary.freight,
        total: summary.orderTotal,
        shippingAddressId: null,
        billingAddressId: null,
      });
      clear();
      router.push(`/orders/${orderId}`);
    } catch (err) {
      setPlaceError(err instanceof Error ? err.message : "Could not place order. Please try again.");
      setPlacing(false);
    }
  };

  return (
    <div className="sticky top-24 bg-ivory border border-ink/10 rounded-sm overflow-hidden animate-slide-up">
      <div className="px-6 py-5 border-b border-ink/8 bg-cream">
        <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">Weight Bridge</p>
      </div>

      <div className="px-6 py-6 border-b border-ink/8">
        <div className="flex items-baseline justify-between mb-3">
          <span className="font-serif-display text-3xl text-maroon-dark tabular-nums transition-all duration-300">
            {summary.totalWeightKg.toLocaleString("en-IN")} KG
          </span>
          {!meetsMinimum && (
            <span className="text-xs text-ink/50">{remainingKg.toLocaleString("en-IN")} KG to go</span>
          )}
        </div>
        <ProgressBar percent={percent} />
        <p className="text-xs text-ink/45 mt-2">Minimum {terms.minimumOrderKg.toLocaleString("en-IN")} KG</p>
      </div>

      {summary.items.length === 0 ? (
        <EmptyState
          title="Your cart is empty."
          description="Add products from the catalogue to build your order."
        />
      ) : (
        <>
          <div className="px-6 py-5 border-b border-ink/8 flex flex-col gap-3 max-h-64 overflow-y-auto scrollbar-thin">
            {summary.items.map((item) => (
              <div key={`${item.productId}-${item.packSize}`} className="flex items-start justify-between gap-3 text-sm animate-slide-up">
                <div>
                  <p className="font-medium text-ink/80">{item.productName}</p>
                  <p className="text-xs text-ink/45">
                    {item.packSize} KG × {item.quantity}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-medium text-ink/80">₹{item.total.toLocaleString("en-IN")}</p>
                  <button
                    onClick={() => setQuantity(item.productId, item.packSize, 0)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <dl className="px-6 py-5 border-b border-ink/8 flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/55">Goods Value</dt>
              <dd className="font-medium text-ink/80">₹{summary.goodsValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/55">GST (5%)</dt>
              <dd className="font-medium text-ink/80">₹{summary.gst.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/55">Freight</dt>
              <dd className="font-medium text-ink/80">
                {summary.freight === 0 ? "Free" : `₹${summary.freight.toLocaleString("en-IN")}`}
              </dd>
            </div>
            <div className="flex justify-between pt-2 border-t border-ink/8 mt-1">
              <dt className="font-semibold text-ink/80">Order Total</dt>
              <dd className="font-serif-display text-lg text-maroon">
                ₹{summary.orderTotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </dd>
            </div>
          </dl>
        </>
      )}

      <div className="px-6 py-5">
        {placeError && (
          <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-sm px-4 py-3 mb-3">
            {placeError}
          </p>
        )}
        <Button
          size="lg"
          variant="primary"
          disabled={!meetsMinimum || summary.items.length === 0 || placing}
          className="w-full"
          onClick={handlePlaceOrder}
        >
          {placing
            ? "Placing Order…"
            : meetsMinimum
            ? "Place Order"
            : `Add ${remainingKg.toLocaleString("en-IN")} KG to your order`}
        </Button>
      </div>
    </div>
  );
}
