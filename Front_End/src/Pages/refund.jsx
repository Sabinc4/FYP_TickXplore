import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaQrcode, FaMoneyBillWave, FaArrowLeft } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { MdEventSeat, MdDirectionsBus, MdDirectionsCar } from "react-icons/md";
import { BsCalendarDate, BsCashCoin } from "react-icons/bs";

const Refunds = () => {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (userId) fetchBookings();
  }, [userId]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:3001/api/refunds/upcoming/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUpcomingBookings(res.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch upcoming bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefundRequest = async () => {
    if (!reason.trim()) {
      return toast.error("Please enter a refund reason.");
    }

    setIsSubmitting(true);
    try {
      await axios.post(
        `http://localhost:3001/api/refunds/request/${selectedBooking._id}`,
        {
          refundAmount: selectedBooking.totalPrice,
          reason,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Refund request submitted for admin approval.");
      setSelectedBooking(null);
      setReason("");
      fetchBookings();
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to submit refund request.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateRefundAmount = (booking) => {
    // Implement your refund calculation logic here
    // For example: 80% refund if cancelled more than 24 hours before departure
    return booking.totalPrice * 0.8;
  };

  const getTransportIcon = (booking) => {
    return booking.busId ? (
      <MdDirectionsBus className="text-lg text-blue-400" />
    ) : (
      <MdDirectionsCar className="text-lg text-blue-400" />
    );
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
          <FaQrcode className="text-black" />
          Refunds
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <ImSpinner8 className="text-4xl text-blue-400 animate-spin mb-4" />
            <p className="text-slate-500 text-lg">Loading your bookings...</p>
          </div>
        ) : !selectedBooking ? (
          <>
            {upcomingBookings.length === 0 ? (
              <div className="bg-slate-900 text-white rounded-2xl shadow-md p-8 text-center border border-slate-700">
                <FaMoneyBillWave className="text-4xl text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No bookings eligible for refund
                </h3>
                <p className="text-slate-400">
                  You currently don't have any upcoming bookings that qualify for
                  refunds.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {upcomingBookings.map((booking) => {
                  const isBus = !!booking.busId;
                  const title = isBus
                    ? booking.busId?.name
                    : booking.vehicleId?.name;
                  const takeOff = new Date(
                    booking.takeOffDate || booking.reservationDate
                  ).toLocaleString();
                  const estimatedRefund = calculateRefundAmount(booking);

                  return (
                    <div
                      key={booking._id}
                      className="bg-slate-900 text-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-700"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-slate-800 p-3 rounded-lg">
                          {getTransportIcon(booking)}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold">{title}</h2>
                            <span className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded-full">
                              Est. refund: ₹{estimatedRefund.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400">
                            Booking ID: {booking._id.slice(-8).toUpperCase()}
                          </p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                            <p className="text-slate-400 flex items-center gap-1">
                              <MdEventSeat />
                              Seats: {booking.selectedSeats?.join(", ") || "N/A"}
                            </p>
                            <p className="text-slate-400 flex items-center gap-1">
                              <BsCashCoin />
                              Total: ₹{booking.totalPrice}
                            </p>
                            <p className="text-slate-400 flex items-center gap-1">
                              <BsCalendarDate />
                              Departure: {takeOff}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col md:items-end">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="bg-blue-700 hover:bg-blue-800 transition px-4 py-2 rounded-md text-white font-medium"
                        >
                          Request Refund
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="bg-slate-900 text-white rounded-2xl shadow-xl p-6 max-w-2xl mx-auto border border-slate-700">
            <button
              onClick={() => setSelectedBooking(null)}
              className="flex items-center gap-2 text-slate-400 hover:text-white mb-4"
            >
              <FaArrowLeft />
              <span>Back to bookings</span>
            </button>

            <h3 className="text-xl font-semibold mb-4">
              Submit Refund Request
            </h3>
            
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-800 p-3 rounded-lg">
                  <p className="text-slate-400 text-sm">Original Amount</p>
                  <p className="font-medium">₹{selectedBooking.totalPrice}</p>
                </div>
                <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-800">
                  <p className="text-blue-300 text-sm">Estimated Refund</p>
                  <p className="font-medium text-blue-200">
                    ₹{calculateRefundAmount(selectedBooking).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-slate-400 mb-2">
                Reason for Refund <span className="text-red-400">*</span>
              </label>
              <textarea
                className="w-full h-32 bg-slate-800 border border-slate-600 rounded-lg p-3 placeholder-slate-500 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please explain why you're requesting a refund..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <p className="mt-1 text-xs text-slate-500">
                Provide details to help us process your request faster.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedBooking(null);
                  setReason("");
                }}
                className="bg-slate-700 hover:bg-slate-600 transition px-4 py-2 rounded-md"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleRefundRequest}
                className="bg-blue-700 hover:bg-blue-800 transition px-4 py-2 rounded-md disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={!reason.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <ImSpinner8 className="animate-spin inline mr-2" />
                    Processing...
                  </>
                ) : (
                  "Submit Refund"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Refunds;