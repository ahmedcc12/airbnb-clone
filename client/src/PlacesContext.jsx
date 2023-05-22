import { createContext, useState } from "react";

export const PlacesContext = createContext();

export default function PlacesProvider({ children }) {
  const [places, setPlaces] = useState([]);

  return (
    <PlacesContext.Provider value={{ places, setPlaces }}>
      {children}
    </PlacesContext.Provider>
  );
}