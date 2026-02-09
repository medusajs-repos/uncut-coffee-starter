import { useState, useEffect, useRef } from "react"
import Footer from "@/components/footer"
import { useAddToCart } from "@/lib/hooks/use-cart"
import { useCartDrawer } from "@/lib/context/cart"
import { sdk } from "@/lib/utils/sdk"
import { HttpTypes } from "@medusajs/types"
import { DEFAULT_CART_DROPDOWN_FIELDS } from "@/components/cart"

// Accordion Component
const AccordionItem = ({ title, children, dotted = false, titleClassName, containerClassName, dotColor }: { title: string; children: React.ReactNode; dotted?: boolean; titleClassName?: string; containerClassName?: string; dotColor?: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className={`border-t ${dotted ? `border-dotted ${dotColor || 'border-neutral-300'}` : 'border-black'}`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={containerClassName || "w-full py-2 flex items-center justify-between text-left cursor-pointer"}
      >
        <span className={titleClassName || "text-[32px] font-bold uppercase tracking-wider text-neutral-400 leading-tight"}>{title}</span>
        <span 
          className="text-black text-xl leading-none transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          {isOpen ? "−" : "+"}
        </span>
      </div>
      <div 
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ 
          maxHeight: isOpen ? '500px' : '0px',
          opacity: isOpen ? 1 : 0
        }}
      >
        <div className="pb-5">
          {children}
        </div>
      </div>
    </div>
  )
}

// Hero Section
const HERO_VIDEO = "https://cdn.mignite.app/ws/works_01KG7HEF506FB5P7HQP4V3WMR7/I_want_a_202601301447_rbq6u-01KG7JHVRVZ9NBQPZHYMH5XVC8.mp4"

