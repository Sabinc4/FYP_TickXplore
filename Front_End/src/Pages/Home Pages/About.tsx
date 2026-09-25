const VALUES = [
  {
    title: "Reliability",
    text: "Every journey on TickXplore is backed by verified transport operators. Seats and vehicle reservations are confirmed instantly, so you can travel without surprises.",
  },
  {
    title: "Transparency",
    text: "Clear pricing, honest availability, and complete booking details. You always know your total fare, your vehicle, and your pickup points before you pay.",
  },
  {
    title: "Convenience",
    text: "Search routes, compare services, choose your seats, and pay online from anywhere. Cash on Visit is also available for travelers who prefer to pay at the time of travel.",
  },
  {
    title: "Customer Support",
    text: "Our built-in chatbot and support channels are here to answer questions, and every refund request is reviewed by the admin team with email updates at each step.",
  },
];

const OFFERS = [
  {
    title: "Bus Tickets",
    text: "Book comfortable bus tickets across the most scenic tourist routes in Nepal, select your preferred seat, and choose Khalti or Cash on Visit at checkout.",
  },
  {
    title: "Vehicle Rentals",
    text: "Rent a variety of vehicles including 4x4s, jeeps, Scorpios, tourist buses, and e-vans for mountain trips and beyond, with pickup and drop-off details captured at booking.",
  },
  {
    title: "Tourist Area Packages",
    text: "Discover and book entry and packages for top destinations such as Chitwan, Poon Hill, Nagarkot, Ghandruk, Kalinchok, Langtang, and Mustang in select areas.",
  },
  {
    title: "Live Tracking",
    text: "Track your bus or vehicle in real time from your dashboard while you travel, so you always know where your ride is.",
  },
  {
    title: "Flexible Payment Options",
    text: "Pay securely online through Khalti or choose Cash on Visit (CoV) to pay the vendor directly at the time of travel.",
  },
  {
    title: "Booking History & Refunds",
    text: "View all past and upcoming bookings in one place, request a refund with a reason for eligible upcoming trips, and get notified by email once the admin reviews it.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Create an Account",
    text: "Register as a user, choose your role, and verify your details through OTP to start booking.",
  },
  {
    step: "02",
    title: "Search and Choose",
    text: "Browse buses and vehicles, compare prices, pick your destination, date, and seats, and find the best option for your trip.",
  },
  {
    step: "03",
    title: "Book and Pay",
    text: "Confirm your booking instantly via Khalti online payment or reserve with Cash on Visit and pay at the time of travel.",
  },
  {
    step: "04",
    title: "Travel and Track",
    text: "Get your confirmation and notifications, then track your bus or vehicle live from your dashboard throughout your journey.",
  },
];

const FEATURES = [
  {
    image: "/Pictures/Bus.jpg",
    alt: "Comfortable bus travel across Nepal",
    title: "Travel Comfortably by Bus",
    text: "Book your bus tickets easily and travel across the most scenic routes in Nepal with TickXplore. Choose your seat in advance, see live availability, and travel with verified operators.",
    reverse: false,
  },
  {
    image: "/Pictures/vehicle.jpg",
    alt: "Rental vehicles for trips across Nepal",
    title: "Rent Vehicles for Every Journey",
    text: "Rent a variety of vehicles like 4x4s, jeeps, and Scorpios for your trips to the mountains and beyond. Our fleet is designed to make your journey more comfortable and exciting.",
    reverse: true,
  },
  {
    image: "/Pictures/Nagarkot.jpg",
    alt: "Scenic tourist destinations in Nepal",
    title: "Explore Tourist Destinations",
    text: "From Chitwan to Poon Hill and beyond, discover and book your favourite tourist areas with entry and package options, and plan your perfect escape in just a few clicks.",
    reverse: false,
  },
];

