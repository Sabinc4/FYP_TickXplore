import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaUserTie,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { bookingsApi, homeApi, API_BASE_URL, type Bus } from "../api";

const SeatAvailability = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [covSeats, setCovSeats] = useState<number[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("Online");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        if (!id) return;
        const response = await homeApi.getBusById(id);
        const busData = response.bus;

        if (!busData) {
          toast.error("Bus not found.");
          setLoading(false);
          return;
        }

        busData.bookedSeats = (busData.bookedSeats || []).map(Number);
        setSelectedBus(busData);

        const covRes = await bookingsApi.getCovSeats(id);
        setCovSeats((covRes.covSeats || []).map(Number));
      } catch (error) {
        console.error("Fetch error:", error);
        showErrorToast("Failed to fetch bus data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, [id]);

  const getSeatLabel = (seatNumber: number) => {
    const row = Math.floor((seatNumber - 1) / 4);
    const col = ((seatNumber - 1) % 4) + 1;
    return `${String.fromCharCode(65 + row)}${col}`;
  };

  const handleSeatSelection = (seatNumber: number) => {
    if (!selectedBus) return;

    if (selectedBus.bookedSeats?.includes(seatNumber)) {
      showWarningToast("This seat is already booked.");
      return;
    }

    if (covSeats.includes(seatNumber)) {
      showWarningToast("This seat is reserved for Cash on Visit.");
      return;
    }

    const isSelected = selectedSeats.includes(seatNumber);
    const newSelectedSeats = isSelected
      ? selectedSeats.filter((num) => num !== seatNumber)
      : [...selectedSeats, seatNumber];

    setSelectedSeats(newSelectedSeats);
    setTotalPrice(newSelectedSeats.length * selectedBus.pricePerSeat);
  };

  const handleProceedToPayment = () => {
    if (!selectedBus) return;

    if (selectedSeats.length === 0) {
      showErrorToast("Please select at least one seat.");
      return;
    }

    if (paymentMethod === "CashOnVisit") {
      showConfirmationToast();
    } else {
      navigate("/payment", {
        state: {
          busId: selectedBus._id,
          seats: selectedSeats,
          totalPrice,
        },
      });
    }
  };

  const showErrorToast = (message: string) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 3000,
      className: "!bg-red-50 !text-red-800",
      progressClassName: "!bg-red-500",
    });
  };

  const showWarningToast = (message: string) => {
    toast.warning(message, {
      position: "top-center",
      autoClose: 3000,
      className: "!bg-yellow-50 !text-yellow-800",
      progressClassName: "!bg-yellow-500",
    });
  };

  const showCashOnVisitToast = (message: string) => {
    toast.info(message, {
      position: "top-center",
      autoClose: 5000,
      className: "!bg-blue-50 !text-blue-800",
      progressClassName: "!bg-blue-600",
    });
  };

  const showConfirmationToast = () => {
    if (!selectedBus) return;
    toast.dismiss();

    toast(
      <div className="w-full max-w-md p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <FaUserTie className="h-6 w-6 text-blue-500" />
          </div>
          <div className="ml-3 w-0 flex-1">
            <h3 className="text-lg font-medium text-gray-900">Confirm Booking</h3>
            <div className="mt-2 text-sm text-gray-600">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="font-semibold">Seats:</p>
                  <p>{selectedSeats.map(getSeatLabel).join(", ")}</p>
                </div>
                <div>
                  <p className="font-semibold">Total:</p>
                  <p>Rs. {totalPrice}</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="font-semibold">Payment Method:</p>
                <p>Cash on Visit</p>
              </div>
              <p className="mt-2 text-xs italic text-blue-600">
                * Payment will be collected when boarding. Booking stays pending
                until the vendor confirms payment at the visit.
              </p>
            </div>
            <div className="mt-4 flex space-x-3">
              <button
                onClick={confirmCashBooking}
                className="inline-flex flex-1 items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <FaCheck className="mr-2" /> Confirm
              </button>
              <button
                onClick={() => toast.dismiss()}
                className="inline-flex flex-1 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
            </div>
          </div>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        draggable: false,
        className: "!bg-white !text-gray-900 !shadow-xl !rounded-lg !p-0 !max-w-full",
      }
    );
  };

  const confirmCashBooking = async () => {
    if (!selectedBus) return;
    setIsProcessing(true);
    try {
      const response = await bookingsApi.cashOnVisit({
        type: "bus",
        itemId: selectedBus._id,
        userId: localStorage.getItem("userId"),
        seats: selectedSeats,
        takeOffDate: selectedBus.takeOffDate,
      });

      toast.dismiss();
      showCashOnVisitToast(
        `Cash on Visit booking placed! Seats: ${selectedSeats
          .map(getSeatLabel)
          .join(", ")}. Reference: ${
          (response as { bookingId?: string }).bookingId
        }. Please pay when boarding — booking is pending confirmation.`
      );

      window.setTimeout(() => {
        navigate("/my-bookings");
      }, 3000);
    } catch (err) {
      console.error("Booking error:", err);
      showErrorToast("Failed to complete booking. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <ClipLoader color="#2563eb" size={50} />
        <p className="ml-4 text-lg font-semibold text-slate-700">Loading bus data...</p>
      </div>
    );
  }

  if (!selectedBus) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold text-slate-700">No buses available.</p>
      </div>
    );
  }

  const seatStatus = (seatNumber: number): "booked" | "cov" | "selected" | "available" => {
    if (selectedBus.bookedSeats?.includes(seatNumber)) return "booked";
    if (covSeats.includes(seatNumber)) return "cov";
    if (selectedSeats.includes(seatNumber)) return "selected";
    return "available";
  };

  const seatClasses: Record<string, string> = {
    booked: "bg-red-500 text-white cursor-not-allowed",
    cov: "bg-blue-500 text-white cursor-not-allowed",
    selected: "bg-emerald-500 text-white hover:bg-emerald-600",
    available: "bg-slate-100 border hover:bg-slate-200",
  };

  const busImage =
    selectedBus.image &&
    (selectedBus.image.startsWith("http")
      ? selectedBus.image
      : `${API_BASE_URL}${selectedBus.image}`);

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
        <div className="flex-1 rounded-2xl bg-white p-4 shadow-card sm:p-6">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 sm:text-3xl">
            Journey Details
          </h2>

          {busImage && (
            <div className="mb-4 sm:mb-6">
              <img
                src={busImage}
                alt="Bus"
                className="h-48 w-full rounded-xl object-cover shadow-sm sm:h-64"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/default-bus-image.jpg";
                }}
              />
            </div>
          )}

          <div className="mb-4 space-y-3 sm:mb-6 sm:space-y-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <FaCalendarAlt className="text-slate-500" size={20} />
              <div>
                <p className="font-semibold text-slate-600">Trip Date</p>
                <p className="text-base text-slate-900 sm:text-lg">
                  {new Date(selectedBus.takeOffDate || "").toLocaleDateString("en-US")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <FaMapMarkerAlt className="text-slate-500" size={20} />
              <div>
                <p className="font-semibold text-slate-600">Pickup Point</p>
                <p className="text-base text-slate-900 sm:text-lg">{selectedBus.pickupPoint}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <FaMapMarkerAlt className="text-slate-500" size={20} />
              <div>
                <p className="font-semibold text-slate-600">Drop Point</p>
                <p className="text-base text-slate-900 sm:text-lg">{selectedBus.dropPoint}</p>
              </div>
            </div>
          </div>

          <div className="mb-4 sm:mb-6">
            <label className="mb-2 block font-medium text-slate-700">Payment Method</label>
            <select
              className="input-field"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Online">Pay via Khalti</option>
              <option value="CashOnVisit">Cash on Visit</option>
            </select>
          </div>

          <h2 className="mb-3 text-xl font-bold text-slate-900 sm:mb-4 sm:text-2xl">
            Selected Seats
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-xl">
              <thead>
                <tr className="bg-emerald-600 text-white">
                  <th className="rounded-tl-xl p-2 text-left sm:p-3">Seat</th>
                  <th className="rounded-tr-xl p-2 text-right sm:p-3">Price</th>
                </tr>
              </thead>
              <tbody>
                {selectedSeats.map((seatNumber) => (
                  <tr key={seatNumber} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-2 text-left sm:p-3">Seat {getSeatLabel(seatNumber)}</td>
                    <td className="p-2 text-right sm:p-3">Rs. {selectedBus.pricePerSeat}</td>
                  </tr>
                ))}
                <tr className="bg-slate-100">
                  <td className="p-2 text-left font-bold sm:p-3">Total</td>
                  <td className="p-2 text-right font-bold sm:p-3">Rs. {totalPrice}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <button
            onClick={handleProceedToPayment}
            disabled={isProcessing}
            className="mt-4 w-full rounded-xl bg-emerald-600 py-2 text-base font-semibold text-white transition-colors hover:bg-emerald-700 sm:mt-6 sm:py-3 sm:text-lg"
          >
            Continue to Payment
          </button>
        </div>

        <div className="flex-1 rounded-2xl bg-white p-4 shadow-card sm:p-6">
          <h2 className="mb-4 text-center text-2xl font-bold text-slate-900 sm:mb-6 sm:text-3xl">
            Bus Layout
          </h2>

          <div className="mb-3 text-center text-lg font-bold text-slate-500 sm:mb-4 sm:text-xl">
            FRONT
          </div>

          <div className="mb-2 flex justify-end pr-[30px] sm:pr-[46px]">
            <FaUserTie size={24} className="text-slate-700" />
          </div>

          <div className="mb-2 flex items-center gap-3 pl-2 sm:gap-4">
            <div className="w-10 text-center text-slate-500 sm:w-12">DOOR</div>
            <div className="w-10 sm:w-12" />
          </div>

          <div className="flex flex-col gap-2 sm:gap-3">
            {Array.from({ length: Math.ceil(selectedBus.totalSeats / 4) }, (_, rowIndex) => {
              const rowLabel = String.fromCharCode(65 + rowIndex);
              return (
                <div key={rowLabel} className="flex items-center gap-3 pl-2 sm:gap-4">
                  <div className="w-10 sm:w-12" />
                  <div className="flex gap-2 sm:gap-4">
                    {[1, 2, 3, 4].map((colNum) => {
                      const seatNumber = rowIndex * 4 + colNum;
                      if (seatNumber > selectedBus.totalSeats) return null;

                      const label = getSeatLabel(seatNumber);
                      const status = seatStatus(seatNumber);

                      let gapStyle = "";
                      if (colNum === 2) gapStyle = "mr-12 sm:mr-20";
                      if (colNum === 1 || colNum === 3) gapStyle = "mr-2 sm:mr-4";

                      return (
                        <div key={seatNumber} className={gapStyle}>
                          <button
                            onClick={() => handleSeatSelection(seatNumber)}
                            disabled={status === "booked" || status === "cov"}
                            className={`h-10 w-10 rounded-lg font-bold transition-colors sm:h-12 sm:w-12 ${seatClasses[status]}`}
                            data-seat-status={status}
                            data-seat-number={seatNumber}
                          >
                            {label}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 text-center text-lg font-bold text-slate-500 sm:mt-6 sm:text-xl">
            REAR
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="flex items-center">
              <div className="mr-2 h-4 w-4 rounded bg-emerald-500" />
              <span className="text-sm">Selected</span>
            </div>
            <div className="flex items-center">
              <div className="mr-2 h-4 w-4 rounded bg-red-500" />
              <span className="text-sm">Booked</span>
            </div>
            <div className="flex items-center">
              <div className="mr-2 h-4 w-4 rounded bg-blue-500" />
              <span className="text-sm">Cash on Visit</span>
            </div>
            <div className="flex items-center">
              <div className="mr-2 h-4 w-4 rounded border bg-slate-100" />
              <span className="text-sm">Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatAvailability;