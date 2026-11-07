import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { TicketProvider } from './context/TicketContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { ExplorePage } from './pages/ExplorePage.jsx';
import { EventDetailPage } from './pages/EventDetailPage.jsx';
import { MyTicketsPage } from './pages/MyTicketsPage.jsx';
import { AuthPage } from './pages/AuthPage.jsx';

// Scroll to top upon route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainLayout() {
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const navigate = useNavigate();

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    if (city === 'All Cities') {
      navigate('/explore');
    } else {
      navigate(`/explore?city=${encodeURIComponent(city)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07080d] text-slate-100">
      <ScrollToTop />
      <Navbar selectedCity={selectedCity} onSelectCity={handleCitySelect} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/event/:id" element={<EventDetailPage />} />
          <Route path="/my-tickets" element={<MyTicketsPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TicketProvider>
          <MainLayout />
        </TicketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
