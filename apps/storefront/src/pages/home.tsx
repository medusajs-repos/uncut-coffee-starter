import { useState } from "react"
import Footer from "@/components/footer"

// Accordion Component
const AccordionItem = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="border-t border-dotted border-neutral-300">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left cursor-pointer"
      >
        <span className="text-sm font-bold uppercase tracking-wider">{title}</span>
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
      className="relative w-screen h-[100dvh] overflow-hidden bg-[#3d2a1a] rounded-b-[16px]"
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
  
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }
  
  return (
    <section className="pt-8 pb-0 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
        <div className="min-h-[300px] flex items-center justify-center text-center">
          <p className="text-neutral-400 text-[32px] uppercase tracking-wider font-bold leading-none">
            UNCUT COFFEE BEANS. NATURE'S ORIGINAL ENERGY SOURCE.
          </p>
        </div>
        <div className="overflow-hidden flex items-center">
          <video 
            src="https://cdn.mignite.app/ws/works_01KG7HEF506FB5P7HQP4V3WMR7/Make_the_bag_202602031440_h6dsd-01KGHRAQFFRH78TT9E2FPA46FV.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-auto"
          />
        </div>
        <div className="bg-white min-h-[300px] flex flex-col">
          <h3 className="text-yellow-900 text-sm font-bold uppercase tracking-wider">beans 350g</h3>
          <div className="border-t border-dotted border-[#3d2a1a]/30 my-3" />
          <p className="text-black text-sm font-bold uppercase tracking-wider leading-relaxed">
            SINGLE ORIGIN BEANS ROASTED TO PERFECTION. RICH, BOLD FLAVOR YOU'LL CRAVE EVERY DAY. SAVOR AT HOME OR TAKE ON THE GO.
          </p>
          <div className="border-t border-dotted border-[#3d2a1a]/30 my-3" />
          <p className="text-black text-sm font-bold uppercase tracking-wider">
            SINGLE ORIGIN ARABICA + MEDIUM ROAST. NOTES OF CHOCOLATE, CITRUS + CARAMEL.
          </p>
          <div className="border-t border-dotted border-[#3d2a1a]/30 my-3" />
          
          <div className="mt-8 space-y-3">
            <label className="flex items-center justify-between p-4 border border-black rounded-lg cursor-pointer h-[56px]" style={{ borderRadius: '8px' }}>
              <div className="flex items-center gap-3">
                <input 
                  type="radio" 
                  name="purchase" 
                  className="w-4 h-4 appearance-none border border-black rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[12px] before:h-[12px] before:rounded-full before:bg-yellow-900 before:scale-0 checked:before:scale-100 before:transition-transform"
                />
                <span className="text-black text-sm uppercase tracking-wider font-bold">1 x Bag</span>
              </div>
              <span className="text-black text-sm font-bold">$37.72</span>
            </label>
            
            <label className="flex flex-col p-4 border border-black rounded-[8px] cursor-pointer text-[14px]">
              <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="purchase" 
                    defaultChecked 
                    className="w-[16px] h-[16px] appearance-none border border-black rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[12px] before:h-[12px] before:rounded-full before:bg-yellow-900 before:scale-0 checked:before:scale-100 before:transition-transform flex-shrink-0"
                  />
                  <span className="text-black text-[14px] uppercase tracking-wider font-bold truncate min-w-0">1 X SUBSCRIPTION</span>
                  <div className="flex items-center gap-2 ml-auto flex-shrink-0">
                    <span className="text-neutral-400 text-[14px] font-bold line-through">$37.72</span>
                    <span className="text-[#3d2a1a] text-[14px] font-bold">$32.06</span>
                  </div>
              </div>
              <div className="border-t border-dotted border-[#3d2a1a]/30 my-3" />
              <div className="flex items-center justify-between text-[14px] font-bold uppercase tracking-wider text-black">
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 flex items-center justify-center"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 6L9 17l-5-5"/></svg></span>
                  1 x BAG DELIVERED
                </div>
                
              </div>
              <div className="flex items-center gap-3 text-[14px] font-bold uppercase tracking-wider text-black mt-2">
                <span className="w-4 h-4 flex items-center justify-center"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 6L9 17l-5-5"/></svg></span>
                CANCEL OR PAUSE ANYTIME
              </div>
              <div className="flex items-center gap-3 text-[14px] font-bold uppercase tracking-wider text-black mt-2">
                <span className="w-4 h-4 flex items-center justify-center"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 6L9 17l-5-5"/></svg></span>
                TO-GO CUP ON 2ND ORDER
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
              <button className="flex-1 bg-black text-white text-sm uppercase tracking-wider font-bold h-14 hover:bg-neutral-800 transition-colors cursor-pointer" style={{ borderRadius: 8 }}>
                ADD TO CART
              </button>
            </div>
            
            <p className="text-sm font-bold uppercase tracking-wider text-neutral-400">DUTIES AND TAXES INCLUDED</p>
            
            {/* Accordions */}
            <div className="mt-8 space-y-0">
              <AccordionItem title="INGREDIENTS & NUTRITION">
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
              <AccordionItem title="SHIPPING">
                <p className="text-[14px] text-black font-bold leading-relaxed">
                  Free shipping on all orders over $50. Standard delivery takes 3-5 business days. Express shipping available at checkout for faster delivery.
                </p>
              </AccordionItem>
              <AccordionItem title="FAQ">
                <p className="text-[14px] text-black font-bold leading-relaxed">
                  How should I take this supplement? Take 2 capsules daily with food for best absorption. Can I take this with other supplements? Yes, our formulas are designed to work together safely.
                </p>
              </AccordionItem>
            </div>
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
      <ThreeColumnSection />
      <section id="shop" className="scroll-mt-10" />
      <section id="why-uncut" className="scroll-mt-10" />
      <section id="our-story" className="scroll-mt-10" />
      <Footer />
    </>
  )
}

export default Home
