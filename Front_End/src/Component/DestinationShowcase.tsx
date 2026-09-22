import { useNavigate } from "react-router-dom";
import { FaTicketAlt, FaMapMarkerAlt } from "react-icons/fa";
import Reveal from "./Reveal";

import Chitwan from "/Pictures/Chitwan.jpg";
import Pokhara from "/Pictures/Pokhara.jpeg";
import Poon from "/Pictures/Poon.jpg";
import Nagarkot from "/Pictures/Nagarkot.jpg";
import Ghandruk from "/Pictures/Ghandruk.jpeg";
import Kalinchok from "/Pictures/Kalinchok.jpeg";
import Langtang from "/Pictures/Langtang.jpeg";
import Mustang from "/Pictures/Mustang.jpg";
import Rara from "/Pictures/Rara.jpg";
import SheyPhoksundo from "/Pictures/Shey_Phoksundo.jpeg";
import NamoBuddha from "/Pictures/Namo_Buddha.jpg";

interface Destination {
  image: string;
  title: string;
  tagline: string;
  featured?: boolean;
}

const DESTINATIONS: Destination[] = [
  {
    image: Chitwan,
    title: "Chitwan National Park",
    tagline: "UNESCO World Heritage site with wildlife safari",
    featured: true,
  },
  { image: Poon, title: "Poon Hill", tagline: "Breathtaking sunrise over the Annapurna range" },
  { image: Nagarkot, title: "Nagarkot", tagline: "Panoramic Himalaya views just outside Kathmandu" },
  { image: Mustang, title: "Upper Mustang", tagline: "Tibetan culture, monasteries and desert-like valleys" },
  { image: Pokhara, title: "Pokhara", tagline: "Lakeside gateway to adventure and serenity" },
  { image: Langtang, title: "Langtang Valley", tagline: "Scenic trekking through a serene alpine valley" },
  { image: Ghandruk, title: "Ghandruk", tagline: "Traditional Gurung village with mountain views" },
  { image: Rara, title: "Rara Lake", tagline: "Nepal’s largest lake, hidden in the Karnali hills" },
  { image: SheyPhoksundo, title: "Shey Phoksundo", tagline: "Turquoise alpine lake at Nepal’s largest park" },
  { image: Kalinchok, title: "Kalinchok", tagline: "Kuri village & the famous Kalinchowk shrine" },
  { image: NamoBuddha, title: "Namo Buddha", tagline: "Serene Buddhist stupa and hilltop retreat" },
];

const dayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const DestinationShowcase = () => {
  const navigate = useNavigate();

  const bookTrip = (title: string) => {
    navigate(
      `/tickets?pickup=${encodeURIComponent("Kathmandu")}&drop=${encodeURIComponent(title)}&date=${encodeURIComponent(dayKey())}`
    );
  };

  return (
    <section id="destinations" className="bg-gradient-to-b from-white to-slate-50 px-4 py-14 sm:px-6 lg:px-8">
      <Reveal className="mx-auto max-w-6xl text-center">
        <p className="section-eyebrow">Where to Go</p>
        <h2 className="section-title">Top Destinations Across Nepal</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-500 sm:text-base">
          From jungle safaris to high Himalayan trails — browse popular places
          and book your bus or vehicle in a few taps.
        </p>
      </Reveal>

      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {DESTINATIONS.map(({ image, title, tagline, featured }, index) => (
          <Reveal
            key={title}
            delay={(index % 3) * 90}
            className={featured ? "sm:col-span-2" : ""}
          >
            <div
              onClick={() => bookTrip(title)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-lg"
            >
              <img
                src={image}
                alt={title}
                loading="lazy"
                className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                  featured ? "h-60 sm:h-72 lg:h-80" : "h-48 sm:h-56"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-medium text-blue-300">
                    <FaMapMarkerAlt /> Nepal
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-white sm:text-xl">{title}</h3>
                  <p className="mt-1 text-xs text-slate-300 sm:text-sm">{tagline}</p>
                </div>
                <button
                  type="button"
                  onClick={() => bookTrip(title)}
                  className="flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 sm:px-4 sm:text-sm"
                >
                  <FaTicketAlt /> Book
                </button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default DestinationShowcase;