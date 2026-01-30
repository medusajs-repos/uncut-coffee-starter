import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/lib/hooks/use-products"
import { useLoaderData } from "@tanstack/react-router"

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
    <div className="content-container py-12 pt-24 md:pt-28">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
          {category?.name || "Category"}
        </h1>
        {category?.description && (
          <p className="text-sap-gray text-base max-w-lg mx-auto">
            {category.description}
          </p>
        )}
      </div>

      {isFetching && products.length === 0 ? (
        <div className="text-sap-gray text-center py-12">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-sap-gray text-center py-12">No products found in this category</div>
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

export default Category
