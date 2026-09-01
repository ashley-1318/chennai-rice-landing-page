"use client";

import { PrivateLayout } from "@/components/layout/private-layout";
import { PrivatePageHeader } from "@/components/layout/private-page-header";
import { Card, CardBody } from "@/components/ui/card";

const FAQS = [
  { q: "How do pack sizes work for my account?", a: "Available pack sizes are matched automatically to your registered business type — retailer, wholesaler or distributor." },
  { q: "What is the minimum order weight?", a: "Minimum order weight depends on your business type and is shown on the Weight Bridge panel in your catalogue." },
  { q: "How do I track a shipped order?", a: "Visit Order History and open any order to see its live delivery timeline." },
];

export default function SupportPage() {
  return (
    <PrivateLayout>
      <PrivatePageHeader eyebrow="Help" title="Support" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 pb-16 grid lg:grid-cols-[1fr_360px] gap-12 items-start">
        <div id="faqs" className="flex flex-col gap-4">
          <h2 className="font-serif-display text-xl text-maroon-dark mb-2">Frequently Asked Questions</h2>
          {FAQS.map((faq) => (
            <Card key={faq.q}>
              <CardBody>
                <p className="font-medium text-ink/85 mb-1.5">{faq.q}</p>
                <p className="text-sm text-ink/60 leading-relaxed">{faq.a}</p>
              </CardBody>
            </Card>
          ))}

          <div id="shipping" className="mt-6">
            <h2 className="font-serif-display text-xl text-maroon-dark mb-2">Shipping & Delivery</h2>
            <p className="text-sm text-ink/60 leading-relaxed">
              Orders above 1,000 KG ship free of freight charges. Orders below this threshold
              carry a flat freight fee, shown at checkout on the Weight Bridge panel.
            </p>
          </div>

          <div id="terms" className="mt-6">
            <h2 className="font-serif-display text-xl text-maroon-dark mb-2">Terms & Conditions</h2>
            <p className="text-sm text-ink/60 leading-relaxed">
              Trade terms, pricing tiers and payment terms are set according to your
              registered business type and are outlined in your Price List.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-serif-display text-xl text-maroon-dark mb-4">Contact & Support</h2>
          <Card>
            <CardBody>
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-xs text-ink/50 uppercase tracking-wide mb-1">Phone</p>
                  <a href="tel:+911234567890" className="text-sm font-medium text-ink/85 hover:text-maroon-dark">
                    +91 12345 67890
                  </a>
                </div>

                <div>
                  <p className="text-xs text-ink/50 uppercase tracking-wide mb-1">Email</p>
                  <a
                    href="mailto:support@chennairiceindustries.com"
                    className="text-sm font-medium text-ink/85 hover:text-maroon-dark break-all"
                  >
                    support@chennairiceindustries.com
                  </a>
                </div>

                <div>
                  <p className="text-xs text-ink/50 uppercase tracking-wide mb-1">Registered Office</p>
                  <p className="text-sm text-ink/85 leading-relaxed">
                    Chennai Rice Industries India Private Limited
                    <br />
                    SF No. 116/1,2,4-B, N. Thayirpalayam Village,
                    <br />
                    Nasiyanur, Gangapuram Post,
                    <br />
                    Erode, Tamil Nadu – 638102
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </PrivateLayout>
  );
}
