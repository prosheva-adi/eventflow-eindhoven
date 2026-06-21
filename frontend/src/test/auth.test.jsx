import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("../api/axios", () => ({
    default: {
        post: vi.fn(),
    }
}));

vi.mock("../components/Navbar", () => ({
    default: () => <div>Navbar</div>
}));

import api from "../api/axios";

describe("LoginPage", () => {
    it("renders email and password fields", () => {
        render(<MemoryRouter><LoginPage /></MemoryRouter>);
        expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    });

    it("renders sign in button", () => {
        render(<MemoryRouter><LoginPage /></MemoryRouter>);
        expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    });

    it("shows error on failed login", async () => {
        api.post.mockRejectedValueOnce({
            response: { data: { message: "Invalid email or password." } }
        });
        render(<MemoryRouter><LoginPage /></MemoryRouter>);
        fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
            target: { value: "wrong@email.com" }
        });
        fireEvent.change(screen.getByPlaceholderText("••••••••"), {
            target: { value: "wrongpassword" }
        });
        fireEvent.submit(screen.getByRole("button", { name: /sign in/i }).closest("form"));
        await waitFor(() => {
            expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
        });
    });

    it("navigates to home on successful login", async () => {
        api.post.mockResolvedValueOnce({
            data: { token: "abc", userId: "1", username: "adelina", email: "a@a.com", role: "USER" }
        });
        render(<MemoryRouter><LoginPage /></MemoryRouter>);
        fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
            target: { value: "a@a.com" }
        });
        fireEvent.change(screen.getByPlaceholderText("••••••••"), {
            target: { value: "password123" }
        });
        fireEvent.submit(screen.getByRole("button", { name: /sign in/i }).closest("form"));
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });
});

describe("RegisterPage", () => {
    it("renders all fields", () => {
        render(<MemoryRouter><RegisterPage /></MemoryRouter>);
        expect(screen.getByPlaceholderText("johndoe")).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    });

    it("shows error when passwords do not match", async () => {
        render(<MemoryRouter><RegisterPage /></MemoryRouter>);
        const passwords = screen.getAllByPlaceholderText("••••••••");
        fireEvent.change(passwords[0], { target: { value: "password123" } });
        fireEvent.change(passwords[1], { target: { value: "different" } });
        fireEvent.submit(screen.getByRole("button", { name: /create account/i }).closest("form"));
        await waitFor(() => {
            expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
        });
    });

    it("navigates home on successful register", async () => {
        api.post.mockResolvedValueOnce({
            data: { token: "abc", userId: "1", username: "adelina", email: "a@a.com", role: "USER" }
        });
        render(<MemoryRouter><RegisterPage /></MemoryRouter>);
        fireEvent.change(screen.getByPlaceholderText("johndoe"), { target: { value: "adelina" } });
        fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), { target: { value: "a@a.com" } });
        const passwords = screen.getAllByPlaceholderText("••••••••");
        fireEvent.change(passwords[0], { target: { value: "password123" } });
        fireEvent.change(passwords[1], { target: { value: "password123" } });
        fireEvent.submit(screen.getByRole("button", { name: /create account/i }).closest("form"));
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });
});