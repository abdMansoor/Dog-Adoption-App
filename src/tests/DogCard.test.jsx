import { render, screen, fireEvent } from "@testing-library/react";
import DogCard from "../components/DogCard";

describe("DogCard", () => {
  const dog = {
    id: "dog1",
    name: "Dog One",
    breed: "Breed1",
    age: 3,
    img: "",
    zip_code: "12345",
  };

  test("renders dog details", () => {
    render(
      <DogCard dog={dog} onFavoriteToggle={() => {}} isFavorite={false} />
    );

    expect(screen.getByText("Dog One")).toBeInTheDocument();
    expect(screen.getByText("Breed: Breed1")).toBeInTheDocument();
    expect(screen.getByText("Age: 3")).toBeInTheDocument();
    expect(screen.getByText("Location: 12345")).toBeInTheDocument();
  });

  test("handles favorite toggle", () => {
    const toggleFavoriteMock = jest.fn();

    render(
      <DogCard
        dog={dog}
        onFavoriteToggle={toggleFavoriteMock}
        isFavorite={false}
      />
    );

    const favoriteButton = screen.getByText("Add to Favorites");
    fireEvent.click(favoriteButton);

    expect(toggleFavoriteMock).toHaveBeenCalledWith("dog1");
  });
});
