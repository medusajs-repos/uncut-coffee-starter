import ProductActions from "@/components/product-actions"
import { ImageGallery } from "@/components/ui/image-gallery"
import { useLoaderData } from "@tanstack/react-router"

/**
 * Product Page Pattern
 *
 * Demonstrates:
 * - useLoaderData for SSR-loaded product and region
 * - Product data structure (images, variants, options)
 * - ProductActions for variant selection + add to cart
 * - ImageGallery for product images
 *
 * Key interactions:
 * - Variant selection updates price display
 * - Add to cart with optimistic updates
 * - Stock checking per variant
 */
const ProductDetails = () => {
  const { product, region } = useLoaderData({
    from: "/$countryCode/products/$handle",
  })

  return (
    <div className="content-container py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Image gallery */}
        <div>
          <ImageGallery images={product.images || []} />
        </div>

        {/* Right: Product info + variant selection */}
        <div>
          <h1 className="text-2xl font-medium mb-2">{product.title}</h1>
          {product.description && (
            <p className="text-secondary-text mb-6">{product.description}</p>
          )}
          <ProductActions product={product} region={region} />
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
