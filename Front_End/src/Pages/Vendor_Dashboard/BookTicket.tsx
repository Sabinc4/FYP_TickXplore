import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaBus,
  FaCar,
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCreditCard,
  FaMoneyBillWave,
  FaCheckCircle,
} from "react-icons/fa";
import { bookingsApi, homeApi, API_BASE_URL, type Booking, type Bus, type Vehicle } from "../../api";
import { formatMoney } from "../../utils/format";
import AdminPageHeader from "../../Component/Admin Component/AdminPageHeader";
import BusSeatGrid from "../../Component/BusSeatGrid";
import BookingTicket, { getSeatLabel } from "../../Component/BookingTicket";

interface OutletContext {
  vehicles: Vehicle[];
  buses: Bus[];
  bookings: Booking[];
  loading: boolean;
  error: string;
  fetchData: () => void;
}

interface SearchForm {
  pickup: string;
  drop: string;
  date: string;
}

interface Customer {
  name: string;
  phone: string;
  email: string;
}

const toLocalDateKey = (date: string | Date): string => {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const imageUrlFor = (image?: string, fallback = "/default-bus-image.jpg") =>
  image
    ? image.startsWith("http")
      ? image
      : `${API_BASE_URL}${image}`
    : fallback;

const BookTicket = () => {
  const { buses, vehicles, bookings, fetchData } = useOutletContext<OutletContext>();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const paidParam = queryParams.get("paid") === "1";
  const bookingParam = queryParams.get("booking");

  const [form, setForm] = useState<SearchForm>({ pickup: "", drop: "", date: "" });
  const [activeTab, setActiveTab] = useState<"all" | "bus" | "vehicle">("all");

  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [covSeats, setCovSeats] = useState<number[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [reservationDate, setReservationDate] = useState("");
  const [pickupPoint, setPickupPoint] = useState("");
  const [dropPoint, setDropPoint] = useState("");

  const [customer, setCustomer] = useState<Customer>({ name: "", phone: "", email: "" });
  const [paymentMethod, setPaymentMethod] = useState<"Online" | "CashOnVisit">("CashOnVisit");
  const [processing, setProcessing] = useState(false);

  const [lastBookingId, setLastBookingId] = useState<string | null>(bookingParam || null);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  /* ---- resolve the booking to display after payment / cash booking ---- */
  useEffect(() => {
    if (!lastBookingId) return;
    const found = bookings.find((b) => b._id === lastBookingId);
    if (found) {
      setCreatedBooking(found);
      setLastBookingId(null);
    }
  }, [bookings, lastBookingId]);

  /* ---- travel options ---- */
  const pickupOptions = useMemo(
    () =>
      [...new Set(
        [
          ...buses.map((b) => b.pickupPoint),
          ...vehicles.map((v) => v.pickupPoint),
        ].filter(Boolean) as string[]
      )].sort(),
    [buses, vehicles]
  );

  const dropOptions = useMemo(
    () =>
      [...new Set(
        [
          ...buses.map((b) => b.dropPoint),
          ...vehicles.map((v) => v.dropPoint),
        ].filter(Boolean) as string[]
      )].sort(),
    [buses, vehicles]
  );

  const filteredBuses = useMemo(() => {
    const now = Date.now();
    return buses
      .filter((bus) => {
        if (form.pickup && bus.pickupPoint?.toLowerCase() !== form.pickup.toLowerCase()) return false;
        if (form.drop && bus.dropPoint?.toLowerCase() !== form.drop.toLowerCase()) return false;
        if (form.date && bus.takeOffDate && toLocalDateKey(bus.takeOffDate) !== form.date) return false;
        const hasDeparted = !!bus.takeOffDate && new Date(bus.takeOffDate).getTime() < now;
        if (hasDeparted) return false;
        return true;
      })
      .sort((a, b) =>
        (a.takeOffDate ? new Date(a.takeOffDate).getTime() : 0) -
        (b.takeOffDate ? new Date(b.takeOffDate).getTime() : 0)
      )
      .map((bus) => {
        const booked = (bus.bookedSeats || []).length;
        return { ...bus, available: bus.totalSeats - booked };
      });
  }, [buses, form]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      if (form.pickup && vehicle.pickupPoint?.toLowerCase() !== form.pickup.toLowerCase()) return false;
      if (form.drop && vehicle.dropPoint?.toLowerCase() !== form.drop.toLowerCase()) return false;
      return true;
    });
  }, [vehicles, form]);
