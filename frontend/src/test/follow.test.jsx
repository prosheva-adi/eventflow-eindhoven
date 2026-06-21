import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import VenueDetailPage from "../pages/VenueDetailPage";

const mockVenue = {
    id: "v1", name: "Effenaar", address: "Dommelstraat 2", category: "CONCERT_HALL",
    latitude: 51.4381, longitude: 5.4752, description: "Great venue",
    imageUrl: null, website: "https://effenaar.nl"
};

vi.mock("../api/axios", () => ({
    default: {
        get: vi.fn((url) => {
            if (url.includes("/follow")) return Promise.resolve({ data: false });
            return Promise.resolve({ data: mockVenue });
        }),
        post: vi.fn(() => Promise.resolve({ data: {} })),
        delete: vi.fn(() => Promise.resolve({ data: {} })),
        put: vi.fn(() => Promise.resolve({ data: mockVenue })),
    }
}));

vi.mock("../hooks/useAuth", () => ({
    useAuth: () => ({ isAdmin: false, isLoggedIn: true })
}));

const renderPage = () => render(
    <MemoryRouter initialEntries={["/venues/v1"]}>
        <Routes>
            <Route path="/venues/:id" element={<VenueDetailPage />} />
        </Routes>
    </MemoryRouter>
);

describe("VenueDetailPage follow button — logged in", () => {
    it("shows follow button when logged in as regular user", async () => {
        renderPage();
        expect(await screen.findByRole("button", { name: /follow/i })).toBeInTheDocument();
    });

    it("shows + Follow text when not following", async () => {
        renderPage();
        expect(await screen.findByText("+ Follow")).toBeInTheDocument();
    });

    it("toggles to Following after clicking follow", async () => {
        renderPage();
        const btn = await screen.findByRole("button", { name: /follow/i });
        fireEvent.click(btn);
        await waitFor(() => {
            expect(screen.getByText("✓ Following")).toBeInTheDocument();
        });
    });
});