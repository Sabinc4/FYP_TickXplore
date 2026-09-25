import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaTicketAlt,
  FaMountain,
  FaClock,
  FaBed,
  FaUtensils,
  FaLightbulb,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaInfoCircle,
  FaHistory,
  FaCheck,
  FaCalendarAlt,
  FaBus,
  FaGripLines,
  FaShoePrints,
  FaBinoculars,
  FaCompass,
  FaArrowRight,
} from "react-icons/fa";
import Reveal from "../Component/Reveal";
import { getBlogBySlug, BLOG_POSTS } from "./index";
import type { BlogPost } from "./types";

const dayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  center?: boolean;
}

const SectionHeading = ({ eyebrow, title, center = false }: SectionHeadingProps) => (
  <div className={center ? "text-center" : ""}>
    <p className="section-eyebrow">{eyebrow}</p>
    <h2
      className={`mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl ${
        center ? "mx-auto max-w-2xl" : ""
      }`}
    >
      {title}
    </h2>
    <div className={`mt-3 h-1 w-12 rounded-full bg-blue-600 ${center ? "mx-auto" : ""}`} />
  </div>
);

const ATTRACTION_ICONS = [FaBinoculars, FaCompass, FaShoePrints, FaGripLines, FaMapMarkerAlt, FaMountain];

