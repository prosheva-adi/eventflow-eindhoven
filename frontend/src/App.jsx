import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import Navbar from "./components/Navbar";
import EventMap from "./components/EventMap";
import EventsPage from "./pages/EventsPage";
import SavedPage from "./pages/SavedPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EventDetailPage from "./pages/EventDetailPage";
import VenuesPage from "./pages/VenuesPage.jsx";
import VenueDetailPage from "./pages/VenueDetailPage.jsx";
import AdminUsersPage from "./pages/AdminUsersPage.jsx";

function App() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <Helmet>
                    <meta name="description" content="EventFlow — discover and manage events in Eindhoven. Browse venues, get real-time notifications, and stay up to date with everything happening around you." />
                </Helmet>
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<EventMap />} />
                        <Route path="/events" element={<EventsPage />} />
                        <Route path="/events/:id" element={<EventDetailPage />} />
                        <Route path="/saved" element={<SavedPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/venues" element={<VenuesPage />} />
                        <Route path="/venues/:id" element={<VenueDetailPage />} />
                        <Route path="/admin/users" element={<AdminUsersPage />} />
                    </Routes>
                </main>
            </BrowserRouter>
        </HelmetProvider>
    );
}

export default App;