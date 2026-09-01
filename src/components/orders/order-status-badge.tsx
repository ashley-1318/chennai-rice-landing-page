import { Badge } from "@/components/ui/badge";
import { OrderStatus, PaymentStatus } from "@/mock/types";

const STATUS_TONE: Record<OrderStatus, "gold" | "success" | "warning" | "danger" | "neutral"> = {
  processing: "warning",
  shipped: "gold",
  delivered: "success",
  cancelled: "danger",
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>;
}

const PAYMENT_TONE: Record<PaymentStatus, "success" | "warning" | "danger"> = {
  paid: "success",
  partial: "warning",
  unpaid: "danger",
};

const PAYMENT_LABEL: Record<PaymentStatus, string> = {
  paid: "Paid",
  partial: "Partial",
  unpaid: "Unpaid",
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge tone={PAYMENT_TONE[status]}>{PAYMENT_LABEL[status]}</Badge>;
}
