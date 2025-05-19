import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const userIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149060.png',
  iconSize: [32, 32],
});

const vehicleIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854894.png',
  iconSize: [32, 32],
});

const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/61/61112.png',
  iconSize: [32, 32],
});

const LiveTracker = () => {
  const { type, id } = useParams();
  const [userPosition, setUserPosition] = useState(null);
  const [vendorPosition, setVendorPosition] = useState(null);
  const [departureTime, setDepartureTime] = useState(null);
  const [liveTrackingEnabled, setLiveTrackingEnabled] = useState(false);

  // 1️⃣ Track User Location and Send to Server
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserPosition({ lat: latitude, lng: longitude });

        const userId = localStorage.getItem("userId");
        if (userId) {
          try {
            await fetch(`http://localhost:3001/api/users/${userId}/location`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ latitude, longitude }),
            });
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

  // 2️⃣ Fetch Initial Vendor Data (Takeoff Time & First Location)
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!type || !id) return;

      const endpoint = type === 'bus' ? 'buses' : 'vehicles';

      try {
        const res = await fetch(`http://localhost:3001/api/${endpoint}/${id}`);
        const data = await res.json();

        // Get departure time
        const depTime = type === 'bus'
          ? data.bus?.takeOffDate
          : data.vehicle?.reservations?.[0]?.reservedFrom;

        if (depTime) setDepartureTime(new Date(depTime));

        // Get initial location
        const location = type === 'bus'
          ? data.bus?.currentLocation
          : data.vehicle?.currentLocation;

        if (location?.latitude && location?.longitude) {
          setVendorPosition({ lat: location.latitude, lng: location.longitude });
        }
      } catch (err) {
        console.error("Initial data fetch failed:", err);
      }
    };

    fetchInitialData();
  }, [type, id]);

  // 3️⃣ Start Live Polling After Departure
  useEffect(() => {
    if (!departureTime) return;

    const interval = setInterval(async () => {
      const now = new Date();
      if (now >= departureTime) {
        setLiveTrackingEnabled(true);

        try {
          const res = await fetch(`http://localhost:3001/api/${type}s/${id}/location`);
          const data = await res.json();

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
    <div className="w-full min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4 text-center">Live Tracker</h2>

      <MapContainer
        center={vendorPosition || { lat: 27.7172, lng: 85.324 }} // Kathmandu fallback
        zoom={14}
        scrollWheelZoom
        style={{ height: '600px', width: '100%' }}
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
            icon={type === 'bus' ? busIcon : vehicleIcon}
          >
            <Popup>{type === 'bus' ? 'Bus Location 🚌' : 'Vehicle Location 🚗'}</Popup>
          </Marker>
        )}
      </MapContainer>

      <div className="mt-6 bg-white shadow p-4 rounded-md w-full max-w-md text-center">
        <p><strong>Type:</strong> {type?.toUpperCase()}</p>
        <p><strong>Departure Time:</strong> {departureTime?.toLocaleString() || "Loading..."}</p>
        <p><strong>Tracking:</strong> {liveTrackingEnabled ? "✅ Live" : "⏳ Waiting for Departure"}</p>
      </div>
    </div>
  );
};

export default LiveTracker;
