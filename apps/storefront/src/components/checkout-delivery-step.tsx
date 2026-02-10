import ShippingItemSelector from "@/components/shipping-item-selector"
import {
  useSetCartShippingMethod,
  useShippingOptions,
} from "@/lib/hooks/use-checkout"
import { HttpTypes } from "@medusajs/types"
import { useEffect, useState } from "react"
import { CheckCircleSolid } from "@medusajs/icons"

interface DeliveryStepProps {
  cart: HttpTypes.StoreCart;
}

const DeliveryStep = ({ cart }: DeliveryStepProps) => {
  const { data: shippingOptions } = useShippingOptions({ cart_id: cart.id });
  const setShippingMethodMutation = useSetCartShippingMethod();
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    cart.shipping_methods?.[0]?.shipping_option_id || ""
  );

  // Check if shipping method is already selected
  const hasShippingMethod = !!cart.shipping_methods?.length;

  useEffect(() => {
    // Auto-select first option if none selected and options are available
    if (!selectedOptionId && shippingOptions && shippingOptions.length > 0) {
      handleSelectShippingOption(shippingOptions[0].id);
    }
  }, [shippingOptions, selectedOptionId]);

  const handleSelectShippingOption = async (optionId: string) => {
    if (setShippingMethodMutation.isPending) return;
    
    setSelectedOptionId(optionId);
    
    await setShippingMethodMutation.mutateAsync(
      { shipping_option_id: optionId },
      {
        onError: (error) => {
          console.error("Failed to set shipping method:", error);
        },
      }
    );
  };

  // Check if address is complete before showing shipping options
  const hasAddress = !!(cart?.shipping_address?.address_1);

  if (!hasAddress) {
    return (
      <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 h-12">
        <p className="text-sm font-bold text-neutral-500">
          Please enter your shipping address first to see available shipping options.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status indicator */}
      {hasShippingMethod && (
        <div className="flex items-center gap-2 text-sm font-bold text-green-600">
          <CheckCircleSolid className="w-4 h-4" />
          <span>Shipping method selected</span>
        </div>
      )}

      {/* Shipping Method Selection */}
      <div className="space-y-3">
        {shippingOptions?.length === 0 && (
          <p className="text-sm font-bold text-neutral-500">
            No shipping options available for your address.
          </p>
        )}
        {shippingOptions?.map((option) => (
          <ShippingItemSelector
            key={option.id}
            shippingOption={option}
            isSelected={selectedOptionId === option.id}
            handleSelect={handleSelectShippingOption}
            cart={cart}
          />
        ))}
      </div>

      {/* Loading indicator */}
      {setShippingMethodMutation.isPending && (
        <p className="text-sm font-bold text-neutral-500">Updating shipping method...</p>
      )}
    </div>
  );
};

export default DeliveryStep;
