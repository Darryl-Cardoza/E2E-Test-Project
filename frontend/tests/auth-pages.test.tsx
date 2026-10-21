import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import LoginPage from "../app/login/page";
import RegisterPage from "../app/register/page";

const { push, replace } = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push, replace }) }));
vi.mock("next/link", () => ({ default: ({ href, children }: { href: string; children: ReactNode }) => <a href={href}>{children}</a> }));

describe("authentication pages", () => {
  beforeEach(() => { vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:5000/api"); });
  afterEach(() => { cleanup(); localStorage.clear(); vi.unstubAllEnvs(); });

  it("submits login credentials, saves the session, and navigates to the dashboard", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ token: "signed-token", user: { id: "u1", name: "Alex Morgan", email: "alex@example.com" } }) }));
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email address/i), "alex@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/dashboard"));
    expect(fetch).toHaveBeenCalledWith("http://localhost:5000/api/auth/login", expect.objectContaining({ method: "POST" }));
    expect(localStorage.getItem("northstar_token")).toBe("signed-token");
  });

  it("shows the API error when login is rejected", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({ message: "Email or password is incorrect." }) }));
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email address/i), "alex@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Email or password is incorrect.");
    expect(push).not.toHaveBeenCalled();
  });

  it("registers a new account and navigates into the workspace", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ token: "new-token", user: { id: "u2", name: "Sam Lee", email: "sam@example.com" } }) }));
    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/your name/i), "Sam Lee");
    await user.type(screen.getByLabelText(/email address/i), "sam@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/dashboard"));
    expect(fetch).toHaveBeenCalledWith("http://localhost:5000/api/auth/register", expect.objectContaining({ method: "POST" }));
    expect(localStorage.getItem("northstar_token")).toBe("new-token");
  });
});
