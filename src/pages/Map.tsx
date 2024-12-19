import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvent } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

// Define the structure of the data you expect from your API
interface SeverityData {
  severity: "red" | "yellow" | "green" | "blue"; // Severity levels returned by the API
}

// Define the structure of the marker object
interface MarkerData {
  lat: number;
  lng: number;
  name: string;
}

const MapPage = () => {
  const [markerPosition, setMarkerPosition] = useState<MarkerData | null>(null);
  const [severity, setSeverity] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch severity data based on latitude and longitude
  const fetchSeverityData = async (lat: number, lng: number) => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      // Set a timeout for 10 seconds
      const timeout = setTimeout(() => {
        setError("Data loading timed out!");
        setLoading(false);
      }, 10000); // 10 seconds timeout

      // Replace the URL with your API endpoint
      const response = await axios.get<SeverityData>(`https://api.example.com/severity`, {
        params: {
          lat,
          lng,
        },
      });

      clearTimeout(timeout); // Clear the timeout once data is fetched
      setSeverity(response.data.severity); // Set the severity level returned from the API
      setLoading(false);
    } catch (error) {
      console.error("Error fetching severity data", error);
      setSeverity(null); // In case of an error, set severity to null
      setLoading(false);
      setError("Error fetching data");
    }
  };

  // Handle map click to set marker position
  const handleMapClick = (lat: number, lng: number) => {
    setMarkerPosition({ lat, lng, name: "Selected Location" }); // Set marker position

    // Fetch severity data for the selected location
    fetchSeverityData(lat, lng);
  };

  // Map marker and circle color based on severity
  const getCircleColor = (severity: string | null) => {
    switch (severity) {
      case "red":
        return "red";
      case "yellow":
        return "yellow";
      case "green":
        return "green";
      case "blue":
        return "blue";
      default:
        return "gray"; // Default color if no severity is set
    }
  };

  // Custom component to handle map click events
  const MapClickHandler = () => {
    useMapEvent("click", (event) => {
      const { lat, lng } = event.latlng;
      handleMapClick(lat, lng);
    });

    return null; // No UI for this component
  };

  return (
    <div className="flex h-screen">
      {/* Map Container */}
      <MapContainer
        center={[51.505, -0.09] as LatLngExpression}
        zoom={13}
        className="w-3/4 h-full border-r border-gray-300"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* MapClickHandler to handle map clicks */}
        <MapClickHandler />

        {/* Conditionally render the marker and circle */}
        {markerPosition && (
          <>
            <Marker position={[markerPosition.lat, markerPosition.lng]}>
              <Popup>{markerPosition.name}</Popup>
            </Marker>
            <Circle
              center={[markerPosition.lat, markerPosition.lng]}
              radius={500} // Adjust the radius size as per your requirement
              pathOptions={{
                fillColor: getCircleColor(severity),
                color: getCircleColor(severity),
                fillOpacity: 0.4,
              }}
            />
          </>
        )}
      </MapContainer>

      {/* Side Modal with Data */}
      <div className="w-1/4 h-full p-4 bg-opacity-60 backdrop-blur-md bg-white border-l border-gray-300 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            {/* Stylish loading spinner */}
            <div className="loader">Loading...</div>
          </div>
        ) : markerPosition ? (
          <div>
            <h2 className="text-xl font-bold mb-4">{markerPosition.name}</h2>
            <p>Latitude: {markerPosition.lat}</p>
            <p>Longitude: {markerPosition.lng}</p>
            {severity ? (
              <div>
                <p className="mb-2">Severity: {severity}</p>
                {/* Display corresponding severity level */}
              </div>
            ) : (
              <p>Severity data not available</p>
            )}
          </div>
        ) : (
          <p>Select a location on the map</p>
        )}

        {/* Display error message if any */}
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>
    </div>
  );
};

export default MapPage;
