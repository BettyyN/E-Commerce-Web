import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface Slide {
  id: number;
  image: string;
  category: string;
  title: string;
  subtitle: string;
  cta: string;
  accent: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "/hero/Grocery & Cooking Essentials.jpg",
    category: "Category Spotlight",
    title: "Grocery & Cooking Essentials",
    subtitle:
      "Stock your shelves with pantry staples, cooking oils, spices, and everything your customers reach for every day.",
    cta: "Browse Products",
    accent: "bg-yellow-400",
  },
  {
    id: 2,
    image: "/hero/Breakfast, Snacks & Beverages.jpg",
    category: "Category Spotlight",
    title: "Breakfast, Snacks & Beverages",
    subtitle:
      "From morning cereals to afternoon snacks and refreshing drinks — wholesale deals built for your business.",
    cta: "Browse Products",
    accent: "bg-orange-400",
  },
  {
    id: 3,
    image: "/hero/Household, Hygiene & Packaging Essentials.jpg",
    category: "Category Spotlight",
    title: "Household, Hygiene & Packaging",
    subtitle:
      "Cleaning supplies, personal care products, and packaging materials at competitive wholesale prices.",
    cta: "Browse Products",
    accent: "bg-emerald-400",
  },
];

const AUTOPLAY_INTERVAL = 5500;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [animating, setAnimating] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (index: number) => {
      if (animating) return;
      setAnimating(true);
      setTimeout(() => setAnimating(false), 600);
      setCurrent((index + slides.length) % slides.length);
    },
    [animating],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  const handleCta = () => {
    const productsSection = document.getElementById("products-section");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={sectionRef}
      className="relative w-full lg:w-[90%] lg:mx-auto h-[50vh] min-h-[340px] md:h-[50vh] md:min-h-[50vh] overflow-hidden shadow-lg group rounded-lg"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((s, index) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out rounded-lg ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={s.image}
            alt={s.title}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />

          {/* Left-to-right gradient so text is readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          <div className="hidden md:block absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Text — left side */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 max-w-xl">
            {/* Category label */}
            <div
              className={`flex items-center gap-2 mb-2 transition-all duration-500 ${
                animating
                  ? "opacity-0 translate-y-2"
                  : "opacity-100 translate-y-0"
              }`}
            >
              <span className={`inline-block w-6 h-0.5 ${s.accent}`} />
              <span className="text-white/70 text-xs tracking-widest uppercase font-medium">
                {s.category}
              </span>
            </div>

            <h2
              className={`text-white text-2xl md:text-4xl font-bold mb-2 drop-shadow-md transition-all duration-500 delay-75 ${
                animating
                  ? "opacity-0 translate-y-3"
                  : "opacity-100 translate-y-0"
              }`}
            >
              {s.title}
            </h2>

            <p
              className={`text-yellow-50/90 text-sm md:text-base mb-5 drop-shadow-sm line-clamp-2 transition-all duration-500 delay-100 ${
                animating
                  ? "opacity-0 translate-y-3"
                  : "opacity-100 translate-y-0"
              }`}
            >
              {s.subtitle}
            </p>

            <div
              className={`transition-all duration-500 delay-150 ${
                animating
                  ? "opacity-0 translate-y-3"
                  : "opacity-100 translate-y-0"
              }`}
            >
              <button
                onClick={handleCta}
                className="group/btn inline-flex items-center gap-2 w-fit bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold px-5 py-2 rounded-full text-sm md:text-base transition-all duration-200 hover:gap-3"
              >
                {s.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Arrow controls */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/60 backdrop-blur-sm text-white hover:text-gray-900 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/60 backdrop-blur-sm text-white hover:text-gray-900 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dot indicators — top right */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current
                ? "w-6 bg-yellow-400"
                : "w-2 bg-white/60 hover:bg-white/90"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
