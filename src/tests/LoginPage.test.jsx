import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../pages/LoginPage";
import { BrowserRouter } from "react-router-dom";
import axios from "../api/api";

jest.mock("../api/api");

describe("LoginPage", () => {
  test("renders login form", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByText("Dog Adoption App")).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/log in/i)).toBeInTheDocument();
  });

  test("handles login successfully", async () => {
    axios.post.mockResolvedValue({});

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/your name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.click(screen.getByText(/log in/i));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/auth/login", {
        name: "John Doe",
        email: "john@example.com",
      });
    });
  });

  test("handles login failure", async () => {
    axios.post.mockRejectedValue(new Error("Login failed"));

    jest.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/your name/i), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: "jane@example.com" },
    });
    fireEvent.click(screen.getByText(/log in/i));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });
});
