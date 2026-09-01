"use client";

import { PrivateLayout } from "@/components/layout/private-layout";
import { PrivatePageHeader } from "@/components/layout/private-page-header";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState, LoadingState } from "@/components/ui/empty-state";
import { fetchInvoices, fetchCreditSummary } from "@/lib/services/invoices";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { useAuth } from "@/lib/auth/auth-context";
import { BUSINESS_TYPE_TERMS } from "@/mock/customers";

const STATUS_TONE = {
  paid: "success",
  unpaid: "danger",
  partial: "warning",
  overdue: "danger",
} as const;

const STATUS_LABEL = {
  paid: "Paid",
  unpaid: "Unpaid",
  partial: "Partial",
  overdue: "Overdue",
};

export default function PaymentsPage() {
  const { user } = useAuth();
  const { data: invoices, isLoading: invoicesLoading, error: invoicesError } = useAsyncData(fetchInvoices, []);
  const {
    data: credit,
    isLoading: creditLoading,
    error: creditError,
  } = useAsyncData(() => (user ? fetchCreditSummary(user.id) : Promise.resolve(null)), [user?.id]);

  if (!user) return null;
  const terms = BUSINESS_TYPE_TERMS[user.businessType];
  const isLoading = invoicesLoading || creditLoading;
  const error = invoicesError ?? creditError;

  return (
    <PrivateLayout>
      <PrivatePageHeader eyebrow="Your Account" title="Payments & Invoices" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="animate-slide-up">
            <CardBody>
              <p className="text-xs uppercase tracking-wide text-ink/45 mb-2">Outstanding Amount</p>
              <p className="font-serif-display text-2xl text-maroon">
                {credit ? `₹${credit.outstanding.toLocaleString("en-IN", { maximumFractionDigits: 0 })}` : "—"}
              </p>
            </CardBody>
          </Card>
          <Card className="animate-slide-up [animation-delay:60ms]">
            <CardBody>
              <p className="text-xs uppercase tracking-wide text-ink/45 mb-2">Credit Limit</p>
              <p className="font-serif-display text-2xl text-maroon-dark">
                {credit ? `₹${credit.creditLimit.toLocaleString("en-IN")}` : "—"}
              </p>
            </CardBody>
          </Card>
          <Card className="animate-slide-up [animation-delay:120ms]">
            <CardBody>
              <p className="text-xs uppercase tracking-wide text-ink/45 mb-2">Available Credit</p>
              <p className="font-serif-display text-2xl text-emerald-700">
                {credit ? `₹${credit.availableCredit.toLocaleString("en-IN", { maximumFractionDigits: 0 })}` : "—"}
              </p>
            </CardBody>
          </Card>
          <Card className="animate-slide-up [animation-delay:180ms]">
            <CardBody>
              <p className="text-xs uppercase tracking-wide text-ink/45 mb-2">Payment Terms</p>
              <p className="font-serif-display text-2xl text-maroon-dark">{terms.paymentTerms}</p>
            </CardBody>
          </Card>
        </div>

        {isLoading ? (
          <LoadingState label="Loading invoices…" />
        ) : error ? (
          <EmptyState title="Couldn't load your invoices." description={error} />
        ) : !invoices || invoices.length === 0 ? (
          <EmptyState title="No invoices yet." description="Invoices generated for your orders will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-ink/45 border-b border-ink/10">
                  <th className="py-3 pr-4 font-medium">Invoice Number</th>
                  <th className="py-3 pr-4 font-medium">Order</th>
                  <th className="py-3 pr-4 font-medium">Date</th>
                  <th className="py-3 pr-4 font-medium">Due Date</th>
                  <th className="py-3 pr-4 font-medium">Amount</th>
                  <th className="py-3 pr-4 font-medium">Paid</th>
                  <th className="py-3 pr-4 font-medium">Balance</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, i) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-ink/6 hover:bg-cream/50 transition-colors animate-slide-up"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <td className="py-4 pr-4 font-medium text-ink/85">{invoice.invoiceNumber}</td>
                    <td className="py-4 pr-4 text-ink/60">{invoice.orderNumber}</td>
                    <td className="py-4 pr-4 text-ink/60">{invoice.date}</td>
                    <td className="py-4 pr-4 text-ink/60">{invoice.dueDate}</td>
                    <td className="py-4 pr-4 font-medium text-ink/85">₹{invoice.amount.toLocaleString("en-IN")}</td>
                    <td className="py-4 pr-4 text-ink/60">₹{invoice.paid.toLocaleString("en-IN")}</td>
                    <td className="py-4 pr-4 text-ink/60">₹{invoice.balance.toLocaleString("en-IN")}</td>
                    <td className="py-4 pr-4">
                      <Badge tone={STATUS_TONE[invoice.status]}>{STATUS_LABEL[invoice.status]}</Badge>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Download</Button>
                        {invoice.balance > 0 && (
                          <Button variant="primary" size="sm">Pay Now</Button>
                        )}
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
