import { useState, useEffect, useRef } from "react"
import Footer from "@/components/footer"
import { useAddToCart } from "@/lib/hooks/use-cart"
import { useCartDrawer } from "@/lib/context/cart"
import { sdk } from "@/lib/utils/sdk"
import { HttpTypes } from "@medusajs/types"
import { DEFAULT_CART_DROPDOWN_FIELDS } from "@/components/cart"

// Accordion Component
const AccordionItem = ({ title, children, dotted = false, titleClassName, containerClassName, dotColor, thinIcon = false, smallThinIcon = false, isOpen: controlledOpen, onToggle, fixedHeight }: { title: string; children: React.ReactNode; dotted?: boolean; titleClassName?: string; containerClassName?: string; dotColor?: string; thinIcon?: boolean; smallThinIcon?: boolean; isOpen?: boolean; onToggle?: () => void; fixedHeight?: number }) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const handleToggle = onToggle || (() => setInternalOpen(!internalOpen))
  
  const ThinPlusIcon = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" stroke="currentColor" strokeWidth="1">
      <line x1={size/2} y1={size*0.167} x2={size/2} y2={size*0.833} />
      <line x1={size*0.167} y1={size/2} x2={size*0.833} y2={size/2} className={`transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
    </svg>
  )
  
  // For fixed height mode (used in FAQ), use simpler height animation
  if (fixedHeight) {
    return (
      <div className={`border-t ${dotted ? `border-dotted ${dotColor || 'border-neutral-400'}` : 'border-black'}`}>
        <div
          onClick={handleToggle}
          className={containerClassName || "w-full py-2 flex items-center justify-between text-left cursor-pointer"}
        >
          <span className={titleClassName || "text-[32px] font-bold uppercase tracking-wider text-neutral-400 leading-tight"}>{title}</span>
          {(thinIcon || smallThinIcon) ? (
            <span className="text-neutral-500 transition-transform duration-300" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
              <ThinPlusIcon size={smallThinIcon ? 16 : 24} />
            </span>
          ) : (
            <span 
              className="text-black text-xl leading-none transition-transform duration-300"
              style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              {isOpen ? "−" : "+"}
            </span>
          )}
        </div>
        <div 
          className="overflow-hidden transition-[height,opacity] duration-300 ease-out"
          style={{ 
            height: isOpen ? fixedHeight : 0,
            opacity: isOpen ? 1 : 0
          }}
        >
          <div className="h-full pb-5 flex flex-col justify-end">
            {children}
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className={`border-t ${dotted ? `border-dotted ${dotColor || 'border-neutral-400'}` : 'border-black'}`}>
      <div
        onClick={handleToggle}
        className={containerClassName || "w-full py-2 flex items-center justify-between text-left cursor-pointer"}
      >
        <span className={titleClassName || "text-[32px] font-bold uppercase tracking-wider text-neutral-400 leading-tight"}>{title}</span>
        {(thinIcon || smallThinIcon) ? (
          <span className="text-neutral-500 transition-transform duration-300" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
            <ThinPlusIcon size={smallThinIcon ? 16 : 24} />
          </span>
        ) : (
          <span 
            className="text-black text-xl leading-none transition-transform duration-300"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            {isOpen ? "−" : "+"}
          </span>
        )}
      </div>
      <div 
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ 
          gridTemplateRows: isOpen ? '1fr' : '0fr'
        }}
      >
        <div className="overflow-hidden">
          <div 
            className={`pb-5 flex flex-col justify-end transition-opacity duration-300 ${isOpen ? 'min-h-[480px] opacity-100' : 'opacity-0'}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// FAQ Section with single-open accordion
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  
  const faqs = [
    { title: "Single Origin Beans", answer: "Our beans are sourced from single estates across the world's most renowned coffee-growing regions. Each origin tells a unique story through its flavor profile, shaped by altitude, soil composition, and traditional processing methods. We maintain direct relationships with our farming partners, visiting estates regularly to ensure quality standards. Full traceability means you can trace every bag back to the exact farm, lot, and harvest date." },
    { title: "Freshly Roasted", answer: "Freshness is everything in specialty coffee. Unlike mass-produced beans that can sit on shelves for months, every batch we roast is done to order and shipped within 48 hours. Our small-batch roasting approach allows us to highlight each origin's unique characteristics. We carefully monitor roast profiles, adjusting time and temperature to bring out the best in every bean. The result is coffee at peak freshness with optimal flavor complexity." },
    { title: "Ethically Sourced", answer: "We believe great coffee should benefit everyone in the supply chain. Our direct trade partnerships mean farmers receive fair compensation that reflects the quality of their work. We pay premiums well above commodity prices, enabling farmers to invest in their communities and sustainable practices. Many of our partners use organic methods, shade-grown cultivation, and water conservation techniques that protect local ecosystems for future generations." },
    { title: "Flavor Notes & Profiles", answer: "Coffee is as complex as wine, with hundreds of aromatic compounds creating unique flavor experiences. Our Ethiopian Yirgacheffe offers bright citrus and floral notes with a tea-like body. Brazilian Santos delivers rich chocolate and nutty sweetness with low acidity. Colombian Supremo balances caramel sweetness with subtle fruit undertones. Each product page includes detailed tasting notes, recommended brew methods, and food pairing suggestions to help you explore." },
    { title: "Perfect Grind for Every Method", answer: "The right grind size is crucial for optimal extraction and flavor. Espresso demands a fine, powdery consistency for proper pressure resistance. Pour-over methods like V60 or Chemex work best with medium-fine grounds. French press requires a coarse grind to prevent over-extraction and sediment. Cold brew needs extra-coarse grounds for its long steeping time. We offer precision grinding for every method, or you can order whole bean to grind fresh at home." },
  ]
  
  return (
    <section id="why-uncut" className="p-8 max-w-[1024px] mx-auto bg-neutral-100 rounded-[16px] scroll-mt-10 mb-16">
      <div>
        {faqs.map((faq, index) => (
          <AccordionItem 
            key={faq.title}
            title={faq.title} 
            dotted 
            dotColor="border-neutral-400" 
            thinIcon
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            fixedHeight={480}
          >
            <p className="text-black text-base font-bold uppercase leading-relaxed max-w-[320px]">
              {faq.answer}
            </p>
          </AccordionItem>
        ))}
        <div className="border-t border-dotted border-neutral-400" />
      </div>
    </section>
  )
}

