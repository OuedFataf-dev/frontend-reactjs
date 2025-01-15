import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Dropdown from '../components/Dropdown';
import Navbar from '../components/Navbar';
import téléchargement from '../assets/téléchargement.jpeg';
import { formatDistanceToNow, parseISO } from 'date-fns';
import axios from 'axios'; // Importation d'axios pour les appels API
import { Card, CardBody, CardHeader, Typography, Button } from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookSquare, faWhatsapp, faTelegram, faTwitterSquare } from '@fortawesome/free-brands-svg-icons';
import { faThumbsUp, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import { useDropzone } from 'react-dropzone';
import Footer from './footer';
import { FingerPrintIcon } from "@heroicons/react/24/solid";

// Composant Dropzone pour le téléchargement d'images ou vidéos
const ImageDropzone = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: 'image/*,video/*',
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed p-4 rounded-md ${isDragActive ? 'border-blue-500' : 'border-gray-300'} ${
        isDragReject ? 'border-red-500' : ''
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Déposez les fichiers ici...</p>
      ) : (
        <p>Glissez et déposez une image ou une vidéo ici, ou cliquez pour sélectionner</p>
      )}
    </div>
  );
};

function Home() {
  const [newComment, setNewComment] = useState('');
  const [commentInputVisible, setCommentInputVisible] = useState(null);
  const [afficherModalPartager, setAfficherModalPartager] = useState(false);
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Fetch posts from API
  const fetchPosts = async (token) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/index', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const posts = response.data;

      posts.forEach(post => {
        if (post.file_path) {
          post.file_url = `http://127.0.0.1:8000/storage/${post.file_path}`;
        }
      });

      setPosts(posts); // Setting posts
    } catch (error) {
      console.error("Erreur lors de la récupération des posts", error);
      throw error;
    }
  };

  useEffect(() => {
    if (token) {
      fetchPosts(token).catch(error => console.error('Erreur lors du chargement des posts', error));
    }
  }, [token]);

  const handleLike = (index) => {
    const newPosts = [...posts];
    newPosts[index].likes = (newPosts[index].likes || 0) + 1;
    setPosts(newPosts);
  };

  const handleCommentClick = (index) => {
    setCommentInputVisible(commentInputVisible === index ? null : index);
  };

  const handleCommentSubmit = (e, index) => {
    e.preventDefault();
    if (newComment.trim() === '') return;
    const newPosts = [...posts];
    if (!newPosts[index].comments) newPosts[index].comments = [];
    newPosts[index].comments.push(newComment);
    setPosts(newPosts);
    setNewComment('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && !file) return;

    createPost(content, file, token)
      .then(newPost => {
        // Ajouter le nouveau post au début de la liste des posts
        setPosts(prevPosts => {
          const updatedPosts = [newPost, ...prevPosts];
          return updatedPosts;
        });
        setContent('');
        setFile(null);

        // Recharger les posts pour s'assurer que l'affichage est à jour
        fetchPosts(token).catch(error => {
          console.error('Erreur lors du rechargement des posts', error);
        });
      })
      .catch(error => {
        console.error('Erreur lors de la soumission du post', error);
      });
  };

  const createPost = async (content, file, token) => {
    const formData = new FormData();
    formData.append('content', content);
    if (file) formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/store', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      const newPost = response.data;
      newPost.id = newPost.id || Date.now(); // Utilisation d'un identifiant unique
      if (newPost.file_path) {
        newPost.file_url = `http://127.0.0.1:8000/storage/posts/${newPost.file_path}`;
      }
      return newPost;
    } catch (error) {
      console.error("Erreur lors de la création du post", error);
      throw error;
    }
  };

  const formatPostDate = (dateString) => {
    if (!dateString) return "Date invalide";
    try {
      const date = parseISO(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Erreur lors du parsing de la date:", error);
      return "Date invalide";
    }
  };

  const handleDelete = async (postId) => {
    if (!token) {
      console.error("Utilisateur non authentifié");
      return;
    }
    try {
      await axios.delete(`http://127.0.0.1:8000/api/destroy/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error("Erreur lors de la suppression du post", error);
      if (error.response && error.response.status === 401) {
        console.error("Token expiré ou invalide.");
        setToken(null);
        localStorage.removeItem('token');
        window.location.href = "/login";
      }
    }
  };

  return (
    <>
      <Navbar />
      
      {/* Formulaire d'ajout de post */}
      <section className="bg-white px-4 pb-6 pt-6">
        <div className="container mx-auto">
          <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-md">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Écrivez quelque chose..."
              rows="3"
              className="w-full border rounded-md p-3 mb-4"
            />
            <ImageDropzone onDrop={(acceptedFiles) => setFile(acceptedFiles[0])} />
            <div className="mt-4 flex justify-end">
              <Button type="submit" color="blue">Publier</Button>
            </div>
          </form>
        </div>
      </section>

      <section className="bg-white px-4 pb-20 pt-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <div key={index} className="border rounded p-4 mb-2" style={{ backgroundColor: post.bgColor }}>
                <div className="relative">
                  <div>
                    <Link to={`/profile/${post.user_id}`}>
                      <img className="w-10 h-10 mb-3 rounded-full shadow-lg" src={téléchargement} alt="User profile" />
                      <div>
                        <span>{formatPostDate(post.created_at)}</span>
                      </div>
                    </Link>
                  </div>

                  <div className="z-80 absolute right-0 top-[-6px] w-120 rounded-lg shadow-lg">
                    <Dropdown post={post} onDelete={handleDelete} />
                  </div>
                </div>

                <p>{post.content}</p>

                {/* Displaying images or videos */}
                {post.file_url && (post.file_url.endsWith('.jpeg') || post.file_url.endsWith('.jpg') || post.file_url.endsWith('.png')) && (
                  <img src={post.file_url} alt="uploaded" className="mt-2 w-full h-64 object-cover rounded" />
                )}

                {post.file_url && post.file_url.endsWith('.mp4') && (
                  <video controls src={post.file_url} alt="uploaded" className="mt-2 w-full h-64 object-cover rounded" />
                )}

                <div className="flex justify-between px-6 py-4 border-t">
                  <button onClick={() => handleLike(index)} className="flex items-center text-gray-600 hover:text-blue-500">
                    <FontAwesomeIcon icon={faThumbsUp} className="mr-1" />
                    {post.likes > 0 && `${post.likes}`}
                  </button>
                  <button onClick={() => handleCommentClick(index)} className="flex items-center text-gray-600 hover:text-blue-500">
                    <FontAwesomeIcon icon={faComment} className="mr-1" />
                  </button>
                  <button onClick={() => setAfficherModalPartager(true)} className="flex items-center text-gray-600 hover:text-blue-500">
                    <FontAwesomeIcon icon={faShare} className="mr-1" />
                  </button>
                </div>

                {/* Displaying comments */}
                <div className="comments">
                  {post.comments && post.comments.map((comment, commentIndex) => (
                    <p key={commentIndex} className="comment">{comment}</p>
                  ))}
                </div>

                {commentInputVisible === index && (
                  <form onSubmit={(e) => handleCommentSubmit(e, index)} className="mt-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Écrivez un commentaire..."
                      className="border rounded p-1 w-full"
                    />
                    <button type="submit" className="bg-blue-500 text-white rounded px-2 mt-2">
                      Ajouter
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
}

export default Home;
