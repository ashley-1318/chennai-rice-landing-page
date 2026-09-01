import { supabase } from "@/lib/supabase/client";
import { Product } from "@/mock/types";
import type { Database } from "@/lib/supabase/database.types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    variety: row.variety,
    description: row.description,
    origin: row.origin,
    tag: row.tag,
    image: row.image_path,
    basePricePerKg: row.base_price_per_kg,
    stockKg: row.stock_kg,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToProduct);
}
