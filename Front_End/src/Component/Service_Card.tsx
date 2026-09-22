import type { IconType } from "react-icons";
import { FaWifi, FaBed, FaGlassWhiskey } from "react-icons/fa";
import Reveal from "./Reveal";

interface ServiceCardItem {
  icon: IconType;
  title: string;
  description: string;
}

const SERVICES: ServiceCardItem[] = [
  {
    icon: FaWifi,
    title: "Free WiFi",
    description:
      "Stay connected with high-speed WiFi onboard. Browse, stream, or work without interruptions.",
  },
  {
    icon: FaBed,
    title: "Comfortable Pillows",
    description:
      "Rest and relax with our plush pillows, designed to give you a peaceful journey.",
  },
  {
    icon: FaGlassWhiskey,
    title: "Complimentary Water Bottle",
    description:
      "Stay hydrated throughout your journey with a free water bottle provided on board.",
  },
];

const Service_Card = () => (
  <section className="bg-gradient-to-b from-slate-50 to-white px-4 py-14 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-5xl text-center">
      <Reveal>
        <p className="section-eyebrow">Onboard Amenities</p>
        <h2 className="section-title">Our Premium Services</h2>
        <p className="mt-4 text-sm text-slate-500 sm:text-base">
          Explore the top features of our buses and make your travel experience
          unforgettable!
        </p>
      </Reveal>
    </div>

    <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
      {SERVICES.map(({ icon: Icon, title, description }, index) => (
        <Reveal key={title} delay={index * 90} className="mx-auto w-full max-w-sm">
          <div className="flex min-h-[250px] flex-col items-center justify-between rounded-2xl bg-slate-800 p-8 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-lg">
            <Icon className="mb-4 text-5xl text-blue-400" />
            <h2 className="mb-4 text-xl font-semibold text-white">{title}</h2>
            <p className="text-sm leading-relaxed text-slate-300">{description}</p>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

export default Service_Card;