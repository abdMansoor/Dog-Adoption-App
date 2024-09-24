import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import SearchPage from "../pages/SearchPage";
import { BrowserRouter } from "react-router-dom";
import axios from "../api/api";
import { FavoritesProvider } from "../context/FavoritesContext";

jest.mock("../api/api");

describe("SearchPage", () => {
  beforeEach(() => {
    axios.get.mockClear();
    axios.post.mockClear();
  });

  test("renders search page and fetches breeds and dogs", async () => {
    // Mock responses
    axios.get
      .mockResolvedValueOnce({ data: ["Breed1", "Breed2"] }) // First call to /dogs/breeds
      .mockResolvedValueOnce({
        data: {
          resultIds: ["dog1", "dog2"],
          total: 2,
        },
      }); // Second call to /dogs/search

    axios.post.mockResolvedValueOnce({
      data: [
        {
          id: "dog1",
          name: "Dog One",
          breed: "Breed1",
          age: 3,
          img: "",
          zip_code: "12345",
        },
        {
          id: "dog2",
          name: "Dog Two",
          breed: "Breed2",
          age: 5,
          img: "",
          zip_code: "67890",
        },
      ],
    }); // Call to /dogs

    render(
      <FavoritesProvider>
        <BrowserRouter>
          <SearchPage />
        </BrowserRouter>
      </FavoritesProvider>
    );

    // Wait for breeds to load
    await waitFor(() => {
      expect(axios.get).toHaveBeenNthCalledWith(1, "/dogs/breeds");
    });

    // Wait for dogs to load
    await waitFor(() => {
      expect(axios.get).toHaveBeenNthCalledWith(
        2,
        "/dogs/search",
        expect.objectContaining({
          params: { size: 10, from: 0, sort: "breed:asc" },
        })
      );
    });

    // Check that axios.post was called to fetch dog details
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/dogs", ["dog1", "dog2"]);
    });

    expect(screen.getByText("Dog One")).toBeInTheDocument();
    expect(screen.getByText("Dog Two")).toBeInTheDocument();
  });

  test("allows user to add and remove favorites", async () => {
    // Mock data similar to previous test
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({
      data: {
        resultIds: ["dog1"],
        total: 1,
      },
    });
    axios.post.mockResolvedValueOnce({
      data: [
        {
          id: "dog1",
          name: "Dog One",
          breed: "Breed1",
          age: 3,
          img: "",
          zip_code: "12345",
        },
      ],
    });

    render(
      <FavoritesProvider>
        <BrowserRouter>
          <SearchPage />
        </BrowserRouter>
      </FavoritesProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Dog One")).toBeInTheDocument();
    });

    const favoriteButton = screen.getByText("Add to Favorites");
    fireEvent.click(favoriteButton);
    expect(favoriteButton.textContent).toBe("Remove from Favorites");

    fireEvent.click(favoriteButton);
    expect(favoriteButton.textContent).toBe("Add to Favorites");
  });
});
