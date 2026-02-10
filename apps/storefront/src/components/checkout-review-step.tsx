import Address from "@/components/address"
import PaymentButton from "@/components/payment-button"
import PaymentMethodInfo from "@/components/payment-method-info"
import { Button } from "@/components/ui/button"
import { Price } from "@/components/ui/price"
import { getActivePaymentSession, isPaidWithGiftCard } from "@/lib/utils/checkout"
import { HttpTypes } from "@medusajs/types"

interface ReviewStepProps {
  cart: HttpTypes.StoreCart;
  onBack: () => void;
}

const ReviewStep = ({ cart, onBack }: ReviewStepProps) => {
  const paidByGiftcard = isPaidWithGiftCard(cart);
  const activeSession = getActivePaymentSession(cart);

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      {cart.email && (
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">Contact</h3>
          <p className="text-sm text-neutral-600">{cart.email}</p>
        </div>
      )}

      {/* Shipping Information */}
      {cart.shipping_address && (
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-neutral-900 mb-2">
              Ship to
            </h3>
            <Address address={cart.shipping_address} />
          </div>

          {cart.shipping_methods?.[0] && (
            <div className="pt-4 border-t border-neutral-200">
              <h3 className="text-sm font-medium text-neutral-900 mb-2">
                Shipping method
              </h3>
              <div className="flex items-center justify-between text-sm text-neutral-600">
                <span>{cart.shipping_methods[0].name}</span>
                <Price
                  price={cart.shipping_methods[0].amount}
                  currencyCode={cart.currency_code}
                  textSize="small"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Payment Information */}
      <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-neutral-900 mb-2">
            Payment
          </h3>
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            {activeSession && (
              <PaymentMethodInfo provider_id={activeSession.provider_id} />
            )}
            {paidByGiftcard && <span>Gift Card</span>}
          </div>
        </div>

        {cart.billing_address && (
          <div className="pt-4 border-t border-neutral-200">
            <h3 className="text-sm font-medium text-neutral-900 mb-2">
              Billing address
            </h3>
            <Address address={cart.billing_address} />
          </div>
        )}
      </div>

      {/* Terms Notice */}
      <p className="text-sm text-neutral-500">
        By placing your order, you agree to our Terms of Service and Privacy Policy. 
        Your payment will be processed securely.
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4">
        <Button variant="secondary" onClick={onBack} className="flex-1">
          Back
        </Button>
        <div className="flex-1">
          <PaymentButton cart={cart} className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
