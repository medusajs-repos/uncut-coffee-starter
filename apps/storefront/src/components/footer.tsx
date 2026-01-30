import CountrySelect from "@/components/country-select"
import { useCategories } from "@/lib/hooks/use-categories"
import { useRegions } from "@/lib/hooks/use-regions"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { Link, useLocation } from "@tanstack/react-router"

const Footer = () => {
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname);
  const baseHref = countryCode ? `/${countryCode}` : "";

  const { data: categories } = useCategories({
    fields: "name,handle",
    queryParams: {
      parent_category_id: "null",
      limit: 5,
    },
  });

  const { data: regions } = useRegions({
    fields: "id, currency_code, *countries",
  });

  const footerLinks = [
    { name: "Shop All", url: `${baseHref}/store` },
    { name: "About", url: "#" },
    { name: "FAQ", url: "#" },
    { name: "Contact", url: "#" },
  ]

  return (
    <footer className="bg-white border-t border-sap-gray-light w-full" data-testid="footer">
      <div className="content-container py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link
              to={baseHref || "/"}
              className="text-2xl font-bold text-black uppercase tracking-tight hover:opacity-70 transition-opacity"
            >
              SAP
            </Link>
            <p className="text-sap-gray text-sm mt-4 leading-relaxed">
              Nature's perfect endurance fuel. Made from 100% pure maple sap.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-black text-xs font-medium uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to={`${baseHref}/store` as any}
                  className="text-sap-gray text-sm hover:text-black transition-colors"
                >
                  All Products
                </Link>
              </li>
              {categories?.map((category) => (
                <li key={category.handle}>
                  <Link
                    to={`${baseHref}/categories/${category.handle}` as any}
                    className="text-sap-gray text-sm hover:text-black transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-black text-xs font-medium uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sap-gray text-sm hover:text-black transition-colors">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="text-sap-gray text-sm hover:text-black transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-sap-gray text-sm hover:text-black transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-sap-gray text-sm hover:text-black transition-colors">
                  Wholesale
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-black text-xs font-medium uppercase tracking-wider mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-sap-gray text-sm hover:text-black transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-sap-gray text-sm hover:text-black transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a 
                  href="https://strava.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-sap-gray text-sm hover:text-black transition-colors"
                >
                  Strava Club
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <CountrySelect regions={regions ?? []} />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-sap-gray-light mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-sap-gray text-xs">
              {new Date().getFullYear()} SAP Good Energy. All rights reserved.
            </span>
            <div className="flex gap-6">
              <a href="#" className="text-sap-gray text-xs hover:text-black transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sap-gray text-xs hover:text-black transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sap-gray text-xs hover:text-black transition-colors">
                Shipping
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
