import React from "react";

const DogCard = ({ dog, onFavoriteToggle, isFavorite }) => {
  return (
    <div className="border rounded p-4 shadow-md">
      <img
        src={dog.img}
        alt={dog.name}
        className="w-full h-48 object-cover rounded"
      />
      <h3 className="text-xl font-bold mt-2">{dog.name}</h3>
      <p className="text-gray-600">Breed: {dog.breed}</p>
      <p className="text-gray-600">Age: {dog.age}</p>
      <p className="text-gray-600">Location: {dog.zip_code}</p>
      <button
        onClick={() => onFavoriteToggle(dog.id)}
        className={`mt-2 px-4 py-2 rounded ${
          isFavorite ? "bg-red-500 text-white" : "bg-gray-200"
        }`}
      >
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </button>
    </div>
  );
};

export default DogCard;
