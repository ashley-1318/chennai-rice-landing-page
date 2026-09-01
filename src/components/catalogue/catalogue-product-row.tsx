"use client";

import { useState } from "react";
import { Product, BusinessType, PackSizeKg } from "@/mock/types";
import { ProductImage } from "@/components/branding/product-image";
import { Badge } from "@/components/ui/badge";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { getPricesForProduct } from "@/mock/pricing";
import { useCart } from "@/lib/cart/cart-context";

export function CatalogueProductRow({
  product,
  businessType,
}: {
  product: Product;
  businessType: BusinessType;
}) {
  const prices = getPricesForProduct(product, businessType);
  const [selectedPack, setSelectedPack] = useState<PackSizeKg>(prices[0].packSize);
  const { lines, setQuantity } = useCart();

  const currentLine = lines.find((l) => l.productId === product.id && l.packSize === selectedPack);
  const quantity = currentLine?.quantity ?? 0;
  const activePrice = prices.find((p) => p.packSize === selectedPack)!;
  const stockPacks = Math.floor(product.stockKg / selectedPack);

  return (
    <div className="grid sm:grid-cols-[120px_1fr] gap-5 py-6 border-b border-ink/8 animate-slide-up">
      <div className="w-full sm:w-[120px]">
        <ProductImage src={product.image} alt={`${product.name} pack`} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-serif-display text-xl text-maroon-dark">{product.name}</h3>
              <Badge tone="gold">{product.tag}</Badge>
            </div>
            <p className="text-xs text-ink/45 mb-2">{product.variety} &middot; {product.origin}</p>
            <p className="text-sm text-ink/60 leading-relaxed max-w-lg">{product.description}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-serif-display text-2xl text-maroon">₹{activePrice.price.toLocaleString("en-IN")}</p>
            <p className="text-xs text-ink/45">₹{activePrice.pricePerKg.toFixed(2)}/kg</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2" role="radiogroup" aria-label="Pack size">
            {prices.map((p) => (
              <button
                key={p.packSize}
                role="radio"
                aria-checked={selectedPack === p.packSize}
                onClick={() => setSelectedPack(p.packSize)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all duration-150 ${
                  selectedPack === p.packSize
                    ? "bg-maroon text-ivory border-maroon"
                    : "border-ink/15 text-ink/60 hover:border-maroon/40"
                }`}
              >
                {p.packSize} KG
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <p className="text-xs text-ink/45">
              {stockPacks > 0 ? `${stockPacks.toLocaleString("en-IN")} packs available` : "Out of stock"}
            </p>
            <QuantityStepper
              quantity={quantity}
              max={stockPacks}
              onChange={(q) => setQuantity(product.id, selectedPack, q)}
              label={`${product.name} ${selectedPack} KG quantity`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
