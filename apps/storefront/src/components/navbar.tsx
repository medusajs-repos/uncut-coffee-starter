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
import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { Link, useLocation } from "@tanstack/react-router"

export const Navbar = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""

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

  return (
    <div className="sticky top-0 inset-x-0 z-40">
      <header className="relative h-16 mx-auto border-b bg-white border-zinc-200">
        <nav className="content-container text-sm font-medium text-zinc-600 flex items-center justify-between w-full h-full">
          {/* Desktop Navigation */}
          <NavigationMenu.Root className="hidden lg:flex items-center h-full">
            <NavigationMenu.List className="flex items-center gap-x-6 h-full">
              {/* Shop dropdown */}
              <NavigationMenu.Item className="h-full flex items-center">
                <NavigationMenu.Trigger className="text-zinc-600 hover:text-zinc-500 h-full flex items-center gap-1 select-none">
                  Shop
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="content-container py-12">
                  <div className="grid grid-cols-2 gap-12">
                    <div className="flex flex-col gap-6">
                      <h3 className="text-zinc-900 text-base font-medium uppercase">
                        Categories
                      </h3>
                      <div className="flex flex-col gap-3">
                        {categoryLinks.map((link) => (
                          <NavigationMenu.Link key={link.id} asChild>
                            <Link
                              to={link.to}
                              className="text-zinc-600 hover:text-zinc-500 text-base font-medium transition-colors"
                            >
                              {link.name}
                            </Link>
                          </NavigationMenu.Link>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      {[0, 1].map((i) => (
                        <div
                          key={i}
                          className="aspect-square bg-zinc-50 flex items-center justify-center"
                        >
                          <span className="text-zinc-600 text-sm">
                            Image Placeholder
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            </NavigationMenu.List>

            <NavigationMenu.Viewport
              className="absolute top-full bg-white border-b border-zinc-200 shadow-lg overflow-hidden
                data-[state=open]:animate-[dropdown-open_300ms_ease-out]
                data-[state=closed]:animate-[dropdown-close_300ms_ease-out]"
              style={{ left: "50%", transform: "translateX(-50%)", width: "100vw" }}
            />
          </NavigationMenu.Root>

          {/* Mobile Menu */}
          <Drawer>
            <DrawerTrigger className="lg:hidden text-zinc-600 hover:text-zinc-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </DrawerTrigger>
            <DrawerContent side="left">
              <DrawerHeader>
                <DrawerTitle className="uppercase">Menu</DrawerTitle>
              </DrawerHeader>
              <div className="flex flex-col py-4">
                <div className="px-6 py-4 text-zinc-900 text-lg font-medium">
                  Shop
                </div>
                <div className="flex flex-col">
                  {categoryLinks.map((link) => (
                    <DrawerClose key={link.id} asChild>
                      <Link
                        to={link.to}
                        className="px-10 py-3 text-zinc-600 hover:bg-zinc-50 transition-colors"
                      >
                        {link.name}
                      </Link>
                    </DrawerClose>
                  ))}
                </div>
              </div>
            </DrawerContent>
          </Drawer>

          {/* Logo */}
          <div className="flex items-center h-full absolute left-1/2 transform -translate-x-1/2">
            <Link
              to={baseHref || "/"}
              className="text-xl font-bold hover:text-zinc-600 uppercase"
            >
              Bloom
            </Link>
          </div>

          {/* Cart */}
          <div className="flex items-center gap-x-6 h-full justify-end">
            <CartDropdown />
          </div>
        </nav>
      </header>
    </div>
  )
}
