import type { IconType } from "react-icons";
import {
  FaMapMarkedAlt,
  FaCreditCard,
  FaShieldAlt,
  FaClipboardCheck,
  FaUndo,
  FaHeadset,
} from "react-icons/fa";
import Reveal from "./Reveal";

interface Feature {
  icon: IconType;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: FaMapMarkedAlt,
    title: "Live Vehicle Tracking",
    description:
      "Follow your bus or vehicle in real time from the Live Tracker, so you always know exactly where your ride is before it arrives.",
  },
  {
    icon: FaCreditCard,
    title: "Secure Online Payment",
    description:
      "Pay instantly via trusted gateways like Khalti or choose cash on delivery, with instant confirmation for every booking.",
  },
  {
    icon: FaShieldAlt,
    title: "Verified Vendors Only",
    description:
      "Every bus and rental vehicle listed on TickXplore belongs to verified vendors, keeping your travel safe and reliable.",
  },
  {
    icon: FaClipboardCheck,
    title: "Instant Booking Confirmation",
    description:
      "Get your e-ticket the moment you pay and skip the ticket counter. Your seat is locked in seconds, not hours.",
  },
  {
    icon: FaUndo,
    title: "Easy Cancellation & Refund",
    description:
      "Changed your plans? Cancel seamlessly and track your refund status from your dashboard, with no paperwork involved.",
  },
  {
    icon: FaHeadset,
    title: "24/7 Smart Support",
    description:
      "Have a question anytime? Our built-in ChatBot and support team are always ready to help you plan the perfect journey.",
  },
];

const WhyChoose = () => (
  <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
    <Reveal className="mx-auto max-w-5xl text-center">
      <p className="section-eyebrow">Why TickXplore</p>
      <h2 className="section-title">Travel Smart, Book with Confidence</h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-400 sm:text-base">
        We combine Nepal’s best routes with modern booking tools so your journey
        is effortless from the first search to the final destination.
      </p>
    </Reveal>

    <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {FEATURES.map(({ icon: Icon, title, description }, index) => (
        <Reveal key={title} delay={index * 90} className="h-full">
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

export default WhyChoose;