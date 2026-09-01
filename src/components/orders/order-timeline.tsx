import { OrderTimelineStep } from "@/mock/types";

export function OrderTimeline({ steps }: { steps: OrderTimelineStep[] }) {
  return (
    <ol className="flex flex-col">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <li key={step.label} className="flex gap-4 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex flex-col items-center">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] shrink-0 transition-colors duration-300 ${
                  step.completed ? "bg-maroon text-ivory" : "bg-ink/10 text-ink/40"
                }`}
              >
                {step.completed ? "✓" : ""}
              </span>
              {!isLast && (
                <span
                  className={`w-px flex-1 min-h-[28px] transition-colors duration-300 ${
                    step.completed ? "bg-maroon/40" : "bg-ink/10"
                  }`}
                />
              )}
            </div>
            <div className="pb-7">
              <p className={`text-sm font-medium ${step.completed ? "text-ink/85" : "text-ink/40"}`}>
                {step.label}
              </p>
              {step.timestamp && <p className="text-xs text-ink/45 mt-0.5">{step.timestamp}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
