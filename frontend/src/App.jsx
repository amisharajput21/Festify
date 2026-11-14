
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext.jsx';
import { TicketProvider } from './context/TicketContext.jsx';
import { useAuth } from './context/AuthContext.jsx';

import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';
import AuthModal from './components/AuthModal.jsx';

import { HomePage } from './pages/HomePage.jsx';
import { ExplorePage } from './pages/ExplorePage.jsx';
import { EventDetailPage } from './pages/EventDetailPage.jsx';
import { MyTicketsPage } from './pages/MyTicketsPage.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import OrganizerDashboardPage from './pages/OrganizerDashboardPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import OrganizerApplicationPage from './pages/OrganizerApplicationPage.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function OrganizerRoute() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ROLE_ORGANIZER') {
    return <Navigate to="/" replace />;
  }

  return <OrganizerDashboardPage />;
}

function AdminRoute() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ROLE_ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <AdminDashboardPage />;
}

function OrganizerApplicationRoute() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ROLE_USER') {
    return <Navigate to="/" replace />;
  }

  return <OrganizerApplicationPage />;
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

      <Navbar
        selectedCity={selectedCity}
        onSelectCity={handleCitySelect}
      />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/event/:id" element={<EventDetailPage />} />
          <Route path="/my-tickets" element={<MyTicketsPage />} />

          <Route path="/organizer" element={<OrganizerRoute />} />
          <Route path="/admin" element={<AdminRoute />} />
          <Route
            path="/apply-organizer"
            element={<OrganizerApplicationRoute />}
          />

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
