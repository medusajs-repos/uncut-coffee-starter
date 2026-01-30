import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/lib/hooks/use-products"
import { useLoaderData } from "@tanstack/react-router"

const Store = () => {
  const { region } = useLoaderData({ from: "/$countryCode/store" })

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useProducts({
    region_id: region.id,
    query_params: { limit: 12 },
  })

  const products = data?.pages.flatMap((page) => page.products) || []

  return (
    <div className="content-container py-12 md:py-16 pt-24 md:pt-28">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">Shop All</h1>
        <p className="text-uncut-gray text-base max-w-lg mx-auto">
          Premium coffee beans roasted to perfection.
        </p>
      </div>

      {isFetching && products.length === 0 ? (
        <div className="text-uncut-gray text-center py-12">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-uncut-gray text-center py-12">No products found</div>
      ) : (
        <>
          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load more */}
          {hasNextPage && (
            <div className="text-center mt-12">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="secondary"
                size="fit"
              >
                {isFetchingNextPage ? "Loading..." : "Load More Products"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Store
