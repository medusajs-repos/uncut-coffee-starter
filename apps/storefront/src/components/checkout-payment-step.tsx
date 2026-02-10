import PaymentContainer from "@/components/payment-container"
import StripeCardContainer from "@/components/stripe-card-container"
import {
  useCartPaymentMethods,
  useInitiateCartPaymentSession,
} from "@/lib/hooks/use-checkout"
import { isStripe as isStripeFunc, getActivePaymentSession, isPaidWithGiftCard } from "@/lib/utils/checkout"
import { HttpTypes } from "@medusajs/types"
import { useCallback, useEffect, useState } from "react"
import { CheckCircleSolid } from "@medusajs/icons"

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
    activeSession?.provider_id ?? ""
  );

  // Update selected payment method when payment methods are loaded
  useEffect(() => {
    if (!selectedPaymentMethod && availablePaymentMethods?.length > 0) {
      setSelectedPaymentMethod(availablePaymentMethods[0].id);
      handlePaymentMethodChange(availablePaymentMethods[0].id);
    }
  }, [availablePaymentMethods, selectedPaymentMethod]);

  const paidByGiftcard = isPaidWithGiftCard(cart);

  const initiatePaymentSession = useCallback(
    async (method: string) => {
      initiatePaymentSessionMutation.mutateAsync(
        { provider_id: method },
        {
          onError: (error) => {
            setError(
              error instanceof Error ? error.message : "An error occurred"
            );
          },
        }
      );
    },
    [initiatePaymentSessionMutation]
  );

  const handlePaymentMethodChange = async (method: string) => {
    setError(null);
    setSelectedPaymentMethod(method);
    initiatePaymentSession(method);
  };

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

  return (
    <div className="space-y-4">
      {/* Status indicator */}
      {activeSession && (
        <div className="flex items-center gap-2 text-sm font-bold text-green-600">
          <CheckCircleSolid className="w-4 h-4" />
          <span>Payment method ready</span>
        </div>
      )}

      {/* Payment Method Selection */}
      {!paidByGiftcard && (availablePaymentMethods?.length ?? 0) > 0 && (
        <div className="space-y-3">
          {availablePaymentMethods.length === 0 && (
            <p className="text-sm font-bold text-neutral-500">
              No payment methods available
            </p>
          )}
          {availablePaymentMethods.map((paymentMethod) => (
            <div key={paymentMethod.id}>
              <PaymentContainer
                paymentProviderId={paymentMethod.id}
                selectedPaymentOptionId={selectedPaymentMethod}
                onClick={() => handlePaymentMethodChange(paymentMethod.id)}
              >
                {isStripeFunc(paymentMethod.id) && (
                  <StripeCardContainer
                    paymentProviderId={paymentMethod.id}
                    selectedPaymentOptionId={selectedPaymentMethod}
                    setError={setError}
                    onSelect={() => handlePaymentMethodChange(paymentMethod.id)}
                  />
                )}
              </PaymentContainer>
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