const AboutUs = () => (
  <div className="overflow-x-hidden bg-slate-50">
    <section className="relative flex h-[40vh] items-center justify-center overflow-hidden">
      <img
        src="/Pictures/Poon.jpg"
        alt="Poon Hill sunrise"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-blue-900/70 to-blue-700/60" aria-hidden />
      <div className="relative z-10 px-4 text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
          About Us
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-blue-100 sm:text-base md:text-lg">
          Connecting travelers with reliable buses and vehicles across Nepal, all in one
          place.
        </p>
      </div>
    </section>

    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <div>
          <p className="mb-6 text-lg leading-relaxed text-slate-700 sm:text-xl">
            Welcome to{" "}
            <strong className="font-semibold text-blue-700">TickXplore</strong>, your go-to
            platform for seamless vehicle bookings across Nepal. Whether you&apos;re planning a
            trip to a tourist destination, need to rent a vehicle, or book a bus ticket for
            your journey, we&apos;ve got you covered!
          </p>
          <p className="text-lg leading-relaxed text-slate-700 sm:text-xl">
            Our mission is to provide a hassle-free booking experience for both locals and
            tourists. We aim to make it easy for you to explore the beautiful destinations of
            Nepal by offering quick and easy access to vehicle reservations, transparent
            pricing, and reliable transport partners.
          </p>
        </div>
        <img
          src="/Pictures/Chitwan.jpg"
          alt="Chitwan National Park"
          className="h-64 w-full rounded-2xl object-cover shadow-card sm:h-80"
        />
      </div>

      <div className="mb-14 mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-8">
          <h2 className="mb-3 text-xl font-bold text-blue-900 sm:text-2xl">Our Mission</h2>
          <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
            To connect travelers with dependable buses and vehicles across Nepal through an
            easy, transparent, and secure booking platform, making every destination more
            accessible for locals and tourists alike.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="mb-3 text-xl font-bold text-slate-900 sm:text-2xl">Our Vision</h2>
          <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
            To be Nepal&apos;s most trusted transport booking destination, where planning a trip
            is as simple as a few taps, every fare is clear, and every journey is safer and
            more enjoyable because of live tracking and dependable partners.
          </p>
        </div>
      </div>

      <h2 className="mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">Our Values</h2>
      <div className="mb-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map(({ title, text }) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-shadow hover:shadow-card-lg"
          >
            <h3 className="mb-2 text-lg font-semibold text-blue-700">{title}</h3>
            <p className="text-base leading-relaxed text-slate-600">{text}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">What We Offer</h2>
      <div className="mb-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {OFFERS.map(({ title, text }, index) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-shadow hover:shadow-card-lg"
          >
            <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              {index + 1}
            </span>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>
            <p className="text-base leading-relaxed text-slate-600">{text}</p>
          </div>
        ))}
      </div>

      <div className="mb-14">
        {FEATURES.map(({ image, alt, title, text, reverse }) => (
          <div
            key={title}
            className="my-8 flex flex-wrap items-center justify-between gap-6 sm:my-12 sm:gap-8"
          >
            <div className={`min-w-[280px] flex-1 ${reverse ? "order-2" : ""}`}>
              <img
                src={image}
                alt={alt}
                loading="lazy"
                className="h-auto w-full rounded-2xl shadow-card transition-shadow duration-300 hover:shadow-card-lg"
              />
            </div>
            <div className={`min-w-[280px] flex-1 ${reverse ? "order-1" : ""}`}>
              <h3 className="mb-3 text-xl font-bold text-slate-900 sm:text-2xl">{title}</h3>
              <p className="text-lg leading-relaxed text-slate-700 sm:text-xl">{text}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">How It Works</h2>
      <div className="mb-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ step, title, text }) => (
          <div
            key={step}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-shadow hover:shadow-card-lg"
          >
            <span className="mb-3 inline-block text-3xl font-extrabold text-blue-600">
              {step}
            </span>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>
            <p className="text-base leading-relaxed text-slate-600">{text}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">
        Why Choose TickXplore
      </h2>
      <div className="mb-14 rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <li className="flex gap-3 text-base leading-relaxed text-slate-700 sm:text-lg">
            <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
            Verified transport operators and active vendors, so you book with confidence.
          </li>
          <li className="flex gap-3 text-base leading-relaxed text-slate-700 sm:text-lg">
            <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
            Secure online payments through Khalti as well as Cash on Visit options.
          </li>
          <li className="flex gap-3 text-base leading-relaxed text-slate-700 sm:text-lg">
            <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
            Real-time live tracking for buses and vehicles during your trip.
          </li>
          <li className="flex gap-3 text-base leading-relaxed text-slate-700 sm:text-lg">
            <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
            Instant booking confirmations, notifications, and a full booking history.
          </li>
          <li className="flex gap-3 text-base leading-relaxed text-slate-700 sm:text-lg">
            <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
            Simple refund requests with admin review and email updates at every step.
          </li>
          <li className="flex gap-3 text-base leading-relaxed text-slate-700 sm:text-lg">
            <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
            A friendly chatbot and support channels whenever you need help.
          </li>
        </ul>
      </div>

      <div className="relative overflow-hidden rounded-2xl text-center sm:p-10">
        <img
          src="/Pictures/Mustang.jpg"
          alt="Mustang, Nepal"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 to-blue-700/75" aria-hidden />
        <div className="relative z-10 p-6 sm:p-8">
          <p className="text-3xl font-bold text-white">
            Join TickXplore today and start your journey with ease.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-blue-100 sm:text-lg">
            Whether you&apos;re planning a road trip or need transport for a group tour, we
            ensure a smooth and reliable experience every time.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default AboutUs;