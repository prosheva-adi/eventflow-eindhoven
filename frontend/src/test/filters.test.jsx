import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EventsPage from "../pages/EventsPage";

vi.mock("../api/axios", () => ({
    default: {
        get: vi.fn((url) => {
            if (url === "/api/events") return Promise.resolve({ data: [
                    {
                        id: "1", name: "Techno Night", startDate: new Date().toISOString().split("T")[0],
                        startTime: "22:00", ticketPrice: 0, categories: ["NIGHTLIFE"],
                        venue: { id: "v1", name: "Effenaar" }
                    },
                    {
                        id: "2", name: "Jazz Sunday", startDate: "2099-12-01",
                        startTime: "15:00", ticketPrice: 10, categories: ["MUSIC"],
                        venue: { id: "v2", name: "Muziekgebouw" }
                    }
                ]});
            if (url === "/api/venues") return Promise.resolve({ data: [] });
            return Promise.resolve({ data: [] });
        }),
        post: vi.fn(),
    }
}));

vi.mock("../hooks/useAuth", () => ({
    useAuth: () => ({ isAdmin: false, isLoggedIn: false })
}));

const renderPage = () => render(<MemoryRouter><EventsPage /></MemoryRouter>);

describe("EventsPage filters", () => {
    it("shows all events on load", async () => {
        renderPage();
        expect(await screen.findByText("Techno Night")).toBeInTheDocument();
        expect(await screen.findByText("Jazz Sunday")).toBeInTheDocument();
    });

    it("filters by search text", async () => {
        renderPage();
        await screen.findByText("Techno Night");
        fireEvent.change(screen.getByPlaceholderText(/search events/i), {
            target: { value: "Jazz" }
        });
        expect(screen.getByText("Jazz Sunday")).toBeInTheDocument();
        expect(screen.queryByText("Techno Night")).not.toBeInTheDocument();
    });

    it("filters by category", async () => {
        renderPage();
        await screen.findByText("Techno Night");
        fireEvent.click(screen.getByRole("button", { name: /music/i }));
        expect(screen.getByText("Jazz Sunday")).toBeInTheDocument();
        expect(screen.queryByText("Techno Night")).not.toBeInTheDocument();
    });

    it("filters by today", async () => {
        renderPage();
        await screen.findByText("Techno Night");
        fireEvent.click(screen.getByRole("button", { name: /today/i }));
        expect(screen.getByText("Techno Night")).toBeInTheDocument();
        expect(screen.queryByText("Jazz Sunday")).not.toBeInTheDocument();
    });

    it("combines search and category filter", async () => {
        renderPage();
        await screen.findByText("Techno Night");
        fireEvent.click(screen.getByRole("button", { name: /nightlife/i }));
        fireEvent.change(screen.getByPlaceholderText(/search events/i), {
            target: { value: "Jazz" }
        });
        expect(screen.queryByText("Techno Night")).not.toBeInTheDocument();
        expect(screen.queryByText("Jazz Sunday")).not.toBeInTheDocument();
    });

    it("shows clear filters button when filters are active", async () => {
        renderPage();
        await screen.findByText("Techno Night");
        fireEvent.click(screen.getByRole("button", { name: /today/i }));
        expect(screen.getByText(/clear filters/i)).toBeInTheDocument();
    });

    it("clears filters when clear button is clicked", async () => {
        renderPage();
        await screen.findByText("Techno Night");
        fireEvent.click(screen.getByRole("button", { name: /today/i }));
        fireEvent.click(screen.getByText(/clear filters/i));
        expect(screen.getByText("Techno Night")).toBeInTheDocument();
        expect(screen.getByText("Jazz Sunday")).toBeInTheDocument();
    });
});