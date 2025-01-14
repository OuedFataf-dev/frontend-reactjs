


import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Dropdown from '../components/Dropdown';
import Navbar from '../components/Navbar';
import téléchargement from '../assets/téléchargement.jpeg';

import { formatDistanceToNow, parseISO } from 'date-fns';
import axios from 'axios'; // Importation d'axios pour les appels API
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
} from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookSquare, faWhatsapp, faTelegram, faTwitterSquare } from '@fortawesome/free-brands-svg-icons';
import { faThumbsUp, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import { useDropzone } from 'react-dropzone';
import { deletePost } from '../services/api';
import { FingerPrintIcon } from "@heroicons/react/24/solid";
import Footer from './footer';
import { usePosts } from './contextapi';

// Composant pour gérer le dépôt d'images/vidéos
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
  const [bgColor, setBgColor] = useState('#ffffff');
  const [file, setFile] = useState(null);
  const [posts, setPosts] = useState([]);
 // const { posts, setPosts } = usePosts();
  const [token, setToken] = useState(localStorage.getItem('token') || null);



  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/posts/${postId}`, // URL de l'API Laravel
        postData, // Les données à envoyer dans la requête PUT
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Le token d'authentification dans les en-têtes
            'Content-Type': 'application/json' // Le type de contenu des données envoyées
          }
        }
      );

      console.log('Post updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  }
  const handleSaveAndDownload = async (postId, postData) => {
    const token = localStorage.getItem('token');
    console.log("Token récupéré depuis le localStorage:", token);
  
    // Vérifier si un token est présent dans le localStorage
    if (!token) {
      console.error("Aucun token trouvé, redirection vers la page de connexion.");
      window.location.href = "/login";  // Rediriger vers la page de connexion
      return;
    }
  
    try {
      // Envoi de la requête pour enregistrer le post
      const response = await axios.post(
        `http://localhost:8000/api/post/${postId}/save`, 
        postData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      console.log('Post saved successfully:', response.data);
  
      // Afficher toute la réponse pour vérifier la structure
      console.log('Réponse complète du serveur:', response.data);
  
      // Vérifier si l'API retourne bien l'URL de l'image
      const imageUrl = response.data.imageUrl;  // Vérifiez si le champ existe
      if (!imageUrl) {
        console.error('L\'URL de l\'image n\'a pas été trouvée.');
        return;
      }
  
      // Utiliser axios pour récupérer l'image en binaire
      const imageResponse = await axios.get(imageUrl, {
        responseType: 'arraybuffer',  // Cela nous permet de récupérer l'image sous forme binaire
      });
  
      // Créer un Blob à partir des données binaires reçues
      const blob = new Blob([imageResponse.data], { type: 'image/jpeg' });  // Assurez-vous du bon type MIME (image/jpeg ou image/png, selon le type réel de l'image)
      
      // Créer un lien de téléchargement
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `post-${postId}.jpg`;  // Nom du fichier à télécharger
      link.click();  // Lancer le téléchargement du fichier
  s
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du post", error);
  
      // Gestion d'une erreur liée à l'authentification
      if (error.response && error.response.status === 401) {
        console.error("Token expiré ou invalide. Redirection vers la page de connexion.");
        localStorage.removeItem('token');  // Supprimer le token expiré ou invalide
        window.location.href = "/login";  // Rediriger vers la page de connexion
      } else {
        // Autres erreurs
        console.error("Une erreur s'est produite lors de la requête:", error.message);
        alert("Une erreur est survenue. Veuillez réessayer plus tard.");
      }
    }
  };
  
  const handleSave = async (postId, postData, token) => {
    try {
      // Construction de l'URL pour le POST
      const response = await axios.post(
        `http://localhost:8000/api/post/${postId}/save`,  // Corrigez l'URL ici
        postData,  // Les données du post à envoyer
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Le token d'authentification
            'Content-Type': 'application/json',   // Type de contenu
          }
        }
      );
  
      console.log('Post saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  //
  
  
  // Charger les posts depuis l'API

  // Charger les posts dès que le composant est monté
 

  // Charger les posts depuis l'API
  const fetchPosts = async (token) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/index', {
        headers: {
          Authorization: `Bearer ${token}`, // Ajouter le token d'authentification
        },
      });
      const posts = response.data;

      // Construire l'URL complète pour chaque fichier
      posts.forEach(post => {
        if (post.file_path) {
          post.file_url = `http://127.0.0.1:8000/storage/${post.file_path}`;
        }
      });

      return posts;
    } catch (error) {
      console.error("Erreur lors de la récupération des posts", error);
      throw error;
    }
  };

  // Récupérer les posts au chargement du composant
  useEffect(() => {
    if (token) {
      fetchPosts(token)
        .then((data) => setPosts(data))
        .catch((error) => console.error('Erreur lors du chargement des posts', error));
    }
  }, [token]);

 
  const handleFileChange = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const createPost = async (content, file, token) => {
    const formData = new FormData();
    formData.append('content', content);
    //formData.append('bgColor', bgColor); // Si vous voulez inclure la couleur de fond, ajoutez-la ici
    if (file) {
      formData.append('file', file); // Le fichier doit être ajouté ici
    }
  
    const baseUrl = 'http://127.0.0.1:8000/storage/posts/'; // URL de base pour l'accès aux fichiers stockés
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/store', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Afficher la réponse pour déboguer
      console.log("Réponse de l'API:", response.data);
  
      const newPost = response.data;
  
      // Construire l'URL complète pour le fichier (si un fichier a été téléchargé)
      if (newPost.file_path) {
        newPost.file_url = `${baseUrl}${newPost.file_path}`; // Ajouter l'URL complète du fichier
      }
  
      return newPost;
    } catch (error) {
      console.error("Erreur lors de la création du post", error);
      throw error;
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Vérifiez si le contenu et le fichier sont vides
    if (!content.trim() && !file) {
      return; // Ne rien faire si le contenu et le fichier sont vides
    }
  
    // Créez d'abord le post via l'API
    createPost(content, file, token)
      .then((newPost) => {
        // Ajouter le nouveau post à l'état local sans avoir à appeler `fetchPosts`
        setPosts((prevPosts) => [newPost, ...prevPosts]);  // Ajoute le nouveau post au début de la liste
        setContent('');  // Réinitialise le contenu du formulaire
        setFile(null);    // Réinitialise le fichier du formulaire
      })
      .catch((error) => {
        console.error('Erreur lors de la soumission du post', error);
      });
  };
  
  // Formater la date d'un post
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

  // Gérer les interactions
  const handleLike = (index) => {
    const newPosts = [...posts];
    newPosts[index].likes += 1;
    setPosts(newPosts);
  };

  const handleCommentClick = (index) => {
    setCommentInputVisible(commentInputVisible === index ? null : index);
  };

  const handleCommentSubmit = (e, index) => {
    e.preventDefault();
    const newPosts = [...posts];
    newPosts[index].comments.push(newComment);
    setPosts(newPosts);
    setNewComment('');
  };

  const handlePartager = () => {
    setAfficherModalPartager(true);
  };

  const handleDelete = async (postId) => {
    if (!token) {
      console.error("Utilisateur non authentifié");
      return;
    }
  
    try {
      // Exemple de suppression via l'API
      await axios.delete(`http://127.0.0.1:8000/api/destroy/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Filtrer le post supprimé de l'état
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Erreur lors de la suppression du post", error);
      if (error.response && error.response.status === 401) {
        // Si le token est invalide ou expiré, vous pouvez rediriger l'utilisateur
        console.error("Token invalide ou expiré.");
        setToken(null);
        localStorage.removeItem('token');
        window.location.href = "/login"; // Redirection vers la page de connexion
      }
    }
  };
      


  return (
    <>
       <div>
       <Navbar />
       </div>
      <div className="relative flex h-screen content-center items-center justify-center pt-16 pb-32">
        <div className="absolute top-0 h-full w-full bg-[url('/img/background-3.png')] bg-cover bg-center" />
        <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
        <div className="max-w-8xl container relative mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12 mb-4">
              <Typography variant="h2" color="white" className="font-bold">
                Salut
               
              </Typography>
            </div>
            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12">
              <Typography variant="h1" color="white" className="mb-6 font-black">
                Your story starts with us.
              </Typography>
              <Typography variant="lead" color="white" className="opacity-80">
                This is a simple example of a Landing Page you can build using
                Material Tailwind.
              </Typography>
            </div>
          </div>
        </div>
      </div>

      <section className="-mt-32 bg-white px-4 pb-20 pt-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
        <div key={index} className="border rounded p-4 mb-2" style={{ backgroundColor: post.bgColor }}>
          <div className="relative">
            <div>
              <Link to={'/profile'}>
                <img className="w-10 h-10 mb-3 rounded-full shadow-lg" src={téléchargement} alt="User profile" />
                <div>
                  <span>{formatPostDate(post.created_at)}</span>
                </div>
              </Link>
            </div>

            <div className="z-80 absolute right-0 top-[-6px] w-120 rounded-lg shadow-lg">
             //<Dropdown post={post} onDelete={handleDelete}  onSave={handleSaveAndDownload} index={index} />
            </div>
          </div>

          <p>{post.content}</p>

          {/* Affichage des fichiers (images et vidéos) */}

          {post.file_url && (
           (post.file_url.endsWith('.jpeg') || post.file_url.endsWith('.jpg') || post.file_url.endsWith('.png')) && (
       <>
          {console.log(post.file_url)}  {/* Vérifier l'URL générée */}
         <img src={post.file_url} alt="uploaded" className="mt-2 w-full h-64 object-cover rounded" />
      </>
     )
)       }

          {post.file_url && post.file_url.endsWith('.mp4') && (
            <video controls src={post.file_url} alt="uploaded" className="mt-2 w-full h-64 object-cover rounded" />
          )}

          <div className="flex justify-between px-6 py-4 border-t">
            <button onClick={() => handleLike(index)} className="flex items-center text-gray-600 hover:text-blue-500">
              <FontAwesomeIcon icon={faThumbsUp} className="mr-1" />
              {post.likes > 0 && `${post.likes}`}
            </button>
            <button className="flex items-center text-gray-600 hover:text-blue-500" onClick={() => handleCommentClick(index)}>
              <FontAwesomeIcon icon={faComment} className="mr-1" />
            </button>
            <button onClick={handlePartager} className="flex items-center text-gray-600 hover:text-blue-500">
              <FontAwesomeIcon icon={faShare} className="mr-1" />
            </button>
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
            

{ afficherModalPartager && (
<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
<div className="bg-white p-6 rounded-lg shadow-md relative w-96 md:w-[80%] lg:w-[60%] xl:w-[50%] h-auto max-h-[80vh]">
<h3 className="text-lg font-semibold mb-6">Partager ce contenu</h3>

{/* Bouton de fermeture */}
<button
  onClick={() => setAfficherModalPartager(false)}
  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
>
  <svg
    className="w-4 h-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 14 14"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
    />
  </svg>
  <span className="sr-only">Fermer modal</span>
</button>

{/* Options de partage avec icônes Font Awesome */}
<div className="space-y-6">
  {/* Partager sur Facebook */}
  <button
    onClick={() =>
      window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href), '_blank')
    }
    className="flex items-center w-full p-4 text-blue-600 hover:bg-gray-200 rounded-lg"
  >
    <FontAwesomeIcon icon={faFacebookSquare} size="2x" className="mr-4" />
    <span>Partager sur Facebook</span>
  </button>

  {/* Partager sur Twitter */}
  <button
    onClick={() =>
      window.open('https://twitter.com/intent/tweet?url=' + encodeURIComponent(window.location.href), '_blank')
    }
    className="flex items-center w-full p-4 text-blue-400 hover:bg-gray-200 rounded-lg"
  >
    <FontAwesomeIcon icon={faTwitterSquare} size="2x" className="mr-4" />
    <span>Partager sur Twitter</span>
  </button>

  {/* Partager par Email */}
  
  {/* Partager par WhatsApp */}
  <button
    onClick={() =>
      window.open('https://wa.me/?text=' + encodeURIComponent(window.location.href), '_blank')
    }
    className="flex items-center w-full p-4 text-green-500 hover:bg-gray-200 rounded-lg"
  >
    <FontAwesomeIcon icon={faWhatsapp} size="2x" className="mr-4" />
    <span>Partager par WhatsApp</span>
  </button>

  {/* Partager par Telegram */}
  <button
    onClick={() =>
      window.open('https://t.me/share/url?url=' + encodeURIComponent(window.location.href), '_blank')
    }
    className="flex items-center w-full p-4 text-blue-500 hover:bg-gray-200 rounded-lg"
  >
    <FontAwesomeIcon icon={faTelegram} size="2x" className="mr-4" />
    <span>Partager par Telegram</span>
  </button>
</div>
</div>
</div>
)}
        </div>

        <div className="mt-32 flex flex-wrap items-center">
          <div className="mx-auto -mt-8 w-full px-4 md:w-5/12">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-gray-900 p-2 text-center shadow-lg">
              <FingerPrintIcon className="h-8 w-8 text-white " />
            </div>
            <Typography variant="h3" className="mb-3 font-bold" color="blue-gray">
              Working with us is a pleasure
            </Typography>
            <Typography className="mb-8 font-normal text-blue-gray-500">
              Don't let your users guess by attaching tooltips and popovers to
              any element.
            </Typography>
            <Button variant="filled">Read more</Button>
          </div>

          <div className="mx-auto mt-24 flex w-full justify-center px-4 md:w-4/12 lg:mt-0">
            <Card className="shadow-lg border shadow-blue-500/10">
              <CardHeader floated={false} color="blue-gray" className="relative h-24">
                <ImageDropzone onDrop={handleFileChange} />
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit}>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="resize-none w-full p-2 border rounded mb-2"
                    rows="4"
                    placeholder="Entrez votre message..."
                  />
                  <button
                    type="submit"
                    disabled={!content.trim() && !file} // Le bouton est désactivé si aucun contenu ou fichier n'est présent
                    className="w-full py-2 bg-blue-500 text-white rounded mt-4"
                  >
                    Publier
                  </button>
                </form>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
/*  */













import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Dropdown from '../components/Dropdown';
import Navbar from '../components/Navbar';
import téléchargement from '../assets/téléchargement.jpeg';

import { formatDistanceToNow, parseISO } from 'date-fns';
import axios from 'axios'; // Importation d'axios pour les appels API
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
} from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookSquare, faWhatsapp, faTelegram, faTwitterSquare } from '@fortawesome/free-brands-svg-icons';
import { faThumbsUp, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import { useDropzone } from 'react-dropzone';
import { deletePost } from '../services/api';
import { FingerPrintIcon } from "@heroicons/react/24/solid";
import Footer from './footer';
import { usePosts } from './contextapi';

// Composant pour gérer le dépôt d'images/vidéos
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
  const [bgColor, setBgColor] = useState('#ffffff');
  const [file, setFile] = useState(null);
  const { posts, addPost, deletePost } = usePosts(); 
 // const [posts, setPosts] = useState([]);
 // const { posts, setPosts } = usePosts();
  const [token, setToken] = useState(localStorage.getItem('token') || null);



  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/posts/${postId}`, // URL de l'API Laravel
        postData, // Les données à envoyer dans la requête PUT
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Le token d'authentification dans les en-têtes
            'Content-Type': 'application/json' // Le type de contenu des données envoyées
          }
        }
      );

      console.log('Post updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  }
  const handleSaveAndDownload = async (postId, postData) => {
    const token = localStorage.getItem('token');
    console.log("Token récupéré depuis le localStorage:", token);
  
    // Vérifier si un token est présent dans le localStorage
    if (!token) {
      console.error("Aucun token trouvé, redirection vers la page de connexion.");
      window.location.href = "/login";  // Rediriger vers la page de connexion
      return;
    }
  
    try {
      // Envoi de la requête pour enregistrer le post
      const response = await axios.post(
        `http://localhost:8000/api/post/${postId}/save`, 
        postData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      console.log('Post saved successfully:', response.data);
  
      // Afficher toute la réponse pour vérifier la structure
      console.log('Réponse complète du serveur:', response.data);
  
      // Vérifier si l'API retourne bien l'URL de l'image
      const imageUrl = response.data.imageUrl;  // Vérifiez si le champ existe
      if (!imageUrl) {
        console.error('L\'URL de l\'image n\'a pas été trouvée.');
        return;
      }
  
      // Utiliser axios pour récupérer l'image en binaire
      const imageResponse = await axios.get(imageUrl, {
        responseType: 'arraybuffer',  // Cela nous permet de récupérer l'image sous forme binaire
      });
  
      // Créer un Blob à partir des données binaires reçues
      const blob = new Blob([imageResponse.data], { type: 'image/jpeg' });  // Assurez-vous du bon type MIME (image/jpeg ou image/png, selon le type réel de l'image)
      
      // Créer un lien de téléchargement
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `post-${postId}.jpg`;  // Nom du fichier à télécharger
      link.click();  // Lancer le téléchargement du fichier
  
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du post", error);
  
      // Gestion d'une erreur liée à l'authentification
      if (error.response && error.response.status === 401) {
        console.error("Token expiré ou invalide. Redirection vers la page de connexion.");
        localStorage.removeItem('token');  // Supprimer le token expiré ou invalide
        window.location.href = "/login";  // Rediriger vers la page de connexion
      } else {
        // Autres erreurs
        console.error("Une erreur s'est produite lors de la requête:", error.message);
        alert("Une erreur est survenue. Veuillez réessayer plus tard.");
      }
    }
  };
  
  const handleSave = async (postId, postData, token) => {
    try {
      // Construction de l'URL pour le POST
      const response = await axios.post(
        `http://localhost:8000/api/post/${postId}/save`,  // Corrigez l'URL ici
        postData,  // Les données du post à envoyer
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Le token d'authentification
            'Content-Type': 'application/json',   // Type de contenu
          }
        }
      );
  
      console.log('Post saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  //
  
  
  // Charger les posts depuis l'API

  // Charger les posts dès que le composant est monté
 


  const fetchPosts = async (token) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/index', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log("Réponse API: ", response.data);  // Log pour déboguer
  
      const posts = response.data;
  
      // Ajouter l'URL complète pour chaque fichier
      posts.forEach((post) => {
        if (post.file_path) {
          post.file_url = `http://127.0.0.1:8000/storage/${post.file_path}`;
        }
      });
  
      return posts;
    } catch (error) {
      console.error("Erreur lors de la récupération des posts", error);
      throw error;
    }
  };
  

 
  // Récupérer les posts au chargement du composant
  useEffect(() => {
    if (token) {
      fetchPosts(token)
        .then((data) =>  addPost(data))
        .catch((error) => console.error('Erreur lors du chargement des posts', error));
    }
  }, [token]);

 
  const handleFileChange = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const createPost = async (content, file, token) => {
    const formData = new FormData();
    formData.append('content', content);
    //formData.append('bgColor', bgColor); // Si vous voulez inclure la couleur de fond, ajoutez-la ici
    if (file) {
      formData.append('file', file); // Le fichier doit être ajouté ici
    }
  
    const baseUrl = 'http://127.0.0.1:8000/storage/posts/'; // URL de base pour l'accès aux fichiers stockés
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/store', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Afficher la réponse pour déboguer
      console.log("Réponse de l'API:", response.data);
  
      const newPost = response.data;
  
      // Construire l'URL complète pour le fichier (si un fichier a été téléchargé)
      if (newPost.file_path) {
        newPost.file_url = `${baseUrl}${newPost.file_path}`; // Ajouter l'URL complète du fichier
      }
  
      return newPost;
    } catch (error) {
      console.error("Erreur lors de la création du post", error);
      throw error;
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Vérifiez si le contenu et le fichier sont vides
    if (!content.trim() && !file) {
      return; // Ne rien faire si le contenu et le fichier sont vides
    }
  
    // Créez d'abord le post via l'API
    createPost(content, file, token)
      .then((newPost) => {
        // Ajouter le nouveau post à l'état local sans avoir à appeler `fetchPosts`
        //setPosts((prevPosts) => [newPost, ...prevPosts]); 
        addPost(newPost);  // Ajoute le post au contexte // Ajoute le nouveau post au début de la liste
        setContent('');  // Réinitialise le contenu du formulaire
        setFile(null);    // Réinitialise le fichier du formulaire
      })
      .catch((error) => {
        console.error('Erreur lors de la soumission du post', error);
      });
  };
  
  // Formater la date d'un post
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

  // Gérer les interactions
  const handleLike = (index) => {
    const newPosts = [...posts];
    newPosts[index].likes += 1;
    addPost(newPosts[index]);  
   // setPosts(newPosts);
  };

  const handleCommentClick = (index) => {
    setCommentInputVisible(commentInputVisible === index ? null : index);
  };

  const handleCommentSubmit = (e, index) => {
    e.preventDefault();
    const newPosts = [...posts];
    newPosts[index].comments.push(newComment);
    addPost(newPosts[index]);  
   // setPosts(newPosts);
    setNewComment('');
  };

  const handlePartager = () => {
    setAfficherModalPartager(true);
  };

  const handleDelete = async (postId) => {
    if (!token) {
      console.error("Utilisateur non authentifié");
      return;
    }
  
    try {
      // Exemple de suppression via l'API
      await axios.delete(`http://127.0.0.1:8000/api/destroy/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Filtrer le post supprimé de l'état
      deletePost(postId); 
     // setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Erreur lors de la suppression du post", error);
      if (error.response && error.response.status === 401) {
        // Si le token est invalide ou expiré, vous pouvez rediriger l'utilisateur
        console.error("Token invalide ou expiré.");
        setToken(null);
        localStorage.removeItem('token');
        window.location.href = "/login"; // Redirection vers la page de connexion
      }
    }
  };


  
      


  return (
    <>
       <div>
       <Navbar />
       </div>
      <div className="relative flex h-screen content-center items-center justify-center pt-16 pb-32">
        <div className="absolute top-0 h-full w-full bg-[url('/img/background-3.png')] bg-cover bg-center" />
        <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
        <div className="max-w-8xl container relative mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12 mb-4">
              <Typography variant="h2" color="white" className="font-bold">
                Salut
               
              </Typography>
            </div>
            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12">
              <Typography variant="h1" color="white" className="mb-6 font-black">
                Your story starts with us.
              </Typography>
              <Typography variant="lead" color="white" className="opacity-80">
                This is a simple example of a Landing Page you can build using
                Material Tailwind.
              </Typography>
            </div>
          </div>
        </div>
      </div>

      <section className="-mt-32 bg-white px-4 pb-20 pt-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
        <div key={index} className="border rounded p-4 mb-2" style={{ backgroundColor: post.bgColor }}>
          <div className="relative">
            <div>
              <Link to={'/profile'}>
                <img className="w-10 h-10 mb-3 rounded-full shadow-lg" src={téléchargement} alt="User profile" />
                <div>
                  <span>{formatPostDate(post.created_at)}</span>
                </div>
              </Link>
            </div>

            <div className="z-80 absolute right-0 top-[-6px] w-120 rounded-lg shadow-lg">
             //<Dropdown post={post} onDelete={handleDelete}  onSave={handleSaveAndDownload} index={index} />
            </div>
          </div>

          <p>{post.content}</p>

          {/* Affichage des fichiers (images et vidéos) */}

          {post.file_url && (
           (post.file_url.endsWith('.jpeg') || post.file_url.endsWith('.jpg') || post.file_url.endsWith('.png')) && (
       <>
          {console.log(post.file_url)}  {/* Vérifier l'URL générée */}
         <img src={post.file_url} alt="uploaded" className="mt-2 w-full h-64 object-cover rounded" />
      </>
     )
)       }

          {post.file_url && post.file_url.endsWith('.mp4') && (
            <video controls src={post.file_url} alt="uploaded" className="mt-2 w-full h-64 object-cover rounded" />
          )}

          <div className="flex justify-between px-6 py-4 border-t">
            <button onClick={() => handleLike(index)} className="flex items-center text-gray-600 hover:text-blue-500">
              <FontAwesomeIcon icon={faThumbsUp} className="mr-1" />
              {post.likes > 0 && `${post.likes}`}
            </button>
            <button className="flex items-center text-gray-600 hover:text-blue-500" onClick={() => handleCommentClick(index)}>
              <FontAwesomeIcon icon={faComment} className="mr-1" />
            </button>
            <button onClick={handlePartager} className="flex items-center text-gray-600 hover:text-blue-500">
              <FontAwesomeIcon icon={faShare} className="mr-1" />
            </button>
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
            

{ afficherModalPartager && (
<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
<div className="bg-white p-6 rounded-lg shadow-md relative w-96 md:w-[80%] lg:w-[60%] xl:w-[50%] h-auto max-h-[80vh]">
<h3 className="text-lg font-semibold mb-6">Partager ce contenu</h3>

{/* Bouton de fermeture */}
<button
  onClick={() => setAfficherModalPartager(false)}
  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
>
  <svg
    className="w-4 h-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 14 14"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
    />
  </svg>
  <span className="sr-only">Fermer modal</span>
</button>

{/* Options de partage avec icônes Font Awesome */}
<div className="space-y-6">
  {/* Partager sur Facebook */}
  <button
    onClick={() =>
      window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href), '_blank')
    }
    className="flex items-center w-full p-4 text-blue-600 hover:bg-gray-200 rounded-lg"
  >
    <FontAwesomeIcon icon={faFacebookSquare} size="2x" className="mr-4" />
    <span>Partager sur Facebook</span>
  </button>

  {/* Partager sur Twitter */}
  <button
    onClick={() =>
      window.open('https://twitter.com/intent/tweet?url=' + encodeURIComponent(window.location.href), '_blank')
    }
    className="flex items-center w-full p-4 text-blue-400 hover:bg-gray-200 rounded-lg"
  >
    <FontAwesomeIcon icon={faTwitterSquare} size="2x" className="mr-4" />
    <span>Partager sur Twitter</span>
  </button>

  {/* Partager par Email */}
  
  {/* Partager par WhatsApp */}
  <button
    onClick={() =>
      window.open('https://wa.me/?text=' + encodeURIComponent(window.location.href), '_blank')
    }
    className="flex items-center w-full p-4 text-green-500 hover:bg-gray-200 rounded-lg"
  >
    <FontAwesomeIcon icon={faWhatsapp} size="2x" className="mr-4" />
    <span>Partager par WhatsApp</span>
  </button>

  {/* Partager par Telegram */}
  <button
    onClick={() =>
      window.open('https://t.me/share/url?url=' + encodeURIComponent(window.location.href), '_blank')
    }
    className="flex items-center w-full p-4 text-blue-500 hover:bg-gray-200 rounded-lg"
  >
    <FontAwesomeIcon icon={faTelegram} size="2x" className="mr-4" />
    <span>Partager par Telegram</span>
  </button>
</div>
</div>
</div>
)}
        </div>

        <div className="mt-32 flex flex-wrap items-center">
          <div className="mx-auto -mt-8 w-full px-4 md:w-5/12">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-gray-900 p-2 text-center shadow-lg">
              <FingerPrintIcon className="h-8 w-8 text-white " />
            </div>
            <Typography variant="h3" className="mb-3 font-bold" color="blue-gray">
              Working with us is a pleasure
            </Typography>
            <Typography className="mb-8 font-normal text-blue-gray-500">
              Don't let your users guess by attaching tooltips and popovers to
              any element.
            </Typography>
            <Button variant="filled">Read more</Button>
          </div>

          <div className="mx-auto mt-24 flex w-full justify-center px-4 md:w-4/12 lg:mt-0">
            <Card className="shadow-lg border shadow-blue-500/10">
              <CardHeader floated={false} color="blue-gray" className="relative h-24">
                <ImageDropzone onDrop={handleFileChange} />
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit}>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="resize-none w-full p-2 border rounded mb-2"
                    rows="4"
                    placeholder="Entrez votre message..."
                  />
                  <button
                    type="submit"
                    disabled={!content.trim() && !file} // Le bouton est désactivé si aucun contenu ou fichier n'est présent
                    className="w-full py-2 bg-blue-500 text-white rounded mt-4"
                  >
                    Publier
                  </button>
                </form>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
/*  */



import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePosts } from './contextapi';
import { useParams } from 'react-router-dom';
import téléchargement from '../assets/téléchargement.jpeg';
import Footer from './footer';
import { faThumbsUp, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'; // Importation d'axios
  

function Profile() {
  const { posts, likePost, addComment } = usePosts(); // Utiliser les fonctions du contexte
  const [commentInputVisible, setCommentInputVisible] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [userPosts, setUserPosts] = useState([]); 
  const { userId } = useParams(); // État pour les posts récupérés de l'utilisateur spécifique
 // Remplace ceci par l'ID de l'utilisateur que tu veux récupérer
  
  // Fonction pour récupérer les posts d'un utilisateur spécifique avec axios
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/posts/user/${userId}`);
        setUserPosts(response.data);  // Met à jour l'état avec les posts récupérés
      } catch (error) {
        console.error('Erreur de récupération des posts:', error);
      }
    };

    fetchPosts(); // Appelle la fonction au chargement du composant
  }, [userId]);

  const handleLike = (index) => {
    likePost(index); // Utiliser la fonction likePost du contexte
  };

  const handleCommentClick = (index) => {
    setCommentInputVisible(commentInputVisible === index ? null : index);
  };

  const handleCommentSubmit = (e, index) => {
    e.preventDefault();
    addComment(index, newComment); // Utiliser la fonction addComment du contexte
    setNewComment(''); // Réinitialiser le champ du commentaire
  };

  const handlePartager = () => {
    // Votre logique pour partager
  };

  return (
    <section className="bg-blueGray-50">
      <div className="flex flex-wrap items-center justify-center bg-gray-200 dark:bg-gray-800">
        <div className="container lg:w-2/6 xl:w-2/7 sm:w-full md:w-2/3 bg-white shadow-lg transform duration-200 ease-in-out">
          <div className="h-32 overflow-hidden">
            <img
              className="w-full"
              src="https://images.unsplash.com/photo-1605379399642-870262d3d051?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
              alt=""
            />
          </div>
          <div className="flex justify-center px-5 -mt-12">
            <img className="h-32 w-32 bg-white p-2 rounded-full" src={téléchargement} alt="" />
          </div>
          <div className="text-center px-14">
            <h2 className="text-gray-800 text-3xl font-bold">Mohit Dhiman</h2>
            <a
              className="text-gray-400 mt-2 hover:text-blue-500"
              href="https://www.instagram.com/immohitdhiman/"
              target="BLANK()"
            >
              809 ami(e)s 44 en commun
            </a>
            <p className="mt-2 text-gray-500 text-sm">Publication</p>
          </div>
          <hr className="mt-6" />
          <div className="flex bg-gray-50">
            <div className="text-center w-1/2 p-4 hover:bg-gray-100 cursor-pointer">
              <p>
                <span className="font-semibold">2.5 k </span> Followers
              </p>
            </div>
            <div className="border"></div>
            <div className="text-center w-1/2 p-4 hover:bg-gray-100 cursor-pointer">
              <p>
                <span className="font-semibold">2.0 k </span> Following
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center bg-gray-200 dark:bg-gray-800">
        <div className="container lg:w-2/3 xl:w-3/4 sm:w-full md:w-3/4 bg-white shadow-lg transform duration-200 ease-in-out">
          {userPosts && userPosts.length > 0 ? (
            userPosts.map((post, index) => (
              <div key={index} className="border rounded p-6 mb-4" style={{ backgroundColor: post.bgColor }}>
                <p>{post.content}</p>
                
                {/* Vérification et affichage de l'image en utilisant file_path */}
                {post.file_path && post.file_path !== 'null' && (
                  <img 
                    src={`http://localhost:8000/storage/${post.file_path}`}  // URL complète avec le serveur
                    alt="uploaded" 
                    className="mt-2 w-full h-72 object-cover rounded" 
                  />
                )}

                {/* Vérification pour un fichier vidéo */}
                {post.file && post.file.type.startsWith('video') && (
                  <video controls src={URL.createObjectURL(post.file)} alt="uploaded" className="mt-2 w-full h-72 object-cover rounded" />
                )}
                
                <div className="flex justify-between px-6 py-4 border-t">
                  <button onClick={() => handleLike(index)} className="flex items-center text-gray-600 hover:text-blue-500">
                    <FontAwesomeIcon icon={faThumbsUp} className="mr-1" />
                    {post.likes > 0 && `${post.likes}`}
                  </button>
                  <button onClick={() => handleCommentClick(index)} className="flex items-center text-gray-600 hover:text-blue-500">
                    <FontAwesomeIcon icon={faComment} className="mr-1" />
                  </button>
                  <button onClick={() => handlePartager(index)} className="flex items-center text-gray-600 hover:text-blue-500">
                    <FontAwesomeIcon icon={faShare} className="mr-1" />
                  </button>
                </div>

                {/* Affichage des commentaires */}
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

                {post.comments && post.comments.length > 0 && (
                  <div className="mt-2">
                    {post.comments.map((comment, commentIndex) => (
                      <div key={commentIndex} className="text-gray-700">- {comment}</div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-gray-600">No posts to display</div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Profile;



import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Profile() {
  // Récupérer l'ID de l'utilisateur depuis l'URL
  const { id } = useParams(); 
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/posts/user/${id}`, {
          headers: {
            Authorization: `Bearer 41|jQWhzMi5rha2W9sjyYD8Mca16I0LdzmNMpqxQ1h592546b55`
          }
        });
        setUserPosts(response.data); // Mettre à jour les posts de l'utilisateur
      } catch (err) {
        setError("Erreur lors de la récupération des posts de cet utilisateur.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [id]); // Refaire la requête chaque fois que l'ID change

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Profil de l'utilisateur {id}</h1>
      {userPosts.length > 0 ? (
        <ul>
          {userPosts.map(post => (
            <li key={post.id}>
              <div>
                <p>{post.content}</p>
                <img src={`http://127.0.0.1:8000/storage/${post.file_path}`} alt="Post" />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun post disponible pour cet utilisateur.</p>
      )}
    </div>
  );
}

export default Profile;


<form onSubmit={handleSubmit}>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="resize-none w-full p-2 border rounded mb-2"
                    rows="4"
                    placeholder="Entrez votre message..."
                  />
                  <button
                    type="submit"
                    disabled={!content.trim() && !file} // Le bouton est désactivé si aucun contenu ou fichier n'est présent
                    className="w-full py-2 bg-blue-500 text-white rounded mt-4"
                  >
                    Publier
                  </button>
                </form>