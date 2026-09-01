"use client";

import { PrivateLayout } from "@/components/layout/private-layout";
import { PrivatePageHeader } from "@/components/layout/private-page-header";
import { Card, CardBody } from "@/components/ui/card";
import { EmptyState, LoadingState } from "@/components/ui/empty-state";
import { useAuth } from "@/lib/auth/auth-context";
import { BUSINESS_TYPE_TERMS } from "@/mock/customers";
import { fetchProducts } from "@/lib/services/products";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { ALL_PACK_SIZES, getFullPriceListForProduct } from "@/mock/pricing";

export default function PriceListPage() {
  const { user } = useAuth();
  const { data: products, isLoading, error } = useAsyncData(fetchProducts, []);
  if (!user) return null;
  const terms = BUSINESS_TYPE_TERMS[user.businessType];

  return (
    <PrivateLayout>
      <PrivatePageHeader eyebrow="Your Account" title="Your Price List" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card>
            <CardBody>
              <p className="text-xs uppercase tracking-wide text-ink/45 mb-2">Business Type</p>
              <p className="font-serif-display text-xl text-maroon-dark">{terms.label}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-xs uppercase tracking-wide text-ink/45 mb-2">Discount</p>
              <p className="font-serif-display text-xl text-maroon">{terms.discountLabel}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-xs uppercase tracking-wide text-ink/45 mb-2">Minimum Order</p>
              <p className="font-serif-display text-xl text-maroon-dark">{terms.minimumOrderKg} KG</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-xs uppercase tracking-wide text-ink/45 mb-2">Payment Terms</p>
              <p className="font-serif-display text-xl text-maroon-dark">{terms.paymentTerms}</p>
            </CardBody>
          </Card>
        </div>

        {isLoading ? (
          <LoadingState label="Loading price list…" />
        ) : error ? (
          <EmptyState title="Couldn't load your price list." description={error} />
        ) : (
          <>
            <div className="overflow-x-auto border border-ink/10 rounded-sm">
              <table className="w-full text-sm min-w-[720px]">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-ink/45 bg-cream">
                    <th className="py-3 px-4 font-medium">Variety</th>
                    {ALL_PACK_SIZES.map((size) => (
                      <th key={size} className="py-3 px-4 font-medium text-right">
                        {size} KG
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(products ?? []).map((product) => {
                    const priceMap = getFullPriceListForProduct(product, user.businessType);
                    return (
                      <tr key={product.id} className="border-t border-ink/8">
                        <td className="py-3 px-4 font-medium text-ink/85">{product.name}</td>
                        {ALL_PACK_SIZES.map((size) => {
                          const entry = priceMap[size];
                          return (
                            <td key={size} className="py-3 px-4 text-right">
                              {entry ? (
                                <span className="text-ink/80 font-medium">
                                  ₹{entry.price.toLocaleString("en-IN")}
                                </span>
                              ) : (
                                <span className="text-ink/25">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-ink/40 mt-4">
              Prices shown reflect your {terms.label.toLowerCase()} tier pricing. Pack sizes not
              applicable to your account are shown as —.
            </p>
          </>
        )}
      </div>
    </PrivateLayout>
  );
}
