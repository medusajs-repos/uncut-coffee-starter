import PaymentContainer from "@/components/payment-container"
import StripeCardContainer from "@/components/stripe-card-container"
import { Button } from "@/components/ui/button"
import {
  useCartPaymentMethods,
  useInitiateCartPaymentSession,
} from "@/lib/hooks/use-checkout"
import { isStripe as isStripeFunc, getActivePaymentSession, isPaidWithGiftCard } from "@/lib/utils/checkout"
import { HttpTypes } from "@medusajs/types"
import { useCallback, useEffect, useState } from "react"

interface PaymentStepProps {
  cart: HttpTypes.StoreCart;
  onNext: () => void;
  onBack: () => void;
}

const PaymentStep = ({ cart, onNext, onBack }: PaymentStepProps) => {
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

  const isStripe = isStripeFunc(selectedPaymentMethod);

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

  const handleSubmit = useCallback(async () => {
    if (!selectedPaymentMethod) return;

    if (!activeSession) {
      await initiatePaymentSession(selectedPaymentMethod);
    }

    onNext();
  }, [selectedPaymentMethod, activeSession, onNext, initiatePaymentSession]);

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      {!paidByGiftcard && (availablePaymentMethods?.length ?? 0) > 0 && (
        <div className="space-y-3">
          {availablePaymentMethods.length === 0 && (
            <p className="text-sm text-neutral-500">
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
                    onCardComplete={handleSubmit}
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
          <p className="text-sm font-medium text-neutral-900 mb-1">
            Payment method
          </p>
          <p className="text-sm text-neutral-600">
            Your order will be paid with gift card
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3 pt-4">
        <Button
          variant="secondary"
          onClick={onBack}
          disabled={initiatePaymentSessionMutation.isPending}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={
            (isStripe && !activeSession) ||
            (!selectedPaymentMethod && !paidByGiftcard) ||
            initiatePaymentSessionMutation.isPending
          }
          className="flex-1"
        >
          {!activeSession && isStripeFunc(selectedPaymentMethod)
            ? "Enter card details"
            : "Review order"}
        </Button>
      </div>
    </div>
  );
};

export default PaymentStep;
