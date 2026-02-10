import CheckoutProgress from "@/components/checkout-progress"
import { CartEmpty } from "@/components/cart"
import { Loading } from "@/components/ui/loading"
import { useCart } from "@/lib/hooks/use-cart"
import { type CheckoutStep, CheckoutStepKey } from "@/lib/types/global"
import {
  useLoaderData,
  useLocation,
  useNavigate,
  Link,
} from "@tanstack/react-router"
import { lazy, Suspense, useEffect, useMemo } from "react"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { ArrowLeft } from "@medusajs/icons"

const DeliveryStep = lazy(() => import("@/components/checkout-delivery-step"))
const AddressStep = lazy(() => import("@/components/checkout-address-step"))
const PaymentStep = lazy(() => import("@/components/checkout-payment-step"))
const ReviewStep = lazy(() => import("@/components/checkout-review-step"))
const CheckoutSummary = lazy(() => import("@/components/checkout-summary"))

const Checkout = () => {
  const { step } = useLoaderData({
    from: "/$countryCode/checkout",
  });
  const { data: cart, isLoading: cartLoading } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const countryCode = getCountryCodeFromPath(location.pathname);

  const steps: CheckoutStep[] = useMemo(() => {
    return [
      {
        key: CheckoutStepKey.ADDRESSES,
        title: "Information",
        description: "Enter your contact and shipping details.",
        completed: !!(cart?.shipping_address && cart?.billing_address),
      },
      {
        key: CheckoutStepKey.DELIVERY,
        title: "Shipping",
        description: "Select your shipping method.",
        completed: !!cart?.shipping_methods?.length,
      },
      {
        key: CheckoutStepKey.PAYMENT,
        title: "Payment",
        description:
          "Enter your payment details.",
        completed: !!cart?.payment_collection?.payment_sessions?.length,
      },
      {
        key: CheckoutStepKey.REVIEW,
        title: "Review",
        description: "Review and place your order.",
        completed: false,
      },
    ];
  }, [cart]);

  const currentStepIndex = useMemo(
    () => steps.findIndex((s) => s.key === step),
    [step, steps]
  );

  const goToStep = (step: CheckoutStepKey) => {
    navigate({
      to: `${location.pathname}?step=${step}`,
      replace: true,
    });
  };

  useEffect(() => {
    // Determine which step to show based on cart state
    if (!cart) {
      return;
    }

    if (
      step !== CheckoutStepKey.ADDRESSES &&
      currentStepIndex >= 0 &&
      !steps[0].completed
    ) {
      goToStep(CheckoutStepKey.ADDRESSES);
      return;
    }

    if (
      step !== CheckoutStepKey.DELIVERY &&
      currentStepIndex >= 1 &&
      !steps[1].completed
    ) {
      goToStep(CheckoutStepKey.DELIVERY);
      return;
    }

    if (
      step !== CheckoutStepKey.PAYMENT &&
      currentStepIndex >= 2 &&
      !steps[2].completed
    ) {
      goToStep(CheckoutStepKey.PAYMENT);
      return;
    }
  }, [cart, steps, location]);

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      goToStep(steps[nextIndex].key);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      goToStep(steps[prevIndex].key);
    }
  };

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
            to={`/${countryCode}/cart` as any}
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to cart</span>
          </Link>

          {/* Logo / Store Name */}
          <div className="mb-8">
            <Link to={`/${countryCode}` as any} className="text-2xl font-bold tracking-tight">
              UNCUT
            </Link>
          </div>

          {/* Breadcrumb Progress */}
          <div className="mb-8">
            <CheckoutProgress
              steps={steps}
              currentStepIndex={currentStepIndex}
              handleStepChange={goToStep}
            />
          </div>

          {/* Step Content */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
              {steps[currentStepIndex]?.title}
            </h1>
            <p className="text-neutral-600">
              {steps[currentStepIndex]?.description}
            </p>
          </div>

          {/* Form Content */}
          <Suspense fallback={<Loading />}>
            {cartLoading && <Loading />}
            {cart && (
              <>
                {step === CheckoutStepKey.ADDRESSES && (
                  <AddressStep cart={cart} onNext={handleNext} />
                )}
                {step === CheckoutStepKey.DELIVERY && (
                  <DeliveryStep
                    cart={cart}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                )}
                {step === CheckoutStepKey.PAYMENT && (
                  <PaymentStep
                    cart={cart}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                )}
                {step === CheckoutStepKey.REVIEW && (
                  <ReviewStep cart={cart} onBack={handleBack} />
                )}
              </>
            )}
          </Suspense>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <div className="flex flex-wrap gap-4 text-xs text-neutral-500">
              <span>Refund policy</span>
              <span>Privacy policy</span>
              <span>Terms of service</span>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="bg-neutral-100 px-6 lg:px-12 xl:px-16 py-8 lg:py-12 border-l border-neutral-200 order-1 lg:order-2">
          <div className="lg:sticky lg:top-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">
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