// How to Enjoy Section
const HOW_TO_ENJOY_IMAGES = {
  morning: "https://cdn.mignite.app/ws/works_01KG7HEF506FB5P7HQP4V3WMR7/generated-01KH0SJXF9B3KVRF3145HX07CZ-01KH0SJXF99XM07CG0470TETK3.jpeg",
  midday: "https://cdn.mignite.app/ws/works_01KG7HEF506FB5P7HQP4V3WMR7/generated-01KH0SJYSHJ0VG2S57JV29SC0A-01KH0SJYSHZGXS9AA1D3Z8P6MH.jpeg",
  afternoon: "https://cdn.mignite.app/ws/works_01KG7HEF506FB5P7HQP4V3WMR7/generated-01KH0SK03PKNSBHH4ZHZKG39BZ-01KH0SK03PAV53BYNMNEA5KDC6.jpeg",
}

const HowToEnjoySection = () => {
  const cards = [
    {
      label: "MORNING",
      image: HOW_TO_ENJOY_IMAGES.morning,
      line1: "START YOUR DAY",
      line2: "WITH A FRESH BREW",
    },
    {
      label: "MIDDAY",
      image: HOW_TO_ENJOY_IMAGES.midday,
      line1: "REFRESH & RECHARGE",
      line2: "DURING YOUR BREAK",
    },
    {
      label: "AFTERNOON",
      image: HOW_TO_ENJOY_IMAGES.afternoon,
      line1: "WIND DOWN",
      line2: "WITH A SMOOTH ESPRESSO",
    },
  ]

  return (
    <section className="py-16 px-6">
      <h2 className="text-[32px] leading-none font-bold tracking-tight uppercase text-neutral-400 text-center mb-24">
        How to Enjoy
      </h2>
      
      <div className="max-w-[1024px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="flex flex-col items-center">
            <span className="text-base font-bold uppercase tracking-wider text-neutral-400 mb-4">
              {card.label}
            </span>
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden">
              <img 
                src={card.image}
                alt={card.label}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-0 right-0 text-center px-4">
                <p className="text-white text-base font-bold uppercase tracking-wide">
                  {card.line1}
                </p>
                <p className="text-white text-base font-bold uppercase tracking-wide">
                  {card.line2}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// Hero Section
const HERO_VIDEO = "https://cdn.mignite.app/ws/works_01KG7HEF506FB5P7HQP4V3WMR7/I_want_a_202601301447_rbq6u-01KG7JHVRVZ9NBQPZHYMH5XVC8.mp4"

const HeroSection = () => {
  return (
    <div 
      id="hero"
      className="relative w-screen h-[100dvh] overflow-hidden bg-[#3d2a1a] rounded-b-[16px] z-10 scroll-mt-10"
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
    <section id="shop" className="px-4 scroll-mt-10">
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
                  <span className="w-4 h-4 flex items-center justify-center text-neutral-500"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 6L9 17l-5-5"/></svg></span>
                  TO-GO CUP included
                </div>
                
              </div>

              <div className="flex items-center justify-between text-[14px] font-bold uppercase tracking-wider text-black mt-2">
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 flex items-center justify-center text-neutral-500"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 6L9 17l-5-5"/></svg></span>
                  5 x BAGs DELIVERED
                </div>
                
              </div>

              <div className="flex items-center gap-3 text-[14px] font-bold uppercase tracking-wider text-black mt-2">
                <span className="w-4 h-4 flex items-center justify-center text-neutral-500"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 6L9 17l-5-5"/></svg></span>
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
              <AccordionItem title="INGREDIENTS & NUTRITION" dotted smallThinIcon titleClassName="text-[16px] font-bold uppercase tracking-wider text-black leading-tight" containerClassName="w-full py-4 flex items-center justify-between text-left cursor-pointer">
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
              <AccordionItem title="SHIPPING" dotted smallThinIcon titleClassName="text-[16px] font-bold uppercase tracking-wider text-black leading-tight" containerClassName="w-full py-4 flex items-center justify-between text-left cursor-pointer">
                <p className="text-[14px] text-black font-bold leading-relaxed uppercase">
                  OUR PREMIUM COFFEE BEANS ARE CAREFULLY PACKAGED AND SHIPPED WITHIN 24 HOURS OF ROASTING. FREE SHIPPING ON ALL ORDERS OVER $50. STANDARD DELIVERY TAKES 3-5 BUSINESS DAYS. EXPRESS SHIPPING AVAILABLE FOR NEXT-DAY DELIVERY.
                </p>
              </AccordionItem>
              <AccordionItem title="FAQ" dotted smallThinIcon titleClassName="text-[16px] font-bold uppercase tracking-wider text-black leading-tight" containerClassName="w-full py-4 flex items-center justify-between text-left cursor-pointer">
                <p className="text-[14px] text-black font-bold leading-relaxed uppercase">
                  HOW FRESH IS YOUR COFFEE? ALL OUR BEANS ARE ROASTED TO ORDER AND SHIPPED WITHIN 24 HOURS. WHAT GRIND OPTIONS DO YOU OFFER? WE OFFER WHOLE BEAN, ESPRESSO, FILTER, AND FRENCH PRESS GRINDS. HOW SHOULD I STORE MY COFFEE? KEEP IN A COOL, DRY PLACE AWAY FROM DIRECT SUNLIGHT FOR OPTIMAL FRESHNESS.
                </p>
              </AccordionItem>
              <div className="border-t border-dotted border-neutral-400" />
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

// Second Scroller Images (Coffee themed)
const SCROLLER_IMAGES_2 = [
  "https://cdn.mignite.app/ws/works_01KG7HEF506FB5P7HQP4V3WMR7/generated-01KH10ET9JNBDGKTZ36XRPWWAP-01KH10ET9JKN802WGBX1AFEKC9.jpeg",
  "https://cdn.mignite.app/ws/works_01KG7HEF506FB5P7HQP4V3WMR7/generated-01KH10EVD5JZH51E2SP0TVS5QH-01KH10EVD6SP3ASPEYBFW35GMQ.jpeg",
  "https://cdn.mignite.app/ws/works_01KG7HEF506FB5P7HQP4V3WMR7/generated-01KH10EWSHDS2NPQ8XZYYB2P34-01KH10EWSH03EWPQ9576JSKP7H.jpeg",
  "https://cdn.mignite.app/ws/works_01KG7HEF506FB5P7HQP4V3WMR7/generated-01KH10EXV39FS0NA11QWJW8RWE-01KH10EXV3X15ARMG2YYVRQS9R.jpeg",
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

// Word Cloud Section
const WordCloudSection = () => {
  const phrases = [
    // Top area (above title)
    { text: "SUNRISE RITUALS", top: "8%", left: "5%", delay: 0 },
    { text: "SINGLE ORIGIN", top: "6%", left: "25%", delay: 0.5 },
    { text: "ROASTED FRESH", top: "12%", left: "45%", delay: 1 },
    { text: "BOLD FLAVOR", top: "8%", left: "70%", delay: 1.5 },
    { text: "MORNING ENERGY", top: "18%", left: "8%", delay: 2 },
    { text: "SLOW MORNINGS,\nRICH COFFEE", top: "16%", left: "78%", delay: 0.3 },
    { text: "THAT FIRST SIP", top: "24%", left: "3%", delay: 0.8 },
    { text: "HAND PICKED\nBEANS", top: "22%", left: "82%", delay: 1.3 },
    // Bottom area (below title)
    { text: "PURE &\nUNCUT", top: "62%", left: "3%", delay: 1.8 },
    { text: "THAT ONE\nMUG", top: "64%", left: "22%", delay: 0.2 },
    { text: "AROMA THAT\nWAKES YOU", top: "60%", left: "75%", delay: 0.7 },
    { text: "FUEL FOR\nYOUR DAY", top: "72%", left: "8%", delay: 1.2 },
    { text: "NO SHORTCUTS", top: "68%", left: "80%", delay: 1.7 },
    { text: "CRAFTED WITH\nINTENTION", top: "78%", left: "25%", delay: 0.4 },
    { text: "THE RIGHT GRIND\nEVERY TIME", top: "74%", left: "55%", delay: 0.9 },
    { text: "EMBRACE THE\nBITTER", top: "82%", left: "70%", delay: 1.4 },
    { text: "BEAN TO CUP.\nNOTHING ELSE.", top: "86%", left: "5%", delay: 1.9 },
    { text: "WARMTH IN\nYOUR HANDS", top: "88%", left: "45%", delay: 0.6 },
  ]

  return (
    <section 
      className="relative w-full overflow-hidden py-8"
      style={{ 
        background: "radial-gradient(ellipse 95% 65% at 50% 50%, rgb(113 63 18 / 0.5) 0%, rgb(113 63 18 / 0.3) 25%, rgb(113 63 18 / 0.15) 50%, rgb(113 63 18 / 0.05) 70%, transparent 85%)",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)"
      }}
    >
      <style>{`
        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
      <div id="our-story" className="relative w-full h-[880px] scroll-mt-20">
        {/* Scattered phrases */}
        {phrases.map((phrase, index) => (
          <span
            key={index}
            className="absolute text-yellow-900 text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-center whitespace-pre-line leading-tight"
            style={{ 
              top: phrase.top, 
              left: phrase.left,
              animation: `floatUpDown 6s ease-in-out infinite`,
              animationDelay: `${phrase.delay}s`
            }}
          >
            {phrase.text}
          </span>
        ))}
        
        {/* Center large text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-[8vw] sm:text-[9vw] md:text-[10vw] font-bold uppercase tracking-tighter text-center leading-none text-white">
            UNCUT COFFEE BEANS
          </h2>
        </div>
      </div>
    </section>
  )
}

// Second Image Scroller Section (scrolls in opposite direction)
const ImageScrollerSection2 = () => {
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
  const tripleImages = [...SCROLLER_IMAGES_2, ...SCROLLER_IMAGES_2, ...SCROLLER_IMAGES_2]

  // Track if initial scroll position has been set
  const [isReady, setIsReady] = useState(false)
  
  // Initialize scroll position to center
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return
    
    const timer = setTimeout(() => {
      const singleSetWidth = scrollContainer.scrollWidth / 3
      const imageWidth = singleSetWidth / SCROLLER_IMAGES_2.length
      const containerWidth = scrollContainer.clientWidth
      
      const image2Offset = imageWidth * 1
      const centerOffset = (containerWidth - imageWidth) / 2
      
      scrollContainer.scrollLeft = singleSetWidth + image2Offset - centerOffset
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
      
      if (currentScroll >= singleSetWidth * 2) {
        isResetting.current = true
        scrollContainer.scrollLeft = currentScroll - singleSetWidth
        requestAnimationFrame(() => { isResetting.current = false })
      }
      else if (currentScroll < singleSetWidth * 0.1) {
        isResetting.current = true
        scrollContainer.scrollLeft = currentScroll + singleSetWidth
        requestAnimationFrame(() => { isResetting.current = false })
      }
    }

    scrollContainer.addEventListener('scroll', handleScroll)
    return () => scrollContainer.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-scroll disabled - manual drag only

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
    if (momentumId.current) {
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
    e.preventDefault()
    const x = e.clientX
    const walk = dragStartX.current - x
    scrollRef.current.scrollLeft = scrollStartX.current + walk
    
    const now = Date.now()
    const dt = now - lastMoveTime.current
    if (dt > 0) {
      velocity.current = (lastMouseX.current - x) / dt * 16
    }
    lastMouseX.current = x
    lastMoveTime.current = now
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      startMomentum()
    }
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false)
      startMomentum()
    }
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
            key={`scroller2-${index}`}
            className="flex-shrink-0"
            style={{ width: 'calc((100vw - 72px) / 3.5)' }}
          >
            <div className="relative w-full" style={{ paddingBottom: '125%' }}>
              <img 
                src={src}
                alt={`Coffee moment ${(index % SCROLLER_IMAGES_2.length) + 1}`}
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

// Hand-drawn SVG graphics for engagement section
const StarburstGraphic = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M100 100 L60 20" strokeLinecap="round" />
    <path d="M100 100 L140 15" strokeLinecap="round" />
    <path d="M100 100 L180 60" strokeLinecap="round" />
    <path d="M100 100 L185 110" strokeLinecap="round" />
    <path d="M100 100 L165 165" strokeLinecap="round" />
    <path d="M100 100 L100 185" strokeLinecap="round" />
    <path d="M100 100 L35 160" strokeLinecap="round" />
    <path d="M100 100 L15 100" strokeLinecap="round" />
    <path d="M100 100 L25 45" strokeLinecap="round" />
  </svg>
)

const OvalsGraphic = () => (
  <svg viewBox="0 0 200 180" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
    <ellipse cx="100" cy="45" rx="70" ry="25" />
    <ellipse cx="100" cy="100" rx="45" ry="18" />
    <ellipse cx="100" cy="150" rx="55" ry="20" />
  </svg>
)

const OrganicBlobGraphic = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M120 20 C160 25, 180 60, 175 100 C172 130, 185 150, 170 175 C150 195, 110 190, 80 180 C50 170, 30 150, 25 120 C20 90, 35 60, 60 40 C85 20, 100 18, 120 20" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Engagement Section (Newsletter, Social, Contact)
const EngagementSection = () => {
  const [email, setEmail] = useState("")
  
  return (
    <section className="py-16 px-8 bg-white">
      <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-8 max-w-7xl mx-auto">
          {/* Newsletter Column */}
          <div className="flex flex-col items-center text-center relative min-h-[320px] w-full md:w-1/3 max-w-[360px]">
            <div className="absolute inset-0 flex items-center justify-center opacity-100 pointer-events-none z-0">
              <div className="w-48 h-48">
                <StarburstGraphic />
              </div>
            </div>
            <div className="relative z-10 flex flex-col items-center h-full">

              <p className="text-[20px] font-bold uppercase tracking-wide text-neutral-500 max-w-[220px] leading-snug mb-auto">
                Join our newsletter for brewing tips, new roasts, exclusive offers, and pure coffee culture.
              </p>
              <div className="flex gap-2 mt-8 w-full max-w-xs">
                <input
                  type="email"
                  placeholder="YOUR EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 h-[56px] bg-neutral-200 text-black text-sm font-bold uppercase tracking-wide placeholder:text-neutral-500 placeholder:font-bold rounded-[8px] outline-none"
                />
                <button className="relative z-20 px-6 h-[56px] bg-black text-white text-sm font-bold uppercase tracking-wide rounded-[8px] hover:bg-neutral-800 transition-colors cursor-pointer">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          {/* Social Column */}
          <div className="flex flex-col items-center text-center relative min-h-[320px] w-full md:w-1/3 max-w-[360px]">
            <div className="absolute inset-0 flex items-center justify-center opacity-100 pointer-events-none z-0">
              <div className="w-48 h-44">
                <OvalsGraphic />
              </div>
            </div>
            <div className="relative z-10 flex flex-col items-center h-full">

              <p className="text-[20px] font-bold uppercase tracking-wide text-neutral-500 leading-snug mb-auto">
                Your Morning Ritual at<br />@UncutCoffee
              </p>
              <button className="relative z-20 mt-8 px-8 h-[56px] bg-black text-white text-sm font-bold uppercase tracking-wide rounded-[8px] hover:bg-neutral-800 transition-colors cursor-pointer">
                Follow Us
              </button>
            </div>
          </div>
          
          {/* Contact Column */}
          <div className="flex flex-col items-center text-center relative min-h-[320px] w-full md:w-1/3 max-w-[360px]">
            <div className="absolute inset-0 flex items-center justify-center opacity-100 pointer-events-none z-0">
              <div className="w-48 h-48 translate-x-8">
                <OrganicBlobGraphic />
              </div>
            </div>
            <div className="relative z-10 flex flex-col items-center h-full">
              <p className="text-xl font-bold text-neutral-500 max-w-[220px] leading-snug mb-auto uppercase">
                Working on something?Cafes, roasters, wholesale... tell us what you're brewing and how we can fuel your vision.
              </p>
              <button className="relative z-20 mt-8 px-8 h-[56px] bg-black text-white text-sm font-bold uppercase tracking-wide rounded-[8px] hover:bg-neutral-800 transition-colors cursor-pointer">
                Contact Us
              </button>
            </div>
          </div>
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
            Raw beans.
          </h2>
          <h2 className="text-[32px] leading-none font-bold tracking-tight uppercase text-neutral-400">
            Everything you need,<br />nothing you don't.
          </h2>
        </div>
      </section>
      
      {/* FAQ Section */}
      <FAQSection />
      
      {/* How to Enjoy Section */}
      <HowToEnjoySection />
      
      {/* Word Cloud Section */}
      <WordCloudSection />
      
      {/* Second Image Scroller */}
      <ImageScrollerSection2 />
      
      {/* Engagement Section */}
      <EngagementSection />
      
      <Footer />
    </>
  )
}

export default Home
