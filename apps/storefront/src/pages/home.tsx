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
  return (
    <section className="py-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
        <div className="min-h-[300px] flex items-center justify-center text-center">
          <p className="text-[#3d2a1a] text-[32px] uppercase tracking-wider font-medium leading-none">
            Not Synthetic. Not Processed.<br />
            Just Beans.<br />
            Nature's Original Energy Source
          </p>
        </div>
        <div className="bg-[#f5f0eb] rounded-lg p-8 min-h-[300px] flex items-center justify-center">
          <span className="text-[#3d2a1a]/40 text-sm uppercase tracking-wider">Column 2</span>
        </div>
        <div className="bg-[#f5f0eb] rounded-lg p-8 min-h-[300px] flex items-center justify-center">
          <span className="text-[#3d2a1a]/40 text-sm uppercase tracking-wider">Column 3</span>
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
