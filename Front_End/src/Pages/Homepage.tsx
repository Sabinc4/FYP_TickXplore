import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { homeApi, API_BASE_URL } from "../api";

// Today's local calendar date as YYYY-MM-DD.
const localTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

interface HomepageFormData {
  pickupPoint: string;
  droppingPoint: string;
  date: string;
}

const Homepage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<HomepageFormData>({
    pickupPoint: "",
    droppingPoint: "",
    date: localTodayKey(),
  });

  const [pickupLocations, setPickupLocations] = useState<string[]>([]);
  const [dropLocations, setDropLocations] = useState<string[]>([]);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [title, setTitle] = useState("");
  const [fetchingLocations, setFetchingLocations] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const content = await homeApi.getContent();
        if (content.backgroundImage) {
          setBackgroundImage(
            content.backgroundImage.startsWith("http")
              ? content.backgroundImage
              : `${API_BASE_URL}${content.backgroundImage}`
          );
        }
        setTitle(content.title || "");
      } catch (err) {
        console.error("Error fetching homepage content:", err);
        setError("Failed to load homepage content. Please try again.");
      }
    };

    const fetchLocations = async () => {
      try {
        const [busContent, vehicleContent] = await Promise.all([
          homeApi.getBuses({ homepage: true }),
          homeApi.getVehicles({ homepage: true }),
        ]);

        const buses = (busContent.data || busContent.buses || []) as Array<{
          pickupPoint?: string;
          dropPoint?: string;
        }>;
        const vehicles = (vehicleContent.data || vehicleContent.vehicles || []) as Array<{
          pickupPoint?: string;
          dropPoint?: string;
        }>;

        setPickupLocations(
          [...new Set([...buses.map((b) => b.pickupPoint), ...vehicles.map((v) => v.pickupPoint)])].filter(
            (loc): loc is string => Boolean(loc)
          )
        );
        setDropLocations(
          [...new Set([...buses.map((b) => b.dropPoint), ...vehicles.map((v) => v.dropPoint)])].filter(
            (loc): loc is string => Boolean(loc)
          )
        );
      } catch (err) {
        console.error("Error fetching locations:", err);
        setError("Failed to load locations. Please try again.");
      } finally {
        setFetchingLocations(false);
      }
    };

    fetchHomepageData();
    fetchLocations();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.pickupPoint || !formData.droppingPoint) {
      toast.error("Please select both Pickup and Dropping Points.");
      return;
    }

    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error("Please select a date that is not in the past.");
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      navigate(
        `/tickets?pickup=${encodeURIComponent(formData.pickupPoint)}&drop=${encodeURIComponent(formData.droppingPoint)}&date=${encodeURIComponent(formData.date)}`
      );
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="relative flex min-h-[88vh] flex-col">
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-slate-900/60" aria-hidden />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-16">
        <h2 className="mb-10 max-w-3xl text-center text-3xl font-bold text-white drop-shadow-lg sm:text-4xl md:text-5xl">
          {title}
        </h2>

        <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-white/95 p-5 shadow-card-lg backdrop-blur sm:p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Pickup Point
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {/* <FaMapMarkerAlt className="text-lg" /> */}
                </div>
                <select
                  name="pickupPoint"
                  value={formData.pickupPoint}
                  onChange={handleChange}
                  className="input-field"
                  required
                  disabled={fetchingLocations}
                >
                  <option value="" disabled>
                    Select Pickup Point
                  </option>
                  {fetchingLocations ? (
                    <option>Loading...</option>
                  ) : (
                    pickupLocations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Dropping Point
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {/* <FaMapMarkerAlt className="text-lg" /> */}
                </div>
                <select
                  name="droppingPoint"
                  value={formData.droppingPoint}
                  onChange={handleChange}
                  className="input-field"
                  required
                  disabled={fetchingLocations}
                >
                  <option value="" disabled>
                    Select Dropping Point
                  </option>
                  {fetchingLocations ? (
                    <option>Loading...</option>
                  ) : (
                    dropLocations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Date
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {/* <FaCalendarAlt className="text-lg" /> */}
                </div>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={localTodayKey()}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary !py-3 sm:mt-0"
              disabled={loading || fetchingLocations}
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <>
                  <FaSearch /> Find Tickets
                </>
              )}
            </button>
          </form>
          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Homepage;