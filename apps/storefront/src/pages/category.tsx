import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/lib/hooks/use-products"
import { useLoaderData } from "@tanstack/react-router"

/**
 * Category Page Pattern
 *
 * Demonstrates:
 * - useLoaderData for SSR-loaded category and region
 * - useProducts with category_id filter
 * - Filtering products by category
 */
const Category = () => {
  const { category, region } = useLoaderData({
    from: "/$countryCode/categories/$handle",
  })

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useProducts({
    region_id: region.id,
    query_params: {
      category_id: category?.id ? [category.id] : undefined,
      limit: 12,
    },
  })

  const products = data?.pages.flatMap((page) => page.products) || []

  return (
    <div className="content-container py-6">
      <h1 className="text-xl mb-6">{category?.name || "Category"}</h1>

      {isFetching && products.length === 0 ? (
        <div className="text-zinc-600">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-zinc-600">No products found</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

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

export default Category