const HeroSection = () => {
  return (
    <div 
      className="relative w-screen h-[100dvh] overflow-hidden bg-[#3d2a1a] rounded-b-[16px] z-10"
    >
      <video 
        src={HERO_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        controls={false}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none [&::-webkit-media-controls]:hidden [&::-webkit-media-controls-enclosure]:hidden"
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 flex items-end justify-center">
        <h1 className="text-[13.3vw] font-bold text-white uppercase tracking-tighter text-center whitespace-nowrap leading-none pb-4">
          Uncut Coffee
        </h1>
      </div>
    </div>
  )
}

// Three Column Section
const ThreeColumnSection = () => {
  const [quantity, setQuantity] = useState(1)
  const [purchaseType, setPurchaseType] = useState<"single" | "subscription">("subscription")
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<{
    single: HttpTypes.StoreProduct | null;
    subscription: HttpTypes.StoreProduct | null;
  }>({ single: null, subscription: null })
  const [region, setRegion] = useState<HttpTypes.StoreRegion | null>(null)
  
  const addToCartMutation = useAddToCart({
    fields: DEFAULT_CART_DROPDOWN_FIELDS,
  })
  const { openCart } = useCartDrawer()
  
  // Fetch products and region on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products by handle
        const [singleRes, subRes, regionsRes] = await Promise.all([
          sdk.store.product.list({ handle: "coffee-beans-single", fields: "+variants.prices.*" }),
          sdk.store.product.list({ handle: "coffee-beans-subscription", fields: "+variants.prices.*" }),
          sdk.store.region.list({})
        ])
        
        setProducts({
          single: singleRes.products[0] || null,
          subscription: subRes.products[0] || null
        })
        
        // Find US region or default to first region
        const usRegion = regionsRes.regions.find(r => 
          r.countries?.some(c => c.iso_2 === "us")
        ) || regionsRes.regions[0]
        setRegion(usRegion)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      }
    }
    fetchData()
  }, [])
  
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }
  
  const handleAddToCart = async () => {
    const selectedProduct = purchaseType === "single" ? products.single : products.subscription
    if (!selectedProduct || !selectedProduct.variants?.[0] || !region) return
    
    const variant = selectedProduct.variants[0]
    setIsLoading(true)
    
    try {
      await addToCartMutation.mutateAsync({
        variant_id: variant.id,
        quantity: quantity,
        country_code: "us",
        product: selectedProduct,
        variant: variant,
        region: region,
      })
      openCart()
    } catch (error) {
      console.error("Failed to add to cart:", error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Get prices from products
  const singlePrice = products.single?.variants?.[0]?.calculated_price?.calculated_amount || 37.72
  const subscriptionPrice = products.subscription?.variants?.[0]?.calculated_price?.calculated_amount || 32.06
  
  return (
    <section className="px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-stretch gap-16">
        {/* Left container - Text + Video (66% width) */}
        <div className="hidden md:flex md:w-2/3 gap-16">
          {/* Column 1 - Sticky text */}
          <div className="w-1/2">
            <div className="sticky top-[20vh] h-[60vh] flex items-center">
              <p className="text-neutral-400 text-[32px] uppercase tracking-wider font-bold leading-none text-center">
                UNCUT COFFEE BEANS. NATURE'S ORIGINAL ENERGY SOURCE.
              </p>
            </div>
          </div>
          {/* Column 2 - Sticky video */}
          <div className="w-1/2">
            <div className="sticky top-[20vh] h-[60vh] flex items-center">
              <video 
                src="https://cdn.mignite.app/ws/works_01KG7HEF506FB5P7HQP4V3WMR7/Make_the_bag_202602031440_h6dsd-01KGHRAQFFRH78TT9E2FPA46FV.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
        {/* Column 3 - Scrollable content (33% width) */}
        <div className="md:w-1/3 bg-white flex flex-col">
          <h3 className="text-yellow-900 text-sm font-bold uppercase tracking-wider">beans 350g</h3>
          <div className="border-t border-dotted border-[#3d2a1a]/30 my-3" />
          <p className="text-black text-sm font-bold uppercase tracking-wider leading-relaxed">
            SINGLE ORIGIN BEANS ROASTED TO PERFECTION. RICH, BOLD FLAVOR YOU'LL CRAVE EVERY DAY. SAVOR AT HOME OR TAKE ON THE GO.
          </p>
          <div className="border-t border-dotted border-[#3d2a1a]/30 my-3" />
          <p className="text-black text-sm font-bold uppercase tracking-wider">
            SINGLE ORIGIN ARABICA + MEDIUM ROAST. NOTES OF CHOCOLATE, CITRUS + CARAMEL.
          </p>
          <div className="border-t border-dotted border-[#3d2a1a]/30 mt-3 mb-8" />
          
          <div className="space-y-3">
            <label 
              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer h-[56px] transition-colors ${purchaseType === "single" ? "border-yellow-900 bg-white" : "border-black"}`} 
              style={{ borderRadius: '8px' }}
              onClick={() => setPurchaseType("single")}
            >
              <div className="flex items-center gap-3">
                <input 
                  type="radio" 
                  name="purchase" 
                  checked={purchaseType === "single"}
                  onChange={() => setPurchaseType("single")}
                  className="w-4 h-4 appearance-none border border-black rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[12px] before:h-[12px] before:rounded-full before:bg-yellow-900 before:scale-0 checked:before:scale-100 before:transition-transform"
                />
                <span className="text-black text-sm uppercase tracking-wider font-bold">1 x Bag</span>
              </div>
              <span className="text-black text-sm font-bold">$15.00</span>
            </label>
            
            <label 
              className={`flex flex-col p-4 border rounded-[8px] cursor-pointer text-[14px] transition-colors ${purchaseType === "subscription" ? "border-yellow-900 bg-white" : "border-black"}`}
              onClick={() => setPurchaseType("subscription")}
            >
              <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="purchase" 
                    checked={purchaseType === "subscription"}
                    onChange={() => setPurchaseType("subscription")}
                    className="w-[16px] h-[16px] appearance-none border border-black rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[12px] before:h-[12px] before:rounded-full before:bg-yellow-900 before:scale-0 checked:before:scale-100 before:transition-transform flex-shrink-0"
                  />
                  <span className="text-black text-[14px] uppercase tracking-wider font-bold truncate min-w-0">1 X BOX</span>
                  <div className="flex items-center gap-2 ml-auto flex-shrink-0">
                    <span className="text-neutral-400 text-[14px] font-bold line-through">${singlePrice.toFixed(2)}</span>
                    <span className="text-[#3d2a1a] text-[14px] font-bold">${subscriptionPrice.toFixed(2)}</span>
                  </div>
              </div>
              <div className="border-t border-dotted border-[#3d2a1a]/30 my-3" />
              <div className="flex items-center justify-between text-[14px] font-bold uppercase tracking-wider text-black">
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 flex items-center justify-center"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 6L9 17l-5-5"/></svg></span>
                  TO-GO CUP included
                </div>
                
              </div>

              <div className="flex items-center justify-between text-[14px] font-bold uppercase tracking-wider text-black mt-2">
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 flex items-center justify-center"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 6L9 17l-5-5"/></svg></span>
                  5 x BAGs DELIVERED
                </div>
                
              </div>

              <div className="flex items-center gap-3 text-[14px] font-bold uppercase tracking-wider text-black mt-2">
                <span className="w-4 h-4 flex items-center justify-center"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 6L9 17l-5-5"/></svg></span>
                <span className="text-yellow-900">SAVE 15%</span>
              </div>
            </label>

            <div className="flex gap-2 mt-4">
              <div className="flex items-center border border-black bg-black h-14 hover:bg-neutral-800 transition-colors cursor-pointer" style={{ borderRadius: 8 }}>
                <button 
                  type="button"
                  onClick={decreaseQuantity}
                  className="px-4 py-3 text-white flex items-center justify-center cursor-pointer"
                >
                  <span className="w-[13.5px] h-[13.5px] flex items-center justify-center relative">
                    <span className="absolute w-full h-[1.5px] bg-white"></span>
                  </span>
                </button>
                <span className="px-3 py-3 text-white font-bold text-sm">{quantity}</span>
                <button 
                  type="button"
                  onClick={increaseQuantity}
                  className="px-4 py-3 text-white flex items-center justify-center cursor-pointer"
                >
                  <span className="w-[13.5px] h-[13.5px] flex items-center justify-center relative">
                    <span className="absolute w-full h-[1.5px] bg-white"></span>
                    <span className="absolute w-[1.5px] h-full bg-white"></span>
                  </span>
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                disabled={isLoading || addToCartMutation.isPending}
                className="flex-1 bg-black text-white text-sm uppercase tracking-wider font-bold h-14 hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                style={{ borderRadius: 8 }}
              >
                {isLoading || addToCartMutation.isPending ? "ADDING..." : "ADD TO CART"}
              </button>
            </div>
            
            <p className="text-sm font-bold uppercase tracking-wider text-neutral-400">DUTIES AND TAXES INCLUDED</p>
            
            {/* Accordions */}
            <div className="mt-8 space-y-0">
              <AccordionItem title="INGREDIENTS & NUTRITION" dotted titleClassName="text-[16px] font-bold uppercase tracking-wider text-black leading-tight" containerClassName="w-full py-4 flex items-center justify-between text-left cursor-pointer">
                <div className="text-[14px] text-black font-bold space-y-4">
                  {/* Ingredients intro */}
                  <div className="space-y-1">
                    <p>- 100% ARABICA COFFEE BEANS</p>
                    <p>- SINGLE ORIGIN ETHIOPIAN</p>
                  </div>
                  
                  {/* Nutrition table */}
                  <div>
                    <p className="mb-2">PER 100G</p>
                    <div className="space-y-1">
                      {[
                        { label: "ENERGY (KJ)", value: "12" },
                        { label: "ENERGY (KCAL)", value: "3" },
                        { label: "FAT (G)", value: "0.1" },
                        { label: "OF WHICH SATURATES (G)", value: "0" },
                        { label: "CARBOHYDRATES (G)", value: "0.3" },
                        { label: "OF WHICH SUGARS (G)", value: "0" },
                        { label: "PROTEIN (G)", value: "0.3" },
                        { label: "CAFFEINE (MG)", value: "95" },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between">
                          <span>{item.label}</span>
                          <span>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Ending note */}
                  <p className="uppercase">
                    CONTAINS A VARIETY OF NATURALLY OCCURRING ANTIOXIDANTS AND POLYPHENOLS SUCH AS CHLOROGENIC ACID, QUINIC ACID, AND CAFESTOL.
                  </p>
                </div>
              </AccordionItem>
              <AccordionItem title="SHIPPING" dotted titleClassName="text-[16px] font-bold uppercase tracking-wider text-black leading-tight" containerClassName="w-full py-4 flex items-center justify-between text-left cursor-pointer">
                <p className="text-[14px] text-black font-bold leading-relaxed uppercase">
                  OUR PREMIUM COFFEE BEANS ARE CAREFULLY PACKAGED AND SHIPPED WITHIN 24 HOURS OF ROASTING. FREE SHIPPING ON ALL ORDERS OVER $50. STANDARD DELIVERY TAKES 3-5 BUSINESS DAYS. EXPRESS SHIPPING AVAILABLE FOR NEXT-DAY DELIVERY.
                </p>
              </AccordionItem>
              <AccordionItem title="FAQ" dotted titleClassName="text-[16px] font-bold uppercase tracking-wider text-black leading-tight" containerClassName="w-full py-4 flex items-center justify-between text-left cursor-pointer">
                <p className="text-[14px] text-black font-bold leading-relaxed uppercase">
                  HOW FRESH IS YOUR COFFEE? ALL OUR BEANS ARE ROASTED TO ORDER AND SHIPPED WITHIN 24 HOURS. WHAT GRIND OPTIONS DO YOU OFFER? WE OFFER WHOLE BEAN, ESPRESSO, FILTER, AND FRENCH PRESS GRINDS. HOW SHOULD I STORE MY COFFEE? KEEP IN A COOL, DRY PLACE AWAY FROM DIRECT SUNLIGHT FOR OPTIMAL FRESHNESS.
                </p>
              </AccordionItem>
              <div className="border-t border-dotted border-neutral-300" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Image Scroller Section
const SCROLLER_IMAGES = [
  "https://cdn.mignite.app/ws/works_01KG7HEF506FB5P7HQP4V3WMR7/generated-01KGPQAVEATRSAF62DS7KXH95M-01KGPQAVEA27VFBBM95DE6V6Z3.jpeg",
  "https://cdn.mignite.app/ws/works_01KG7HEF506FB5P7HQP4V3WMR7/generated-01KGPQAWDEFNBBET9N7MHD49AF-01KGPQAWDEE3T9XAN47VVAYC17.jpeg",
  "https://cdn.mignite.app/ws/works_01KG7HEF506FB5P7HQP4V3WMR7/generated-01KGPQAY9QQ2NMCG0XCMZPEN9R-01KGPQAY9QWJD6SR7H3H2CDC6W.jpeg",
  "https://cdn.mignite.app/ws/works_01KG7HEF506FB5P7HQP4V3WMR7/generated-01KGPQAYE1PNDQK0B5WVK6WFRG-01KGPQAYE1ATE9CMGPGGKB3T1M.jpeg",
  "https://cdn.mignite.app/ws/works_01KG7HEF506FB5P7HQP4V3WMR7/generated-01KGPQAYJY4VZ8S4DSVK0V2T59-01KGPQAYJYZD6BQRCR3F640N4Z.jpeg",
]

const ImageScrollerSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const scrollStartX = useRef(0)
  const isResetting = useRef(false)
  const lastMouseX = useRef(0)
  const lastMoveTime = useRef(0)
  const velocity = useRef(0)
  const momentumId = useRef<number | null>(null)

  // Triple the images for seamless infinite scroll
  const tripleImages = [...SCROLLER_IMAGES, ...SCROLLER_IMAGES, ...SCROLLER_IMAGES]

  // Track if initial scroll position has been set
  const [isReady, setIsReady] = useState(false)
  
  // Initialize scroll position to center image 3 (index 2) in the middle set
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return
    
    // Small delay to ensure images have dimensions
    const timer = setTimeout(() => {
      const singleSetWidth = scrollContainer.scrollWidth / 3
      const imageWidth = singleSetWidth / SCROLLER_IMAGES.length
      const containerWidth = scrollContainer.clientWidth
      
      // Start of middle set + offset to image 3 (index 2) + center the image
      const image3Offset = imageWidth * 2 // 2 images before image 3
      const centerOffset = (containerWidth - imageWidth) / 2
      
      scrollContainer.scrollLeft = singleSetWidth + image3Offset - centerOffset
      setIsReady(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  // Handle infinite loop on scroll
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const handleScroll = () => {
      if (isResetting.current) return
      
      const singleSetWidth = scrollContainer.scrollWidth / 3
      const currentScroll = scrollContainer.scrollLeft
      
      // If scrolled past the end of middle set, jump to start of middle set
      if (currentScroll >= singleSetWidth * 2) {
        isResetting.current = true
        scrollContainer.scrollLeft = currentScroll - singleSetWidth
        requestAnimationFrame(() => { isResetting.current = false })
      }
      // If scrolled before the start of middle set, jump to end of middle set
      else if (currentScroll < singleSetWidth * 0.1) {
        isResetting.current = true
        scrollContainer.scrollLeft = currentScroll + singleSetWidth
        requestAnimationFrame(() => { isResetting.current = false })
      }
    }

    scrollContainer.addEventListener('scroll', handleScroll)
    return () => scrollContainer.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-scroll animation
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    let lastTime = 0
    const speed = 0.5 // pixels per frame

    const animate = (currentTime: number) => {
      if (!isHovered && !isDragging && !isResetting.current && momentumId.current === null) {
        const delta = currentTime - lastTime
        if (delta > 16) { // ~60fps
          scrollContainer.scrollLeft += speed
          lastTime = currentTime
        }
      }
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [isHovered, isDragging])

  // Momentum scroll after drag release
  const startMomentum = () => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer || Math.abs(velocity.current) < 0.5) {
      momentumId.current = null
      return
    }

    const friction = 0.95
    
    const animateMomentum = () => {
      if (!scrollContainer || Math.abs(velocity.current) < 0.5) {
        momentumId.current = null
        return
      }
      
      scrollContainer.scrollLeft += velocity.current
      velocity.current *= friction
      
      momentumId.current = requestAnimationFrame(animateMomentum)
    }
    
    momentumId.current = requestAnimationFrame(animateMomentum)
  }

  // Handle drag scrolling
  const handleMouseDown = (e: React.MouseEvent) => {
    // Cancel any ongoing momentum
    if (momentumId.current !== null) {
      cancelAnimationFrame(momentumId.current)
      momentumId.current = null
    }
    
    setIsDragging(true)
    dragStartX.current = e.clientX
    scrollStartX.current = scrollRef.current?.scrollLeft || 0
    lastMouseX.current = e.clientX
    lastMoveTime.current = Date.now()
    velocity.current = 0
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    
    const now = Date.now()
    const dt = now - lastMoveTime.current
    
    if (dt > 0) {
      const dx = lastMouseX.current - e.clientX
      velocity.current = dx / dt * 16 // normalize to ~60fps
    }
    
    lastMouseX.current = e.clientX
    lastMoveTime.current = now
    
    const delta = dragStartX.current - e.clientX
    scrollRef.current.scrollLeft = scrollStartX.current + delta
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    startMomentum()
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    setIsHovered(false)
  }

  return (
    <section className="overflow-hidden py-8">
      <div 
        ref={scrollRef}
        className={`flex gap-6 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Spacer for centering offset */}
        <div className="flex-shrink-0" style={{ width: 'calc((100vw - 72px) / 8)' }} />
        {tripleImages.map((src, index) => (
          <div 
            key={`scroller-${index}`}
            className="flex-shrink-0"
            style={{ width: 'calc((100vw - 72px) / 3.5)' }}
          >
            <div className="relative w-full" style={{ paddingBottom: '125%' }}>
              <img 
                src={src}
                alt={`Coffee lifestyle ${(index % SCROLLER_IMAGES.length) + 1}`}
                className="absolute inset-0 w-full h-full object-cover rounded-2xl pointer-events-none"
                draggable={false}
              />
            </div>
          </div>
        ))}
        {/* Spacer for centering offset */}
        <div className="flex-shrink-0" style={{ width: 'calc((100vw - 72px) / 8)' }} />
      </div>
    </section>
  )
}

// Main Home Component
const Home = () => {
  return (
    <>
      <HeroSection />
      <div className="h-8" />
      <ThreeColumnSection />
      <div className="h-8" />
      <ImageScrollerSection />
      
      {/* Tagline Section */}
      <section className="py-16 px-6">
        <div className="text-center">
          <h2 className="text-[32px] leading-none font-bold tracking-tight uppercase text-neutral-500">
            Raw beans
          </h2>
          <h2 className="text-[32px] leading-none font-bold tracking-tight uppercase text-neutral-400">
            Everything you need,<br />nothing you don't.
          </h2>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="p-8 max-w-[1024px] mx-auto bg-neutral-100 rounded-[16px]">
        <div>
          <AccordionItem title="Single Origin Beans" dotted dotColor="border-neutral-400">
            <p className="text-neutral-600 text-sm leading-relaxed">
              Our beans are sourced from single estates, ensuring consistent flavor profiles and full traceability from farm to cup.
            </p>
          </AccordionItem>
          <AccordionItem title="Freshly Roasted" dotted dotColor="border-neutral-400">
            <p className="text-neutral-600 text-sm leading-relaxed">
              Every batch is roasted to order and shipped within 48 hours, guaranteeing peak freshness and optimal flavor in every cup.
            </p>
          </AccordionItem>
          <AccordionItem title="Ethically Sourced" dotted dotColor="border-neutral-400">
            <p className="text-neutral-600 text-sm leading-relaxed">
              We partner directly with farmers, paying fair prices and supporting sustainable farming practices that benefit communities and the environment.
            </p>
          </AccordionItem>
          <AccordionItem title="Flavor Notes & Profiles" dotted dotColor="border-neutral-400">
            <p className="text-neutral-600 text-sm leading-relaxed">
              From bright and fruity Ethiopian beans to rich, chocolatey Brazilian varieties, explore a world of flavors with detailed tasting notes for each origin.
            </p>
          </AccordionItem>
          <AccordionItem title="Perfect Grind for Every Method" dotted dotColor="border-neutral-400">
            <p className="text-neutral-600 text-sm leading-relaxed">
              Whether you brew with espresso, pour-over, French press, or cold brew, we offer the ideal grind size to extract the best flavors from your beans.
            </p>
          </AccordionItem>
          <div className="border-t border-dotted border-neutral-400" />
        </div>
      </section>
      
      <section id="shop" className="scroll-mt-10" />
      <section id="why-uncut" className="scroll-mt-10" />
      <section id="our-story" className="scroll-mt-10" />
      <Footer />
    </>
  )
}

export default Home
