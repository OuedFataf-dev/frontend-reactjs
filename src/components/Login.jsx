import React, { useState } from "react";
import {
  Card,
  Input,
  Button,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { CpuChipIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from '@react-oauth/google';  // Importation du package

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
  
     withCredentials : true , 
        withXSRFToken : true
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
    <Card shadow={false} className="md:px-24 md:py-14 py-8 border border-gray-300">
      <CardHeader shadow={false} floated={false} className="text-center">
        <Typography variant="h5" color="blue-gray" className="mb-2">
          login
        </Typography>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:mt-12">
          <div className="flex justify-center">
            <div className="w-1/2">
              <label htmlFor="email">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="block font-medium mb-2"
                >
                  Your Email
                </Typography>
              </label>
              <Input
                id="email"
                color="gray"
                size="lg"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@mail.com"
                className="!w-full placeholder:!opacity-100 focus:!border-t-primary !border-t-blue-gray-200"
                labelProps={{
                  className: "hidden",
                }}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-1/2">
              <label htmlFor="password">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="block font-medium mb-2"
                >
                  Password
                </Typography>
              </label>
              <Input
                id="password"
                color="gray"
                size="lg"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                placeholder="••••••••"
                className="!w-full placeholder:!opacity-100 focus:!border-t-primary !border-t-blue-gray-200"
                labelProps={{
                  className: "hidden",
                }}
              />
            </div>
          </div>
          
          {error && (
            <Typography variant="small" color="red" className="text-center text-sm mt-2">
              {error}
            </Typography>
          )}
          
          <Button
            size="sm"
            color="blue"
            className="!w-1/2 mx-auto"
            type="submit"
            disabled={loading} // Désactive le bouton pendant le chargement
          >
            {loading ? "Chargement..." : "Continue"}
          </Button>
          
          <Button
            variant="outlined"
            size="sm"
            className="flex h-10 border-blue-gray-200 items-center justify-center gap-2 !w-1/2 mx-auto"
          >
            <img
              src={`https://www.material-tailwind.com/logos/logo-google.png`}
              alt="google"
              className="h-5 w-5"
            />
            Sign in with Google
          </Button>
          
          <Typography color="gray" className="mt-4 text-center font-normal">
            Vous avez déjà un compte ?{" "}
            <a href="/sign-up" className="font-medium text-gray-900">
                s'inscrire
            </a>
          </Typography>

          <Typography
            variant="small"
            className="text-center mx-auto max-w-[19rem] !font-medium !text-gray-600"
          >
            Upon signing in, you consent to abide by our{" "}
            <a href="#" className="text-gray-900">
              Terms of Service
            </a>{" "}
            &{" "}
            <a href="#" className="text-gray-900">
              Privacy Policy.
            </a>
          </Typography>
        </form>
      </CardBody>
    </Card>
  );
}

export default Login;
