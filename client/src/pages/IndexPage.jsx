import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "../Image.jsx";
import { PlacesContext } from "../PlacesContext.jsx";
import { UserContext } from "../UserContext.jsx";

export default function IndexPage() {
  const { places, setPlaces } = useContext(PlacesContext);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedPerks, setSelectedPerks] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get("/places", {
          params: { search: "", minPrice: priceRange[0], maxPrice: priceRange[1] },
        });
        const allPlaces = response.data;

        // Filter places based on selected perks
        const filteredPlaces = allPlaces.filter((place) => {
          for (const selectedPerk of selectedPerks) {
            if (!place.perks.includes(selectedPerk)) {
              return false;
            }
          }
          return true;
        });

        setPlaces(filteredPlaces);
      } catch (error) {
        console.log("Error fetching places:", error);
      }
    };

    fetchPlaces();
  }, [priceRange, selectedPerks, setPlaces]);

  const handlePriceChange = (event) => {
    setPriceRange([event.target.min, event.target.value]);
  };

  const handlePerkChange = (event) => {
    const perk = event.target.value;
    if (event.target.checked) {
      setSelectedPerks((prevPerks) => [...prevPerks, perk]);
    } else {
      setSelectedPerks((prevPerks) => prevPerks.filter((p) => p !== perk));
    }

    setPlaces(allPlaces.filter((place) => {
      for (const selectedPerk of selectedPerks) {
        if (!place.perks.includes(selectedPerk)) {
          return false;
        }
      }
      return true;
    }));
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
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
        <div className="mx-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Perks</label>
          <div className="flex space-x-4">
            <label htmlFor="perkWifi" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
        </svg>
              <input
                type="checkbox"
                id="perkWifi"
                name="perkWifi"
                value="wifi"
                onChange={handlePerkChange}
                className="mr-2"
              />
              Free Wi-Fi
            </label>
            <label htmlFor="perkParking" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
              <input
                type="checkbox"
                id="perkParking"
                name="perkParking"
                value="Free parking"
                onChange={handlePerkChange}
                className="mr-2"
              />
              Free Parking
            </label>
            <label htmlFor="perkKitchen" className="flex items-center">
           

              <input
                type="checkbox"
                id="perkKitchen"
                name="perkKitchen"
                value="Kitchen"
                onChange={handlePerkChange}
                className="mr-2"
              />
              Kitchen
            </label>
            <label htmlFor="perkWasher" className="flex items-center">
              <input
                type="checkbox"
                id="perkWasher"
                name="perkWasher"
                value="Washer"
                onChange={handlePerkChange}
                className="mr-2"
              />
              Washer
            </label>
            <label htmlFor="perkDryer" className="flex items-center">
              <input
                type="checkbox"
                id="perkDryer"
                name="perkDryer"
                value="Dryer"
                onChange={handlePerkChange}
                className="mr-2"
              />
              Dryer
            </label>
            <label htmlFor="perkAC" className="flex items-center">
              <input
                type="checkbox"
                id="perkAC"
                name="perkAC"
                value="Air conditioning"
                onChange={handlePerkChange}
                className="mr-2"
              />
              Air Conditioning
            </label>
            <label htmlFor="perkPets" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
             stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round"
                d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"/>
        </svg>
              <input
                type="checkbox"
                id="perkPets"
                name="perkPets"
                value="pets"
                onChange={handlePerkChange}
                className="mr-2"
              />
              Pets Allowed
            </label>
            <label htmlFor="perkTV" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
        </svg>
              <input
                type="checkbox"
                id="perkTV"
                name="perkTV"
                value="tv"
                onChange={handlePerkChange}
                className="mr-2"
              />
              TV
            </label>
          </div>
        </div>
      </div>
      <div className="grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {places.length > 0 &&
          places.map((place) => (
            <Link
              to={user && place.owner === user._id ? "/account/places/" + place._id : "/place/" + place._id}
              key={place._id}
            >
              <div className="bg-gray-500 mb-2 rounded-2xl flex">
                {place.photos?.[0] && (
                  <Image className="rounded-2xl object-cover aspect-square" src={place.photos?.[0]} alt="" />
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
