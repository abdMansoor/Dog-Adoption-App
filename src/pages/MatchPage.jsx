import React, { useContext, useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { FavoritesContext } from "../context/FavoritesContext";
import DogCard from "../components/DogCard";

const MatchPage = () => {
  const { favorites } = useContext(FavoritesContext);
  const [matchedDog, setMatchedDog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (favorites.length === 0) {
      navigate("/search");
      return;
    }

    const generateMatch = async () => {
      try {
        const matchResponse = await api.post("/dogs/match", favorites);
        const matchedDogId = matchResponse.data.match;

        const dogResponse = await api.post("/dogs", [matchedDogId]);
        setMatchedDog(dogResponse.data[0]);
      } catch (error) {
        console.error("Error generating match:", error);
      }
    };

    generateMatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!matchedDog) {
    return <p>Loading your match...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Match!</h1>
      <DogCard
        dog={matchedDog}
        onFavoriteToggle={() => {}}
        isFavorite={false}
      />
      <button
        onClick={() => navigate("/search")}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Back to Search
      </button>
    </div>
  );
};

export default MatchPage;
