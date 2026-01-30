// Hero Section
const HERO_VIDEO = "https://cdn.mignite.app/ws/works_01KG7HEF506FB5P7HQP4V3WMR7/I_want_a_202601301447_rbq6u-01KG7JHVRVZ9NBQPZHYMH5XVC8.mp4"

const HeroSection = () => {
  return (
    <section 
      className="relative overflow-hidden"
      style={{ 
        width: '100vw', 
        height: '100vh', 
        marginLeft: 'calc(50% - 50vw)',
        backgroundColor: '#3d2a1a' 
      }}
    >
      <video 
        src={HERO_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: 'center center' }}
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 flex items-end justify-center px-4">
        <h1 className="text-[13.3vw] font-bold text-white uppercase tracking-tighter text-center whitespace-nowrap leading-none pb-4">
          Uncut Coffee
        </h1>
      </div>
    </section>
  )
}

// Main Home Component
const Home = () => {
  return (
    <div className="-mt-[72px]">
      <HeroSection />
    </div>
  )
}

export default Home
