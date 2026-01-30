import CountrySelect from "@/components/country-select"
import { useRegions } from "@/lib/hooks/use-regions"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { Link, useLocation } from "@tanstack/react-router"

const Footer = () => {
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname);
  const baseHref = countryCode ? `/${countryCode}` : "";

  const { data: regions } = useRegions({
    fields: "id, currency_code, *countries",
  });

  return (
    <footer className="bg-white w-full pt-36 pb-16 px-6" data-testid="footer">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-stretch gap-8 leading-none">
        {/* Left side - Link columns */}
        <div className="flex flex-wrap gap-y-4" style={{ gap: '160px' }}>
          {/* Column 1 */}
          <div className="flex flex-col">
            <a href="#" className="text-black text-sm font-medium uppercase tracking-wide hover:opacity-60 transition-opacity">
              Affiliates
            </a>
            <a href="#" className="text-black text-sm font-medium uppercase tracking-wide hover:opacity-60 transition-opacity">
              Clubs
            </a>
            <a href="#" className="text-black text-sm font-medium uppercase tracking-wide hover:opacity-60 transition-opacity">
              AMBASSADORS
            </a>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col">
            <a href="#" className="text-black text-sm font-medium uppercase tracking-wide hover:opacity-60 transition-opacity">
              Contact
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-black text-sm font-medium uppercase tracking-wide hover:opacity-60 transition-opacity">
              Instagram
            </a>
            <a href="#" className="text-black text-sm font-medium uppercase tracking-wide hover:opacity-60 transition-opacity">
              FAQ
            </a>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col">
            <Link
              to={`${baseHref}/account` as any}
              className="text-black text-sm font-medium uppercase tracking-wide hover:opacity-60 transition-opacity"
            >
              Account
            </Link>
            <div className="text-black text-sm font-medium uppercase tracking-wide">
              <CountrySelect regions={regions ?? []} />
            </div>
            <a href="#" className="text-black text-sm font-medium uppercase tracking-wide hover:opacity-60 transition-opacity">
              Privacy and Cookies
            </a>
          </div>
        </div>

        {/* Right side - Copyright */}
        <div className="flex flex-col justify-end">
          <div className="text-black text-sm font-medium uppercase tracking-wide whitespace-nowrap">
            UNCUT COFFEE &copy; Copyright {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
