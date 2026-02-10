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
      className={`flex flex-col justify-center h-12 text-sm cursor-pointer rounded-lg bg-neutral-50 px-3 mb-2 transition-colors border ${
        isSelected
          ? "border-neutral-900"
          : "border-neutral-200 hover:border-black"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex items-center gap-x-4">
        <input 
          type="radio" 
          checked={isSelected}
          readOnly
          className="w-4 h-4 appearance-none border border-black rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[12px] before:h-[12px] before:rounded-full before:bg-yellow-900 before:scale-0 checked:before:scale-100 before:transition-transform"
        />
        <p className="text-base font-bold uppercase text-black">
          {paymentMethodsData[paymentProviderId]?.title || paymentProviderId}
        </p>
      </div>
      {children}
    </div>
  );
};

export default PaymentContainer;
