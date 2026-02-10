import PaymentButton from "@/components/payment-button"
import { getActivePaymentSession, isPaidWithGiftCard } from "@/lib/utils/checkout"
import { HttpTypes } from "@medusajs/types"

interface ReviewStepProps {
  cart: HttpTypes.StoreCart;
}

const ReviewStep = ({ cart }: ReviewStepProps) => {
  const paidByGiftcard = isPaidWithGiftCard(cart);
  const activeSession = getActivePaymentSession(cart);

  // Check if all previous steps are complete
  const hasAddress = !!(cart?.shipping_address?.address_1 && cart?.email);
  const hasShippingMethod = !!cart.shipping_methods?.length;
  const hasPayment = !!activeSession || paidByGiftcard;

  const isReady = hasAddress && hasShippingMethod && hasPayment;

  if (!isReady) {
    return (
      <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
        <p className="text-sm font-bold text-neutral-500">
          Please complete all steps above to place your order.
        </p>
        <ul className="mt-2 text-sm font-bold text-neutral-500 list-disc list-inside">
          {!hasAddress && <li>Enter your contact and shipping information</li>}
          {!hasShippingMethod && <li>Select a shipping method</li>}
          {!hasPayment && <li>Set up payment</li>}
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Terms Notice */}
      <p className="text-sm font-bold text-neutral-500">
        By placing your order, you agree to our Terms of Service and Privacy Policy. 
        Your payment will be processed securely.
      </p>

      {/* Place Order Button */}
      <PaymentButton cart={cart} className="w-full py-4 text-base" />
    </div>
  );
};

export default ReviewStep;
