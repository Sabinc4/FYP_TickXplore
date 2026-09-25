import { useState } from "react";

type Category =
  | "All"
  | "Booking & Payment"
  | "Tickets & Vehicles"
  | "Refunds & Cancellation"
  | "Tracking"
  | "Account & Vendors";

interface FAQItem {
  category: Exclude<Category, "All">;
  question: string;
  answer: string;
}

const CATEGORIES: Category[] = [
  "All",
  "Booking & Payment",
  "Tickets & Vehicles",
  "Refunds & Cancellation",
  "Tracking",
  "Account & Vendors",
];

const FAQS: FAQItem[] = [
  {
    category: "Booking & Payment",
    question: "What is TickXplore?",
    answer:
      "TickXplore is a transport booking platform in Nepal where you can book bus tickets, reserve vehicles like 4x4s, jeeps, Scorpios, tourist buses, and e-vans, and explore tourist area packages all in one place.",
  },
  {
    category: "Booking & Payment",
    question: "How do I book a ticket or vehicle?",
    answer:
      "Go to the Tickets or Vehicle Bookings section, choose your destination, date, and preferred transport, select your seats or pickup details if applicable, then confirm your booking at checkout.",
  },
  {
    category: "Booking & Payment",
    question: "What payment methods are available?",
    answer:
      "TickXplore supports secure online payments through Khalti as well as Cash on Visit (CoV), where you pay the vendor directly at the time of travel.",
  },
  {
    category: "Booking & Payment",
    question: "How does Cash on Visit work?",
    answer:
      "When booking a bus seat or vehicle, choose Cash on Visit as your payment method. Your booking is reserved and you pay the vendor in person at the time of travel. The platform handles the confirmation, so just show up with your booking details.",
  },
  {
    category: "Booking & Payment",
    question: "Can I book multiple tickets or seats at once?",
    answer:
      "Yes, you can book multiple seats for your group during a single booking, and seat selection is available for buses so your group can sit together.",
  },
  {
    category: "Booking & Payment",
    question: "Are there discounts available?",
    answer:
      "TickXplore occasionally offers discounts and special offers on certain routes and vehicles. Keep an eye on the homepage and announcements for the latest deals.",
  },
  {
    category: "Tickets & Vehicles",
    question: "Can we choose buses from anywhere?",
    answer:
      "Yes, TickXplore allows you to select buses from various routes and locations across Nepal, so you can board from the point that suits your journey.",
  },
  {
    category: "Tickets & Vehicles",
    question: "What types of vehicles can I reserve?",
    answer:
      "You can reserve a variety of vehicles including 4x4s, jeeps, Scorpios, tourist buses, and e-vans, ideal for mountain trips and group tours, with pickup and drop-off locations captured at booking.",
  },
  {
    category: "Tickets & Vehicles",
    question: "Which tourist areas can I book?",
    answer:
      "Popular destinations such as Chitwan, Poon Hill, Nagarkot, Ghandruk, Kalinchok, Langtang, and Mustang are available under the Tourist Areas and booking sections in select areas.",
  },
  {
    category: "Tickets & Vehicles",
    question: "Can I see seat availability before booking?",
    answer:
      "Yes, the seat selection page shows available seats and remaining availability for each bus, and booking is confirmed only after your preferred seats are selected.",
  },
  {
    category: "Refunds & Cancellation",
    question: "How do I cancel my booking?",
    answer:
      "You can request a cancellation for eligible upcoming bookings from your booking history. Not all bookings may be eligible, so check the booking status and conditions before requesting.",
  },
  {
    category: "Refunds & Cancellation",
    question: "How do refunds work?",
    answer:
      "Open your Booking History, choose an upcoming booking, and request a refund by providing a reason. The admin reviews your request and you are notified by email once it is approved or declined.",
  },
  {
    category: "Refunds & Cancellation",
    question: "How long does a refund take?",
    answer:
      "Once you submit a refund request, the admin reviews it and you receive a status update. After approval, the refund is processed and you are informed by email at each step.",
  },
  {
    category: "Tracking",
    question: "Is there live tracking for my bus or vehicle?",
    answer:
      "Yes. From your user dashboard, you can track your booked bus or vehicle in real time during your trip, so you always know where your ride is.",
  },
  {
    category: "Tracking",
    question: "Why can&apos;t I see my vehicle&apos;s live location?",
    answer:
      "Live tracking updates are shared by the vendor. If a location is not yet available, it may not have been broadcast yet. Check back a little closer to your departure time.",
  },
  {
    category: "Account & Vendors",
    question: "How do I create an account?",
    answer:
      "Visit the registration page, fill in your details, and choose whether you are registering as a user, vendor, or admin. Verification is completed through OTP to secure your account.",
  },
  {
    category: "Account & Vendors",
    question: "How do I register as a vendor?",
    answer:
      "Use the vendor registration option, provide your business and vehicle details, and submit. Vendors only become active after an admin activates their account, at which point they can start managing bookings.",
  },
  {
    category: "Account & Vendors",
    question: "I forgot my password. How do I reset it?",
    answer:
      "Use the forgot password option, request an OTP, and then choose a new password. You can also change your password from your profile at any time.",
  },
  {
    category: "Account & Vendors",
    question: "Do I get notifications about my bookings?",
    answer:
      "Yes, you receive notifications for booking confirmations, status updates, refund decisions, and other important activity related to your account and journeys.",
  },
  {
    category: "Account & Vendors",
    question: "How do I get help if I have more questions?",
    answer:
      "Use the chatbot available on the site for quick answers, or reach out through the contact details at the bottom of the website. You can also visit the booking, history, and refund pages for details specific to your account.",
  },
];

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [category, setCategory] = useState<Category>("All");

  const filtered = CATEGORIES.includes(category)
    ? category === "All"
      ? FAQS
      : FAQS.filter((faq) => faq.category === category)
    : FAQS;

  const toggleDescription = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div>
      <section className="relative flex h-[30vh] items-center justify-center overflow-hidden">
        <img
          src="/Pictures/Bus_Tickets.jpg"
          alt="Bus tickets"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-blue-900/70 to-blue-700/60"
          aria-hidden
        />
        <h1 className="relative z-10 px-4 text-center text-3xl font-bold text-white sm:text-4xl md:text-5xl">
          Frequently Asked Questions
        </h1>
      </section>

      <div className="p-4 sm:p-6 lg:p-8">
        <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-slate-600 sm:text-base md:text-lg">
          TickXplore is your go-to platform for booking vehicle tickets in Nepal. Whether
          you&apos;re looking to travel by bus, 4x4 jeeps, scorpios, or e-vans, find the answers
          to the most common questions below.
        </p>

        <div className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setActiveIndex(null);
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors sm:text-base ${
                category === cat
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 px-4 sm:gap-6 sm:px-8 md:grid-cols-2 lg:gap-8 lg:px-16">
          {filtered.map((faq, index) => (
            <div
              key={faq.question}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-card transition-shadow hover:shadow-card-lg sm:p-6"
              onClick={() => toggleDescription(index)}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900 sm:text-xl md:text-2xl">
                  <span className="mr-2 text-blue-600">
                    {activeIndex === index ? "−" : "+"}
                  </span>
                  {faq.question}
                </h2>
              </div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-blue-500">
                {faq.category}
              </p>
              {activeIndex === index && (
                <p className="text-sm text-slate-600 sm:text-base">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-10 text-center text-slate-500">
            No questions found in this category yet.
          </p>
        )}

        <div className="relative mt-12 overflow-hidden rounded-2xl text-center sm:p-10">
          <img
            src="/Pictures/Chitwan.jpg"
            alt="Chitwan National Park"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-slate-900/85 to-blue-700/75"
            aria-hidden
          />
          <div className="relative z-10 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Still have questions?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-blue-100 sm:text-lg">
              Use the chatbot for quick answers, or reach out through the contact details in
              the footer. Registered users can also check their bookings, history, and refund
              pages for account-specific information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;