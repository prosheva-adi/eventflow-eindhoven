import EventCard from "../components/EventCard";
import { Link } from "react-router-dom";

function EventsPage() {
    const mockEvents = [
        {
            id: 1,
            title: "Techno Night",
            date: "Fri, Mar 28",
            location: "Eindhoven Center",
            price: "€15",
            image: "https://picsum.photos/500/300?1"
        },
        {
            id: 2,
            title: "Food Festival",
            date: "Sat, Apr 12",
            location: "Strijp-S",
            price: "Free",
            image: "https://picsum.photos/500/300?2"
        },
        {
            id: 3,
            title: "Jazz Evening",
            date: "Sun, May 4",
            location: "Music Hall",
            price: "€22",
            image: "https://picsum.photos/500/300?3"
        }
    ];

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(to bottom, #0f0f0f, #151515)",
            color: "white",
            fontFamily: "sans-serif"
        }}>

            {/* Page Content */}
            <div style={{
                maxWidth: "1400px",
                margin: "0 auto",
                padding: "120px 32px 80px"
            }}>

                {/* Header */}
                <div style={{ marginBottom: "48px" }}>
                    <h1 style={{
                        fontSize: "36px",
                        fontWeight: "700",
                        marginBottom: "12px"
                    }}>
                        Discover Events
                    </h1>
                    <p style={{ color: "#9ca3af" }}>
                        Find the best events happening in Eindhoven
                    </p>
                </div>

                {/* Search Bar */}
                <div style={{ marginBottom: "40px" }}>
                    <input
                        placeholder="Search events..."
                        style={{
                            width: "100%",
                            padding: "14px 18px",
                            borderRadius: "12px",
                            border: "1px solid #222",
                            background: "#1a1a1a",
                            color: "white",
                            fontSize: "14px",
                            outline: "none"
                        }}
                    />
                </div>

                {/* Events Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
                    gap: "32px"
                }}>
                    {mockEvents.map(event => (
                        <Link
                            key={event.id}
                            to={`/events/${event.id}`}
                            style={{
                                textDecoration: "none",
                                color: "white",
                                background: "#181818",
                                borderRadius: "16px",
                                overflow: "hidden",
                                border: "1px solid #222",
                                transition: "transform 0.25s ease, box-shadow 0.25s ease"
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = "translateY(-6px)";
                                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.4)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >

                            {/* Image */}
                            <div style={{ position: "relative" }}>
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    style={{
                                        width: "100%",
                                        height: "180px",
                                        objectFit: "cover"
                                    }}
                                />
                                <div style={{
                                    position: "absolute",
                                    inset: 0,
                                    background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)"
                                }} />
                            </div>

                            {/* Content */}
                            <div style={{ padding: "16px" }}>
                                <h3 style={{
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    marginBottom: "10px"
                                }}>
                                    {event.title}
                                </h3>
                                <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "6px" }}>
                                    📅 {event.date}
                                </p>
                                <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "6px" }}>
                                    📍 {event.location}
                                </p>
                                <p style={{
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    color: "#6c63ff"
                                }}>
                                    {event.price}
                                </p>
                            </div>

                        </Link>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default EventsPage;