

// ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import  React from 'react'
import { useAuth } from '../pages/useAuth';


function ProtectedRoute({ children }) {
  const isAuthenticated = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/home" />;
  }

  return children; // Si l'utilisateur est authentifié, afficher les enfants
}




export default ProtectedRoute;