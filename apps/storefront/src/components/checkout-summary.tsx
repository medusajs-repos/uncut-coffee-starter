import { CartPromo } from "@/components/cart"
import { Loading } from "@/components/ui/loading"
import { Price } from "@/components/ui/price"
import { Thumbnail } from "@/components/ui/thumbnail"
import { HttpTypes } from "@medusajs/types"
import { Suspense } from "react"

interface CheckoutSummaryProps {
  cart: HttpTypes.StoreCart;
}

const CheckoutSummary = ({ cart }: CheckoutSummaryProps) => {
  return (
    <div className="space-y-6">
      {/* Line Items */}
      <Suspense fallback={<Loading />}>
        <div className="space-y-4">
          {cart.items?.map((item) => (
            <div key={item.id} className="flex items-start gap-4">
              {/* Product Image with Quantity Badge */}
              <div className="relative flex-shrink-0">
                <Thumbnail
                  thumbnail={item.thumbnail}
                  alt={item.product_title || item.title}
                  size="sm"
                  className="rounded-lg border border-neutral-200"
                />
                {/* Quantity Badge */}
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-neutral-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-neutral-900 truncate">
                  {item.product_title}
                </p>
                {item.variant_title && item.variant_title !== "Default Variant" && (
                  <p className="text-sm font-bold text-neutral-500">{item.variant_title}</p>
                )}
              </div>

              {/* Price */}
              <div className="flex-shrink-0">
                <Price
                  price={item.total || 0}
                  currencyCode={cart.currency_code}
                  textSize="small"
                  className="font-medium"
                />
              </div>
            </div>
          ))}
        </div>
      </Suspense>

      {/* Promo Code */}
      <div className="pt-4 border-t border-neutral-200">
        <Suspense fallback={<Loading />}>
          <CartPromo cart={cart} />
        </Suspense>
      </div>

      {/* Cost Summary */}
      <div className="pt-4 border-t border-neutral-200 space-y-3">
        <div className="flex justify-between text-sm font-bold">
          <span className="text-neutral-600">Subtotal</span>
          <Price
            price={cart.subtotal}
            currencyCode={cart.currency_code}
            textSize="small"
          />
        </div>

        {cart.shipping_total !== undefined && cart.shipping_total > 0 ? (
          <div className="flex justify-between text-sm font-bold">
            <span className="text-neutral-600">Shipping</span>
            <Price
              price={cart.shipping_total}
              currencyCode={cart.currency_code}
              textSize="small"
            />
          </div>
        ) : (
          <div className="flex justify-between text-sm font-bold">
            <span className="text-neutral-600">Shipping</span>
            <span className="text-neutral-500">Calculated at next step</span>
          </div>
        )}

        {cart.discount_total !== undefined && cart.discount_total > 0 && (
          <div className="flex justify-between text-sm font-bold">
            <span className="text-neutral-600">Discount</span>
            <Price
              price={cart.discount_total}
              currencyCode={cart.currency_code}
              textSize="small"
              type="discount"
              className="text-green-600"
            />
          </div>
        )}

        {cart.tax_total !== undefined && cart.tax_total > 0 && (
          <div className="flex justify-between text-sm font-bold">
            <span className="text-neutral-600">Taxes</span>
            <Price
              price={cart.tax_total}
              currencyCode={cart.currency_code}
              textSize="small"
            />
          </div>
        )}
      </div>

      {/* Total */}
      <div className="pt-4 border-t border-neutral-200">
        <div className="flex justify-between items-baseline">
          <span className="text-base font-bold text-neutral-900">Total</span>
          <div className="text-right">
            <span className="text-xs font-bold text-neutral-500 mr-2 uppercase">
              {cart.currency_code}
            </span>
            <Price
              price={cart.total}
              currencyCode={cart.currency_code}
              className="text-xl font-bold"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
