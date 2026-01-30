import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/lib/hooks/use-products"
import { useLoaderData } from "@tanstack/react-router"

/**
 * Store Page Pattern
 *
 * Demonstrates:
 * - useLoaderData for SSR-loaded region
 * - useProducts hook with region_id for pricing
 * - Infinite scroll / pagination pattern
 * - Rendering product cards with region context
 */
const Store = () => {
  const { region } = useLoaderData({ from: "/$countryCode/store" })

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useProducts({
    region_id: region.id,
    query_params: { limit: 12 },
  })

  const products = data?.pages.flatMap((page) => page.products) || []

  return (
    <div className="content-container py-6">
      <h1 className="text-xl mb-6">All Products</h1>

      {isFetching && products.length === 0 ? (
        <div className="text-zinc-600">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-zinc-600">No products found</div>
      ) : (
        <>
          {/* Product grid - minimal styling, AI agent will customize */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load more pattern */}
          {hasNextPage && (
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              variant="secondary"
              className="mt-6"
            >
              {isFetchingNextPage ? "Loading..." : "Load More"}
            </Button>
          )}
        </>
      )}
    </div>
  )
}

export default Store
