// src/product/generator/components/Stepper.tsx
type StepperProps = {
  step: number;
};

export default function Stepper({ step }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-6 mb-8">
      {[1, 2, 3].map((n) => {
        const done = step > n;
        const active = step === n;

        return (
          <div key={n} className="flex items-center gap-3">
            <div
              className={[
                "w-9 h-9 rounded-full flex items-center justify-center font-bold",
                done ? "bg-emerald-500 text-white" : "",
                active ? "bg-blue-600 text-white" : "",
                !done && !active ? "bg-blue-100 text-blue-700" : "",
              ].join(" ")}
            >
              {done ? "✓" : n}
            </div>

            {n !== 3 && (
              <div className="w-16 h-1 rounded bg-blue-100 overflow-hidden">
                <div
                  className={[
                    "h-full transition-all",
                    step > n ? "w-full bg-blue-600" : "w-0 bg-blue-600",
                  ].join(" ")}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
