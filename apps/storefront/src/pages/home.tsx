import Footer from "@/components/footer"

// Hero Section
const HERO_VIDEO = "https://cdn.mignite.app/ws/works_01KG7HEF506FB5P7HQP4V3WMR7/I_want_a_202601301447_rbq6u-01KG7JHVRVZ9NBQPZHYMH5XVC8.mp4"

const HeroSection = () => {
  return (
    <div 
      className="relative w-screen h-[100dvh] overflow-hidden bg-[#3d2a1a]"
    >
      <video 
        src={HERO_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
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

// Main Home Component
const Home = () => {
  return (
    <>
      <HeroSection />
      <Footer />
    </>
  )
}

export default Home
