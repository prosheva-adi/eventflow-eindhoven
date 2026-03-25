import { Link } from "react-router-dom";

function EventCard({ event }) {
    return (
        <Link to={`/events/${event.id}`} style={{
            display: "block",
            width: "280px",
            background: "#1a1a1a",
            borderRadius: "12px",
            overflow: "hidden",
            textDecoration: "none",
            color: "white"
        }}>

            {/* Image */}
            <img
                src={event.image}
                alt={event.title}
                style={{ width: "100%", height: "160px", objectFit: "cover" }}
            />

            {/* Content */}
            <div style={{ padding: "12px" }}>
                <h3>{event.title}</h3>
                <p>📅 {event.date}</p>
                <p>📍 {event.location}</p>
                <p>💵 {event.price}</p>
            </div>

        </Link>
    );
}

export default EventCard;