const resultsEmpty =
    (activeTab === "all" && filteredBuses.length === 0 && filteredVehicles.length === 0) ||
    (activeTab === "bus" && filteredBuses.length === 0) ||
    (activeTab === "vehicle" && filteredVehicles.length === 0);
  /* ---- select a trip ---- */
  const selectBus = async (bus: Bus) => {
    setLoadingDetails(true);
    try {
      const [detail, cov] = await Promise.all([
        homeApi.getBusById(bus._id),
        bookingsApi.getCovSeats(bus._id),
      ]);
      setSelectedBus(detail.bus || bus);
      setSelectedVehicle(null);
      setSelectedSeats([]);
      setCovSeats((cov.covSeats || []).map(Number));
      if (detail.bus?.takeOffDate && detail.bus?.pickupPoint && detail.bus?.dropPoint) {
        setForm((prev) => ({
          pickup: prev.pickup,
          drop: prev.drop,
          date: toLocalDateKey(detail.bus.takeOffDate!),
        }));
      }
    } catch (err) {
      console.error("Select bus error:", err);
      toast.error("Failed to load bus details.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const selectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setSelectedBus(null);
    setSelectedSeats([]);
    setPickupPoint(vehicle.pickupPoint || "");
    setDropPoint(vehicle.dropPoint || "");
    setReservationDate("");
  };

  const toggleSeat = (seatNumber: number) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((num) => num !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  /* ---- pricing -- */
  const totalPrice = useMemo(() => {
    if (selectedBus) return selectedBus.pricePerSeat * selectedSeats.length;
    if (selectedVehicle) return selectedVehicle.price || 0;
    return 0;
  }, [selectedBus, selectedVehicle, selectedSeats]);

  const resetAll = () => {
    setSelectedBus(null);
    setSelectedVehicle(null);
    setSelectedSeats([]);
    setCovSeats([]);
    setReservationDate("");
    setPickupPoint("");
    setDropPoint("");
    setCustomer({ name: "", phone: "", email: "" });
    setCreatedBooking(null);
    setLastBookingId(null);
    navigate(location.pathname, { replace: true });
    window.scrollTo(0, 0);
  };

  /* ---- submit ---- */
  const validateCustomer = () => {
    if (!customer.name.trim()) return "Customer name is required.";
    if (paymentMethod === "Online" && !customer.email.trim()) return "Customer email is required for online payment.";
    if (selectedBus && selectedSeats.length === 0) return "Please select at least one seat.";
    if (selectedVehicle && (!reservationDate || !pickupPoint.trim() || !dropPoint.trim())) {
      return "Please fill the reservation date, pickup and drop locations.";
    }
    return null;
  };

  const buildPayload = () => ({
    type: selectedBus ? ("bus" as const) : ("vehicle" as const),
    itemId: selectedBus?._id || selectedVehicle?._id || "",
    seats: selectedBus ? selectedSeats : undefined,
    takeOffDate: selectedBus ? selectedBus.takeOffDate : reservationDate,
    pickupPoint: selectedVehicle ? pickupPoint : undefined,
    dropPoint: selectedVehicle ? dropPoint : undefined,
    customerName: customer.name.trim(),
    customerPhone: customer.phone.trim(),
    customerEmail: customer.email.trim(),
  });

  const handleConfirm = async () => {
    const invalid = validateCustomer();
    if (invalid) {
      toast.error(invalid);
      return;
    }

    // Re-check vehicle availability right before committing.
    if (selectedVehicle) {
      try {
        const res = await bookingsApi.getReservationsByVehicle(selectedVehicle._id);
        if (res.length > 0) {
          toast.error("This vehicle just got reserved. Please choose another.");
          return;
        }
      } catch {
        toast.error("Could not verify vehicle availability.");
        return;
      }
    }

    setProcessing(true);
    try {
      const payload = buildPayload();

      if (paymentMethod === "CashOnVisit") {
        const res = (await bookingsApi.cashOnVisit(payload)) as { bookingId?: string };
        toast.success("Booking placed. Cash on Visit is pending confirmation.");
        if (res.bookingId) setLastBookingId(res.bookingId);
        setSelectedBus(null);
        setSelectedVehicle(null);
        setSelectedSeats([]);
        setCustomer({ name: "", phone: "", email: "" });
        window.scrollTo(0, 0);
        await fetchData();
      } else {
        const res = (await bookingsApi.initiatePayment(payload)) as { payment_url?: string };
        if (res.payment_url) {
          window.open(res.payment_url, "_blank", "noopener,noreferrer");
          toast.info("Complete payment in the new tab. Your ticket will appear here after payment.");
        } else {
          toast.error("Payment initiation failed. Please try again.");
        }
      }
    } catch (err) {
      const axiosErr = err as {
        response?: { status?: number; data?: { message?: string; code?: string; conflictSeats?: number[] } };
        message?: string;
      };
      console.error("Booking error:", axiosErr);

      const respData = axiosErr.response?.data || {};
      const status = axiosErr.response?.status;
      const isConflict = status === 409 || respData.code === "SEAT_CONFLICT" || respData.code === "VEHICLE_CONFLICT";

      if (isConflict) {
        const conflictSeats = respData.conflictSeats || [];
        toast.error(respData.message || "Selection just became unavailable. Please re-check and try again.");

        // Auto-recover: re-fetch availability and drop the conflicted seats so
        // the vendor can immediately re-pick and resubmit.
        if (respData.code === "SEAT_CONFLICT" && selectedBus) {
          try {
            const [detail, cov] = await Promise.all([
              homeApi.getBusById(selectedBus._id),
              bookingsApi.getCovSeats(selectedBus._id),
            ]);
            if (detail.bus) setSelectedBus(detail.bus);
            setCovSeats((cov.covSeats || []).map(Number));
            setSelectedSeats((prev) => prev.filter((seat) => !conflictSeats.includes(seat)));
          } catch {
            // Fresh state failed to load; leave the current bus details intact.
          }
        } else if (respData.code === "VEHICLE_CONFLICT") {
          setSelectedVehicle(null);
          setSelectedSeats([]);
        }
      } else {
        toast.error(axiosErr.response?.data?.message || axiosErr.message || "Failed to create booking.");
      }
    } finally {
      setProcessing(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-gray-300 p-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30";

  /* ======================= RENDER ======================= */
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Book a Ticket"
        subtitle="Search your fleet, pick seats or a vehicle, and book for a customer — online or cash on visit."
      >
        <span className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-indigo-700 shadow">
          {buses.length} buses · {vehicles.length} vehicles
        </span>
        <Link
          to="/VendorDashboard/bookings"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm transition-colors hover:bg-indigo-50"
        >
          View Bookings
        </Link>
      </AdminPageHeader>

      {paidParam && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-800">
          <FaCheckCircle className="mt-0.5 shrink-0 text-emerald-600" />
          <div>
            <p className="font-semibold">Payment successful</p>
            <p className="text-sm">
              The online payment was recorded. Your ticket is below — you can download it or book another trip.
            </p>
          </div>
        </div>
      )}

      {createdBooking ? (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-5 shadow-card sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">Ticket Issued</h2>
            <p className="text-sm text-slate-500">
              Booking {createdBooking._id.slice(-8).toUpperCase()} is visible in the Bookings section
              under Payment Management for confirmation and settlement.
            </p>
          </div>
          <BookingTicket booking={createdBooking} />
          <div className="flex flex-wrap gap-3">
            <button
              onClick={resetAll}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Book another
            </button>
            <Link
              to="/VendorDashboard/bookings"
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Go to Bookings
            </Link>
          </div>
        </div>
      ) : selectedBus || selectedVehicle ? (
        /* ------------------------------------------------ */
        /*  Trip selected → seats/details + customer + pay  */
        /* ------------------------------------------------ */
        <div className="space-y-6">
          <button
            onClick={() => {
              setSelectedBus(null);
              setSelectedVehicle(null);
              setSelectedSeats([]);
            }}
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            <FaArrowLeft /> Back to search
          </button>

          {selectedBus ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <section className="rounded-2xl bg-white p-5 shadow-card sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-xl font-bold text-slate-900">{selectedBus.name}</h2>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                      {selectedBus.pricePerSeat} / seat
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <FaMapMarkerAlt className="text-teal-600" />
                      {selectedBus.pickupPoint}
                    </span>
                    <FaArrowRight className="text-slate-400" />
                    <span className="flex items-center gap-1.5">
                      <FaMapMarkerAlt className="text-rose-500" />
                      {selectedBus.dropPoint}
                    </span>
                    <span className="ml-2 flex items-center gap-1.5">
                      <FaCalendarAlt className="text-indigo-500" />
                      {selectedBus.takeOffDate
                        ? new Date(selectedBus.takeOffDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "TBD"}
                    </span>
                  </div>
                  {loadingDetails && (
                    <p className="mt-3 text-sm font-medium text-amber-600">Refreshing seat availability…</p>
                  )}
                </section>

                <BusSeatGrid
                  bus={selectedBus}
                  selectedSeats={selectedSeats}
                  covSeats={covSeats}
                  onToggle={toggleSeat}
                />

                <section className="rounded-2xl bg-white p-5 shadow-card sm:p-6">
                  <h2 className="mb-3 text-lg font-bold text-slate-900">Selected Seats</h2>
                  {selectedSeats.length === 0 ? (
                    <p className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">
                      No seats selected yet — tap seats on the bus map to choose.
                    </p>
                  ) : (
                    <div className="rounded-xl bg-teal-50/60 p-3">
                      <div className="flex flex-wrap gap-2">
                        {selectedSeats.map((seat) => (
                          <button
                            key={seat}
                            onClick={() => toggleSeat(seat)}
                            title="Deselect seat"
                            className="group flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-bold text-white shadow-sm transition hover:bg-rose-500"
                          >
                            {getSeatLabel(seat)}
                            <span className="text-xs text-teal-100 group-hover:block hidden">×</span>
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-teal-200 pt-3">
                        <p className="text-sm text-slate-600">
                          {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""} × {selectedBus.pricePerSeat}
                        </p>
                        <p className="text-xl font-bold text-slate-900">{formatMoney(totalPrice)}</p>
                      </div>
                    </div>
                  )}
                </section>
              </div>

              <div className="space-y-4">
                <CustomerPaymentPanel
                  customer={customer}
                  setCustomer={setCustomer}
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  totalPrice={totalPrice}
                  processing={processing}
                  onConfirm={handleConfirm}
                />
              </div>
            </div>
          ) : selectedVehicle ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <section className="rounded-2xl bg-white p-5 shadow-card sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-xl font-bold text-slate-900">{selectedVehicle.name}</h2>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                      {formatMoney(selectedVehicle.price)}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <FaMapMarkerAlt className="text-teal-600" />
                      {selectedVehicle.pickupPoint || "N/A"}
                    </span>
                    <FaArrowRight className="text-slate-400" />
                    <span className="flex items-center gap-1.5">
                      <FaMapMarkerAlt className="text-rose-500" />
                      {selectedVehicle.dropPoint || "N/A"}
                    </span>
                    <span className="ml-2">
                      {selectedVehicle.isAvailable !== false ? (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                          Available
                        </span>
                      ) : (
                        <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                          Booked
                        </span>
                      )}
                    </span>
                  </div>
                  <img
                    src={imageUrlFor(selectedVehicle.image, "/default-vehicle.jpg")}
                    alt={selectedVehicle.name}
                    className="mt-4 aspect-video w-full rounded-xl object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/default-vehicle.jpg";
                    }}
                  />
                </section>

                <section className="rounded-2xl bg-white p-5 shadow-card sm:p-6">
                  <h2 className="mb-4 text-lg font-bold text-slate-900">Reservation Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="resDate" className="mb-1.5 block text-sm font-medium text-slate-700">
                        Reservation Date
                      </label>
                      <input
                        id="resDate"
                        type="date"
                        className={inputCls}
                        value={reservationDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setReservationDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="vehPickup" className="mb-1.5 block text-sm font-medium text-slate-700">
                        Pickup Location
                      </label>
                      <input
                        id="vehPickup"
                        type="text"
                        className={inputCls}
                        placeholder="Pickup location"
                        value={pickupPoint}
                        onChange={(e) => setPickupPoint(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="vehDrop" className="mb-1.5 block text-sm font-medium text-slate-700">
                        Drop-off Location
                      </label>
                      <input
                        id="vehDrop"
                        type="text"
                        className={inputCls}
                        placeholder="Drop-off location"
                        value={dropPoint}
                        onChange={(e) => setDropPoint(e.target.value)}
                      />
                    </div>
                  </div>
                </section>
              </div>

              <div className="space-y-4">
                <CustomerPaymentPanel
                  customer={customer}
                  setCustomer={setCustomer}
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  totalPrice={totalPrice}
                  processing={processing}
                  onConfirm={handleConfirm}
                />
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        /* ------------------------------------------------ */
        /*  Search fleet                                     */
        /* ------------------------------------------------ */
        <div className="space-y-6">
          <section className="rounded-2xl bg-white p-5 shadow-card sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-900">Find a trip</h2>
              <div className="flex items-center gap-2">
                {(["all", "bus", "vehicle"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                      activeTab === tab
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-gray-300 text-gray-600 hover:bg-slate-50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
            >
              <div>
                <label htmlFor="pickup" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Pickup
                </label>
                <select
                  id="pickup"
                  className={inputCls}
                  value={form.pickup}
                  onChange={(e) => setForm((prev) => ({ ...prev, pickup: e.target.value }))}
                >
                  <option value="">Anywhere</option>
                  {pickupOptions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="drop" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Destination
                </label>
                <select
                  id="drop"
                  className={inputCls}
                  value={form.drop}
                  onChange={(e) => setForm((prev) => ({ ...prev, drop: e.target.value }))}
                >
                  <option value="">Anywhere</option>
                  {dropOptions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Travel Date (buses)
                </label>
                <input
                  id="date"
                  type="date"
                  className={inputCls}
                  value={form.date}
                  onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ pickup: "", drop: "", date: "" })}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100"
                >
                  Clear
                </button>
              </div>
            </form>
          </section>

          {activeTab !== "vehicle" && filteredBuses.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">Buses</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredBuses.map((bus) => (
                  <div key={bus._id} className="rounded-2xl bg-white p-4 shadow-card sm:p-5">
                    <div className="flex items-start gap-3">
                      <img
                        src={imageUrlFor(bus.image)}
                        alt={bus.name}
                        className="h-16 w-16 shrink-0 rounded-xl object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/default-bus-image.jpg";
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="flex items-center gap-2 truncate font-bold text-slate-900">
                          <FaBus className="shrink-0 text-indigo-600" />
                          {bus.name || bus.busName || "Bus"}
                        </h3>
                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                          <FaMapMarkerAlt className="text-teal-600" />
                          {bus.pickupPoint} <FaArrowRight className="text-slate-400" /> {bus.dropPoint}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                          <FaCalendarAlt className="text-indigo-500" />
                          {bus.takeOffDate
                            ? new Date(bus.takeOffDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Date TBD"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                      <div>
                        <p className="text-sm text-slate-500">
                          {bus.available} seats free · {formatMoney(bus.pricePerSeat)}/seat
                        </p>
                      </div>
                      <button
                        onClick={() => selectBus(bus)}
                        disabled={loadingDetails}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {loadingDetails ? "Loading…" : "Book"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab !== "bus" && filteredVehicles.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">Vehicles</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredVehicles.map((vehicle) => {
                  const unavailable = vehicle.isAvailable === false;
                  return (
                    <div key={vehicle._id} className="rounded-2xl bg-white p-4 shadow-card sm:p-5">
                      <div className="flex items-start gap-3">
                        <img
                          src={imageUrlFor(vehicle.image, "/default-vehicle.jpg")}
                          alt={vehicle.name}
                          className="h-16 w-16 shrink-0 rounded-xl object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/default-vehicle.jpg";
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="flex items-center gap-2 truncate font-bold text-slate-900">
                            <FaCar className="shrink-0 text-indigo-600" />
                            {vehicle.name}
                          </h3>
                          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                            <FaMapMarkerAlt className="text-teal-600" />
                            {vehicle.pickupPoint || "N/A"} <FaArrowRight className="text-slate-400" />{" "}
                            {vehicle.dropPoint || "N/A"}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {vehicle.totalSeats || vehicle.capacity || "—"} seats · {formatMoney(vehicle.price)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            unavailable
                              ? "bg-rose-100 text-rose-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {unavailable ? "Booked" : "Available"}
                        </span>
                        <button
                          onClick={() => selectVehicle(vehicle)}
                          disabled={unavailable}
                          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Reserve
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {resultsEmpty && (
            <div className="rounded-2xl bg-white p-10 text-center shadow-card">
              <h3 className="text-lg font-semibold text-slate-900">No matching trips</h3>
              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                Try clearing the filters, or check that your transport has been added.
              </p>
              <button
                onClick={() => setForm({ pickup: "", drop: "", date: "" })}
                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface CustomerPaymentPanelProps {
  customer: Customer;
  setCustomer: (c: Customer) => void;
  paymentMethod: "Online" | "CashOnVisit";
  setPaymentMethod: (m: "Online" | "CashOnVisit") => void;
  totalPrice: number;
  processing: boolean;
  onConfirm: () => void;
}

const CustomerPaymentPanel = ({
  customer,
  setCustomer,
  paymentMethod,
  setPaymentMethod,
  totalPrice,
  processing,
  onConfirm,
}: CustomerPaymentPanelProps) => {
  const inputCls =
    "w-full rounded-xl border border-gray-300 p-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30";

  return (
    <>
      <section className="rounded-2xl bg-white p-5 shadow-card sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-slate-900">Customer Details</h2>
        <p className="mb-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
          Walk-in customers don&apos;t need an account. These details are used for the ticket, receipts and payment.
        </p>
        <div className="space-y-4">
          <div>
            <label htmlFor="custName" className="mb-1.5 block text-sm font-medium text-slate-700">
              Name *
            </label>
            <input
              id="custName"
              type="text"
              className={inputCls}
              placeholder="Customer name"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="custPhone" className="mb-1.5 block text-sm font-medium text-slate-700">
              Phone
            </label>
            <input
              id="custPhone"
              type="tel"
              className={inputCls}
              placeholder="Phone number"
              value={customer.phone}
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="custEmail" className="mb-1.5 block text-sm font-medium text-slate-700">
              Email {paymentMethod === "Online" ? "*" : ""}
            </label>
            <input
              id="custEmail"
              type="email"
              className={inputCls}
              placeholder="Customer email"
              value={customer.email}
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-card sm:p-6">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Payment Method</h2>
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5">
          <button
            type="button"
            onClick={() => setPaymentMethod("Online")}
            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              paymentMethod === "Online"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-600 hover:bg-white"
            }`}
          >
            <FaCreditCard /> Pay via Khalti
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod("CashOnVisit")}
            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              paymentMethod === "CashOnVisit"
                ? "bg-emerald-600 text-white shadow"
                : "text-slate-600 hover:bg-white"
            }`}
          >
            <FaMoneyBillWave /> Cash on Visit
          </button>
        </div>
        {paymentMethod === "CashOnVisit" && (
          <p className="mt-3 rounded-xl bg-blue-50 p-3 text-xs text-blue-700">
            Booking stays pending until you collect cash and confirm the payment from the Bookings section.
          </p>
        )}
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-card sm:p-6">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Summary</h2>
        <div className="space-y-1.5 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>Total</span>
            <span className="font-bold text-slate-900">{formatMoney(totalPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span>Platform commission (10%)</span>
            <span className="font-semibold text-slate-700">{formatMoney(totalPrice * 0.1)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-2">
            <span>Vendor earnings</span>
            <span className="font-semibold text-emerald-700">{formatMoney(totalPrice * 0.9)}</span>
          </div>
        </div>
        <button
          onClick={onConfirm}
          disabled={processing}
          className="mt-5 w-full rounded-xl bg-indigo-600 py-3 text-base font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {processing
            ? "Processing…"
            : paymentMethod === "Online"
            ? "Proceed to Payment"
            : "Confirm Booking"}
        </button>
      </section>
    </>
  );
};

export default BookTicket;