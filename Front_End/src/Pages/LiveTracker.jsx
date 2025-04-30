import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Icons
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
  const [position, setPosition] = useState({ lat: 27.7172, lng: 85.324 }); // Default: Kathmandu
  const [departureTime, setDepartureTime] = useState(null);
  const [liveTrackingEnabled, setLiveTrackingEnabled] = useState(false);

  // Fetch Departure Time
  useEffect(() => {
    const fetchDepartureTime = async () => {
      try {
        const endpoint = type === "bus" ? "buses" : "vehicles";
        const response = await fetch(`http://localhost:3001/api/${endpoint}/${id}`);
        const data = await response.json();

        const depTime = type === "bus" 
          ? data.bus?.takeOffDate 
          : data.vehicle?.reservations?.[0]?.reservedFrom;

        if (depTime) {
          setDepartureTime(new Date(depTime));
        }
      } catch (error) {
        console.error("Error fetching departure time:", error);
      }
    };

    if (type && id) {
      fetchDepartureTime();
    }
  }, [type, id]);

  // Fetch Live Location after departure
  useEffect(() => {
    if (!departureTime) return;

    const interval = setInterval(async () => {
      const now = new Date();

      if (now >= departureTime) {
        setLiveTrackingEnabled(true);

        try {
          const response = await fetch(`http://localhost:3001/api/${type}s/${id}/location`);
          const data = await response.json();

          if (data.latitude && data.longitude) {
            setPosition({ lat: data.latitude, lng: data.longitude });
          }
        } catch (error) {
          console.error("Error fetching live location:", error);
        }
      } else {
        setLiveTrackingEnabled(false);
      }
    }, 3000); // update every 3 seconds

    return () => clearInterval(interval);
  }, [departureTime, id, type]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4 w-full max-w-md">
        <h2 className="text-xl font-bold mb-2">Live Tracking Info</h2>
        <div className="text-gray-700">
          <p><span className="font-semibold">Type:</span> {type ? type.toUpperCase() : "Unknown"}</p>
          <p><span className="font-semibold">Latitude:</span> {position.lat.toFixed(6)}</p>
          <p><span className="font-semibold">Longitude:</span> {position.lng.toFixed(6)}</p>
          <p><span className="font-semibold">Departure Time:</span> {departureTime ? departureTime.toLocaleString() : "Loading..."}</p>
          <p><span className="font-semibold">Tracking Status:</span> {liveTrackingEnabled ? "Live" : "Waiting for Departure..."}</p>
        </div>
      </div>

      <div className="w-full max-w-5xl h-[600px] shadow-md rounded-lg overflow-hidden">
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={15}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[position.lat, position.lng]}
            icon={type === 'bus' ? busIcon : vehicleIcon}
          >
            <Popup>
              {type === 'bus' ? 'Bus Location 🚌' : 'Vehicle Location 🚗'}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default LiveTracker;
