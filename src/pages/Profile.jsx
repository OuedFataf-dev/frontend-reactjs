
import React, { useState, useEffect,useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePosts } from './contextapi';
import { useParams } from 'react-router-dom';
import téléchargement from '../assets/téléchargement.jpeg';
import Footer from './footer';
import { faThumbsUp, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import { CameraIcon } from '@heroicons/react/24/solid';  //
import axios from 'axios'; // Importation d'axios
  

function Profile() {
  const { posts, likePost, addComment } = usePosts(); // Utiliser les fonctions du contexte
  const [commentInputVisible, setCommentInputVisible] = useState(null);
  const [newComment, setNewComment] = useState('');
   
  const { userId } = useParams(); 
  const [selectedImage, setSelectedImage] = useState(téléchargement); 
  const { id } = useParams(); 
  const [userPosts, setUserPosts] = useState([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null); 
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  // État pour les posts récupérés de l'utilisateur spécifique
 // Remplace ceci par l'ID de l'utilisateur que tu veux récupérer
 // Récupération du nom de l'utilisateur depuis le localStorage
 useEffect(() => {
   const storedName = localStorage.getItem("userName");
   if (storedName) {
     setUserName(storedName);
   } else {
     setUserName("Nom non trouvé");  // Nom par défaut si non trouvé
   }
 }, []);

 
 useEffect(() => {
  const storedName = localStorage.getItem("userName");
  const storedImage = localStorage.getItem("profileImage");  // Récupérer l'URL de l'image depuis localStorage

  if (storedName) {
    setUserName(storedName);  // Si le nom est trouvé, l'afficher
  } else {
    setUserName("Nom non trouvé");  // Nom par défaut si non trouvé
  }

  // Si une image est trouvée dans le localStorage, on l'utilise
  if (storedImage) {
    setSelectedImage(storedImage);
  } else {
    setSelectedImage(téléchargement);  // Image par défaut si aucune image n'est trouvée
  }
}, []);


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
 
  const handleCameraClick = () => {
    // Lorsque l'icône est cliquée, on déclenche l'input file
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Créez un URL local pour le fichier sélectionné
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); // Mettez à jour l'état avec l'image sélectionnée
      };
      reader.readAsDataURL(file);
      uploadProfilePicture(file); // // Lire l'image en tant que base64
    }
  };

     
  const uploadProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      setLoading(true);  // Activer le chargement
      const response = await axios.post('http://localhost:8000/api/upload-profile-picture', formData, {
        headers: {
          'Authorization':  `Bearer ${token}`, // Remplacez par le token de l'utilisateur
        },
      });
      localStorage.setItem("profileImage", imageUrl); 
      if (response.data.success) {
        setSelectedImage(response.data.file_path);  // Mise à jour de l'image de profil avec l'URL retournée par l'API
      } else {
        setError('Erreur lors du téléchargement de l\'image.');
      }
    } catch (error) {
      setError('Une erreur s\'est produite lors du téléchargement.');
    } finally {
      setLoading(false);  // Désactiver le chargement
    }
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

          <div className="flex justify-center px-5 -mt-12 relative">
      <div className="relative">
        <img
          className="h-32 w-32 bg-white p-2 rounded-full"
          src={selectedImage|| "https://via.placeholder.com/150"}    // Remplacez ceci par le chemin de l'image de profil
          alt="Profile"
        />
        
        {/* Icône de l'appareil photo placée sur le bord du cercle */}
        <button
           onClick={handleCameraClick}
          className="absolute top-0 right-0 bg-white p-2 rounded-full border-2 border-blue-500 transform translate-x-5 translate-y-5 shadow-md">
          <CameraIcon className="h-6 w-6 text-blue-500" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*" // Accepter seulement les images
          onChange={handleFileChange}
          style={{ display: 'none' }} // Masquer l'input
        />
      </div>
    </div>
         
         
          <div className="text-center px-14">
          <h2 className="username">{userName ? userName : "Nom de l'utilisateur"}</h2>
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

