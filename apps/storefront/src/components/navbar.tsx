import { useCart } from "@/lib/hooks/use-cart"
import { useCartDrawer } from "@/lib/context/cart"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { UserCircleSolid } from "@medusajs/icons"
import { Link, useLocation } from "@tanstack/react-router"

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer"
import { CartLineItem, DEFAULT_CART_DROPDOWN_FIELDS } from "@/components/cart"
import { sortCartItems } from "@/lib/utils/cart"
import { Price } from "@/components/ui/price"

const NAV_LINKS = [
  { label: "SHOP", href: "/" },
  { label: "WHY UNCUT", href: "/why-uncut" },
  { label: "OUR STORY", href: "/our-story" },
]

export const Navbar = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""
  const { isOpen, openCart, closeCart } = useCartDrawer()
  const { data: cart } = useCart({
    fields: DEFAULT_CART_DROPDOWN_FIELDS,
  })

  const sortedItems = sortCartItems(cart?.items || [])
  const itemCount = sortedItems?.reduce((total, item) => total + item.quantity, 0) || 0

  const textColorClass = "text-white"

  return (
    <div className="fixed top-0 inset-x-0 z-50">
      <header className="relative h-10 mx-auto bg-transparent">
        <nav className="w-full h-10 px-4 flex items-center justify-between mix-blend-difference">
          <Link
            to={baseHref || "/"}
            className={`text-base font-medium uppercase tracking-wide ${textColorClass} hover:opacity-70 transition-opacity cursor-pointer`}
          >
            UNCUT
          </Link>

          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={`${baseHref}${link.href}` as any}
              className={`text-base font-medium uppercase tracking-wide ${textColorClass} hover:opacity-70 transition-opacity cursor-pointer`}
            >
              {link.label}
            </Link>
          ))}

          <div className="flex items-center gap-4">
            <button className={`${textColorClass} hover:opacity-70 transition-opacity cursor-pointer`}>
              <UserCircleSolid className="w-4 h-4" />
            </button>

            <Drawer open={isOpen} onOpenChange={(open) => (open ? openCart() : closeCart())}>
              <DrawerTrigger asChild>
                <button className={`${textColorClass} hover:opacity-70 transition-opacity text-base font-medium cursor-pointer`}>
                  {itemCount}
                </button>
              </DrawerTrigger>

              <DrawerContent className="flex flex-col bg-white">
                <DrawerHeader className="border-b border-uncut-gray-light">
                  <DrawerTitle className="uppercase text-sm tracking-wide font-medium">Your Cart</DrawerTitle>
                </DrawerHeader>

                {/* Empty Cart */}
                {(!cart || itemCount === 0) && (
                  <div className="flex flex-col items-center justify-center flex-1 p-8">
                    <span className="text-uncut-gray text-base mb-6">
                      Your cart is empty
                    </span>
                    <Link to={`${baseHref}/` as any} onClick={closeCart}>
                      <button className="uncut-button-outline cursor-pointer">
                        Continue Shopping
                      </button>
                    </Link>
                  </div>
                )}

                {/* Cart Items */}
                {cart && itemCount > 0 && (
                  <>
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
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

                    <DrawerFooter className="border-t border-uncut-gray-light">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm uppercase tracking-wide text-uncut-gray">Subtotal</span>
                        <Price price={cart.item_subtotal} currencyCode={cart.currency_code} textWeight="plus" />
                      </div>

                      <Link to={`${baseHref}/cart` as any} onClick={closeCart} className="block">
                        <button className="uncut-button w-full cursor-pointer">
                          View Cart & Checkout
                        </button>
                      </Link>
                    </DrawerFooter>
                  </>
                )}
              </DrawerContent>
            </Drawer>
          </div>
        </nav>
      </header>
    </div>
  )
}
