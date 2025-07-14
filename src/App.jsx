import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LocationProvider } from './context/LocationContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AllShops from './pages/AllShops';
import ShopDetail from './pages/ShopDetail';

function App() {
  return (
    <LocationProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shops" element={<AllShops />} />
              <Route path="/shop/:id" element={<ShopDetail />} />
              <Route path="/best-prices" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LocationProvider>
  );
}

export default App;