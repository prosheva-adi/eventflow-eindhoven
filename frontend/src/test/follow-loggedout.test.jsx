import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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
    useAuth: () => ({ isAdmin: false, isLoggedIn: false })
}));

describe("VenueDetailPage follow button — logged out", () => {
    it("does not show follow button when logged out", async () => {
        render(
            <MemoryRouter initialEntries={["/venues/v1"]}>
                <Routes>
                    <Route path="/venues/:id" element={<VenueDetailPage />} />
                </Routes>
            </MemoryRouter>
        );
        await screen.findByText("Effenaar");
        expect(screen.queryByRole("button", { name: /follow/i })).not.toBeInTheDocument();
    });
});