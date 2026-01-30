import { isEmpty } from "@/lib/utils/validation"
import { HttpTypes } from "@medusajs/types"

// ============ FORMAT PRICE ============

type FormatPriceParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const formatPrice = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: FormatPriceParams): string => {
  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency_code,
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(amount)
    : amount.toString()
}

// ============ PERCENTAGE DIFF ============

export const getPricePercentageDiff = (original: number, calculated: number): string => {
  const diff = original - calculated
  const decrease = (diff / original) * 100

  return decrease.toFixed()
}

// ============ PRODUCT PRICE ============

export const getPricesForVariant = (variant: any): {
  calculated_price_number: number;
  calculated_price: string;
  original_price_number: number;
  original_price: string;
  currency_code: string;
  price_type: string;
  percentage_diff: string;
} | null => {
  if (!variant?.calculated_price?.calculated_amount) {
    return null
  }

  return {
    calculated_price_number: variant.calculated_price.calculated_amount,
    calculated_price: formatPrice({
      amount: variant.calculated_price.calculated_amount,
      currency_code: variant.calculated_price.currency_code,
    }),
    original_price_number: variant.calculated_price.original_amount,
    original_price: formatPrice({
      amount: variant.calculated_price.original_amount,
      currency_code: variant.calculated_price.currency_code,
    }),
    currency_code: variant.calculated_price.currency_code,
    price_type: variant.calculated_price.calculated_price.price_list_type,
    percentage_diff: getPricePercentageDiff(
      variant.calculated_price.original_amount,
      variant.calculated_price.calculated_amount
    ),
  }
}

export function getProductPrice({
  product,
  variant_id,
}: {
  product: HttpTypes.StoreProduct
  variant_id?: string
}): {
  product: HttpTypes.StoreProduct;
  cheapestPrice: {
    calculated_price_number: number;
    calculated_price: string;
    original_price_number: number;
    original_price: string;
    currency_code: string;
    price_type: string;
    percentage_diff: string;
  } | null;
  variantPrice: {
    calculated_price_number: number;
    calculated_price: string;
    original_price_number: number;
    original_price: string;
    currency_code: string;
    price_type: string;
    percentage_diff: string;
  } | null;
} {
  if (!product || !product.id) {
    throw new Error("No product provided")
  }

  const cheapestPrice = () => {
    if (!product || !product.variants?.length) {
      return null
    }

    const cheapestVariant: any = product.variants
      .filter((v: any) => !!v.calculated_price)
      .sort((a: any, b: any) => {
        return (
          a.calculated_price.calculated_amount -
          b.calculated_price.calculated_amount
        )
      })[0]

    return getPricesForVariant(cheapestVariant)
  }

  const variantPrice = () => {
    if (!product || !variant_id) {
      return null
    }

    const variant: any = product.variants?.find(
      (v) => v.id === variant_id || v.sku === variant_id
    )

    if (!variant) {
      return null
    }

    return getPricesForVariant(variant)
  }

  return {
    product,
    cheapestPrice: cheapestPrice(),
    variantPrice: variantPrice(),
  }
}
