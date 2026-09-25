import type { ReactNode } from "react";

interface AccommodationHeroProps {
  children: ReactNode;
}

const AccommodationHero = ({ children }: AccommodationHeroProps) => (
  <section className="relative overflow-hidden bg-gradient-to-br from-[#E6F2FF] via-[#F2F8FF] to-white">
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600 shadow-sm">
          Bed &amp; Breakfast · Hotels · Villas
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-[2.6rem] md:leading-tight">
          Find Your Perfect Stay
        </h1>
        <p className="mt-3 text-base text-slate-500 sm:text-lg">
          Discover beautiful rooms, hotels, and villas near your favorite
          destinations.
        </p>
      </div>

      {children}
    </div>
  </section>
);

export default AccommodationHero;