import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SavedPage from "../pages/SavedPage";

vi.mock("../api/axios", () => ({
    default: {
        get: vi.fn(() => Promise.resolve({ data: [] })),
    }
}));

vi.mock("../hooks/useAuth", () => ({
    useAuth: () => ({ isLoggedIn: false })
}));

describe("SavedPage", () => {
    it("shows auth gate when logged out", () => {
        render(<MemoryRouter><SavedPage /></MemoryRouter>);
        expect(screen.getByText("Your saved events")).toBeInTheDocument();
        expect(screen.getByText(/sign in to see/i)).toBeInTheDocument();
    });

    it("shows sign in link when logged out", () => {
        render(<MemoryRouter><SavedPage /></MemoryRouter>);
        expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
    });
});