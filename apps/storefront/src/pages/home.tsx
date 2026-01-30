import { Link, useLocation } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { useState } from "react"
import { ChevronDownMini, Plus, Minus, CheckCircleSolid } from "@medusajs/icons"

// Image URLs
const HERO_IMAGE = "https://cdn.mignite.app/ws/works_01KG7HEF506FB5P7HQP4V3WMR7/generated-01KG7HNY1MD2WE973WT7B6VKXA-01KG7HNY1MFKMPT8Z989TAQS31.jpeg"
const PRODUCT_IMAGE = "https://cdn.mignite.app/ws/works_01KG7HEF506FB5P7HQP4V3WMR7/generated-01KG7HNWWYS30ARD5PQSTB3X7B-01KG7HNWWY0QGHN7RSS9E7XK01.jpeg"
const LIFESTYLE_1 = "https://cdn.mignite.app/ws/works_01KG7HEF506FB5P7HQP4V3WMR7/generated-01KG7HNZ4YEJ0D9HD19CPHNMP1-01KG7HNZ4ZHJ3QNXPZ46GA8CWQ.jpeg"
const MAPLE_IMAGE = "https://cdn.mignite.app/ws/works_01KG7HEF506FB5P7HQP4V3WMR7/generated-01KG7HP0BZPYCK47R1YBXR1MDD-01KG7HP0C07GWPPHBEN2T5SQXT.jpeg"
const TEAM_IMAGE = "https://cdn.mignite.app/ws/works_01KG7HEF506FB5P7HQP4V3WMR7/generated-01KG7HP7461YS8CXNBS5TXCGD2-01KG7HP746C278B9WH3H83A2GQ.jpeg"
const FLATLAY_IMAGE = "https://cdn.mignite.app/ws/works_01KG7HEF506FB5P7HQP4V3WMR7/generated-01KG7HP8V4X9EK6B8VMA12QJXS-01KG7HP8V4T1778NW70J2G2Z84.jpeg"
const COMPARISON_IMAGE = "https://cdn.mignite.app/ws/works_01KG7HEF506FB5P7HQP4V3WMR7/generated-01KG7HPA3PJ848QDQVJE24TQCP-01KG7HPA3PJDRETM8JTNYNT8BH.jpeg"
const BLOB_IMAGE = "https://cdn.mignite.app/ws/works_01KG7HEF506FB5P7HQP4V3WMR7/generated-01KG7HPB0J07TQJAB4FRHGA774-01KG7HPB0KE43FXEAGQNYTRNSP.jpeg"

const CAROUSEL_IMAGES = [LIFESTYLE_1, MAPLE_IMAGE, TEAM_IMAGE, FLATLAY_IMAGE, PRODUCT_IMAGE]

// Hero Section
const HERO_VIDEO = "https://cdn.mignite.app/ws/works_01KG7HEF506FB5P7HQP4V3WMR7/I_want_a_202601301447_rbq6u-01KG7JHVRVZ9NBQPZHYMH5XVC8.mp4"

