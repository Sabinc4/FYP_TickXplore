import aboutusimage from "../Pictures/Bus.jpg";
import busImage from "../Pictures/bus1.jpg";
import vehicleImage from "../Pictures/vehicle.jpg";

const FEATURE_ROWS = [
  {
    image: busImage,
    alt: "Bus Travel",
    text: "Book your bus tickets easily and travel across the most scenic routes in Nepal with TickXplore. We offer a range of comfortable bus services that connect you to various tourist destinations in Nepal.",
    reverse: false,
  },
  {
    image: vehicleImage,
    alt: "Vehicle Rental",
    text: "Rent a variety of vehicles like 4x4s, jeeps, and Scorpios for your trips to the mountains and beyond. Our fleet is designed to make your journey more comfortable and exciting.",
    reverse: true,
  },
];

const AboutUs = () => (
  <div className="overflow-x-hidden bg-slate-50">
    <section className="relative flex h-[30vh] items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${aboutusimage})` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-slate-900/60" aria-hidden />
      <h1 className="relative z-10 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
        About Us
      </h1>
    </section>

    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <p className="mb-6 text-lg leading-relaxed text-slate-700 sm:text-xl">
        Welcome to <strong className="font-semibold text-blue-700">TickXplore</strong>, your
        go-to platform for seamless vehicle bookings across Nepal. Whether you&apos;re planning a
        trip to a tourist destination, need to rent a vehicle, or book a bus ticket for your
        journey, we&apos;ve got you covered!
      </p>

      <p className="mb-10 text-lg leading-relaxed text-slate-700 sm:text-xl">
        Our mission is to provide a hassle-free booking experience for both locals and
        tourists. We aim to make it easy for you to explore the beautiful destinations of
        Nepal by offering quick and easy access to vehicle reservations.
      </p>

      {FEATURE_ROWS.map(({ image, alt, text, reverse }) => (
        <div
          key={alt}
          className={`my-8 flex flex-wrap items-center justify-between gap-6 sm:my-12 sm:gap-8`}
        >
          <div className={`flex-1 min-w-[280px] ${reverse ? "order-2" : ""}`}>
            <img
              src={image}
              alt={alt}
              className="h-auto w-full rounded-2xl shadow-card transition-shadow duration-300 hover:shadow-card-lg"
            />
          </div>
          <div className={`flex-1 min-w-[280px] ${reverse ? "order-1" : ""}`}>
            <p className="text-lg leading-relaxed text-slate-700 sm:text-xl">{text}</p>
          </div>
        </div>
      ))}

      <p className="mt-8 text-lg leading-relaxed text-slate-700 sm:mt-12 sm:text-xl">
        Join <strong className="font-semibold text-blue-700">TickXplore</strong> today and
        start your journey with ease. Whether you&apos;re planning a road trip or need transport
        for a group tour, we ensure a smooth and reliable experience every time.
      </p>
    </div>
  </div>
);

export default AboutUs;