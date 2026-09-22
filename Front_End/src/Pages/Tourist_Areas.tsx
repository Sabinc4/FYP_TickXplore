import { useNavigate } from "react-router-dom";
import { FaTicketAlt, FaMountain, FaArrowDown } from "react-icons/fa";
import Reveal from "../Component/Reveal";
import TouristVisit from "../Component/TouristVisit";
import DestinationShowcase from "../Component/DestinationShowcase";
import TravelExperiences from "../Component/TravelExperiences";
import TravelTips from "../Component/TravelTips";
import TouristCTA from "../Component/TouristCTA";
import Mustang from "/Pictures/Mustang.jpg";

const Tourist_Areas = () => {
  const navigate = useNavigate();

  const scrollToDestinations = () => {
    document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <section className="relative overflow-hidden">
        <img
          src={Mustang}
          alt="Scenic tourist destination in Nepal"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/70" aria-hidden />

        <Reveal className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-300">
            Discover Nepal
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-4xl md:text-5xl">
            Explore Nepal&apos;s Tourist Destinations
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
            UNESCO heritage parks, Himalayan sunrises, serene lakes and
            timeless villages — find your next adventure and book buses or
            vehicles to get there with ease.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/tickets")}
              className="btn-primary !px-6 !py-3 text-sm sm:text-base"
            >
              <FaTicketAlt /> Find Tickets
            </button>
            <button
              type="button"
              onClick={scrollToDestinations}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/60 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20 sm:text-base"
            >
              <FaArrowDown /> Browse Destinations
            </button>
          </div>
        </Reveal>

        <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs text-white/70 sm:flex">
          <FaMountain /> Travel across Nepal
        </div>
      </section>

      <DestinationShowcase />
      <TravelExperiences />
      <TravelTips />
      <TouristVisit />
      <TouristCTA />
    </>
  );
};

export default Tourist_Areas;