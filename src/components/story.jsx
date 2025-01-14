import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Dropdown from '../components/Dropdown';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import { useDropzone } from 'react-dropzone';
import téléchargement from '../assets/téléchargement.jpeg';


function Profile() {
  const [content, setContent] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [file, setFile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentInputVisible, setCommentInputVisible] = useState(null);
  const [afficherModalPartager, setAfficherModalPartager] = useState(false);

  const handleFileChange = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  // Fonction de soumission de la publication
  const handleSubmit = (e) => {
    e.preventDefault();

    // Autoriser la soumission si du contenu est présent OU un fichier est sélectionné
    if (!content.trim() && !file) {
      return; // Ne soumettre que si le contenu n'est pas vide ou un fichier est sélectionné
    }

    const newPost = { content, bgColor, file, likes: 0, comments: [] };
    setPosts([...posts, newPost]);

    // Réinitialiser l'état après la soumission
    setContent('');
    setFile(null);
  };

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

  return (
    <section className="pt-16 bg-blueGray-50">
      <div className="h-screen bg-gray-200 dark:bg-gray-800 flex flex-wrap items-center justify-center">
        <div className="container lg:w-2/6 xl:w-2/7 sm:w-full md:w-2/3 bg-white shadow-lg transform duration-200 easy-in-out">
          <div className="h-32 overflow-hidden">
            <img
              className="w-full"
              src="https://images.unsplash.com/photo-1605379399642-870262d3d051?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
              alt=""
            />
          </div>
          <div className="flex justify-center px-5 -mt-12">
            <img
              className="h-32 w-32 bg-white p-2 rounded-full"
              src={téléchargement}
              alt=""
            />
          </div>
          <div>
            <div className="text-center px-14">
              <h2 className="text-gray-800 text-3xl font-bold">Mohit Dhiman</h2>
              <a
                className="text-gray-400 mt-2 hover:text-blue-500"
                href="https://www.instagram.com/immohitdhiman/"
                target="BLANK()"
              >
                809 ami(e)s         44 en commun
              </a>
              <p className="mt-2 text-gray-500 text-sm">
                 publication

              </p>
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
      </div>
      {posts.map((post, index) => (
              <div key={index} className="border rounded p-4 mb-2" style={{ backgroundColor: post.bgColor }}>
                <div className="relative">
                  <div>
                    <Link to={'/profile'}>
                      <img className="w-10 h-10 mb-3 rounded-full shadow-lg" src={téléchargement} alt="User profile" />
                    </Link>
                  </div>

                  <div className="z-80 absolute right-0 top-[-6px] w-120  rounded-lg shadow-lg">
                    <Dropdown index={index} />
                  </div>
                </div>

                <p>{post.content}</p>

                {post.file && post.file.type.startsWith('image') && (
                  <img src={URL.createObjectURL(post.file)} alt="uploaded" className="mt-2 w-full h-64 object-cover rounded" />
                )}
                {post.file && post.file.type.startsWith('video') && (
                  <video controls src={URL.createObjectURL(post.file)} alt="uploaded" className="mt-2 w-full h-64 object-cover rounded" />
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

                {post.comments.length > 0 && (
                  <div className="mt-2">
                    {post.comments.map((comment, commentIndex) => (
                      <div key={commentIndex} className="text-gray-700">- {comment}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
    </section>
  );
}

export default Profile;







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
  

  // Charger les posts depuis l'API
  const fetchPosts = async (token) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/index', {
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
  useEffect(() => {
    if (token) {
      fetchPosts(token)
        .then((data) => setPosts(data))
        .catch((error) => console.error('Erreur lors du chargement des posts', error));
    }
  }, [token, setPosts]);

  const handleFileChange = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  // Fonction pour créer un post
  const createPost = async (content, file, token) => {
    const formData = new FormData();
    formData.append('content', content);
  //  formData.append('bgColor', bgColor);
    if (file) {
      formData.append('file', file);
    }
     // Optional: only include tags if provided
    // if (tags && tags.length > 0) {
     // formData.append("tags", JSON.stringify(tags)); 
    //}

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/store', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du post", error);
      throw error;
    }
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!content.trim() && !file) {
      return; // Ne rien faire si le contenu et le fichier sont vides
    }

    createPost(content, file, token)
      .then((newPost) => {
        setPosts([newPost, ...posts]);
        setContent('');
        setFile(null);
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
                        <span>{formatPostDate(post.createdAt)}</span>
                        </div>
                    </Link>
                  </div>

                  <div className="z-80 absolute right-0 top-[-6px] w-120  rounded-lg shadow-lg">
                    <Dropdown index={index} />
                  </div>
                </div>

                <p>{post.content}</p>

                {post.file && post.file.type.startsWith('image') && (
                  <img src={URL.createObjectURL(post.file)} alt="uploaded" className="mt-2 w-full h-64 object-cover rounded" />
                )}
                {post.file && post.file.type.startsWith('video') && (
                  <video controls src={URL.createObjectURL(post.file)} alt="uploaded" className="mt-2 w-full h-64 object-cover rounded" />
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

                {post.comments.length > 0 && (
                  <div className="mt-2">
                    {post.comments.map((comment, commentIndex) => (
                      <div key={commentIndex} className="text-gray-700">- {comment}</div>
                    ))}
                  </div>
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