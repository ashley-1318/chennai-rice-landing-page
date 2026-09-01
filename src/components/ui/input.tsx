import { InputHTMLAttributes, forwardRef, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, id, className = "", ...props },
  ref
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = error ? `${inputId}-error` : undefined;
  const hintId = hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-xs font-semibold tracking-wide uppercase text-ink/70">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={errorId ?? hintId}
        className={`w-full px-4 py-3 text-sm bg-ivory border rounded-sm transition-colors duration-150 outline-none placeholder:text-ink/30 ${
          error
            ? "border-red-400 focus:border-red-500"
            : "border-ink/15 focus:border-maroon"
        } ${className}`}
        {...props}
      />
      {error ? (
        <p id={errorId} className="text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-ink/50">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
