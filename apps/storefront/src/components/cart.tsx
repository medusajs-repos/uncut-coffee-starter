import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Loading } from "@/components/ui/loading"
import { Price } from "@/components/ui/price"
import { Thumbnail } from "@/components/ui/thumbnail"
import {
  useCart,
  useDeleteLineItem,
  useUpdateLineItem,
  useApplyPromoCode,
  useRemovePromoCode,
} from "@/lib/hooks/use-cart"
import { sortCartItems } from "@/lib/utils/cart"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { getPricePercentageDiff } from "@/lib/utils/price"
import { useCartDrawer } from "@/lib/context/cart"
import { Minus, Plus, Trash, XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Link, useLocation } from "@tanstack/react-router"
import { clsx } from "clsx"
import { useState } from "react"


type LineItemPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  currencyCode: string
  className?: string
}

export const LineItemPrice = ({ item, currencyCode, className }: LineItemPriceProps) => {
  const { total, original_total } = item
  const originalPrice = original_total
  const currentPrice = total
  const hasReducedPrice = currentPrice && originalPrice && currentPrice < originalPrice

  return (
    <Price
      price={currentPrice || 0}
      currencyCode={currencyCode}
      originalPrice={
        hasReducedPrice
          ? {
              price: originalPrice || 0,
              percentage: getPricePercentageDiff(originalPrice || 0, currentPrice || 0),
            }
          : undefined
      }
      className={className}
    />
  )
}


type CartDeleteItemProps = {
  item: HttpTypes.StoreCartLineItem
  fields?: string
}

export const CartDeleteItem = ({ item, fields }: CartDeleteItemProps) => {
  const deleteLineItemMutation = useDeleteLineItem({ fields })
  return (
    <Button
      onClick={() => deleteLineItemMutation.mutate({ line_id: item.id })}
      disabled={deleteLineItemMutation.isPending}
      className="text-neutral-600 hover:text-neutral-500 transition-colors ml-2"
      variant="transparent"
      size="fit"
    >
      <Trash />
    </Button>
  )
}


type CartItemQuantitySelectorProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "default" | "compact"
  fields?: string
}

export const CartItemQuantitySelector = ({
  item,
  type = "default",
  fields,
}: CartItemQuantitySelectorProps) => {
  const updateLineItemMutation = useUpdateLineItem({ fields })
  const deleteLineItemMutation = useDeleteLineItem({ fields })

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity === 0) {
      deleteLineItemMutation.mutate({ line_id: item.id })
    } else {
      updateLineItemMutation.mutate({
        line_id: item.id,
        quantity: newQuantity,
      })
    }
  }

  return (
    <div className="flex items-center">
      <Button
        onClick={() => handleQuantityChange(item.quantity - 1)}
        className={clsx(
          type === "compact" &&
            "text-neutral-600 hover:text-neutral-500 transition-colors p-1 ml-2"
        )}
        variant="transparent"
        size="fit"
      >
        <Minus />
      </Button>
      <span
        className={clsx(
          type === "compact"
            ? "text-sm text-neutral-900 text-center px-3"
            : "text-center text-sm px-6"
        )}
      >
        {item.quantity}
      </span>
      <Button
        onClick={() => handleQuantityChange(item.quantity + 1)}
        className={clsx(
          type === "compact" &&
            "text-neutral-600 hover:text-neutral-500 transition-colors p-1 ml-2"
        )}
        variant="transparent"
        size="fit"
      >
        <Plus />
      </Button>
    </div>
  )
}


interface CartLineItemProps {
  item: HttpTypes.StoreCartLineItem
  cart: HttpTypes.StoreCart
  type?: "default" | "compact" | "display"
  fields?: string
  className?: string
}

const CompactCartLineItem = ({ item, cart, fields }: CartLineItemProps) => {
  const unitPrice = item.unit_price || (item.total ? item.total / item.quantity : 0)
  const updateLineItemMutation = useUpdateLineItem({ fields })
  const deleteLineItemMutation = useDeleteLineItem({ fields })

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity === 0) {
      deleteLineItemMutation.mutate({ line_id: item.id })
    } else {
      updateLineItemMutation.mutate({
        line_id: item.id,
        quantity: newQuantity,
      })
    }
  }
  
  return (
    <div className="flex items-start gap-4" data-testid="cart-item">
      <Thumbnail 
        thumbnail={item.thumbnail} 
        alt={item.product_title || item.title} 
        className="w-16 h-20 object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className="text-sm font-bold uppercase tracking-wide text-black">
              {item.product_title}
            </h4>
            {item.variant_title && item.variant_title !== "Default Variant" && (
              <p className="text-sm font-bold uppercase tracking-wide text-black mt-0.5">
                {item.variant_title}
              </p>
            )}
            <div className="text-sm text-neutral-600 mt-1">
              <Price price={unitPrice} currencyCode={cart.currency_code} textSize="small" />
            </div>
          </div>
          <Price price={item.total || 0} currencyCode={cart.currency_code} textSize="small" className="font-medium" />
        </div>

        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center border border-neutral-300 rounded-lg">
            <Button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="px-3 py-2 text-neutral-600 hover:text-black transition-colors"
              variant="transparent"
              size="fit"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-sm text-black min-w-[2rem] text-center font-medium">
              {item.quantity}
            </span>
            <Button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="px-3 py-2 text-neutral-600 hover:text-black transition-colors"
              variant="transparent"
              size="fit"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <CartDeleteItem item={item} fields={fields} />
        </div>
      </div>
    </div>
  )
}

