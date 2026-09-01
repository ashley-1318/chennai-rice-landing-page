import { supabase } from "@/lib/supabase/client";
import { Order, OrderLineItem, OrderStatus, OrderTimelineStep, PaymentStatus } from "@/mock/types";
import type { Database } from "@/lib/supabase/database.types";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type OrderItemRow = Database["public"]["Tables"]["order_items"]["Row"];
type TimelineRow = Database["public"]["Tables"]["order_timeline_steps"]["Row"];

const TIMELINE_LABELS = [
  "Order placed",
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Out for delivery",
  "Delivered",
];

function rowsToOrder(order: OrderRow, items: OrderItemRow[], timeline: TimelineRow[]): Order {
  return {
    id: order.id,
    orderNumber: order.order_number,
    date: order.created_at.slice(0, 10),
    status: order.status as OrderStatus,
    paymentStatus: order.payment_status as PaymentStatus,
    items: items.map(
      (item): OrderLineItem => ({
        productId: item.product_id,
        productName: item.product_name,
        packSize: item.pack_size as OrderLineItem["packSize"],
        quantity: item.quantity,
        unitPrice: item.unit_price,
        total: item.total,
      })
    ),
    totalWeightKg: order.total_weight_kg,
    subtotal: order.subtotal,
    discount: order.discount,
    gst: order.gst,
    freight: order.freight,
    total: order.total,
    shippingAddressId: order.shipping_address_id ?? "",
    billingAddressId: order.billing_address_id ?? "",
    timeline: timeline
      .sort((a, b) => a.step_order - b.step_order)
      .map(
        (step): OrderTimelineStep => ({
          label: step.label,
          completed: step.completed,
          timestamp: step.happened_at ?? undefined,
        })
      ),
  };
}

export async function fetchOrders(): Promise<Order[]> {
  const { data: orders, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  if (!orders?.length) return [];

  const orderIds = orders.map((o) => o.id);
  const [{ data: items, error: itemsError }, { data: timeline, error: timelineError }] = await Promise.all([
    supabase.from("order_items").select("*").in("order_id", orderIds),
    supabase.from("order_timeline_steps").select("*").in("order_id", orderIds),
  ]);
  if (itemsError) throw itemsError;
  if (timelineError) throw timelineError;

  return orders.map((order) =>
    rowsToOrder(
      order,
      (items ?? []).filter((i) => i.order_id === order.id),
      (timeline ?? []).filter((t) => t.order_id === order.id)
    )
  );
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  const { data: order, error } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!order) return null;

  const [{ data: items, error: itemsError }, { data: timeline, error: timelineError }] = await Promise.all([
    supabase.from("order_items").select("*").eq("order_id", id),
    supabase.from("order_timeline_steps").select("*").eq("order_id", id),
  ]);
  if (itemsError) throw itemsError;
  if (timelineError) throw timelineError;

  return rowsToOrder(order, items ?? [], timeline ?? []);
}

export interface PlaceOrderInput {
  businessId: string;
  items: OrderLineItem[];
  totalWeightKg: number;
  subtotal: number;
  discount: number;
  gst: number;
  freight: number;
  total: number;
  shippingAddressId: string | null;
  billingAddressId: string | null;
}

export async function placeOrder(input: PlaceOrderInput): Promise<string> {
  const orderNumber = `CR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      business_id: input.businessId,
      order_number: orderNumber,
      status: "processing",
      payment_status: "unpaid",
      total_weight_kg: input.totalWeightKg,
      subtotal: input.subtotal,
      discount: input.discount,
      gst: input.gst,
      freight: input.freight,
      total: input.total,
      shipping_address_id: input.shippingAddressId,
      billing_address_id: input.billingAddressId,
    })
    .select("id")
    .single();

  if (error) throw error;
  const orderId = order.id;

  const { error: itemsError } = await supabase.from("order_items").insert(
    input.items.map((item) => ({
      order_id: orderId,
      product_id: item.productId,
      product_name: item.productName,
      pack_size: item.packSize,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total: item.total,
    }))
  );
  if (itemsError) throw itemsError;

  const now = new Date().toISOString();
  const { error: timelineError } = await supabase.from("order_timeline_steps").insert(
    TIMELINE_LABELS.map((label, index) => ({
      order_id: orderId,
      step_order: index,
      label,
      completed: index === 0,
      happened_at: index === 0 ? now : null,
    }))
  );
  if (timelineError) throw timelineError;

  return orderId;
}
