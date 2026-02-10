import { CartEmpty } from "@/components/cart"
import { Loading } from "@/components/ui/loading"
import { useCart } from "@/lib/hooks/use-cart"
import {
  useLocation,
  Link,
} from "@tanstack/react-router"
import { lazy, Suspense } from "react"
import { getCountryCodeFromPath } from "@/lib/utils/region"


const DeliveryStep = lazy(() => import("@/components/checkout-delivery-step"))
const AddressStep = lazy(() => import("@/components/checkout-address-step"))
const PaymentStep = lazy(() => import("@/components/checkout-payment-step"))
const ReviewStep = lazy(() => import("@/components/checkout-review-step"))
const CheckoutSummary = lazy(() => import("@/components/checkout-summary"))

const Checkout = () => {
  const { data: cart, isLoading: cartLoading } = useCart();
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname);

  // Show empty cart state
  if (!cartLoading && (!cart || !cart.items?.length)) {
    return (
      <div className="min-h-screen bg-white">
        <div className="content-container py-16">
          <CartEmpty />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Column - Checkout Form */}
        <div className="bg-white px-6 lg:px-12 xl:px-24 py-8 lg:py-12 order-2 lg:order-1">
          {/* Back to Cart Link */}
          <Link 
            to={`/${countryCode}` as any}
            className="group inline-flex items-center justify-center bg-neutral-200 transition-colors px-4 h-[48px] rounded-[8px] mb-8"
          >
            <span className="text-[14px] font-bold uppercase text-neutral-500 group-hover:text-black transition-colors tracking-wide">BACK TO UNCUT</span>
          </Link>

          {/* All Steps in One Scroll */}
          <Suspense fallback={<Loading />}>
            {cartLoading && <Loading />}
            {cart && (
              <div className="space-y-12">
                {/* 1. Contact & Shipping Address */}
                <section id="information">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-neutral-900 uppercase">Contact & Shipping</h2>
                  </div>
                  <AddressStep cart={cart} />
                </section>

                <hr className="border-neutral-200" />

                {/* 2. Shipping Method */}
                <section id="shipping">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-neutral-900 uppercase">Shipping Method</h2>
                    <p className="text-sm font-bold text-neutral-600 mt-1">Select your preferred shipping option</p>
                  </div>
                  <DeliveryStep cart={cart} />
                </section>

                <hr className="border-neutral-200" />

                {/* 3. Payment */}
                <section id="payment">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-neutral-900 uppercase">Payment</h2>
                    <p className="text-sm font-bold text-neutral-600 mt-1">Enter your payment details</p>
                  </div>
                  <PaymentStep cart={cart} />
                </section>

                <hr className="border-neutral-200" />

                {/* 4. Review & Place Order */}
                <section id="review">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-neutral-900 uppercase">Review & Place Order</h2>
                    <p className="text-sm font-bold text-neutral-600 mt-1">Review your order and complete your purchase</p>
                  </div>
                  <ReviewStep cart={cart} />
                </section>
              </div>
            )}
          </Suspense>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <div className="flex flex-wrap gap-4 text-xs font-bold text-neutral-500">
              <span>Refund policy</span>
              <span>Privacy policy</span>
              <span>Terms of service</span>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="bg-neutral-100 px-6 lg:px-12 xl:px-16 py-8 lg:py-12 border-l border-neutral-200 order-1 lg:order-2">
          <div className="lg:sticky lg:top-8">
            <h2 className="text-lg font-bold text-neutral-900 mb-6 uppercase">
              Order Summary
            </h2>
            <Suspense fallback={<Loading />}>
              {cartLoading && <Loading />}
              {cart && <CheckoutSummary cart={cart} />}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
