import React, { useState, useEffect, useContext } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import DogCard from "../components/DogCard";
import { FavoritesContext } from "../context/FavoritesContext";

const SearchPage = () => {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [, setDogIds] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await api.get("/dogs/breeds");
        setBreeds(response.data);
      } catch (error) {
        console.error("Error fetching breeds:", error);
      }
    };

    fetchBreeds();
  }, []);

  useEffect(() => {
    fetchDogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBreed, sortOrder, currentPage]);

  const fetchDogs = async () => {
    try {
      const params = {
        size: 10,
        from: (currentPage - 1) * 10,
        sort: `breed:${sortOrder}`,
      };

      if (selectedBreed) {
        params.breeds = [selectedBreed];
      }

      const response = await api.get("/dogs/search", {
        params,
      });

      setDogIds(response.data.resultIds);
      setTotalResults(response.data.total);

      // Fetch dog details
      const dogsResponse = await api.post("/dogs", response.data.resultIds);
      setDogs(dogsResponse.data);
    } catch (error) {
      console.error("Error fetching dogs:", error);
    }
  };

  const totalPages = Math.ceil(totalResults / 10);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      sessionStorage.removeItem("isAuthenticated");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dog Search</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center mb-4">
        <label className="mr-2">Filter by Breed:</label>
        <select
          className="border p-2 rounded"
          value={selectedBreed}
          onChange={(e) => setSelectedBreed(e.target.value)}
        >
          <option value="">All Breeds</option>
          {breeds.map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </select>

        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="ml-4 p-2 bg-gray-200 rounded"
        >
          Sort: {sortOrder === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>

      {/* Dog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dogs.map((dog) => (
          <DogCard
            key={dog.id}
            dog={dog}
            onFavoriteToggle={toggleFavorite}
            isFavorite={favorites.includes(dog.id)}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>

      {/* Generate Match */}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => navigate("/match")}
          disabled={favorites.length === 0}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Generate Match
        </button>
      </div>
    </div>
  );
};

export default SearchPage;
