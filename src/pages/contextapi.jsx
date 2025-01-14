
import React, { createContext, useContext, useState } from 'react';

// Créer le contexte pour les posts
const PostContext = createContext();

// Hook pour accéder au contexte des posts
export const usePosts = () => {
  return useContext(PostContext);
};

// Fournisseur de contexte pour gérer l'état des posts
export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  // Fonction pour ajouter une nouvelle publication
  const addPost = (newPost) => {
    setPosts((prevPosts) => [...prevPosts, newPost]);
  };

  // Fonction pour supprimer une publication
  const deletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter(post => post.id !== postId));
  };

  return (
    <PostContext.Provider value={{ posts, addPost, deletePost }}>
      {children}
    </PostContext.Provider>
  );
};
