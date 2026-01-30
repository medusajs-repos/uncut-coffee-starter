import { DEFAULT_CART_DROPDOWN_FIELDS } from "@/components/cart"
import ProductOptionSelect from "@/components/product-option-select"
import ProductPrice from "@/components/product-price"
import { Button } from "@/components/ui/button"
import { useCartDrawer } from "@/lib/context/cart"
import { useAddToCart } from "@/lib/hooks/use-cart"
import { getVariantOptionsKeymap, isVariantInStock } from "@/lib/utils/product"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { HttpTypes } from "@medusajs/types"
import { useLocation } from "@tanstack/react-router"
import { isEqual } from "lodash-es"
import { useEffect, useMemo, useRef, useState, memo } from "react"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct;
  region: HttpTypes.StoreRegion;
  disabled?: boolean;
};

const ProductActions = memo(function ProductActions({
  product,
  region,
  disabled,
}: ProductActionsProps) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string | undefined>
  >({});
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname) || "dk";

  const addToCartMutation = useAddToCart({
    fields: DEFAULT_CART_DROPDOWN_FIELDS,
  });
  const { openCart } = useCartDrawer();

  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedOptions({});
  }, [product?.handle]);

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product?.variants?.length === 1) {
      const optionsKeymap = getVariantOptionsKeymap(
        product?.variants?.[0]?.options ?? []
      );
      setSelectedOptions(optionsKeymap ?? {});
    }
  }, [product?.variants]);

  const selectedVariant = useMemo(() => {
    if (!product?.variants || product?.variants.length === 0) {
      return;
    }

    // If there's only one variant and no options, select it directly
    if (
      product?.variants.length === 1 &&
      (!product?.options || product?.options.length === 0)
    ) {
      return product?.variants[0];
    }

    const variant = product?.variants.find((v) => {
      const optionsKeymap = getVariantOptionsKeymap(v?.options ?? []);
      const matches = isEqual(optionsKeymap, selectedOptions);

      return matches;
    });

    return variant;
  }, [product?.variants, product?.options, selectedOptions]);

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }));
  };

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product?.variants?.some((v) => {
      const optionsKeymap = getVariantOptionsKeymap(v?.options ?? []);
      return isEqual(optionsKeymap, selectedOptions);
    });
  }, [product?.variants, selectedOptions]);

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If no variant is selected, we can't add to cart
    if (!selectedVariant) {
      return false;
    }

    return isVariantInStock(selectedVariant);
  }, [selectedVariant]);

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null;

    addToCartMutation.mutateAsync(
      {
        variant_id: selectedVariant.id,
        quantity: 1,
        country_code: countryCode,
        product,
        variant: selectedVariant,
        region,
      },
      {
        onSuccess: () => {
          console.log("Item added to cart");
          openCart();
        },
        onError: () => {
          console.error("Failed to add item to cart");
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-y-4" ref={actionsRef}>
      <ProductPrice
        product={product as HttpTypes.StoreProduct}
        variant={selectedVariant}
        priceProps={{
          textSize: "large",
        }}
      />

      {(product.variants?.length ?? 0) > 1 && (
        <div className="flex flex-col gap-y-4">
          {(product.options || []).map((option) => {
            return (
              <div key={option.id}>
                <ProductOptionSelect
                  option={option}
                  current={selectedOptions[option.id]}
                  updateOption={setOptionValue}
                  title={option.title ?? ""}
                  data-testid="product-options"
                  disabled={!!disabled || addToCartMutation.isPending}
                />
              </div>
            );
          })}
        </div>
      )}

      <Button
        onClick={handleAddToCart}
        disabled={!inStock || !selectedVariant || !!disabled || !isValidVariant}
        variant="primary"
        className="w-full"
        data-testid="add-product-button"
      >
        {!selectedVariant
          ? "Select variant"
          : !inStock || !isValidVariant
            ? "Out of stock"
            : "Add to cart"}
      </Button>
    </div>
  );
});

export default ProductActions;
