import React, { useState } from "react";
import axios from "axios";
import { Card, Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

function SimpleRegistrationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreeTerms) {
      alert("Vous devez accepter les termes et conditions.");
      return;
    }

    // Afficher les valeurs saisies
    console.log("Saisie utilisateur :", { name, email, password });

    try {
      const response = await axios.post("http://localhost:8000/api/register", {
        name,
        email,
        password,
      });

      // Enregistrez le nom de l'utilisateur dans le localStorage
      localStorage.setItem("userName", name);

      // Gérer l'inscription réussie
      console.log("Réponse d'inscription :", response.data);
      navigate("/Login"); // Rediriger vers la page de connexion après une inscription réussie
    } catch (error) {
      console.error("Erreur d'inscription :", error);
      alert("L'inscription a échoué. Veuillez réessayer.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card color="transparent" shadow={false} className="w-96">
        <Typography variant="h4" color="blue-gray">
          S'inscrire
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Enchanté de vous rencontrer ! Entrez vos détails pour vous inscrire.
        </Typography>
        <form className="flex flex-col gap-4 md:mt-12" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <Typography variant="h6" color="blue-gray" className="mb-1">
              Nom
            </Typography>
            <Input
              size="lg"
              placeholder="Votre Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900 mb-4"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="h6" color="blue-gray" className="mb-1 mt-4">
              Votre Email
            </Typography>
            <Input type="email"
              size="lg"
              placeholder="name@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900 mb-4"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="h6" color="blue-gray" className="mb-1 mt-4">
              Mot de passe
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900 mb-4"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center font-normal"
              >
                J'accepte les
                <a
                  href="#"
                  className="font-medium transition-colors hover:text-gray-900"
                >
                  &nbsp;termes et conditions
                </a>
              </Typography>
            }
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            containerProps={{ className: "-ml-2.5" }}
          />
          <Button className="mt-6" fullWidth type="submit">
            S'inscrire
          </Button>
          <Typography color="gray" className="mt-4 text-center font-normal">
            Vous avez déjà un compte ?{" "}
            <a href="/login" className="font-medium text-gray-900">
              Se connecter
            </a>
          </Typography>
        </form>
      </Card>
    </div>
  );
}

export default SimpleRegistrationForm;
