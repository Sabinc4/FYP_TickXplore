import type { IconType } from "react-icons";
import { FaSearch, FaCar, FaCreditCard } from "react-icons/fa";
import Reveal from "./Reveal";

interface CardProps {
  icon: IconType;
  title: string;
  description: string;
}

const Card = ({ icon: Icon, title, description }: CardProps) => (
  <div className="flex h-full min-h-[280px] flex-col items-center justify-between rounded-2xl bg-slate-900 p-6 text-center shadow-card transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02]">
    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-600/15 text-blue-400">
      <Icon className="text-4xl" />
    </div>
    <h2 className="mb-4 text-lg font-bold text-white">{title}</h2>
    <p className="text-sm leading-relaxed text-slate-400">{description}</p>
  </div>
);

const CARDS: CardProps[] = [
  {
    icon: FaSearch,
    title: "Search Your Vehicle",
    description:
      "Quickly search for buses by selecting origin, destination, and travel date. Whether you're looking for local or long-distance options, our platform lets you find buses that meet your schedule, route, and seating preferences.",
  },
  {
    icon: FaCar,
    title: "Choose Your Seat",
    description:
      "Enjoy a hassle-free journey by choosing the seat that suits you best. With various seating options like regular, luxury, and sleeper buses, you can select the perfect seat based on your comfort needs, journey length, and budget.",
  },
  {
    icon: FaCreditCard,
    title: "Pay and Relax",
    description:
      "Securely pay online for your ticket and confirm your booking instantly. Skip the long lines at bus terminals and enjoy peace of mind with our easy and safe payment process, ensuring your seat is booked in a matter of minutes.",
  },
];

const Bus_Facility = () => (
  <section className="px-4 py-14 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-5xl text-center">
      <Reveal>
        <p className="section-eyebrow">How It Works</p>
        <h2 className="section-title">Get Your Tickets in 3 Easy Steps</h2>
        <p className="mt-4 text-sm text-slate-500 sm:text-base">
          Discover why we’re the best choice for your travel needs. With easy
          booking and trusted services, you can make your trips unforgettable!
        </p>
      </Reveal>
    </div>
    <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {CARDS.map((card, index) => (
        <Reveal key={card.title} delay={index * 90} className="h-full">
          <Card {...card} />
        </Reveal>
      ))}
    </div>
  </section>
);

export default Bus_Facility;