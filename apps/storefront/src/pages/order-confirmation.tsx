import { OrderDetails } from "@/components/order"
import { useLoaderData } from "@tanstack/react-router"

/**
 * Order Confirmation Page Pattern
 *
 * Demonstrates:
 * - useLoaderData for SSR-loaded order
 * - Displaying order after successful checkout
 * - OrderDetails component for order information
 */
const OrderConfirmation = () => {
  const { order } = useLoaderData({
    from: "/$countryCode/order/$orderId/confirmed",
  })

  return (
    <div className="content-container py-6">
      <h1 className="text-xl mb-6">Order Confirmed</h1>
      <p className="text-secondary-text mb-6">Thank you for your order!</p>
      <OrderDetails order={order} />
    </div>
  )
}

export default OrderConfirmation
