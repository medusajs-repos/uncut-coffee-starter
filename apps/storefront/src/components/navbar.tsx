import { CartDropdown } from "@/components/cart"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useCategories } from "@/lib/hooks/use-categories"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { Link, useLocation } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Navbar = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""
  const isHomepage = location.pathname === "/" || location.pathname === `/${countryCode}` || location.pathname === `/${countryCode}/`

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const { data: topLevelCategories } = useCategories({
    fields: "id,name,handle,parent_category_id",
    queryParams: { parent_category_id: "null" },
  })

  const categoryLinks = [
    { id: "shop-all", name: "Shop all", to: `${baseHref}/store` },
    ...(topLevelCategories?.map((cat) => ({
      id: cat.id,
      name: cat.name,
      to: `${baseHref}/categories/${cat.handle}`,
    })) ?? []),
  ]

  const navBgClass = isHomepage && !scrolled
    ? "bg-transparent"
    : "bg-white border-b border-sap-gray-light"

  const textColorClass = isHomepage && !scrolled
    ? "text-white"
    : "text-black"

  return (
    <div className="fixed top-0 inset-x-0 z-50">
      <header className={`relative h-10 mx-auto transition-all duration-300 ${navBgClass}`}>
        <nav className="w-full h-10 px-4 flex items-center justify-between">
          {/* Left: Menu trigger */}
          <div className="flex items-center gap-6">
            <Drawer>
              <DrawerTrigger className={`${textColorClass} hover:opacity-70 transition-opacity`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5"
                  />
                </svg>
              </DrawerTrigger>
              <DrawerContent side="left" className="bg-white">
                <DrawerHeader className="border-b border-sap-gray-light">
                  <DrawerTitle className="uppercase text-sm tracking-wide font-medium">Menu</DrawerTitle>
                </DrawerHeader>
                <div className="flex flex-col py-6">
                  <DrawerClose asChild>
                    <Link
                      to={baseHref || "/"}
                      className="px-6 py-3 text-black hover:text-sap-orange transition-colors uppercase text-sm font-medium tracking-wide"
                    >
                      Home
                    </Link>
                  </DrawerClose>
                  <div className="px-6 py-3">
                    <span className="text-sap-gray text-xs uppercase tracking-wider">Shop</span>
                  </div>
                  {categoryLinks.map((link) => (
                    <DrawerClose key={link.id} asChild>
                      <Link
                        to={link.to}
                        className="px-8 py-2 text-black hover:text-sap-orange transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </DrawerClose>
                  ))}
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          {/* Center: Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link
              to={baseHref || "/"}
              className={`text-xl md:text-2xl font-bold uppercase tracking-tight ${textColorClass} hover:opacity-70 transition-opacity`}
            >
              SAP
            </Link>
          </div>

          {/* Right: Cart */}
          <div className="flex items-center gap-4">
            <CartDropdown textColor={textColorClass} />
          </div>
        </nav>
      </header>
    </div>
  )
}
