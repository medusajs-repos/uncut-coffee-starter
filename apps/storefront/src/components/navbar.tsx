import { useState } from "react"
import { useCart } from "@/lib/hooks/use-cart"
import { useCartDrawer } from "@/lib/context/cart"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { XMark } from "@medusajs/icons"
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
  { label: "SHOP", anchor: "#shop" },
  { label: "WHY", anchor: "#why-uncut" },
  { label: "OUR STORY", anchor: "#our-story" },
]

export const Navbar = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""
  const { isOpen, openCart, closeCart } = useCartDrawer()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: cart } = useCart({
    fields: DEFAULT_CART_DROPDOWN_FIELDS,
  })

  const sortedItems = sortCartItems(cart?.items || [])
  const itemCount = sortedItems?.reduce((total, item) => total + item.quantity, 0) || 0

  const textColorClass = "text-white"

  return (
    <>
      {/* Mobile Menu Fullscreen Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col md:hidden">
          <div className="h-10 px-4 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                const element = document.getElementById("hero")
                if (element) {
                  setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth" })
                  }, 100)
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }
              }}
              className="text-base font-bold uppercase tracking-wide text-white hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none"
            >
              UNCUT
            </button>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:opacity-70 transition-opacity cursor-pointer text-base font-bold uppercase tracking-wide"
            >
              CLOSE
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  setMobileMenuOpen(false)
                  const targetId = link.anchor.replace("#", "")
                  const element = document.getElementById(targetId)
                  if (element) {
                    setTimeout(() => {
                      element.scrollIntoView({ behavior: "smooth" })
                    }, 100)
                  }
                }}
                className="text-[40px] font-bold uppercase tracking-wide text-white hover:opacity-70 transition-opacity cursor-pointer leading-tight bg-transparent border-none"
              >
                {link.label}
              </button>
            ))}

          </div>
        </div>
      )}

      <header className="fixed top-0 inset-x-0 z-50 h-10 mix-blend-difference">
          <nav className="w-full h-10 px-4 flex items-center justify-between">
            <button
              onClick={() => {
                const element = document.getElementById("hero")
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" })
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }
              }}
              className={`text-base font-bold uppercase tracking-wide ${textColorClass} hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none`}
            >
              UNCUT
            </button>

            {/* Mobile Menu Button - visible on md and below */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`md:hidden text-base font-bold uppercase tracking-wide ${textColorClass} hover:opacity-70 transition-opacity cursor-pointer`}
            >
              MENU
            </button>

            {/* Desktop Navigation Links - hidden on md and below */}
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={(e) => {
                  e.preventDefault()
                  const targetId = link.anchor.replace("#", "")
                  const element = document.getElementById(targetId)
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" })
                  }
                }}
                className={`hidden md:block text-base font-bold uppercase tracking-wide ${textColorClass} hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none`}
              >
                {link.label}
              </button>
            ))}



            <Drawer open={isOpen} onOpenChange={(open) => (open ? openCart() : closeCart())}>
              <DrawerTrigger asChild>
                <button className={`${textColorClass} hover:opacity-70 transition-opacity text-base font-bold cursor-pointer`}>
                  [ {itemCount} ]
                </button>
              </DrawerTrigger>

              <DrawerContent className="flex flex-col bg-white">
                <DrawerHeader className="">
                  <DrawerTitle className="text-black font-bold text-[32px] uppercase flex items-center gap-3">
                    Cart
                    <span className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-500 text-sm font-medium flex items-center justify-center">
                      {itemCount}
                    </span>
                  </DrawerTitle>
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
          </nav>
        </header>
    </>
  )
}
