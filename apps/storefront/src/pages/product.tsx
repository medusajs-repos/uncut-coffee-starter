import ProductActions from "@/components/product-actions"
import { ImageGallery } from "@/components/ui/image-gallery"
import { useLoaderData } from "@tanstack/react-router"
import { useState } from "react"
import { Plus, Minus, CheckCircleSolid } from "@medusajs/icons"

// Accordion Item Component
const AccordionItem = ({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <div className="border-b border-uncut-gray-light">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex justify-between items-center text-left"
      >
        <span className="font-medium uppercase text-sm tracking-wide">{title}</span>
        {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
      </button>
      {isOpen && (
        <div className="pb-4">
          {children}
        </div>
      )}
    </div>
  )
}

const ProductDetails = () => {
  const { product, region } = useLoaderData({
    from: "/$countryCode/products/$handle",
  })

  const benefits = [
    "Made with 100% premium coffee beans",
    "25g fast-acting carbohydrates",
    "Natural electrolytes & minerals",
    "Easy to digest, no stomach issues",
    "Free shipping on orders over $50"
  ]

  return (
    <div className="content-container py-8 md:py-16 pt-24 md:pt-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Left: Image gallery - sticky on desktop */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="uncut-card overflow-hidden">
            <ImageGallery images={product.images || []} />
          </div>
        </div>

        {/* Right: Product info */}
        <div className="flex flex-col gap-6">
          {/* Title */}
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight">
              {product.title}
            </h1>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-uncut-gray text-base leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Benefits */}
          <div className="space-y-3 py-4">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircleSolid className="w-5 h-5 text-uncut-orange flex-shrink-0" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Product Actions (variant selection + add to cart) */}
          <ProductActions product={product} region={region} />

          {/* Accordion sections */}
          <div className="border-t border-uncut-gray-light mt-4">
            <AccordionItem title="Ingredients & Nutrition" defaultOpen>
              <div className="space-y-3 text-sm text-uncut-gray">
                <p><span className="text-black font-medium">Ingredients:</span> 100% Arabica Coffee Beans</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-uncut-cream rounded-lg">
                    <span className="text-2xl font-bold text-black">25g</span>
                    <p className="text-xs uppercase tracking-wide mt-1">Carbohydrates</p>
                  </div>
                  <div className="p-4 bg-uncut-cream rounded-lg">
                    <span className="text-2xl font-bold text-black">50:50</span>
                    <p className="text-xs uppercase tracking-wide mt-1">Glucose:Fructose</p>
                  </div>
                  <div className="p-4 bg-uncut-cream rounded-lg">
                    <span className="text-2xl font-bold text-black">50mg</span>
                    <p className="text-xs uppercase tracking-wide mt-1">Sodium</p>
                  </div>
                  <div className="p-4 bg-uncut-cream rounded-lg">
                    <span className="text-2xl font-bold text-black">95mg</span>
                    <p className="text-xs uppercase tracking-wide mt-1">Potassium</p>
                  </div>
                </div>
              </div>
            </AccordionItem>
            
            <AccordionItem title="How to Use">
              <div className="space-y-4 text-sm text-uncut-gray">
                <div className="flex gap-4">
                  <span className="text-uncut-orange font-bold text-lg">GRIND</span>
                  <p>Grind beans fresh for optimal flavor. Adjust grind size based on your brewing method.</p>
                </div>
                <div className="flex gap-4">
                  <span className="text-uncut-orange font-bold text-lg">BREW</span>
                  <p>Use 1-2 tablespoons per 6oz of water. Water temperature: 195-205F for best extraction.</p>
                </div>
                <div className="flex gap-4">
                  <span className="text-uncut-orange font-bold text-lg">ENJOY</span>
                  <p>Best enjoyed fresh. Can be served hot, iced, or as espresso.</p>
                </div>
              </div>
            </AccordionItem>
            
            <AccordionItem title="Shipping & Returns">
              <div className="space-y-2 text-sm text-uncut-gray">
                <p><span className="text-black font-medium">Free shipping</span> on all orders over $50.</p>
                <p>Standard shipping takes 3-5 business days.</p>
                <p>Not satisfied? We offer a 30-day money-back guarantee.</p>
              </div>
            </AccordionItem>
            
            <AccordionItem title="FAQ">
              <div className="space-y-4 text-sm text-uncut-gray">
                <div>
                  <p className="font-medium text-black mb-1">Is UNCUT coffee organic?</p>
                  <p>Yes! All our beans are certified organic and ethically sourced.</p>
                </div>
                <div>
                  <p className="font-medium text-black mb-1">How much caffeine per cup?</p>
                  <p>Approximately 95mg per 8oz cup, depending on brew strength.</p>
                </div>
                <div>
                  <p className="font-medium text-black mb-1">How should I store the beans?</p>
                  <p>Store in a cool, dry place in an airtight container. Best used within 30 days of roasting.</p>
                </div>
              </div>
            </AccordionItem>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
