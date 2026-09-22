import { FaCheckCircle } from "react-icons/fa";
import EVans from "/Pictures/E_vans.jpg";
import Reveal from "./Reveal";

const TIPS: string[] = [
  "Book seats 2–3 weeks ahead during peak season (Oct–Nov and Mar–May).",
  "Prefer public buses or shared jeeps on a budget; hire private vehicles for flexibility.",
  "Carry small cash — ATMs can be scarce in hilly and rural destinations.",
  "Use the Live Tracker to confirm your vehicle’s departure and arrival.",
  "Pack warm layers for high-altitude spots like Poon Hill, Mustang and Langtang.",
  "Start early for sunrise viewpoints such as Nagarkot and Poon Hill.",
];

const TravelTips = () => (
  <section className="px-4 py-14 sm:px-6 lg:px-8">
    <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl shadow-card-lg">
          <img
            src={EVans}
            alt="Comfortable transport for tourist destinations"
            loading="lazy"
            className="h-64 w-full object-cover sm:h-80 lg:h-[26rem]"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 to-transparent p-5">
            <p className="text-sm font-semibold text-white">
              Say “Namaste” to hassle-free travel planning
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div>
          <p className="section-eyebrow">Travel Smart</p>
          <h2 className="section-title">Tips Before You Go</h2>
          <p className="mt-4 max-w-xl text-sm text-slate-500 sm:text-base">
            A little planning goes a long way in Nepal. Keep these tips in mind
            to make your trip smoother and safer.
          </p>
          <ul className="mt-6 grid gap-3">
            {TIPS.map((tip) => (
              <li key={tip} className="flex items-start gap-3">
                <FaCheckCircle className="mt-0.5 shrink-0 text-blue-600" />
                <span className="text-sm text-slate-700 sm:text-base">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  </section>
);

export default TravelTips;