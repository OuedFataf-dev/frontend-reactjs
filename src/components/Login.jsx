import React, { useState } from "react";
import { CpuChipIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from '@react-oauth/google'; // Importation du package

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Réinitialiser les erreurs au cas où une précédente erreur aurait été définie
    setError('');

    // Validation des champs
    if (!email || !password) {
      setError("Veuillez compléter tous les champs.");
      return;
    }

    try {
      setLoading(true); // Démarrer le chargement

      // Requête de connexion
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password,
        withCredentials: true,
        withXSRFToken: true,
      });

      // Vérifier si un token est renvoyé et le stocker
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userName', response.data.user.name); // Enregistrer le nom de l'utilisateur

        console.log('Token reçu :', response.data.token);  // Afficher le token dans la console
        navigate('/home'); // Rediriger l'utilisateur vers la page d'accueil
      } else {
        setError("Une erreur est survenue. Aucun token reçu.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Mot de passe incorrect ou email non trouvé.");
      } else {
        setError('Une erreur s\'est produite. Veuillez réessayer.');
      }
    } finally {
      setLoading(false); // Arrêter le chargement
    }
  };

  const responseGoogle = async (response) => {
    if (response.credential) {
      try {
        const res = await axios.post('http://localhost:8000/api/google', {
          token: response.credential,
        });

        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          console.log('Token reçu :', res.data.token);
          navigate('/home');
        } else {
          setError("Une erreur est survenue lors de la connexion avec Google.");
        }
      } catch (error) {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
    } else {
      setError("Connexion Google échouée. Veuillez réessayer.");
    }
  };

  return (
    <>        
      <div className="font-[sans-serif] max-sm:px-4">
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-4 m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
            <div className="md:max-w-md w-full px-4 py-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-12">
                  <h3 className="text-gray-800 text-3xl font-extrabold">Sign in</h3>
                  <p className="text-sm mt-4 text-gray-800">Don't have an account? <a href="/sign-up" className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap">Register here</a></p>
                </div>

                <div>
                  <label htmlFor="email" className="text-gray-800 text-xs block mb-2">Email</label>
                  <div className="relative flex items-center">
                    <input
                      id="email"
                      name="email"
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-3 outline-none"
                      placeholder="Enter email"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <label htmlFor="password" className="text-gray-800 text-xs block mb-2">Password</label>
                  <div className="relative flex items-center">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-3 outline-none"
                      placeholder="Enter password"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                  <div className="flex items-center">
                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-800">Remember me</label>
                  </div>
                  <div>
                    <a href="#" className="text-blue-600 font-semibold text-sm hover:underline">Forgot Password?</a>
                  </div>
                </div>

                <div className="mt-12">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    {loading ? 'Loading...' : 'Sign in'}
                  </button>
                </div>

                {error && (
                  <div className="text-red-500 mt-4 text-center">
                    <p>{error}</p>
                  </div>
                )}

                <div className="my-4 flex items-center gap-4">
                  <hr className="w-full border-gray-300" />
                  <p className="text-sm text-gray-800 text-center">or</p>
                  <hr className="w-full border-gray-300" />
                </div>

                <div className="space-x-6 flex justify-center">
                <button type="button"
                  class="border-none outline-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 inline" viewBox="0 0 512 512">
                    <path fill="#fbbd00"
                      d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                      data-original="#fbbd00" />
                    <path fill="#0f9d58"
                      d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                      data-original="#0f9d58" />
                    <path fill="#31aa52"
                      d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
                      data-original="#31aa52" />
                    <path fill="#3c79e6"
                      d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
                      data-original="#3c79e6" />
                    <path fill="#cf2d48"
                      d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
                      data-original="#cf2d48" />
                    <path fill="#eb4132"
                      d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
                      data-original="#eb4132" />
                  </svg>
                </button>

                <button type="button"
                  class="border-none outline-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 inline" fill="#000" viewBox="0 0 22.773 22.773">
                    <path d="M15.769 0h.162c.13 1.606-.483 2.806-1.228 3.675-.731.863-1.732 1.7-3.351 1.573-.108-1.583.506-2.694 1.25-3.561C13.292.879 14.557.16 15.769 0zm4.901 16.716v.045c-.455 1.378-1.104 2.559-1.896 3.655-.723.995-1.609 2.334-3.191 2.334-1.367 0-2.275-.879-3.676-.903-1.482-.024-2.297.735-3.652.926h-.462c-.995-.144-1.798-.932-2.383-1.642-1.725-2.098-3.058-4.808-3.306-8.276v-1.019c.105-2.482 1.311-4.5 2.914-5.478.846-.52 2.009-.963 3.304-.765.555.086 1.122.276 1.619.464.471.181 1.06.502 1.618.485.378-.011.754-.208 1.135-.347 1.116-.403 2.21-.865 3.652-.648 1.733.262 2.963 1.032 3.723 2.22-1.466.933-2.625 2.339-2.427 4.74.176 2.181 1.444 3.457 3.028 4.209z" data-original="#000000"></path>
                  </svg>
                </button>
                <button type="button"
                  class="border-none outline-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 inline" fill="#007bff" viewBox="0 0 167.657 167.657">
                    <path d="M83.829.349C37.532.349 0 37.881 0 84.178c0 41.523 30.222 75.911 69.848 82.57v-65.081H49.626v-23.42h20.222V60.978c0-20.037 12.238-30.956 30.115-30.956 8.562 0 15.92.638 18.056.919v20.944l-12.399.006c-9.72 0-11.594 4.618-11.594 11.397v14.947h23.193l-3.025 23.42H94.026v65.653c41.476-5.048 73.631-40.312 73.631-83.154 0-46.273-37.532-83.805-83.828-83.805z" data-original="#010002"></path>
                  </svg>
                </button>
                </div>
              </form>
            </div>

            <div className="w-full h-full flex items-center bg-[#000842] rounded-xl p-8">
              <img src="https://readymadeui.com/signin-image.webp" className="w-full aspect-[12/12] object-contain" alt="login-image" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