const DisplayCartLineItem = ({ item, cart, className }: CartLineItemProps) => {
  return (
    <div
      className={clsx(
        "flex items-center gap-4 py-3 border-b border-neutral-300 last:border-b-0",
        className
      )}
    >
      <Thumbnail
        thumbnail={item.thumbnail}
        alt={item.product_title || item.title}
        className="w-16 h-16"
      />
      <div className="flex-1">
        <p className="text-base font-semibold text-neutral-900">{item.product_title}</p>
        {item.variant_title && item.variant_title !== "Default Variant" && (
          <p className="text-sm text-neutral-600">{item.variant_title}</p>
        )}
        <p className="text-sm text-neutral-600">Quantity: {item.quantity}</p>
      </div>
      <div className="text-right">
        <Price price={item.total || 0} currencyCode={cart.currency_code} textWeight="plus" />
      </div>
    </div>
  )
}

export const CartLineItem = ({
  item,
  cart,
  type = "default",
  fields,
  className,
}: CartLineItemProps) => {
  if (type === "compact") {
    return <CompactCartLineItem item={item} cart={cart} fields={fields} className={className} />
  }

  if (type === "display") {
    return <DisplayCartLineItem item={item} cart={cart} className={className} />
  }

  return (
    <div className="flex items-center gap-6 py-4">
      <div className="flex-shrink-0">
        <Thumbnail thumbnail={item.thumbnail} alt={item.product_title || item.title} />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-y-1">
        <span className="text-neutral-900 text-base font-semibold">{item.product_title}</span>
        {item.variant_title && item.variant_title !== "Default Variant" && (
          <span className="text-neutral-600 text-sm">{item.variant_title}</span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <CartItemQuantitySelector item={item} fields={fields} />

        <div className="text-right">
          <LineItemPrice item={item} currencyCode={cart.currency_code} />
        </div>

        <CartDeleteItem item={item} fields={fields} />
      </div>
    </div>
  )
}


interface CartSummaryProps {
  cart: HttpTypes.StoreCart
}

export const CartSummary = ({ cart }: CartSummaryProps) => {
  if ("isOptimistic" in cart && cart.isOptimistic) {
    return <Loading />
  }
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Subtotal</span>
          <Price
            price={cart.subtotal}
            currencyCode={cart.currency_code}
            className="text-neutral-600"
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Shipping</span>
          <Price
            price={cart.shipping_total}
            currencyCode={cart.currency_code}
            className="text-neutral-600"
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Discount</span>
          <Price
            price={cart.discount_total}
            currencyCode={cart.currency_code}
            type="discount"
            className="text-neutral-600"
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Tax</span>
          <Price
            price={cart.tax_total}
            currencyCode={cart.currency_code}
            className="text-neutral-600"
          />
        </div>
      </div>

      <hr className="bg-neutral-200" />

      <div className="flex justify-between text-sm">
        <span className="text-neutral-900">Total</span>
        <Price price={cart.total} currencyCode={cart.currency_code} className="text-neutral-900" />
      </div>
    </div>
  )
}


type CartPromoProps = {
  cart: HttpTypes.StoreCart
}

export const CartPromo = ({ cart }: CartPromoProps) => {
  const [showInput, setShowInput] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const applyPromoCodeMutation = useApplyPromoCode()
  const removePromoCodeMutation = useRemovePromoCode()

  const handleRemove = (code: string) => {
    removePromoCodeMutation.mutate(
      { code },
      {
        onSuccess: () => {
          console.log("Promo code removed successfully")
        },
        onError: (error) => {
          console.error("Failed to remove promo code:", error)
        },
      }
    )
  }

  const handleApply = () => {
    applyPromoCodeMutation.mutate(
      { code: promoCode },
      {
        onSuccess: () => {
          setShowInput(false)
          setPromoCode("")
        },
        onError: () => {
          console.error("Failed to apply promo code")
        },
      }
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {cart.promotions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {cart.promotions.map((promotion) => (
            <Button key={promotion.code} variant="secondary" size="fit">
              {promotion.code}
              <XMark
                onClick={() => handleRemove(promotion.code || "")}
                className="ml-2 text-neutral-600 hover:text-neutral-500 cursor-pointer"
              />
            </Button>
          ))}
        </div>
      )}

      {!showInput && (
        <Button
          onClick={() => setShowInput(true)}
          variant="transparent"
          className="text-neutral-600 p-0 underline hover:bg-transparent hover:text-neutral-500"
          size="fit"
        >
          Add promo code
        </Button>
      )}

      {showInput && (
        <div className="flex gap-2">
          <Input
            placeholder="Enter promo code"
            name="promoCode"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <Button onClick={handleApply} variant="primary" size="fit">
            Apply
          </Button>
          <Button onClick={() => setShowInput(false)} variant="secondary" size="fit">
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
}


export const CartEmpty = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)

  return (
    <div className="text-center py-16 flex flex-col items-center justify-center gap-4">
      <h2 className="text-lg font-bold text-neutral-900">Your cart is empty</h2>
      <p className="text-neutral-600 text-base font-medium">Start by adding some products</p>
      <Link to={`/${countryCode}/store` as any}>
        <Button variant="primary" size="fit">
          Continue shopping
        </Button>
      </Link>
    </div>
  )
}


export const DEFAULT_CART_DROPDOWN_FIELDS = "id, *items, total, currency_code, item_subtotal"

interface CartDropdownProps {
  textColor?: string
}

export const CartDropdown = ({ textColor = "text-black" }: CartDropdownProps) => {
  const { isOpen, openCart, closeCart } = useCartDrawer()
  const { data: cart } = useCart({
    fields: DEFAULT_CART_DROPDOWN_FIELDS,
  })
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""
  const [showDiscount, setShowDiscount] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const applyPromoCodeMutation = useApplyPromoCode()

  const sortedItems = sortCartItems(cart?.items || [])
  const itemCount = sortedItems?.reduce((total, item) => total + item.quantity, 0) || 0

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return
    applyPromoCodeMutation.mutate(
      { code: promoCode },
      {
        onSuccess: () => {
          setPromoCode("")
          setShowDiscount(false)
        },
      }
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => (open ? openCart() : closeCart())}>
      <DrawerTrigger asChild>
        <button className={`${textColor} hover:opacity-70 transition-opacity h-full text-sm uppercase tracking-wide`}>
          Cart ({itemCount})
        </button>
      </DrawerTrigger>

      <DrawerContent className="flex flex-col bg-white max-h-[90vh]">
        {/* Header */}
        <DrawerHeader className="flex items-center justify-between px-6 py-4 border-b-0">
          <div className="flex items-center gap-3">
            <DrawerTitle className="text-3xl font-serif italic">Cart</DrawerTitle>
            <span className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-medium">
              {itemCount}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center hover:bg-neutral-100 transition-colors"
          >
            <XMark className="w-5 h-5" />
          </button>
        </DrawerHeader>

        {/* Empty Cart */}
        {(!cart || itemCount === 0) && (
          <div className="flex flex-col items-center justify-center flex-1 p-8">
            <span className="text-neutral-500 text-base mb-6">
              Your cart is empty
            </span>
            <Link to={`${baseHref}/store` as any} onClick={closeCart}>
              <button className="bg-black text-white px-8 py-3 rounded-full font-medium uppercase tracking-wide text-sm hover:bg-neutral-800 transition-colors">
                Continue Shopping
              </button>
            </Link>
          </div>
        )}

        {/* Cart Items */}
        {cart && itemCount > 0 && (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {sortedItems?.map((item) => (
                <CartLineItem
                  key={item.id}
                  item={item}
                  cart={cart}
                  type="compact"
                  fields={DEFAULT_CART_DROPDOWN_FIELDS}
                />
              ))}
            </div>

            <DrawerFooter className="px-6 py-4 border-t border-neutral-200 space-y-4">
              {/* Discount Section */}
              <div className="border-b border-neutral-200 pb-4">
                <button
                  onClick={() => setShowDiscount(!showDiscount)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="text-sm font-bold uppercase tracking-wide">Discount</span>
                  <Plus className={`w-5 h-5 transition-transform ${showDiscount ? 'rotate-45' : ''}`} />
                </button>
                {showDiscount && (
                  <div className="flex gap-2 mt-3">
                    <Input
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleApplyPromo} variant="primary" size="fit" className="px-4">
                      Apply
                    </Button>
                  </div>
                )}
              </div>

              {/* Estimated Total */}
              <div className="border-b border-neutral-200 pb-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold uppercase tracking-wide">Estimated Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold">
                      <Price price={cart.item_subtotal} currencyCode={cart.currency_code} />
                    </span>
                    <span className="text-sm font-medium ml-1 uppercase">{cart.currency_code}</span>
                  </div>
                </div>
                <p className="text-sm text-neutral-500 mt-2">
                  Taxes and shipping calculated at checkout.
                </p>
              </div>

              {/* Checkout Button */}
              <Link to={`${baseHref}/checkout` as any} onClick={closeCart} className="block">
                <button className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-wide text-sm hover:bg-neutral-800 transition-colors">
                  Check Out
                </button>
              </Link>

              {/* Payment Methods */}
              <div className="flex gap-2">
                <div className="flex-1 bg-[#5A31F4] text-white py-3 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-sm">shop</span>
                  <span className="font-normal text-sm ml-0.5">Pay</span>
                </div>
                <div className="flex-1 bg-black text-white py-3 rounded-lg flex items-center justify-center">
                  <svg className="h-5" viewBox="0 0 50 20" fill="currentColor">
                    <path d="M9.5 5.5c-.8 0-1.5.2-2 .6-.6.4-1 1-1.2 1.7h-.1l.2-2.1H4v11.6h2.6v-6c0-.8.2-1.5.6-2 .4-.5 1-.7 1.6-.7.5 0 .9.2 1.2.5.3.3.4.8.4 1.4v6.8h2.6v-7.2c0-1.2-.3-2.2-.9-2.8-.6-.6-1.4-.9-2.6-.9zm14.9 0c-1.4 0-2.5.5-3.3 1.4-.8.9-1.2 2.2-1.2 3.7 0 1.6.4 2.8 1.2 3.7.8.9 1.9 1.3 3.3 1.3 1.4 0 2.5-.4 3.3-1.3.8-.9 1.2-2.1 1.2-3.7 0-1.5-.4-2.8-1.2-3.7-.8-.9-1.9-1.4-3.3-1.4zm0 2.1c.7 0 1.2.3 1.6.8.4.5.5 1.3.5 2.2 0 1-.2 1.7-.5 2.2-.4.5-.9.8-1.6.8-.7 0-1.2-.3-1.6-.8-.4-.5-.5-1.3-.5-2.2 0-.9.2-1.7.5-2.2.4-.5.9-.8 1.6-.8zM37 17.3h2.6v-6c0-.8.2-1.5.6-2 .4-.5 1-.7 1.6-.7.5 0 .9.2 1.2.5.3.3.4.8.4 1.4v6.8H46v-7.2c0-1.2-.3-2.2-.9-2.8-.6-.6-1.4-.9-2.6-.9-.8 0-1.5.2-2 .6-.6.4-1 1-1.2 1.7h-.1V5.7H37v11.6z"/>
                  </svg>
                  <span className="ml-1 font-medium">Pay</span>
                </div>
                <div className="flex-1 border border-neutral-300 py-3 rounded-lg flex items-center justify-center">
                  <svg className="h-5" viewBox="0 0 50 20" fill="none">
                    <path d="M23.8 10.2l4.5-9.5h-2.7l-2.7 6.2-1.1-6.2h-2.7l2.2 9.5h2.5z" fill="#5F6368"/>
                    <path d="M11.5.7L8 10.2h2.5l.6-1.7h3.3l.6 1.7h2.6L14 .7h-2.5zm.3 6l1-3 1 3h-2z" fill="#5F6368"/>
                    <path d="M28.8 10.2h2.4V.7h-2.4v9.5z" fill="#5F6368"/>
                    <path d="M35 .7h-4.4v9.5h2.4V7.3h2c1.9 0 3.2-1.3 3.2-3.3S36.9.7 35 .7zm-.1 4.8h-1.9V2.5h1.9c.9 0 1.4.5 1.4 1.5s-.5 1.5-1.4 1.5z" fill="#5F6368"/>
                    <circle cx="5" cy="5.5" r="5" fill="#EA4335"/>
                    <circle cx="5" cy="14.5" r="5" fill="#FBBC05"/>
                    <circle cx="41" cy="5.5" r="5" fill="#4285F4"/>
                    <circle cx="41" cy="14.5" r="5" fill="#34A853"/>
                  </svg>
                  <span className="ml-1 font-medium text-neutral-700">Pay</span>
                </div>
              </div>

              {/* Legal Text */}
              <p className="text-xs text-neutral-500 leading-relaxed">
                One or more of the items in your cart is a recurring or deferred purchase.
                By continuing, I agree to the <span className="underline cursor-pointer">CANCELLATION POLICY</span> and
                authorize you to charge my payment method at the prices, frequency and dates listed on
                this page until my order is fulfilled or I cancel, if permitted.
              </p>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}

// Default export for backwards compatibility
export default CartLineItem
