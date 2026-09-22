import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import {
  FaMapMarkerAlt,
  FaSpinner,
  FaSearch,
  FaExchangeAlt,
  FaBus,
  FaCar,
  FaTimes,
} from "react-icons/fa";
import { AiOutlineCalendar } from "react-icons/ai";
import { IoMdArrowForward } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import { homeApi, API_BASE_URL, type Bus, type Vehicle } from "../api";
import TransportCard, {
  type BusEnriched,
  type VehicleEnriched,
} from "../Component/TransportCard";
import BusTicketsImg from "/Pictures/Bus_Tickets.jpg";

interface SearchFormData {
  pickupPoint: string;
  droppingPoint: string;
  date: string;
}

type SortKey = "date" | "priceAsc" | "priceDesc";

// Local calendar date as YYYY-MM-DD (avoids the UTC vs local off-by-one).
const toLocalDateKey = (date: string | Date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

const dateKeyFromToday = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return toLocalDateKey(d);
};

const formatSummaryDate = (date: string) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

const toNumber = (price: number | "N/A" | undefined) =>
  typeof price === "number" && Number.isFinite(price) ? price : Infinity;

const BusTickets = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [formData, setFormData] = useState<SearchFormData>({
    pickupPoint: queryParams.get("pickup") || "",
    droppingPoint: queryParams.get("drop") || "",
    date: queryParams.get("date") || "",
  });

  const [fetching, setFetching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [browsed, setBrowsed] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [sort, setSort] = useState<SortKey>("date");
  const [buses, setBuses] = useState<BusEnriched[]>([]);
  const [vehicles, setVehicles] = useState<VehicleEnriched[]>([]);
  const [pickupLocations, setPickupLocations] = useState<string[]>([]);
  const [dropLocations, setDropLocations] = useState<string[]>([]);

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (formData.pickupPoint && formData.droppingPoint && formData.date) {
      handleSearch();
    } else {
      browseAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLocations = async () => {
    try {
      const [busContent, vehicleContent] = await Promise.all([
        homeApi.getBuses(),
        homeApi.getVehicles(),
      ]);

      const allBuses = (busContent.buses || busContent.data || []) as Bus[];
      const allVehicles = (vehicleContent.vehicles || vehicleContent.data || []) as Vehicle[];

      const allPickupPoints = [
        ...new Set([
          ...allBuses.map((b) => b.pickupPoint),
          ...allVehicles.map((v) => v.pickupPoint),
        ]),
      ].filter((p): p is string => Boolean(p));

      const allDropPoints = [
        ...new Set([
          ...allBuses.map((b) => b.dropPoint),
          ...allVehicles.map((v) => v.dropPoint),
        ]),
      ].filter((p): p is string => Boolean(p));

      setPickupLocations(allPickupPoints);
      setDropLocations(allDropPoints);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load locations.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const swapRoute = () => {
    setFormData((prev) => ({
      pickupPoint: prev.droppingPoint,
      droppingPoint: prev.pickupPoint,
      date: prev.date,
    }));
    setShowErrors(false);
  };

  const clearAll = () => {
    setFormData({ pickupPoint: "", droppingPoint: "", date: "" });
    setBuses([]);
    setVehicles([]);
    setHasSearched(false);
    setBrowsed(false);
    setShowErrors(false);
  };

  const fetchAndApply = async (criteria: {
    pickupPoint?: string;
    droppingPoint?: string;
    date?: string;
  }) => {
    setFetching(true);
    const searched = Boolean(criteria.pickupPoint && criteria.droppingPoint && criteria.date);
    try {
      const [busContent, vehicleContent] = await Promise.all([
        homeApi.getBuses(),
        homeApi.getVehicles(),
      ]);

      const allBuses = (busContent.buses || busContent.data || []) as Bus[];
      const allVehicles = (vehicleContent.vehicles || vehicleContent.data || []) as Vehicle[];

      const filteredBuses = allBuses.filter((bus) => {
        const busDate = bus.takeOffDate ? toLocalDateKey(bus.takeOffDate) : null;
        const matchesLocation =
          (criteria.pickupPoint
            ? bus.pickupPoint?.toLowerCase() === criteria.pickupPoint.toLowerCase()
            : true) &&
          (criteria.droppingPoint
            ? bus.dropPoint?.toLowerCase() === criteria.droppingPoint.toLowerCase()
            : true);

        const matchesDate = busDate === criteria.date;
        const hasAvailableSeats = (bus.totalSeats - (bus.bookedSeats?.length || 0)) > 0;
        const hasValidPrice = bus.pricePerSeat > 0;
        const hasDeparted = !!bus.takeOffDate && new Date(bus.takeOffDate).getTime() < Date.now();

        return (
          matchesLocation &&
          (!searched || matchesDate) &&
          hasAvailableSeats &&
          hasValidPrice &&
          !hasDeparted
        );
      });

      const filteredVehicles = allVehicles.filter((vehicle) => {
        const isAvailable = vehicle.isAvailable !== false;
        const hasValidPrice = vehicle.price > 0;
        const hasLocationData = vehicle.pickupPoint && vehicle.dropPoint;

        if (searched && hasLocationData) {
          const matchesLocation =
            (criteria.pickupPoint
              ? vehicle.pickupPoint!.toLowerCase() === criteria.pickupPoint.toLowerCase()
              : true) &&
            (criteria.droppingPoint
              ? vehicle.dropPoint!.toLowerCase() === criteria.droppingPoint.toLowerCase()
              : true);

          return matchesLocation && isAvailable && hasValidPrice;
        }

        return isAvailable && hasValidPrice;
      });

      const imageUrlFor = (image?: string, fallback = "/default-vehicle-image.jpg") =>
        image
          ? image.startsWith("http")
            ? image
            : `${API_BASE_URL}${image}`
          : fallback;

      const busesWithDetails: BusEnriched[] = filteredBuses.map((bus) => ({
        ...bus,
        imageUrl: imageUrlFor(bus.image, "/default-bus-image.jpg"),
        availableSeats: bus.totalSeats - (bus.bookedSeats?.length || 0),
        price: bus.pricePerSeat || "N/A",
      }));

      const vehiclesWithDetails: VehicleEnriched[] = filteredVehicles.map((vehicle) => ({
        ...vehicle,
        imageUrl: imageUrlFor(vehicle.image),
        price: vehicle.price || "N/A",
      }));

      setBuses(busesWithDetails);
      setVehicles(vehiclesWithDetails);
      setBrowsed(!searched);
    } catch (err) {
      console.error(err);
      toast.error(searched ? "Search failed." : "Failed to load transports.");
    } finally {
      setFetching(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!formData.pickupPoint || !formData.droppingPoint || !formData.date) {
      setShowErrors(true);
      toast.error("Please select both pickup and dropping points and a travel date.");
      return;
    }
    setShowErrors(false);
    setHasSearched(true);
    setBrowsed(false);
    setSort("date");
    await fetchAndApply({
      pickupPoint: formData.pickupPoint,
      droppingPoint: formData.droppingPoint,
      date: formData.date,
    });
  };

  const browseAll = () => {
    setHasSearched(false);
    fetchAndApply({});
  };

  const handleViewSeats = (id: string, type: "bus" | "vehicle") => {
    if (type === "bus") {
      navigate(`/Seat_Selection/${id}`);
    } else {
      navigate(`/vehicle/${id}`);
    }
  };

  const sortedBuses = useMemo(() => {
    const arr = [...buses];
    if (sort === "priceAsc") arr.sort((a, b) => toNumber(a.price) - toNumber(b.price));
    if (sort === "priceDesc") arr.sort((a, b) => toNumber(b.price) - toNumber(a.price));
    if (sort === "date")
      arr.sort(
        (a, b) =>
          (a.takeOffDate ? new Date(a.takeOffDate).getTime() : 0) -
          (b.takeOffDate ? new Date(b.takeOffDate).getTime() : 0)
      );
    return arr;
  }, [buses, sort]);

  const sortedVehicles = useMemo(() => {
    const arr = [...vehicles];
    if (sort === "priceAsc") arr.sort((a, b) => toNumber(a.price) - toNumber(b.price));
    if (sort === "priceDesc") arr.sort((a, b) => toNumber(b.price) - toNumber(a.price));
    return arr;
  }, [vehicles, sort]);

  const hasResults = buses.length > 0 || vehicles.length > 0;
  const errPickup = showErrors && !formData.pickupPoint;
  const errDrop = showErrors && !formData.droppingPoint;
  const errDate = showErrors && !formData.date;

  const fieldClass = (err: boolean) =>
    `w-full bg-transparent text-[15px] font-medium text-slate-900 outline-none ${
      err ? "text-red-600" : "text-slate-900"
    }`;

  const pickupOptions = (
    <>
      <option value="">Select pickup point</option>
      {pickupLocations.map((location) => (
        <option key={location} value={location}>
          {location}
        </option>
      ))}
    </>
  );

  const dropOptions = (
    <>
      <option value="">Select destination</option>
      {dropLocations.map((location) => (
        <option key={location} value={location}>
          {location}
        </option>
      ))}
    </>
  );

  const SwapButton = ({ onClick }: { onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label="Swap route"
      title="Swap route"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:border-blue-500 hover:text-blue-600"
    >
      <FaExchangeAlt className="rotate-90 md:rotate-0" />
    </button>
  );

  const quickDates = [
    { label: "Today", offset: 0 },
    { label: "Tomorrow", offset: 1 },
    { label: "+7 Days", offset: 7 },
  ];

  return (
    <div>
      {/* ---- Hero band ---- */}
      <section className="relative overflow-hidden">
        <img
          src={BusTicketsImg}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/75" aria-hidden />

        <div className="relative z-10 mx-auto max-w-5xl px-4 pb-32 pt-14 text-center sm:pt-20 lg:pb-36">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-300">
            Plan Your Trip
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-4xl md:text-5xl">
            Search Bus Tickets
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Search buses and vehicles for any route across Nepal, compare prices
            and book your seat in minutes.
          </p>
        </div>
      </section>

      {/* ---- Floating search card ---- */}
      <div className="relative z-20 mx-auto -mt-20 max-w-5xl px-4 sm:-mt-24">
        <form
          onSubmit={handleSearch}
          className="rounded-2xl bg-white p-5 shadow-card-lg sm:p-6"
        >
          {/* Desktop bar */}
          <div className="hidden overflow-hidden rounded-xl border border-slate-200 md:flex md:items-stretch">
            <div
              className={`flex-1 border-r border-slate-200 p-4 ${
                errPickup ? "bg-red-50/60" : ""
              }`}
            >
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                From
              </label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-0 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
                <select
                  name="pickupPoint"
                  value={formData.pickupPoint}
                  onChange={handleChange}
                  className={`pl-5 ${fieldClass(errPickup)}`}
                >
                  {pickupOptions}
                </select>
              </div>
              {errPickup && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  Please choose a pickup point.
                </p>
              )}
            </div>

            <div className="flex items-center px-1.5">
              <SwapButton onClick={swapRoute} />
            </div>

            <div
              className={`flex-1 border-r border-slate-200 p-4 ${
                errDrop ? "bg-red-50/60" : ""
              }`}
            >
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                To
              </label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-0 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
                <select
                  name="droppingPoint"
                  value={formData.droppingPoint}
                  onChange={handleChange}
                  className={`pl-5 ${fieldClass(errDrop)}`}
                >
                  {dropOptions}
                </select>
              </div>
              {errDrop && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  Please choose a destination.
                </p>
              )}
            </div>

            <div
              className={`flex-1 border-r border-slate-200 p-4 ${
                errDate ? "bg-red-50/60" : ""
              }`}
            >
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Travel Date
              </label>
              <div className="relative">
                <AiOutlineCalendar className="absolute left-0 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`pl-5 ${fieldClass(errDate)}`}
                />
              </div>
              {errDate && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  Please choose a date.
                </p>
              )}
            </div>

            <div className="flex items-center p-3">
              <button
                type="submit"
                disabled={fetching}
                className="btn-primary h-full w-full !rounded-lg !px-8"
              >
                {fetching ? <FaSpinner className="animate-spin" /> : <FaSearch />}
                {fetching ? "Searching…" : "Search"}
              </button>
            </div>
          </div>

          {/* Mobile stacked fields */}
          <div className="space-y-3 md:hidden">
            <div className={`rounded-xl border p-3 ${errPickup ? "border-red-300 bg-red-50/60" : "border-slate-200"}`}>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                From
              </label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-0 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
                <select
                  name="pickupPoint"
                  value={formData.pickupPoint}
                  onChange={handleChange}
                  className={`pl-5 ${fieldClass(errPickup)}`}
                >
                  {pickupOptions}
                </select>
              </div>
              {errPickup && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  Please choose a pickup point.
                </p>
              )}
            </div>

            <div className="flex justify-center">
              <SwapButton onClick={swapRoute} />
            </div>

            <div className={`rounded-xl border p-3 ${errDrop ? "border-red-300 bg-red-50/60" : "border-slate-200"}`}>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                To
              </label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-0 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
                <select
                  name="droppingPoint"
                  value={formData.droppingPoint}
                  onChange={handleChange}
                  className={`pl-5 ${fieldClass(errDrop)}`}
                >
                  {dropOptions}
                </select>
              </div>
              {errDrop && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  Please choose a destination.
                </p>
              )}
            </div>

            <div className={`rounded-xl border p-3 ${errDate ? "border-red-300 bg-red-50/60" : "border-slate-200"}`}>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Travel Date
              </label>
              <div className="relative">
                <AiOutlineCalendar className="absolute left-0 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`pl-5 ${fieldClass(errDate)}`}
                />
              </div>
              {errDate && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  Please choose a date.
                </p>
              )}
            </div>

            <button type="submit" disabled={fetching} className="btn-primary w-full !py-3">
              {fetching ? <FaSpinner className="animate-spin" /> : <FaSearch />}
              {fetching ? "Searching…" : "Search"}
            </button>
          </div>

          {/* Quick date chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Quick dates:
            </span>
            {quickDates.map(({ label, offset }) => {
              const key = dateKeyFromToday(offset);
              const active = formData.date === key;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, date: key }));
                    setShowErrors(false);
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    active
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {label}
                </button>
              );
            })}
            {formData.date && (
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, date: dateKeyFromToday(0) }))
                }
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                Reset date
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ---- Results ---- */}
      <div className="mx-auto mt-10 max-w-5xl space-y-6 px-4 pb-16">
        {fetching ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex animate-pulse flex-col gap-4 rounded-2xl bg-white p-5 shadow-card md:flex-row"
              >
                <div className="h-44 w-full rounded-xl bg-slate-200 md:h-auto md:w-52" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-2/3 rounded bg-slate-200" />
                  <div className="h-4 w-1/2 rounded bg-slate-200" />
                  <div className="h-4 w-1/3 rounded bg-slate-200" />
                </div>
                <div className="flex flex-col items-start justify-center gap-3 md:w-40 md:items-end">
                  <div className="h-6 w-24 rounded bg-slate-200" />
                  <div className="h-10 w-full rounded-xl bg-slate-200 md:w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : hasResults ? (
          <>
            {/* Filter / summary bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              {hasSearched ? (
                <div className="flex min-w-0 items-center gap-2">
                  <span className="hidden truncate rounded-full bg-blue-600/10 px-4 py-1.5 text-sm font-semibold text-blue-700 sm:inline-flex sm:items-center sm:gap-2">
                    <FaMapMarkerAlt className="shrink-0" />
                    {formData.pickupPoint} <IoMdArrowForward /> {formData.droppingPoint}
                    {formData.date && (
                      <span className="ml-1 border-l border-blue-200 pl-2">
                        {formatSummaryDate(formData.date)}
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200"
                  >
                    <FaTimes /> Clear
                  </button>
                </div>
              ) : (
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FaCar className="shrink-0 text-emerald-600" />
                  Browse all available buses &amp; vehicles
                </span>
              )}

              <div className="flex items-center gap-3">
                <label htmlFor="sort" className="hidden text-xs font-semibold uppercase tracking-wide text-slate-500 sm:block">
                  Sort
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="input-field !w-auto !py-2 text-sm"
                >
                  <option value="date">Departure</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {sortedBuses.length > 0 && (
              <div className="space-y-4">
                <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <FaBus />
                  </span>
                  Available Buses
                  <span className="rounded-full bg-blue-600/10 px-2.5 py-0.5 text-sm font-semibold text-blue-700">
                    {sortedBuses.length}
                  </span>
                </h3>
                {sortedBuses.map((bus) => (
                  <TransportCard
                    key={bus._id}
                    data={bus}
                    onSelect={() => handleViewSeats(bus._id, "bus")}
                    type="bus"
                  />
                ))}
              </div>
            )}

            {sortedVehicles.length > 0 && (
              <div className="space-y-4">
                <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <FaCar />
                  </span>
                  Available Vehicles
                  <span className="rounded-full bg-blue-600/10 px-2.5 py-0.5 text-sm font-semibold text-blue-700">
                    {sortedVehicles.length}
                  </span>
                </h3>
                {sortedVehicles.map((vehicle) => (
                  <TransportCard
                    key={vehicle._id}
                    data={vehicle}
                    onSelect={() => handleViewSeats(vehicle._id, "vehicle")}
                    type="vehicle"
                  />
                ))}
              </div>
            )}
          </>
        ) : hasSearched ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-card">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl text-slate-400">
              <FaSearch />
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">
              No buses or vehicles found
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              We couldn’t find any transport for{" "}
              <span className="font-semibold text-slate-700">
                {formData.pickupPoint || "—"} → {formData.droppingPoint || "—"}
              </span>{" "}
              {formData.date && (
                <>
                  on{" "}
                  <span className="font-semibold text-slate-700">
                    {formatSummaryDate(formData.date)}
                  </span>
                </>
              )}
              . Try a different date or destination.
            </p>
            <button onClick={clearAll} className="btn-primary mt-6">
              Clear Search
            </button>
          </div>
        ) : browsed ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-card">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl text-slate-400">
              <FaBus />
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">
              No transports available right now
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              All buses and vehicles are currently booked. Please check back later.
            </p>
            <button onClick={browseAll} className="btn-primary mt-6">
              Refresh
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BusTickets;