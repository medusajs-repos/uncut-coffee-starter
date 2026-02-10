import AddressForm from "@/components/address-form"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useSetCartAddresses } from "@/lib/hooks/use-checkout"
import { getStoredCountryCode } from "@/lib/utils/region"
import { HttpTypes } from "@medusajs/types"
import { useEffect, useState, useCallback } from "react"
import { CheckCircleSolid } from "@medusajs/icons"

interface AddressStepProps {
  cart: HttpTypes.StoreCart;
}

const AddressStep = ({ cart }: AddressStepProps) => {
  const setAddressesMutation = useSetCartAddresses();
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [isShippingAddressValid, setIsShippingAddressValid] = useState(false);
  const [isBillingAddressValid, setIsBillingAddressValid] = useState(false);
  const [email, setEmail] = useState(cart.email || "");
  const [isSaved, setIsSaved] = useState(false);
  const storedCountryCode = getStoredCountryCode();
  const [shippingAddress, setShippingAddress] = useState<Record<string, any>>({
    first_name: cart.shipping_address?.first_name || "",
    last_name: cart.shipping_address?.last_name || "",
    company: cart.shipping_address?.company || "",
    address_1: cart.shipping_address?.address_1 || "",
    address_2: cart.shipping_address?.address_2 || "",
    city: cart.shipping_address?.city || "",
    postal_code: cart.shipping_address?.postal_code || "",
    province: cart.shipping_address?.province || "",
    country_code:
      cart.shipping_address?.country_code || storedCountryCode || "",
    phone: cart.shipping_address?.phone || "",
  });
  const [billingAddress, setBillingAddress] = useState<Record<string, any>>({
    first_name: cart.billing_address?.first_name || "",
    last_name: cart.billing_address?.last_name || "",
    company: cart.billing_address?.company || "",
    address_1: cart.billing_address?.address_1 || "",
    address_2: cart.billing_address?.address_2 || "",
    city: cart.billing_address?.city || "",
    postal_code: cart.billing_address?.postal_code || "",
    province: cart.billing_address?.province || "",
    country_code: cart.billing_address?.country_code || storedCountryCode || "",
    phone: cart.billing_address?.phone || "",
  });

  // Check if address is already saved
  const hasAddress = !!(cart?.shipping_address && cart?.billing_address && cart?.email);

  const isFormValid = useCallback(() => {
    const emailValid = email.trim() && email.includes("@");
    return (
      emailValid &&
      isShippingAddressValid &&
      (isBillingAddressValid || sameAsBilling)
    );
  }, [email, isShippingAddressValid, isBillingAddressValid, sameAsBilling]);

  // Auto-save when form is valid
  useEffect(() => {
    if (!isFormValid() || setAddressesMutation.isPending || isSaved) return;

    const saveAddress = async () => {
      const submitData = new FormData();
      submitData.append("email", email);

      Object.entries(shippingAddress).forEach(([key, value]) => {
        submitData.append(`shipping_address.${key}`, value);
      });

      const billingData = sameAsBilling ? shippingAddress : billingAddress;
      Object.entries(billingData).forEach(([key, value]) => {
        submitData.append(`billing_address.${key}`, value);
      });

      try {
        await setAddressesMutation.mutateAsync(submitData);
        setIsSaved(true);
      } catch (error) {
        console.error("Failed to set addresses:", error);
      }
    };

    // Debounce the save
    const timeoutId = setTimeout(saveAddress, 500);
    return () => clearTimeout(timeoutId);
  }, [email, shippingAddress, billingAddress, sameAsBilling, isFormValid, isSaved]);

  // Reset saved state when form changes
  useEffect(() => {
    setIsSaved(false);
  }, [email, shippingAddress, billingAddress, sameAsBilling]);

  useEffect(() => {
    if (!cart.region) {
      return;
    }

    const isValidShippingAddressCountry = cart.region.countries?.some(
      (country) => country.iso_2 === shippingAddress.country_code
    );
    if (!isValidShippingAddressCountry) {
      setShippingAddress((prev) => ({
        ...prev,
        country_code: storedCountryCode || "",
      }));
    }

    const isValidBillingAddressCountry = cart.region.countries?.some(
      (country) => country.iso_2 === billingAddress.country_code
    );
    if (!isValidBillingAddressCountry) {
      setBillingAddress((prev) => ({
        ...prev,
        country_code: storedCountryCode || "",
      }));
    }
  }, [cart.region, storedCountryCode]);

  return (
    <div className="space-y-8">
      {/* Status indicator */}
      {(hasAddress || isSaved) && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircleSolid className="w-4 h-4" />
          <span>Contact and shipping information saved</span>
        </div>
      )}

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-neutral-900">
          Contact
        </h3>
        <div>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full"
          />
          <p className="text-xs text-neutral-500 mt-1.5">
            Order updates will be sent to this email
          </p>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-neutral-900">
          Shipping address
        </h3>
        <AddressForm
          addressFormData={shippingAddress}
          setAddressFormData={setShippingAddress}
          countries={cart.region?.countries}
          setIsFormValid={setIsShippingAddressValid}
        />
      </div>

      {/* Billing Address Checkbox */}
      <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
        <Checkbox
          id="same_as_billing"
          type="checkbox"
          checked={sameAsBilling}
          onChange={(e) => setSameAsBilling(!!e.target.checked)}
        />
        <label htmlFor="same_as_billing" className="text-sm text-neutral-700 cursor-pointer">
          Billing address is the same as shipping
        </label>
      </div>

      {/* Billing Address (if different) */}
      {!sameAsBilling && (
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-neutral-900">
            Billing address
          </h3>
          <AddressForm
            addressFormData={billingAddress}
            setAddressFormData={setBillingAddress}
            countries={cart.region?.countries}
            setIsFormValid={setIsBillingAddressValid}
          />
        </div>
      )}

      {/* Saving indicator */}
      {setAddressesMutation.isPending && (
        <p className="text-sm text-neutral-500">Saving...</p>
      )}
    </div>
  );
};

export default AddressStep;
