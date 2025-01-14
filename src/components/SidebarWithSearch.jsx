import React, { useState } from 'react'; // <-- Ajout de useState ici
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom"; // Import de useNavigate
import axios from "axios"; // Assurez-vous d'importer axios pour effectuer les requêtes API

export function SidebarWithSearch() {
  const navigate = useNavigate(); // Utilisation de navigate pour la redirection après la déconnexion
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || null); // Variable d'état pour gérer le token

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      setLoading(true); // Démarrer le chargement pendant la requête

      // Requête API pour la déconnexion
      const response = await axios.post(
        'http://localhost:8000/api/logout', 
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // L'en-tête pour le token
          },
        }
      );

      // Vérifiez le statut de la réponse pour confirmer la réussite de la déconnexion
      if (response.status === 200 || response.status === 204) {
        // Rediriger vers la page de connexion
        navigate('/login');
      } else {
        console.error('Erreur de déconnexion:', response.data);
      }
    } catch (error) {
      // En cas d'erreur de connexion à l'API
      console.error('Erreur de connexion à l\'API:', error);
    } finally {
      setLoading(false); // Arrêter le chargement
    }
  };

  return (
    <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray">
          Sidebar
        </Typography>
      </div>
      
      <List>
        {/* Lien vers la page d'accueil */}
        <Link to=''>
          <ListItem>
            <ListItemPrefix>
              <PresentationChartBarIcon className="h-5 w-5" />
            </ListItemPrefix>
            Acceuil
          </ListItem>
        </Link>
        
        {/* Lien vers E-Commerce */}
        <ListItem>
          <ListItemPrefix>
            <ShoppingBagIcon className="h-5 w-5" />
          </ListItemPrefix>
          E-Commerce
        </ListItem>

        {/* Lien vers Inbox avec un badge */}
        <ListItem>
          <ListItemPrefix>
            <InboxIcon className="h-5 w-5" />
          </ListItemPrefix>
          Inbox
          <ListItemSuffix>
            <Chip value="14" size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
          </ListItemSuffix>
        </ListItem>

        {/* Lien vers le Profil */}
        <Link to="/Profile">
          <ListItem>
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />
            </ListItemPrefix>
            Profile
          </ListItem>
        </Link>

        {/* Lien vers les Paramètres */}
        <Link to="/Settings">
          <ListItem>
            <ListItemPrefix>
              <Cog6ToothIcon className="h-5 w-5" />
            </ListItemPrefix>
            Parametre
          </ListItem>
        </Link>

        {/* Bouton de déconnexion */}
        <ListItem button onClick={handleLogout}>
          <ListItemPrefix>
            <PowerIcon className="h-5 w-5" />
          </ListItemPrefix>
          Se déconnecter
        </ListItem>
      </List>
    </Card>
  );
}

export default SidebarWithSearch;