const HeroSection = () => {
  return (
    <section className="relative h-dvh w-full px-1 -mt-[72px]">
      <div className="relative h-full w-full overflow-hidden rounded-b-[16px]">
        <div className="absolute inset-0">
          <video 
            src={HERO_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="absolute inset-0 flex items-end justify-center px-4">
          <h1 className="text-[13.3vw] font-bold text-white uppercase tracking-tighter text-center whitespace-nowrap leading-none pb-4">
            Uncut Coffee
          </h1>
        </div>
      </div>
    </section>
  )
}

// Product Purchase Section
const ProductSection = ({ baseHref }: { baseHref: string }) => {
  const [purchaseType, setPurchaseType] = useState<"single" | "subscription">("subscription")
  
  const benefits = [
    "Made with 100% pure maple sap",
    "25g fast-acting carbohydrates",
    "Natural electrolytes & minerals",
    "Easy to digest, no stomach issues"
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="content-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Product Image */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="sap-card aspect-[3/4] bg-sap-cream">
              <img 
                src={PRODUCT_IMAGE} 
                alt="SAP 25G Energy Packet"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight">SAP 25G</h2>
              <p className="text-sap-gray text-base mt-4 leading-relaxed">
                SAP is a real food alternative to gels. Made from 100% pure maple sap, it delivers 25g of fast-acting carbohydrates with natural electrolytes. Easy on your stomach, delicious in your mouth.
              </p>
            </div>

            {/* Purchase Options */}
            <div className="space-y-3">
              <button
                onClick={() => setPurchaseType("single")}
                className={`w-full p-4 border transition-all duration-200 text-left flex justify-between items-center ${
                  purchaseType === "single" 
                    ? "border-black bg-white" 
                    : "border-sap-gray-light hover:border-sap-gray"
                }`}
                style={{ borderRadius: "7px" }}
              >
                <div>
                  <span className="font-medium uppercase text-sm">1 x Case with 10 SAP</span>
                </div>
                <span className="font-bold">$37.90</span>
              </button>

              <button
                onClick={() => setPurchaseType("subscription")}
                className={`w-full p-4 border transition-all duration-200 text-left flex justify-between items-center ${
                  purchaseType === "subscription" 
                    ? "border-sap-orange bg-sap-light" 
                    : "border-sap-gray-light hover:border-sap-gray"
                }`}
                style={{ borderRadius: "7px" }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium uppercase text-sm">1 x Subscription</span>
                  <span className="text-xs bg-sap-orange text-white px-2 py-0.5 rounded-full">Save 15%</span>
                </div>
                <span className="font-bold">$32.22</span>
              </button>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircleSolid className="w-5 h-5 text-sap-orange flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Add to Cart */}
            <Link 
              to={`${baseHref}/store` as any}
              className="sap-button text-center block"
            >
              Shop Now
            </Link>

            {/* Accordion sections */}
            <div className="border-t border-sap-gray-light">
              <AccordionItem title="Ingredients & Nutrition">
                <div className="space-y-2 text-sm text-sap-gray">
                  <p><strong>Ingredients:</strong> Pure Maple Sap, Sea Salt</p>
                  <p><strong>Carbohydrates:</strong> 25g (50% Glucose, 50% Fructose)</p>
                  <p><strong>Sodium:</strong> 50mg</p>
                  <p><strong>Potassium:</strong> 95mg</p>
                </div>
              </AccordionItem>
              <AccordionItem title="Shipping">
                <p className="text-sm text-sap-gray">Free shipping on orders over $50. Standard shipping takes 3-5 business days.</p>
              </AccordionItem>
              <AccordionItem title="FAQ">
                <div className="space-y-4 text-sm text-sap-gray">
                  <div>
                    <p className="font-medium text-black">How should I use SAP?</p>
                    <p>Take one SAP 20 minutes before exercise and every 20-30 minutes during prolonged activity.</p>
                  </div>
                  <div>
                    <p className="font-medium text-black">Is SAP vegan?</p>
                    <p>Yes! SAP is 100% plant-based and vegan-friendly.</p>
                  </div>
                </div>
              </AccordionItem>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Accordion Item Component
const AccordionItem = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="border-b border-sap-gray-light">
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

// Image Carousel Section
const ImageCarousel = () => {
  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x px-6">
        {CAROUSEL_IMAGES.map((img, idx) => (
          <div key={idx} className="flex-shrink-0 w-[320px] md:w-[400px] snap-start">
            <div className="sap-card aspect-[3/4]">
              <img 
                src={img} 
                alt={`Lifestyle ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// Why SAP Feature Section
const WhySapSection = () => {
  const features = [
    {
      title: "Easy to Digest",
      description: "Unlike synthetic gels, maple sap is a natural food your body knows how to process. No more stomach issues mid-race."
    },
    {
      title: "50:50 Carb Ratio",
      description: "The optimal ratio of glucose to fructose for maximum energy absorption without GI distress."
    },
    {
      title: "Electrolytes & Minerals",
      description: "Naturally occurring sodium, potassium, and trace minerals from the maple tree."
    },
    {
      title: "Quick, Without the Crash",
      description: "Fast-acting energy that sustains. No spike and crash like refined sugars."
    },
    {
      title: "Made from Nature, Not a Lab",
      description: "Just two ingredients: maple sap and sea salt. Nothing artificial, ever."
    }
  ]

  const [openFeature, setOpenFeature] = useState(0)

  return (
    <section className="py-16 md:py-24 bg-sap-cream">
      <div className="content-container">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-medium">
            <span className="text-sap-gray">Maple + Salt:</span>{" "}
            <span className="text-black">Everything you need, nothing you don't.</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          {features.map((feature, idx) => (
            <div key={idx} className="dotted-divider">
              <button
                onClick={() => setOpenFeature(openFeature === idx ? -1 : idx)}
                className="w-full py-6 flex justify-between items-center text-left"
              >
                <span className={`text-lg md:text-xl font-medium transition-colors ${openFeature === idx ? "text-black" : "text-sap-gray"}`}>
                  {feature.title}
                </span>
                <Plus className={`w-5 h-5 transition-transform ${openFeature === idx ? "rotate-45" : ""}`} />
              </button>
              {openFeature === idx && (
                <div className="pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <p className="text-sap-gray">{feature.description}</p>
                  <div className="sap-card aspect-square bg-white">
                    <img 
                      src={MAPLE_IMAGE} 
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// How to Enjoy Section
const HowToEnjoySection = () => {
  const steps = [
    {
      title: "PRE",
      description: "Take 0-20 min before training or race",
      image: LIFESTYLE_1
    },
    {
      title: "DURING",
      description: "Take every 20-30 min during training or race",
      image: TEAM_IMAGE
    },
    {
      title: "POST",
      description: "Enjoy as is or drizzle on your food",
      image: FLATLAY_IMAGE
    }
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="content-container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 uppercase">How to Enjoy</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="sap-card relative aspect-[3/4] group overflow-hidden">
              <img 
                src={step.image} 
                alt={step.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-white/80 uppercase tracking-wide">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Comparison Section
const ComparisonSection = () => {
  const comparisons = [
    { label: "No. Ingredients", natural: "3-5", sap: "2", gels: "10-20" },
    { label: "Digestibility", natural: "Varies", sap: "Excellent", gels: "Poor" },
    { label: "Carb Ratio", natural: "Variable", sap: "50:50", gels: "Variable" },
    { label: "Energy Delivery", natural: "Slow", sap: "Optimal", gels: "Fast spike" },
    { label: "Electrolytes", natural: "Some", sap: "Natural", gels: "Added" },
    { label: "Taste & Texture", natural: "Good", sap: "Delicious", gels: "Artificial" },
  ]

  return (
    <section className="py-16 md:py-24 bg-sap-brown text-white overflow-hidden">
      <div className="content-container">
        <h2 className="text-2xl md:text-3xl font-medium text-center mb-12">
          Training is hard, nutrition shouldn't be.
        </h2>

        <div className="grid grid-cols-3 gap-4 max-w-5xl mx-auto">
          {/* Column Headers */}
          <div className="text-center">
            <div className="sap-card bg-black aspect-square mb-4 flex items-center justify-center">
              <span className="text-sap-gray-text text-sm uppercase">Honey/Banana/Dates</span>
            </div>
          </div>
          <div className="text-center">
            <div className="sap-card bg-sap-light aspect-square mb-4 overflow-hidden">
              <img src={PRODUCT_IMAGE} alt="SAP" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="text-center">
            <div className="sap-card bg-black aspect-square mb-4 flex items-center justify-center">
              <span className="text-sap-gray-text text-sm uppercase">Gels</span>
            </div>
          </div>

          {/* Comparison Rows */}
          {comparisons.map((row, idx) => (
            <div key={idx} className="contents">
              <div className="py-3 text-center text-sap-gray-text text-sm border-t border-sap-gray-text/20">
                {row.natural}
              </div>
              <div className="py-3 text-center text-white text-sm font-medium border-t border-sap-gray-text/20">
                {row.sap}
              </div>
              <div className="py-3 text-center text-sap-gray-text text-sm border-t border-sap-gray-text/20">
                {row.gels}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Brand Story Section
const BrandStorySection = () => {
  return (
    <section className="py-24 md:py-32">
      <div className="content-container">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sap-gray text-lg md:text-xl leading-relaxed mb-8">
            <span className="text-black font-medium">We had a problem.</span> Tired of forcing down gels that upset our stomachs. Natural alternatives weren't effective. <span className="text-black font-medium">So we created fuel that actually works.</span>
          </p>
          
          <div className="sap-card aspect-video my-12 overflow-hidden">
            <img 
              src={MAPLE_IMAGE} 
              alt="Maple syrup pouring"
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-2xl md:text-3xl font-medium leading-snug">
            SAP Good Energy fuels your good energy. Made from nature, for athletes who refuse to compromise.
          </p>

          <button className="sap-button mt-8">
            Read the full story
          </button>
        </div>
      </div>
    </section>
  )
}

// Good Energy Cloud Section
const GoodEnergyCloudSection = () => {
  const words = [
    "Making friends at 6am",
    "Chasing progress",
    "Training more, getting hurt less",
    "Finding flow",
    "Early mornings",
    "Long runs",
    "Mountain views",
    "Personal records",
    "Community",
    "Recovery days",
    "Summit pushes",
    "Trail magic",
    "Good vibes",
    "Natural fuel"
  ]

  return (
    <section className="relative py-32 md:py-48 overflow-hidden">
      {/* Background blob */}
      <div className="absolute inset-0 opacity-30">
        <img 
          src={BLOB_IMAGE} 
          alt=""
          className="w-full h-full object-cover blur-3xl"
        />
      </div>

      {/* Floating words */}
      <div className="relative content-container">
        <div className="text-center">
          <span className="text-6xl md:text-8xl font-bold uppercase tracking-tighter text-black/10">
            SAP GOOD ENERGY
          </span>
        </div>
        
        <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-4 md:gap-8 p-8">
          {words.map((word, idx) => (
            <span 
              key={idx}
              className="text-sap-gray-light text-sm md:text-base uppercase tracking-wide"
              style={{
                animation: `float ${6 + (idx % 3)}s ease-in-out infinite`,
                animationDelay: `${idx * 0.3}s`
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// Social Proof Carousel
const SocialProofCarousel = () => {
  const images = [...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES.slice(0, 3)]
  
  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x px-6">
        {images.map((img, idx) => (
          <div key={idx} className="flex-shrink-0 w-[280px] md:w-[360px] snap-start">
            <div className="sap-card aspect-[3/4]">
              <img 
                src={img} 
                alt={`Community ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// Newsletter Section
const NewsletterSection = ({ baseHref }: { baseHref: string }) => {
  const [email, setEmail] = useState("")

  return (
    <section className="py-24 md:py-32">
      <div className="content-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Newsletter signup */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold uppercase mb-4">Good Energy Club</h3>
            <p className="text-sap-gray text-sm mb-6">
              Join our newsletter for pancake parties, training tips and trips, merch, and more good energy.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL"
                className="flex-1 px-4 py-3 border border-sap-gray-light text-sm uppercase placeholder:text-sap-gray"
                style={{ borderRadius: "9px" }}
              />
              <button className="sap-button px-6">Subscribe</button>
            </div>
          </div>

          {/* Social */}
          <div className="text-center">
            <h3 className="text-xl font-bold uppercase mb-4">@SAPGOODENERGY</h3>
            <p className="text-sap-gray text-sm mb-6">
              Follow us for daily inspiration and community stories.
            </p>
            <button className="sap-button-outline">Follow us</button>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right">
            <h3 className="text-xl font-bold uppercase mb-4">Work with us</h3>
            <p className="text-sap-gray text-sm mb-6">
              Working on something? Goals, races, clubs, cafes... Let's chat.
            </p>
            <button className="sap-button-outline">Contact us</button>
          </div>
        </div>
      </div>
    </section>
  )
}

// Main Home Component
const Home = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""

  return (
    <div className="-mt-16"> {/* Offset for transparent nav */}
      <HeroSection />
      <ProductSection baseHref={baseHref} />
      <ImageCarousel />
      <WhySapSection />
      <HowToEnjoySection />
      <ComparisonSection />
      <BrandStorySection />
      <GoodEnergyCloudSection />
      <SocialProofCarousel />
      <NewsletterSection baseHref={baseHref} />
    </div>
  )
}

export default Home
