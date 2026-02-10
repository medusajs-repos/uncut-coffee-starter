import PaymentContainer from "@/components/payment-container"
import {
  useCartPaymentMethods,
  useInitiateCartPaymentSession,
} from "@/lib/hooks/use-checkout"
import { getActivePaymentSession, isPaidWithGiftCard } from "@/lib/utils/checkout"
import { HttpTypes } from "@medusajs/types"
import { useCallback, useEffect, useState } from "react"

interface PaymentStepProps {
  cart: HttpTypes.StoreCart;
}

const PaymentStep = ({ cart }: PaymentStepProps) => {
  const { data: availablePaymentMethods = [] } = useCartPaymentMethods({
    region_id: cart.region?.id,
  });
  const initiatePaymentSessionMutation = useInitiateCartPaymentSession();

  const activeSession = getActivePaymentSession(cart);

  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    "credit_card"
  );

  const paidByGiftcard = isPaidWithGiftCard(cart);

  // Get the real manual payment provider to use behind the scenes
  const manualPaymentProvider = availablePaymentMethods.find(
    (p) => p.id === "pp_system_default"
  );

  const initiatePaymentSession = useCallback(
    async () => {
      if (!manualPaymentProvider) return;
      
      try {
        await initiatePaymentSessionMutation.mutateAsync(
          { provider_id: manualPaymentProvider.id },
          {
            onError: (error) => {
              setError(
                error instanceof Error ? error.message : "An error occurred"
              );
            },
          }
        );
      } catch (e) {
        // Error handled in onError callback
      }
    },
    [initiatePaymentSessionMutation, manualPaymentProvider]
  );

  // Initialize payment session with the real provider when shipping is complete
  useEffect(() => {
    if (
      manualPaymentProvider &&
      cart.shipping_methods?.length &&
      !activeSession
    ) {
      initiatePaymentSession();
    }
  }, [manualPaymentProvider, cart.shipping_methods?.length, activeSession, initiatePaymentSession]);

  // Check if shipping method is selected before showing payment options
  const hasShippingMethod = !!cart.shipping_methods?.length;

  if (!hasShippingMethod) {
    return (
      <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
        <p className="text-sm font-bold text-neutral-500">
          Please select a shipping method first to see payment options.
        </p>
      </div>
    );
  }

  // Fake payment options for display purposes only
  const displayPaymentMethods = [
    { id: "credit_card", name: "Credit Card" },
    { id: "paypal", name: "PayPal" },
  ];

  return (
    <div className="space-y-4">
      {/* Payment Method Selection */}
      {!paidByGiftcard && (
        <div className="space-y-2">
          {displayPaymentMethods.map((method) => (
            <div key={method.id}>
              <PaymentContainer
                paymentProviderId={method.id}
                selectedPaymentOptionId={selectedPaymentMethod}
                onClick={() => setSelectedPaymentMethod(method.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Gift Card Payment */}
      {paidByGiftcard && (
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <p className="text-sm font-bold text-neutral-900 mb-1">
            Payment method
          </p>
          <p className="text-sm font-bold text-neutral-600">
            Your order will be paid with gift card
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm font-bold text-red-700">{error}</p>
        </div>
      )}

      {/* Loading indicator */}
      {initiatePaymentSessionMutation.isPending && (
        <p className="text-sm font-bold text-neutral-500">Setting up payment...</p>
      )}
    </div>
  );
};

export default PaymentStep;
