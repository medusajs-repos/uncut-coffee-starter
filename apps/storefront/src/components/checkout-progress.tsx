import { CheckoutStep, CheckoutStepKey } from "@/lib/types/global"
import { clsx } from "clsx"
import { ChevronRight } from "@medusajs/icons"

type CheckoutProgressProps = {
  steps: CheckoutStep[];
  currentStepIndex: number;
  handleStepChange: (step: CheckoutStepKey) => void;
  className?: string;
};

const CheckoutProgress = ({
  steps,
  currentStepIndex,
  handleStepChange,
  className,
}: CheckoutProgressProps) => {
  return (
    <nav className={clsx("flex flex-wrap items-center gap-1", className)}>
      {steps.map((step, index) => (
        <div key={step.key} className="flex items-center">
          <button
            onClick={() => handleStepChange(step.key)}
            disabled={index > currentStepIndex}
            className={clsx(
              "text-sm font-bold transition-colors disabled:cursor-not-allowed",
              index < currentStepIndex && "text-neutral-900 hover:underline cursor-pointer",
              index === currentStepIndex && "text-neutral-900",
              index > currentStepIndex && "text-neutral-400"
            )}
          >
            {step.title}
          </button>
          {index < steps.length - 1 && (
            <ChevronRight className="w-4 h-4 mx-2 text-neutral-400" />
          )}
        </div>
      ))}
    </nav>
  );
};

export default CheckoutProgress;
