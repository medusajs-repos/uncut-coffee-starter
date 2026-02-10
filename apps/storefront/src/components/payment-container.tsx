import Radio from "@/components/ui/radio"
import { paymentMethodsData } from "@/lib/constants/payment-methods"
import React from "react"

type PaymentContainerProps = {
  paymentProviderId: string;
  selectedPaymentOptionId: string | null;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
};

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  disabled = false,
  children,
  onClick,
}) => {
  const isSelected = selectedPaymentOptionId === paymentProviderId;

  return (
    <div
      className={`flex flex-col justify-center h-12 text-sm cursor-pointer rounded-lg bg-neutral-50 px-3 mb-2 transition-colors border-2 ${
        isSelected
          ? "border-neutral-900"
          : "border-transparent hover:bg-neutral-100"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex items-center gap-x-4">
        <Radio checked={isSelected} readOnly />
        <p className="text-base font-medium uppercase text-black">
          {paymentMethodsData[paymentProviderId]?.title || paymentProviderId}
        </p>
      </div>
      {children}
    </div>
  );
};

export default PaymentContainer;
