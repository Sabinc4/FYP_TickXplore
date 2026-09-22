import { useState } from "react";
import Bus_Tickets from "../Pictures/Bus.jpg";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Can we choose buses from anywhere?",
    answer:
      "Yes, TickXplore allows you to select buses from various routes and locations across Nepal.",
  },
  {
    question: "How do I pay for tickets?",
    answer:
      "You can pay for your tickets using various payment methods, including Khalti, mobile wallets, and Cash on Visit.",
  },
  {
    question: "Are there discounts available?",
    answer:
      "Yes, TickXplore offers occasional discounts and special offers for certain routes and vehicles.",
  },
  {
    question: "Can I book multiple tickets at once?",
    answer: "Yes, you can book multiple tickets for your group in one booking process.",
  },
  {
    question: "How do I cancel my booking?",
    answer:
      "You can easily cancel your booking through the TickXplore platform, subject to cancellation policies.",
  },
];

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleDescription = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div>
      <div className="h-[150px] w-full sm:h-[200px] md:h-[250px] lg:h-[300px]">
        <img
          src={Bus_Tickets}
          alt="Bus Tickets"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-4 text-center sm:p-6 lg:p-8">
        <h1 className="mb-4 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
          Frequently Asked Questions
        </h1>

        <p className="mx-auto mb-6 max-w-2xl text-sm text-slate-600 sm:text-base md:text-lg">
          TickXplore is your go-to platform for booking vehicle tickets in Nepal.
          Whether you&apos;re looking to travel by bus, 4x4 jeeps, scorpios, or
          e-vans.
        </p>

        <div className="grid grid-cols-1 gap-4 px-4 sm:gap-6 sm:px-8 md:grid-cols-2 lg:gap-8 lg:px-16">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-card transition-shadow hover:shadow-card-lg sm:p-6"
              onClick={() => toggleDescription(index)}
            >
              <h2 className="mb-2 text-lg font-semibold text-slate-900 sm:text-xl md:text-2xl">
                <span className="mr-2 text-blue-600">{activeIndex === index ? "−" : "+"}</span>
                {faq.question}
              </h2>
              {activeIndex === index && (
                <p className="text-sm text-slate-600 sm:text-base">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQs;