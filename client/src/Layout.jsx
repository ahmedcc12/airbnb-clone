import Header from "./Header";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { useContext,useEffect } from "react";
import { PlacesContext } from "./PlacesContext.jsx";

export default function Layout() {
  const { setPlaces } = useContext(PlacesContext);

  const handleSearch = async (query) => {
    try {
      const response = await axios.get("/places", {
        params: { search: query },
      });
      setPlaces(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    handleSearch("");
  }, []);

  return (
    <div className="py-4 px-8 flex flex-col min-h-screen mx-auto">
      <Header onSearch={handleSearch} />
      <Outlet />
    </div>
  );
}
