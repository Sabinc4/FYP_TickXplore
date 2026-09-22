import type { IconType } from "react-icons";
import {
  FaLeaf,
  FaSun,
  FaHome,
  FaMountain,
  FaPray,
  FaSnowflake,
} from "react-icons/fa";
import Reveal from "./Reveal";

interface Experience {
  icon: IconType;
  title: string;
  description: string;
}

const EXPERIENCES: Experience[] = [
  {
    icon: FaLeaf,
    title: "Jungle & Wildlife",
    description:
      "Rhinos, elephants and jungle safaris at Chitwan — Nepal’s premier wildlife destination.",
  },
  {
    icon: FaSun,
    title: "Scenic Sunrises",
    description:
      "Catch golden dawns over the Himalaya from Poon Hill and hill stations like Nagarkot.",
  },
  {
    icon: FaHome,
    title: "Culture & Villages",
    description:
      "Walk through traditional Gurung villages like Ghandruk and sacred sites like Namo Buddha.",
  },
  {
    icon: FaMountain,
    title: "Trekking & Trails",
    description:
      "Hike gentle-to-rugged trails through valleys like Langtang with lodges along the way.",
  },
  {
    icon: FaPray,
    title: "Spiritual Journeys",
    description:
      "Visit revered shrines such as Kalinchowk’s mountain temple and Buddhist stupas across the hills.",
  },
  {
    icon: FaSnowflake,
    title: "Alpine Highlands",
    description:
      "High-altitude gems — Rara Lake, Shey Phoksundo and Mustang’s rain-shadow landscapes.",
  },
];

const TravelExperiences = () => (
  <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
    <Reveal className="mx-auto max-w-5xl text-center">
      <p className="section-eyebrow">Travel Experiences</p>
      <h2 className="section-title">A Journey for Every Traveler</h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-500 sm:text-base">
        Whatever you love — wildlife, mountains, culture or quiet lakes — Nepal
        has a destination made for you.
      </p>
    </Reveal>

    <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {EXPERIENCES.map(({ icon: Icon, title, description }, index) => (
        <Reveal key={title} delay={(index % 3) * 90} className="h-full">
          <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-slate-900 p-6 text-center transition-colors hover:border-blue-500/40 hover:bg-slate-800">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/15 text-xl text-blue-400">
              <Icon />
            </div>
            <h3 className="mb-2 text-base font-bold text-white">{title}</h3>
            <p className="text-sm leading-relaxed text-slate-400">{description}</p>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

export default TravelExperiences;