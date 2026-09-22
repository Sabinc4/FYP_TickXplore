import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaMapMarkerAlt, FaSpinner, FaChair } from "react-icons/fa";
import { AiOutlineCalendar } from "react-icons/ai";
import { IoMdArrowForward } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import { homeApi, API_BASE_URL, type Bus, type Vehicle } from "../api";

interface BusEnriched extends Bus {
  imageUrl?: string;
  availableSeats?: number;
  price?: number | "N/A";
}

interface VehicleEnriched extends Omit<Vehicle, "price"> {
  imageUrl?: string;
  price?: number | "N/A";
}

interface SearchFormData {
  pickupPoint: string;
  droppingPoint: string;
  date: string;
}

// Local calendar date as YYYY-MM-DD (avoids the UTC vs local off-by-one).
const toLocalDateKey = (date: string | Date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

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

  const handleSearch = async () => {
    if (!formData.pickupPoint || !formData.droppingPoint) {
      toast.error("Please select both Pickup and Dropping Points.");
      return;
    }
    if (!formData.date) {
      toast.error("Please select a travel date.");
      return;
    }
    setFetching(true);
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
          (!formData.pickupPoint ||
            bus.pickupPoint?.toLowerCase() === formData.pickupPoint.toLowerCase()) &&
          (!formData.droppingPoint ||
            bus.dropPoint?.toLowerCase() === formData.droppingPoint.toLowerCase());

        const matchesDate = busDate === formData.date;
        const hasAvailableSeats = (bus.totalSeats - (bus.bookedSeats?.length || 0)) > 0;
        const hasValidPrice = bus.pricePerSeat > 0;
        const hasDeparted = !!bus.takeOffDate && new Date(bus.takeOffDate).getTime() < Date.now();

        return matchesLocation && matchesDate && hasAvailableSeats && hasValidPrice && !hasDeparted;
      });

      const filteredVehicles = allVehicles.filter((vehicle) => {
        const isAvailable = vehicle.isAvailable !== false;
        const hasValidPrice = vehicle.price > 0;
        const hasLocationData = vehicle.pickupPoint && vehicle.dropPoint;

        if (hasLocationData) {
          const matchesLocation =
            (!formData.pickupPoint ||
              vehicle.pickupPoint!.toLowerCase() === formData.pickupPoint.toLowerCase()) &&
            (!formData.droppingPoint ||
              vehicle.dropPoint!.toLowerCase() === formData.droppingPoint.toLowerCase());

          return matchesLocation && isAvailable && hasValidPrice;
        } else {
          return isAvailable && hasValidPrice;
        }
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

      if (filteredBuses.length === 0 && filteredVehicles.length === 0) {
        toast.info("No available buses or vehicles found for selected criteria");
      }
    } catch (err) {
      console.error(err);
      toast.error("Search failed.");
    } finally {
      setFetching(false);
    }
  };

  const handleViewSeats = (id: string, type: "bus" | "vehicle") => {
    if (type === "bus") {
      navigate(`/Seat_Selection/${id}`);
    } else {
      navigate(`/vehicle/${id}`);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-5xl rounded-2xl bg-white p-4 shadow-card sm:p-6">
      <h2 className="mb-6 text-center text-2xl font-bold text-slate-900">
        Search Bus Tickets
      </h2>

      <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-4">
        <div className="md:col-span-1">
          <label className="mb-2 block text-sm font-medium text-slate-700">From</label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              name="pickupPoint"
              value={formData.pickupPoint}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select pickup point</option>
              {pickupLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="md:col-span-1">
          <label className="mb-2 block text-sm font-medium text-slate-700">To</label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              name="droppingPoint"
              value={formData.droppingPoint}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select destination</option>
              {dropLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="md:col-span-1">
          <label className="mb-2 block text-sm font-medium text-slate-700">Travel Date</label>
          <div className="relative">
            <AiOutlineCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>

        <div className="md:col-span-1">
          <button
            onClick={handleSearch}
            disabled={fetching}
            className="btn-primary w-full"
          >
            {fetching ? <FaSpinner className="animate-spin" /> : "Search"}
          </button>
        </div>
      </div>

      <button
        onClick={() => {
          setFormData({ pickupPoint: "", droppingPoint: "", date: "" });
          setBuses([]);
          setVehicles([]);
        }}
        className="mt-4 w-full rounded-xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-300 md:w-auto"
      >
        Clear Filters
      </button>

      <div className="mt-8 space-y-6">
        {fetching ? (
          <div className="flex items-center justify-center gap-4 py-8">
            <FaSpinner className="animate-spin text-4xl text-blue-600" />
            <span className="text-lg text-slate-600">
              Searching for available transport...
            </span>
          </div>
        ) : (
          <>
            {buses.length > 0 && (
              <div className="space-y-4">
                <h3 className="border-b pb-2 text-xl font-bold text-slate-900">
                  Available Buses ({buses.length})
                </h3>
                {buses.map((bus) => (
                  <TransportCard
                    key={bus._id}
                    data={bus}
                    onSelect={() => handleViewSeats(bus._id, "bus")}
                    type="bus"
                  />
                ))}
              </div>
            )}

            {vehicles.length > 0 && (
              <div className="space-y-4">
                <h3 className="border-b pb-2 text-xl font-bold text-slate-900">
                  Available Vehicles ({vehicles.length})
                </h3>
                {vehicles.map((vehicle) => (
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
        )}
      </div>
    </div>
  );
};

interface TransportCardProps {
  data: BusEnriched | VehicleEnriched;
  onSelect: () => void;
  type: "bus" | "vehicle";
}

const TransportCard = ({ data, onSelect, type }: TransportCardProps) => {
  if (!data || !data.name) return null;

  return (
    <div className="flex flex-col items-center justify-between rounded-2xl bg-white p-6 shadow-card transition-shadow hover:shadow-card-lg md:flex-row">
      <div className="flex-1">
        <h3 className="text-xl font-bold text-slate-900">{data.name}</h3>

        <div className="mt-4 flex items-center gap-4 text-slate-600">
          <span className="flex items-center">
            <FaMapMarkerAlt className="mr-2 text-blue-500" />
            {data.pickupPoint || "N/A"}
          </span>
          <IoMdArrowForward className="text-slate-400" />
          <span className="flex items-center">
            <FaMapMarkerAlt className="mr-2 text-blue-500" />
            {data.dropPoint || "N/A"}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="flex items-center text-sm text-slate-600">
              <AiOutlineCalendar className="mr-2 text-blue-500" />
              {type === "bus"
                ? data.takeOffDate
                  ? new Date(data.takeOffDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Date not set"
                : "Flexible Reservation Date"}
            </p>

            {type === "bus" && (
              <p className="mt-2 flex items-center text-sm text-slate-600">
                <FaChair className="mr-2 text-blue-500" />
                Available: {(data as BusEnriched).availableSeats || 0}/{data.totalSeats || 0}
              </p>
            )}
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-600">
              NPR {(data as BusEnriched | VehicleEnriched).price?.toLocaleString?.() ?? "N/A"}
            </p>
            <p className="text-sm text-slate-500">
              per {type === "bus" ? "seat" : "vehicle"}
            </p>
          </div>
        </div>

        <button
          onClick={onSelect}
          className="mt-4 rounded-xl bg-emerald-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          {type === "bus" ? "View Seats & Book" : "Book Vehicle"}
        </button>
      </div>

      {(data as BusEnriched | VehicleEnriched).imageUrl && (
        <img
          src={(data as BusEnriched | VehicleEnriched).imageUrl}
          alt={data.name}
          className="mt-6 h-32 w-48 rounded-xl object-cover md:ml-6 md:mt-0"
        />
      )}
    </div>
  );
};

export default BusTickets;