import ProductPrice from "@/components/product-price"
import { Thumbnail } from "@/components/ui/thumbnail"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { HttpTypes } from "@medusajs/types"
import { Link, useLocation } from "@tanstack/react-router"

interface ProductCardProps {
  product: HttpTypes.StoreProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname);
  const baseHref = countryCode ? `/${countryCode}` : "";

  return (
    <Link
      to={`${baseHref}/products/${product.handle}` as any}
      className="group flex flex-col w-full"
    >
      <div className="sap-card aspect-[3/4] w-full overflow-hidden bg-sap-cream relative">
        <Thumbnail
          thumbnail={product.thumbnail}
          alt={product.title}
          className="absolute inset-0 object-cover object-center w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="mt-4 space-y-1">
        <h3 className="text-base font-medium text-black uppercase tracking-tight group-hover:text-sap-gray transition-colors">
          {product.title}
        </h3>
        <ProductPrice
          product={product}
          variant={product.variants?.[0]}
          className="text-sap-gray"
        />
      </div>
    </Link>
  );
};

export default ProductCard;
