import { CartDropdown } from "@/components/cart"
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

  const navBgClass = isHomepage && !scrolled
    ? "bg-transparent"
    : "bg-white border-b border-uncut-gray-light"

  const textColorClass = isHomepage && !scrolled
    ? "text-white"
    : "text-black"

  return (
    <div className="fixed top-0 inset-x-0 z-50">
      <header className={`relative h-10 mx-auto transition-all duration-300 ${navBgClass}`}>
        <nav className="w-full h-10 px-4 flex items-center justify-between">
          {/* Left: Spacer for balance */}
          <div className="flex items-center gap-6 w-8">
          </div>

          {/* Center: Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link
              to={baseHref || "/"}
              className={`text-xl md:text-2xl font-bold uppercase tracking-tight ${textColorClass} hover:opacity-70 transition-opacity`}
            >
              UNCUT
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
