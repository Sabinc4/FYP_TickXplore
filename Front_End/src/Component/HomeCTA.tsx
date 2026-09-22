import { useNavigate } from "react-router-dom";
import { FaTicketAlt, FaMountain } from "react-icons/fa";
import Reveal from "./Reveal";

const HomeCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <Reveal>
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl shadow-card-lg">
        <img
          src="/Pictures/Mustang.jpg"
          alt="Scenic Nepalese journey"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/70" aria-hidden />

        <div className="relative z-10 flex flex-col items-center justify-center px-6 py-16 text-center sm:py-20">
          <h2 className="max-w-2xl text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">
            Your Next Adventure Starts Here
          </h2>
          <p className="mt-4 max-w-xl text-sm text-slate-200 sm:text-base">
            Book tickets for buses and vehicles across Nepal in minutes, explore
            breathtaking destinations, and travel with complete peace of mind.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/tickets")}
              className="btn-primary !py-3 !px-6 text-sm sm:text-base"
            >
              <FaTicketAlt /> Find Tickets
            </button>
            <button
              type="button"
              onClick={() => navigate("/tourist-areas")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/60 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20 sm:text-base"
            >
              <FaMountain /> Explore Tourist Areas
            </button>
          </div>
        </div>
      </div>
      </Reveal>
    </section>
  );
};

export default HomeCTA;