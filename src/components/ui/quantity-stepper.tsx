interface QuantityStepperProps {
  quantity: number;
  onChange: (quantity: number) => void;
  step?: number;
  min?: number;
  max?: number;
  label?: string;
}

export function QuantityStepper({
  quantity,
  onChange,
  step = 1,
  min = 0,
  max = 9999,
  label,
}: QuantityStepperProps) {
  const decrease = () => onChange(Math.max(min, quantity - step));
  const increase = () => onChange(Math.min(max, quantity + step));

  return (
    <div
      className="inline-flex items-center border border-ink/15 rounded-sm overflow-hidden"
      role="group"
      aria-label={label ?? "Quantity selector"}
    >
      <button
        type="button"
        onClick={decrease}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        className="w-9 h-9 flex items-center justify-center text-maroon hover:bg-maroon/5 active:scale-90 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        −
      </button>
      <span className="w-12 text-center text-sm font-semibold tabular-nums transition-all duration-150">
        {quantity}
      </span>
      <button
        type="button"
        onClick={increase}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        className="w-9 h-9 flex items-center justify-center text-maroon hover:bg-maroon/5 active:scale-90 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        +
      </button>
    </div>
  );
}
