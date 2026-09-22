import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { api, usersApi, homeApi } from "../api";

interface LatLng {
  lat: number;
  lng: number;
}

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
  iconSize: [32, 32],
});

const vehicleIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854894.png",
  iconSize: [32, 32],
});

const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61112.png",
  iconSize: [32, 32],
});

const LiveTracker = () => {
  const { type, id } = useParams<{ type?: string; id?: string }>();
  const [userPosition, setUserPosition] = useState<LatLng | null>(null);
  const [vendorPosition, setVendorPosition] = useState<LatLng | null>(null);
  const [departureTime, setDepartureTime] = useState<Date | null>(null);
  const [liveTrackingEnabled, setLiveTrackingEnabled] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserPosition({ lat: latitude, lng: longitude });

        const userId = localStorage.getItem("userId");
        if (userId) {
          try {
            await usersApi.updateLocation(userId, { latitude, longitude });
          } catch (error) {
            console.error("User location update failed:", error);
          }
        }
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!type || !id) return;

      try {
        if (type === "bus") {
          const data = await homeApi.getBusById(id);
          const bus = data.bus as typeof data.bus & {
            currentLocation?: { latitude: number; longitude: number };
          };
          if (bus.takeOffDate) setDepartureTime(new Date(bus.takeOffDate));
          if (bus.currentLocation?.latitude && bus.currentLocation?.longitude) {
            setVendorPosition({
              lat: bus.currentLocation.latitude,
              lng: bus.currentLocation.longitude,
            });
          }
        } else {
          const data = await homeApi.getVehicleById(id);
          const vehicle = data.vehicle as typeof data.vehicle & {
            currentLocation?: { latitude: number; longitude: number };
            reservations?: Array<{ reservedFrom?: string }>;
          };
          const depTime = vehicle.reservations?.[0]?.reservedFrom;
          if (depTime) setDepartureTime(new Date(depTime));
          if (vehicle.currentLocation?.latitude && vehicle.currentLocation?.longitude) {
            setVendorPosition({
              lat: vehicle.currentLocation.latitude,
              lng: vehicle.currentLocation.longitude,
            });
          }
        }
      } catch (err) {
        console.error("Initial data fetch failed:", err);
      }
    };

    fetchInitialData();
  }, [type, id]);

  useEffect(() => {
    if (!departureTime) return;

    const interval = setInterval(async () => {
      const now = new Date();
      if (now >= departureTime) {
        setLiveTrackingEnabled(true);

        try {
          const res = await api.get(`/api/${type}s/${id}/location`);
          const data = res.data as { latitude?: number; longitude?: number };
          if (data.latitude && data.longitude) {
            setVendorPosition({ lat: data.latitude, lng: data.longitude });
          }
        } catch (err) {
          console.error("Live location polling failed:", err);
        }
      } else {
        setLiveTrackingEnabled(false);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [departureTime, id, type]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-100 p-4">
      <h2 className="mb-4 text-center text-2xl font-bold text-slate-900">Live Tracker</h2>

      <MapContainer
        center={vendorPosition || { lat: 27.7172, lng: 85.324 }}
        zoom={14}
        scrollWheelZoom
        style={{ width: "100%" }}
        className="h-[45vh] w-full sm:h-[600px]"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userPosition && (
          <Marker position={[userPosition.lat, userPosition.lng]} icon={userIcon}>
            <Popup>You (User)</Popup>
          </Marker>
        )}

        {vendorPosition && liveTrackingEnabled && (
          <Marker
            position={[vendorPosition.lat, vendorPosition.lng]}
            icon={type === "bus" ? busIcon : vehicleIcon}
          >
            <Popup>{type === "bus" ? "Bus Location" : "Vehicle Location"}</Popup>
          </Marker>
        )}
      </MapContainer>

      <div className="mt-6 w-full max-w-md rounded-xl bg-white p-4 text-center shadow-card">
        <p>
          <strong>Type:</strong> {type?.toUpperCase()}
        </p>
        <p>
          <strong>Departure Time:</strong> {departureTime?.toLocaleString() || "Loading..."}
        </p>
        <p>
          <strong>Tracking:</strong>{" "}
          {liveTrackingEnabled ? "Live" : "Waiting for Departure"}
        </p>
      </div>
    </div>
  );
};

export default LiveTracker;