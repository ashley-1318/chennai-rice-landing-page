import { BusinessTypeTerms } from "@/mock/types";

export function BusinessTypeCard({
  terms,
  selected,
  onSelect,
}: {
  terms: BusinessTypeTerms;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      role="radio"
      aria-checked={selected}
      className={`relative text-left w-full p-7 rounded-sm border-2 transition-all duration-250 ease-out bg-ivory hover:-translate-y-0.5 ${
        selected
          ? "border-gold bg-cream shadow-lg"
          : "border-ink/12 hover:border-gold/50"
      }`}
    >
      {selected && (
        <span className="absolute top-5 right-5 w-6 h-6 rounded-full bg-maroon text-ivory flex items-center justify-center text-xs animate-scale-in">
          ✓
        </span>
      )}
      <h3 className="font-serif-display text-2xl text-maroon-dark mb-1">{terms.label}</h3>
      <p className="text-sm text-ink/55 mb-6">{terms.tagline}</p>

      <dl className="flex flex-col gap-2.5 text-sm">
        <div className="flex justify-between border-b border-ink/8 pb-2">
          <dt className="text-ink/50">Pricing</dt>
          <dd className="font-medium text-ink/80">{terms.discountLabel}</dd>
        </div>
        <div className="flex justify-between border-b border-ink/8 pb-2">
          <dt className="text-ink/50">Quantities</dt>
          <dd className="font-medium text-ink/80">{terms.quantityLabel}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink/50">Payment Terms</dt>
          <dd className="font-medium text-ink/80">{terms.paymentTerms}</dd>
        </div>
      </dl>
    </button>
  );
}
