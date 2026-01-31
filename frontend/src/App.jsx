import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import { Routes, Route } from "react-router-dom";
import { useThemeStore } from "./store/useThemeStore.js";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { useState, useEffect } from "react";

function App() {    // entire app must be wrapped in <BrowserRouter></BrowserRouter> (Done in main.jsxs)
  const {theme} = useThemeStore();
  const [wishlistCount, setWishlistCount] = useState(0);
  useEffect(() => {
    async function fetchWishlistCount() {
      try {
        const res = await axios.get("http://localhost:3000/wishlist/count");
        setWishlistCount(res.data.count)
      } catch (err) {
        console.log("Error fetching count: " + err)
      }
    }

    fetchWishlistCount();
  }, [])
  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300" data-theme={theme}>
      <Navbar wishlistCount={wishlistCount}/>

      <Routes>
        <Route path="/" element={<HomePage setWishlistCount={setWishlistCount} />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App
