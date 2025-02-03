import { useState, useEffect } from "react";
import axios from "axios";

export function UpdatedUserProfile() {
  // États pour les champs du formulaire
  const [username, setUsername] = useState('');
  const [photoUser, setPhotoUser] = useState(null); // Photo sera un fichier
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const token=localStorage.getItem('token')

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Créer un objet FormData pour envoyer la photo et le nom
    const formData = new FormData();
    formData.append('username', username);
    if (photoUser) {
      formData.append('photoUser', photoUser); // Ajout de la photo si elle existe
    }

    try {
      // Requête PUT pour mettre à jour le profil
      const response = await axios.put('https://127.0.0.1:8000/api/user/profile', formData, {
        headers: {
            Authorization:` Bearer ${token}`
        }
      });

      if (response.status !== 200) {
        throw new Error('Erreur de mise à jour du profil');
      }

      console.log('Profil mis à jour:', response.data);
      setModalOpen(false); // Fermer le modal après la mise à jour
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)} // Ouvre le modal
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Modifier mon profil
      </button>

      {/* Modal pour modifier le profil */}
      {modalOpen && (
        <div id="authentication-modal" className="fixed top-0 left-0 right-0 z-50 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">Modifier votre profil</h3>
              <button
                onClick={() => setModalOpen(false)} // Ferme le modal
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-900">Nom d'utilisateur</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full p-2.5 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="photoUser" className="block text-sm font-medium text-gray-900">Photo de profil</label>
                <input
                  type="file"
                  id="photoUser"
                  onChange={(e) => setPhotoUser(e.target.files[0])}
                  className="block w-full p-2.5 border rounded-lg"
                />
              </div>

              <div className="flex justify-between">
                {error && <div className="text-red-500 text-sm">{error}</div>}
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  {loading ? 'Chargement...' : 'Mettre à jour'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default UpdatedUserProfile;
 