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
      limit: 3,
    },
  });

  const { data: regions } = useRegions({
    fields: "id, currency_code, *countries",
  });

  return (
    <footer
      className="bg-zinc-50 border-t border-zinc-300 w-full"
      data-testid="footer"
    >
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-12 lg:flex-row items-start justify-between py-16">
          <div className="lg:w-1/3 flex flex-col gap-y-4">
            <Link
              to={baseHref || "/"}
              className="text-xl font-bold text-zinc-900 hover:text-zinc-600 transition-colors w-fit"
            >
              Bloom
            </Link>
            <p className="text-zinc-600 max-w-md text-base font-medium">
              Build Medusa based ecommerce stores with AI.
            </p>
            <CountrySelect regions={regions ?? []} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
            {categories && categories.length > 0 ? (
              <FooterColumn
                title="Categories"
                links={categories.map((category) => ({
                  name: category.name,
                  url: `${baseHref}/categories/${category.handle}`,
                  isExternal: false,
                }))}
              />
            ) : (
              <div className="flex flex-col gap-y-4">
                <h3 className="text-zinc-900 text-sm font-medium uppercase tracking-wide">
                  Categories
                </h3>
                <p className="text-sm text-zinc-600">No categories</p>
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-zinc-300 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-xs text-zinc-600">
              © {new Date().getFullYear()} Bloom. All rights reserved.
            </span>
            <div className="flex gap-6">
              <Link
                className="text-xs text-zinc-600 hover:text-zinc-500 transition-colors"
                to={"/"}
              >
                Privacy Policy
              </Link>
              <Link
                className="text-xs text-zinc-600 hover:text-zinc-500 transition-colors"
                to={"/"}
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({
  title,
  links,
}: {
  title: string;
  links: {
    name: string;
    url: string;
    isExternal: boolean;
  }[];
}) => {
  return (
    <div className="flex flex-col gap-y-4">
      <h3 className="text-zinc-900 text-sm font-medium uppercase tracking-wide">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.url} className="text-sm">
            {link.isExternal ? (
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-600 hover:text-zinc-500 transition-colors"
              >
                {link.name}
              </a>
            ) : (
              <Link
                to={link.url}
                className="text-zinc-600 hover:text-zinc-500 transition-colors"
              >
                {link.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Footer;
