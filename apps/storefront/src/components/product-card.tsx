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
      <div className="aspect-[29/34] w-full overflow-hidden bg-zinc-50 relative">
        <Thumbnail
          thumbnail={product.thumbnail}
          alt={product.title}
          className="absolute inset-0 object-cover object-center w-full h-full"
        />
      </div>

      <div className="flex text-base font-medium mt-4 justify-between">
        <span className="text-zinc-900">{product.title}</span>
        <ProductPrice
          product={product}
          variant={product.variants?.[0]}
          className="text-zinc-600"
        />
      </div>
    </Link>
  );
};

export default ProductCard;
