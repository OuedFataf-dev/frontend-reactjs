import axios from 'axios';

// Créer une instance Axios pour configurer l'URL de base et les headers
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Remplace par l'URL de ton API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fonction pour se connecter à l'API (Login)
export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    return response.data; // Renvoyer les données, par exemple le token
  } catch (error) {
    console.error("Erreur de connexion", error);
    throw error; // Relancer l'erreur pour la gérer dans le composant
  }
};

// Fonction pour récupérer les posts
export const fetchPosts = async (token) => {
  try {
    const response = await api.get('/index', {
      headers: {
        Authorization: `Bearer ${token}`, // Ajouter le token d'authentification
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des posts", error);
    throw error; // Relancer l'erreur pour la gérer dans le composant
  }
};

// Fonction pour publier un post
export const createPost = async (content, bgColor, file, token) => {
  const formData = new FormData();
  formData.append('content', content);
  formData.append('bgColor', bgColor);
  if (file) {
    formData.append('file', file);
  }

  try {
    const response = await api.post('/store', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // Retourne les données du post créé
  } catch (error) {
    console.error("Erreur lors de la création du post", error);
    throw error;
  }
};

export const deletePost = async (id, token) => {
  try {
    const response = await api.delete(`/destroy/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert(response.data.message); // Affiche le message de succès
  } catch (error) {
    if (error.response) {
      const message = error.response.data.message || "Erreur lors de la suppression";
      alert(`Erreur : ${message}`);
    } else if (error.request) {
      alert("Problème de connexion avec le serveur");
    } else {
      alert("Une erreur est survenue lors de la suppression");
    }
  }
};

