"use client";

import { PrivateLayout } from "@/components/layout/private-layout";
import { CatalogueProductRow } from "@/components/catalogue/catalogue-product-row";
import { WeightBridgePanel } from "@/components/catalogue/weight-bridge-panel";
import { EmptyState, LoadingState } from "@/components/ui/empty-state";
import { useAuth } from "@/lib/auth/auth-context";
import { BUSINESS_TYPE_TERMS } from "@/mock/customers";
import { fetchProducts } from "@/lib/services/products";
import { useAsyncData } from "@/lib/hooks/use-async-data";

export default function CataloguePage() {
  const { user } = useAuth();
  const { data: products, isLoading, error } = useAsyncData(fetchProducts, []);

  if (!user) return null;
  const terms = BUSINESS_TYPE_TERMS[user.businessType];

  return (
    <PrivateLayout>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-12 grid lg:grid-cols-[1fr_360px] gap-12 items-start">
        <div>
          <h2 className="font-serif-display text-2xl text-maroon-dark mb-2">Your Catalogue</h2>
          <p className="text-sm text-ink/55 mb-6">
            Pack sizes and pricing shown below reflect your {terms.label.toLowerCase()} account terms.
          </p>
          <div>
            {isLoading ? (
              <LoadingState label="Loading catalogue…" />
            ) : error ? (
              <EmptyState title="Couldn't load the catalogue." description={error} />
            ) : (
              products?.map((product) => (
                <CatalogueProductRow key={product.id} product={product} businessType={user.businessType} />
              ))
            )}
          </div>
        </div>

        <WeightBridgePanel terms={terms} products={products ?? []} />
      </div>
    </PrivateLayout>
  );
}
