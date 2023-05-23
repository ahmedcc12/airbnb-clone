import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "../Image.jsx";
import { PlacesContext } from "../PlacesContext.jsx";

export default function IndexPage() {
  const { places, setPlaces } = useContext(PlacesContext);
  const [priceRange, setPriceRange] = useState([0, 1000]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get("/places", {
          params: { search: "", minPrice: priceRange[0], maxPrice: priceRange[1] },
        });
        setPlaces(response.data);
      } catch (error) {
        console.log("Error fetching places:", error);
      }
    };

    fetchPlaces();
  }, [priceRange, setPlaces]);

  const handlePriceChange = (event) => {
    setPriceRange([event.target.min, event.target.value]);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-end mb-6">
        <div className="w-64 mx-4">
          <label htmlFor="priceRange" className="block mb-2 text-sm font-medium text-gray-700">
            Price Range
          </label>
          <input
            type="range"
            id="priceRange"
            name="priceRange"
            min="0"
            max="1000"
            step="10"
            value={priceRange[1]}
            onChange={handlePriceChange}
            className="w-full appearance-none bg-primary h-2 rounded-lg outline-none focus:outline-none active:outline-none"
          />
          <div className="flex justify-between mt-2">
            <span className="text-sm font-medium text-gray-500">${priceRange[0]}</span>
            <span className="text-sm font-medium text-gray-500">${priceRange[1]}</span>
          </div>
        </div>
      </div>
      <div className="grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {places.length > 0 &&
          places.map((place) => (
            <Link to={"/place/" + place._id} key={place._id}>
              <div className="bg-gray-500 mb-2 rounded-2xl flex">
                {place.photos?.[0] && (
                  <Image
                    className="rounded-2xl object-cover aspect-square"
                    src={place.photos?.[0]}
                    alt=""
                  />
                )}
              </div>
              <h2 className="font-bold">{place.address}</h2>
              <h3 className="text-sm text-gray-500">{place.title}</h3>
              <div className="mt-1">
                <span className="font-bold">${place.price}</span> per night
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