const TouristBlog = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post: BlogPost | undefined = slug ? getBlogBySlug(slug) : undefined;

  if (!post) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <FaMountain className="mx-auto text-5xl text-blue-600" />
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">
          Destination not found
        </h1>
        <p className="mt-3 text-sm text-slate-500 sm:text-base">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/tourist-areas" className="btn-primary">
            <FaArrowLeft /> Back to Tourist Areas
          </Link>
          <Link to="/" className="btn-secondary">
            Go Home
          </Link>
        </div>
      </section>
    );
  }

  const bookTrip = () => {
    const pickup = post.pickupPoint || "Kathmandu";
    const drop = post.dropPoint || post.title;
    navigate(`/tickets?pickup=${encodeURIComponent(pickup)}&drop=${encodeURIComponent(drop)}&date=${dayKey()}`);
  };

  const postIndex = BLOG_POSTS.findIndex((item) => item.slug === post.slug);
  const related: BlogPost[] = [];
  for (let offset = 1; related.length < 3 && offset <= BLOG_POSTS.length; offset += 1) {
    const candidate = BLOG_POSTS[(postIndex + offset) % BLOG_POSTS.length];
    if (candidate.slug !== post.slug && !related.some((item) => item.slug === candidate.slug)) {
      related.push(candidate);
    }
  }

  const { title, tagline, heroImage, intro } = post;

  return (
    <article className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <nav className="mb-6 text-xs font-medium text-slate-500 sm:text-sm" aria-label="Breadcrumb">
          <Link to="/tourist-areas" className="text-blue-600 transition-colors hover:text-blue-700">
            Tourist Areas
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="font-semibold text-slate-800">{title}</span>
        </nav>

        <Reveal>
          <article className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card-lg">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-200 sm:aspect-[16/9] lg:aspect-[21/9]">
              <img
                src={heroImage}
                alt={title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </div>
            <div className="grid grid-cols-1 gap-6 p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              <div>
                <p className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-blue-600">
                  <FaMountain /> <span>Discover Nepal</span>
                </p>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                  {title}
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">{tagline}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row lg:items-center">
                <button type="button" onClick={bookTrip} className="btn-primary !rounded-xl !px-6 !py-3 text-sm sm:text-base">
                  <FaTicketAlt /> Find Tickets
                </button>
                <Link
                  to="/tourist-areas"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100/80 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 sm:text-base"
                >
                  <FaArrowLeft /> Back to Explore
                </Link>
              </div>
            </div>
          </article>
        </Reveal>
        <Reveal>
          <p className="max-w-4xl text-lg font-medium leading-relaxed text-slate-700 sm:text-xl">
            {intro}
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
          <div className="min-w-0 space-y-14">
            <section>
              <SectionHeading eyebrow="About" title="Overview" />
              <Reveal className="mt-5">
                <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{post.overview}</p>
              </Reveal>
            </section>

            {post.history && (
              <section>
                <SectionHeading eyebrow="Background" title="The Story Behind the Destination" />
                <Reveal className="mt-5">
                  <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-indigo-50/40 p-6 sm:p-8">
                    <FaHistory className="absolute -top-3 right-2 text-8xl text-blue-600/10 sm:text-9xl" aria-hidden />
                    <p className="relative flex items-start gap-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-card">
                        <FaHistory />
                      </span>
                      <span>{post.history}</span>
                    </p>
                  </div>
                </Reveal>
              </section>
            )}

            <section>
              <SectionHeading eyebrow="Highlights" title="Main Attractions" />
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {post.attractions.map((item, index) => {
                  const Icon = ATTRACTION_ICONS[index % ATTRACTION_ICONS.length];
                  return (
                    <Reveal key={item.title} delay={(index % 2) * 80} className="h-full">
                      <article className="group relative h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-lg">
                        <span
                          className="pointer-events-none absolute right-4 top-4 text-4xl font-extrabold tracking-tight text-slate-100 transition-colors duration-300 group-hover:text-blue-100"
                          aria-hidden
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-lg text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                          <Icon />
                        </span>
                        <h3 className="mt-4 text-base font-bold text-slate-900 sm:text-lg">{item.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                      </article>
                    </Reveal>
                  );
                })}
              </div>
            </section>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Reveal className="h-full">
                <div className="h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-card sm:p-7">
                  <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900 sm:text-lg">
                    <FaCheckCircle className="text-blue-600" /> Things to Do
                  </h3>
                  <ul className="space-y-3">
                    {post.thingsToDo.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-slate-600 sm:text-base">
                        <FaCheck className="mt-0.5 shrink-0 text-blue-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={80} className="h-full">
                <div className="h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-card sm:p-7">
                  <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900 sm:text-lg">
                    <FaBus className="text-blue-600" /> How to Get There
                  </h3>
                  <ol className="space-y-3">
                    {post.howToGetThere.map((step, index) => (
                      <li key={step} className="flex items-start gap-3 text-sm text-slate-600 sm:text-base">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600/10 text-xs font-bold text-blue-600">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>
            </div>

            {post.foodExperiences && (
              <section>
                <SectionHeading eyebrow="Taste & Culture" title="Food & Local Experiences" />
                <Reveal className="mt-5">
                  <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-card sm:flex-row sm:items-start sm:p-7">
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-xl text-orange-600">
                      <FaUtensils />
                    </span>
                    <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{post.foodExperiences}</p>
                  </div>
                </Reveal>
              </section>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {post.quickFacts && post.quickFacts.length > 0 && (
              <Reveal>
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card sm:p-7">
                  <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900 sm:text-lg">
                    <FaInfoCircle className="text-blue-600" /> Quick Facts
                  </h3>
                  <ul className="space-y-3">
                    {post.quickFacts.map((fact) => (
                      <li key={fact} className="flex items-start gap-2 text-sm leading-relaxed text-slate-600">
                        <FaCheck className="mt-0.5 shrink-0 text-blue-600" />
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            <Reveal delay={60}>
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
                <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                  <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
                    <FaCalendarAlt className="text-blue-600" /> Plan Your Visit
                  </h3>
                </div>
                <div className="space-y-5 p-6">
                  <div className="flex gap-3">
                    <FaClock className="mt-0.5 shrink-0 text-blue-600" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Best Time to Visit</h4>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{post.bestTimeToVisit}</p>
                    </div>
                  </div>
                  {post.accommodation && (
                    <div className="flex gap-3">
                      <FaBed className="mt-0.5 shrink-0 text-blue-600" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Where to Stay</h4>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">{post.accommodation}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-card-lg sm:p-7">
                <h3 className="text-lg font-bold">Ready to go?</h3>
                <p className="mt-2 text-sm leading-relaxed text-blue-100">
                  Book a bus or vehicle to {post.dropPoint || title} and start your adventure with
                  TickXplore today.
                </p>
                <button
                  type="button"
                  onClick={bookTrip}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition-all hover:bg-blue-50 active:scale-[0.98]"
                >
                  <FaTicketAlt /> Find Tickets
                </button>
                <Link
                  to="/tourist-areas"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Explore More Destinations
                </Link>
              </div>
            </Reveal>
          </aside>
        </div>

        <section className="mt-16">
          <SectionHeading eyebrow="Good to Know" title="Travel Tips" />
          <Reveal className="mt-5">
            <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-6 sm:p-8">
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {post.travelTips.map((tip, index) => (
                  <li
                    key={tip}
                    className={`flex items-start gap-2 text-sm leading-relaxed text-slate-700 sm:text-base ${
                      index % 2 === 1 ? "md:pl-4" : ""
                    }`}
                  >
                    <FaLightbulb className="mt-0.5 shrink-0 text-amber-500" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>

        <section className="mt-16">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-12 text-center shadow-card-lg sm:px-12 sm:py-16">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-300">Start Planning</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl">
                Ready to visit {title}?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                Book a bus or vehicle to {post.dropPoint || title} and start your adventure with
                TickXplore today.
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button type="button" onClick={bookTrip} className="btn-primary !px-6 !py-3 text-sm sm:text-base">
                  <FaTicketAlt /> Find Tickets
                </button>
                <Link
                  to="/tourist-areas"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:text-base"
                >
                  <FaArrowLeft /> Explore More Destinations
                </Link>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="mt-16">
          <SectionHeading eyebrow="Keep Exploring" title="Related Destinations" center />
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((dest, index) => (
              <Reveal key={dest.slug} delay={index * 80} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-lg">
                  <Link to={`/blogs/${dest.slug}`} className="block">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-200">
                      <img
                        src={dest.heroImage}
                        alt={dest.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-blue-600">
                      <FaMapMarkerAlt /> Nepal
                    </p>
                    <h3 className="mt-1 text-base font-bold text-slate-900 transition-colors group-hover:text-blue-700 sm:text-lg">
                      {dest.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">{dest.tagline}</p>
                    <Link
                      to={`/blogs/${dest.slug}`}
                      className="mt-4 inline-flex items-center gap-2 self-start text-sm font-semibold text-blue-600 transition-all hover:gap-3 hover:text-blue-700"
                    >
                      Read More <FaArrowRight />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
};

export default TouristBlog;