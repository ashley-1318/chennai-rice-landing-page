import { supabase } from "@/lib/supabase/client";
import { Invoice } from "@/mock/types";
import type { Database } from "@/lib/supabase/database.types";

type InvoiceRow = Database["public"]["Tables"]["invoices"]["Row"];

function rowToInvoice(row: InvoiceRow, orderNumber: string): Invoice {
  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    orderId: row.order_id,
    orderNumber,
    date: row.issue_date,
    dueDate: row.due_date,
    amount: row.amount,
    paid: row.paid,
    balance: row.balance,
    status: row.status,
  };
}

export async function fetchInvoices(): Promise<Invoice[]> {
  const { data: invoices, error } = await supabase
    .from("invoices")
    .select("*")
    .order("issue_date", { ascending: false });
  if (error) throw error;
  if (!invoices?.length) return [];

  const orderIds = invoices.map((inv) => inv.order_id);
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("id, order_number")
    .in("id", orderIds);
  if (ordersError) throw ordersError;

  const orderNumberById = new Map((orders ?? []).map((o) => [o.id, o.order_number]));
  return invoices.map((inv) => rowToInvoice(inv, orderNumberById.get(inv.order_id) ?? ""));
}

export interface CreditSummary {
  creditLimit: number;
  outstanding: number;
  availableCredit: number;
}

export async function fetchCreditSummary(businessId: string): Promise<CreditSummary> {
  const { data, error } = await supabase
    .from("credit_accounts")
    .select("*")
    .eq("business_id", businessId)
    .maybeSingle();
  if (error) throw error;

  const creditLimit = data?.credit_limit ?? 0;
  const outstanding = data?.outstanding ?? 0;
  return { creditLimit, outstanding, availableCredit: creditLimit - outstanding };
}
