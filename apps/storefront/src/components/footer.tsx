import CountrySelect from "@/components/country-select"
import { useRegions } from "@/lib/hooks/use-regions"
import { useLocation } from "@tanstack/react-router"

const Footer = () => {
  const location = useLocation();

  const { data: regions } = useRegions({
    fields: "id, currency_code, *countries",
  });

  return (
    <footer className="bg-white w-full pt-36 pb-16 px-6 font-bold" data-testid="footer">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-stretch gap-8 leading-none">
        {/* Left side - Link columns */}
        <div className="flex flex-row gap-8 md:gap-40 flex-wrap">
          {/* Column 1 */}
          <div className="flex flex-col">
            <span className="text-black text-sm font-bold uppercase tracking-wide hover:opacity-60 transition-opacity cursor-pointer">
              Affiliates
            </span>
            <span className="text-black text-sm font-bold uppercase tracking-wide hover:opacity-60 transition-opacity cursor-pointer">
              Clubs
            </span>
            <span className="text-black text-sm font-bold uppercase tracking-wide hover:opacity-60 transition-opacity cursor-pointer">
              AMBASSADORS
            </span>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col">
            <span className="text-black text-sm font-bold uppercase tracking-wide hover:opacity-60 transition-opacity cursor-pointer">
              Contact
            </span>
            <span className="text-black text-sm font-bold uppercase tracking-wide hover:opacity-60 transition-opacity cursor-pointer">
              Instagram
            </span>
            <span className="text-black text-sm font-bold uppercase tracking-wide hover:opacity-60 transition-opacity cursor-pointer">
              FAQ
            </span>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col">
            <span className="text-black text-sm font-bold uppercase tracking-wide hover:opacity-60 transition-opacity cursor-pointer">
              Account
            </span>
            <div className="text-black text-sm font-bold uppercase tracking-wide cursor-pointer">
              <CountrySelect regions={regions ?? []} />
            </div>
            <span className="text-black text-sm font-bold uppercase tracking-wide hover:opacity-60 transition-opacity cursor-pointer">
              Privacy and Cookies
            </span>
          </div>
        </div>

        {/* Right side - Copyright */}
        <div className="flex flex-col justify-end">
          <div className="text-black text-sm font-bold uppercase tracking-wide whitespace-nowrap">
            UNCUT COFFEE &copy; Copyright {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
