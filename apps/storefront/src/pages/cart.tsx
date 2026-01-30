import {
  CartLineItem,
  CartSummary,
  CartEmpty,
  CartPromo,
} from "@/components/cart"
import { Loading } from "@/components/ui/loading"
import { useCart, useCreateCart } from "@/lib/hooks/use-cart"
import { sortCartItems } from "@/lib/utils/cart"
import { Link, useLoaderData } from "@tanstack/react-router"

const DEFAULT_CART_FIELDS =
  "id, *items, total, currency_code, subtotal, shipping_total, discount_total, tax_total, *promotions";

const Cart = () => {
  const { region, countryCode } = useLoaderData({
    from: "/$countryCode/cart",
  });
  const { data: cart, isLoading: cartLoading } = useCart({
    fields: DEFAULT_CART_FIELDS,
  });
  const createCartMutation = useCreateCart();

  // Auto-create cart if none exists
  if (!cart && !cartLoading && !createCartMutation.isPending) {
    createCartMutation.mutate({ region_id: region.id });
  }

  const cartItems = sortCartItems(cart?.items || []);

  return (
    <div className="content-container py-12 pt-24 md:pt-28">
      {cartLoading ? (
        <Loading />
      ) : cartItems.length === 0 ? (
        <CartEmpty />
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">Your Cart</h1>
            <Link
              to={`/${countryCode}/store` as any}
              className="text-sap-gray hover:text-black text-sm uppercase tracking-wide transition-colors"
            >
              Continue Shopping
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Cart Items */}
            <div className="w-full lg:w-2/3">
              <div className="border-t border-sap-gray-light">
                {cartItems.map((item) => (
                  <div key={item.id} className="border-b border-sap-gray-light py-6">
                    <CartLineItem
                      item={item}
                      cart={cart!}
                      fields={DEFAULT_CART_FIELDS}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            {cart && (
              <div className="w-full lg:w-1/3">
                <div className="bg-sap-cream p-6 rounded-[18px]">
                  <h2 className="text-xl font-bold uppercase tracking-tight mb-6">
                    Order Summary
                  </h2>

                  <CartSummary cart={cart} />

                  <div className="mt-6">
                    <CartPromo cart={cart} />
                  </div>

                  <Link to={`/${countryCode}/checkout` as any} className="block mt-6">
                    <button className="sap-button w-full">
                      Proceed to Checkout
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
