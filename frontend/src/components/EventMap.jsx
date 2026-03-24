import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function EventMap() {
    return (
        <MapContainer
            center={[51.4416, 5.4697]}
            zoom={13}
            // In EventMap.jsx change the style to:
            style={{ height: "calc(100vh - 56px)", width: "100vw", marginTop: "56px" }}
        >
            <TileLayer
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                attribution='© Stadia Maps © OpenStreetMap contributors'
                maxZoom={20}
            />

            <Marker position={[51.4416, 5.4697]}>
                <Popup>
                    Eindhoven City Center 📍
                </Popup>
            </Marker>

        </MapContainer>
    );
}

export default EventMap;