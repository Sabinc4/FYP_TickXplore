import { useNavigate } from "react-router-dom";
import { FaTicketAlt } from "react-icons/fa";
import BusTickets from "/Pictures/Bus_Tickets.jpg";
import Reveal from "./Reveal";

const TouristCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="px-4 pb-16 pt-4 sm:px-6 lg:px-8">
      <Reveal>
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl shadow-card-lg">
          <img
            src={BusTickets}
            alt="Book your journey"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/70" aria-hidden />

          <div className="relative z-10 flex flex-col items-center justify-center px-6 py-16 text-center sm:py-20">
            <h2 className="max-w-2xl text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">
              Ready to Explore Nepal?
            </h2>
            <p className="mt-4 max-w-xl text-sm text-slate-200 sm:text-base">
              Search buses and vehicles for any destination, compare prices and
              book your seat in minutes.
            </p>
            <button
              type="button"
              onClick={() => navigate("/tickets")}
              className="btn-primary !px-6 !py-3 mt-8 text-sm sm:text-base"
            >
              <FaTicketAlt /> Find Tickets
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default TouristCTA;