import React from "react";
import { render, act } from "@testing-library/react";
import {
  FavoritesProvider,
  FavoritesContext,
} from "../context/FavoritesContext";

describe("FavoritesContext", () => {
  test("allows toggling favorites", () => {
    let favorites;
    let toggleFavorite;

    render(
      <FavoritesProvider>
        <FavoritesContext.Consumer>
          {(value) => {
            favorites = value.favorites;
            toggleFavorite = value.toggleFavorite;
            return null;
          }}
        </FavoritesContext.Consumer>
      </FavoritesProvider>
    );

    expect(favorites).toEqual([]);

    act(() => {
      toggleFavorite("dog1");
    });

    expect(favorites).toEqual(["dog1"]);

    act(() => {
      toggleFavorite("dog1");
    });

    expect(favorites).toEqual([]);
  });
});
