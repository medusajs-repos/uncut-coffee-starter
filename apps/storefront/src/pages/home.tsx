import { useState } from "react"
import Footer from "@/components/footer"

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
            SINGLE ORIGIN BEANS ROASTED TO PERFECTION.<br />
            RICH, BOLD FLAVOR YOU'LL CRAVE EVERY MORNING.<br />
            SAVOR AT HOME OR TAKE ON THE GO.
          </p>
          <div className="border-t border-dotted border-[#3d2a1a]/30 my-3" />
          <p className="text-black text-sm font-bold uppercase tracking-wider">
            SINGLE ORIGIN ARABICA + MEDIUM ROAST. NOTES OF CHOCOLATE, CITRUS + CARAMEL.
          </p>
          <div className="border-t border-dotted border-[#3d2a1a]/30 my-3" />
          
          <div className="mt-8 space-y-3">
            <label className="flex items-center justify-between p-4 border border-black rounded-lg cursor-pointer h-16" style={{ borderRadius: '8px' }}>
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
                  <span className="w-4 h-4 flex items-center justify-center"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg></span>
                  1 x BAG DELIVERED
                </div>
                
              </div>
              <div className="flex items-center gap-3 text-[14px] font-bold uppercase tracking-wider text-black mt-2">
                <span className="w-4 h-4 flex items-center justify-center"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg></span>
                CANCEL OR PAUSE ANYTIME
              </div>
              <div className="flex items-center gap-3 text-[14px] font-bold uppercase tracking-wider text-black mt-2">
                <span className="w-4 h-4 flex items-center justify-center"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg></span>
                TO-GO CUP ON 2ND ORDER
              </div>
            </label>

            <div className="flex gap-2 mt-4">
              <div className="flex items-center border border-black rounded-lg bg-black h-14">
                <button 
                  type="button"
                  onClick={decreaseQuantity}
                  className="px-4 py-3 text-white flex items-center justify-center cursor-pointer"
                >
                  <span className="w-6 h-6 flex items-center justify-center text-2xl font-light">-</span>
                </button>
                <span className="px-3 py-3 text-white font-bold text-sm">{quantity}</span>
                <button 
                  type="button"
                  onClick={increaseQuantity}
                  className="px-4 py-3 text-white flex items-center justify-center cursor-pointer"
                >
                  <span className="w-6 h-6 flex items-center justify-center text-2xl font-light">+</span>
                </button>
              </div>
              <button className="flex-1 bg-black text-white text-sm uppercase tracking-wider font-bold rounded-lg h-14">
                ADD TO CART
              </button>
            </div>
            
            <p className="text-sm font-bold uppercase tracking-wider text-neutral-400">DUTIES AND TAXES INCLUDED</p>
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
