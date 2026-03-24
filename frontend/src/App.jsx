import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import EventMap from "./components/EventMap";
import EventsPage from "./pages/EventsPage";
import SavedPage from "./pages/SavedPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<EventMap />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/saved" element={<SavedPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;