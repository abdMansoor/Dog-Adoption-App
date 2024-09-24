import { render, screen, waitFor } from "@testing-library/react";
import MatchPage from "../pages/MatchPage";
import { BrowserRouter } from "react-router-dom";
import axios from "../api/api";
import { FavoritesContext } from "../context/FavoritesContext";
import { useNavigate } from "react-router-dom";

jest.mock("../api/api");

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("MatchPage", () => {
  test("displays matched dog", async () => {
    const favorites = ["dog1", "dog2", "dog3"];

    // Mock axios.post calls
    axios.post
      .mockResolvedValueOnce({ data: { match: "dog2" } }) // First call to /dogs/match
      .mockResolvedValueOnce({
        data: [
          {
            id: "dog2",
            name: "Matched Dog",
            breed: "Breed2",
            age: 4,
            img: "",
            zip_code: "67890",
          },
        ],
      }); // Second call to /dogs

    render(
      <FavoritesContext.Provider value={{ favorites }}>
        <BrowserRouter>
          <MatchPage />
        </BrowserRouter>
      </FavoritesContext.Provider>
    );

    // Verify first call to /dogs/match
    await waitFor(() => {
      expect(axios.post).toHaveBeenNthCalledWith(1, "/dogs/match", favorites);
    });

    // Verify second call to /dogs
    await waitFor(() => {
      expect(axios.post).toHaveBeenNthCalledWith(2, "/dogs", ["dog2"]);
    });

    // Check that the matched dog's details are displayed
    expect(screen.getByText("Your Match!")).toBeInTheDocument();
    expect(screen.getByText("Matched Dog")).toBeInTheDocument();
  });

  test("redirects to search if no favorites", () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);

    render(
      <FavoritesContext.Provider value={{ favorites: [] }}>
        <BrowserRouter>
          <MatchPage />
        </BrowserRouter>
      </FavoritesContext.Provider>
    );

    // Verify that navigate was called with "/search"
    expect(navigate).toHaveBeenCalledWith("/search");

    expect(navigate).toHaveBeenCalledWith("/search");
  });
});
