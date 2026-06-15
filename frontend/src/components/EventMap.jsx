import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

function EventMap() {
    const [venues, setVenues] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/api/venues")
            .then(res => setVenues(res.data))
            .catch(err => console.error("Failed to load venues", err));
    }, []);
    return (
        <MapContainer
            center={[51.4416, 5.4697]}
            zoom={13}
            style={{ height: "calc(100vh - 56px)", width: "100vw", marginTop: "56px" }}
        >
            <TileLayer
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                attribution='© Stadia Maps © OpenStreetMap contributors'
                maxZoom={20}
            />

            {venues.map(venue => (
                <Marker
                    key={venue.id}
                    position={[venue.latitude, venue.longitude]}
                >
                    <Popup>
                        <div style={{ minWidth: "180px" }}>
                            <h3 style={{ margin: "0 0 6px", fontSize: "14px" }}>
                                {venue.name}
                            </h3>

                            <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#666" }}>
                                {venue.address}
                            </p>

                            <button
                                onClick={() => navigate(`/venues/${venue.id}`)}
                                style={{
                                    padding: "6px 10px",
                                    borderRadius: "6px",
                                    border: "none",
                                    background: "#6c63ff",
                                    color: "white",
                                    cursor: "pointer",
                                    fontSize: "12px"
                                }}
                            >
                                View Venue →
                            </button>
                        </div>
                    </Popup>
                </Marker>
            ))}

        </MapContainer>
    );
}

export default EventMap;
