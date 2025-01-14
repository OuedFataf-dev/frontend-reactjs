import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SidebarWithSearch from './components/SidebarWithSearch';
import Settings from './pages/Settings';
import Login from './components/Login';
import Partager from './components/partage';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import SimpleRegistrationForm from './components/inscription';
import { PostProvider } from './pages/contextapi';
import Footer from './pages/footer';

function App() {
  const location = useLocation(); // Récupérer la location actuelle
  const pathname = location.pathname; // Récupérer le pathname actuel

  // Vérifier si on est sur la page de login ou d'inscription
  const isAuthPage = pathname === '/sign-in' || pathname === '/sign-up';

  return (
    <PostProvider> {/* Envelopper toute l'application avec le PostProvider */}
      <div className="flex">
        {/* Sidebar - Toujours visible à gauche */}
        <div className="w-1/4 min-h-screen bg-gray-100">
          {/* SidebarWithSearch /> */}
        </div>

        {/* Contenu principal */}
        <div className="w-3/4">
          {/* Afficher la Navbar sauf sur les pages de login et inscription */}
          {!isAuthPage && (
            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12">
             
            </div>
          )}

          {/* Définir les routes */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/profile/:id" element={<Profile />} />
            
            <Route path="/home" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SimpleRegistrationForm />} />
            {/* Route par défaut pour rediriger les chemins inconnus */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Optionnel : Ajouter un Footer en bas de la page */}
          {/* <Footer /> */}
        </div>
      </div>
    </PostProvider>
  );
}

export default App;
