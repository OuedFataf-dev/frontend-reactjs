import React from 'react';

function Settings (){
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-600 text-white py-4 px-6">
        <h1 className="text-2xl font-bold">Paramètres</h1>
      </div>

      {/* Contenu */}
      <div className="p-4 space-y-4">
        {/* Section Profil */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Profil</h2>
          <ul>
            <li>
              <a href="#" className="text-green-600 hover:text-green-800">
                Modifier le profil
              </a>
            </li>
            <li>
              <a href="#" className="text-green-600 hover:text-green-800">
                Photo de profil
              </a>
            </li>
          </ul>
        </div>

        {/* Section Notifications */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Notifications</h2>
          <ul>
            <li>
              <a href="#" className="text-green-600 hover:text-green-800">
                Paramètres des notifications
              </a>
            </li>
            <li>
              <a href="#" className="text-green-600 hover:text-green-800">
                Notifications de groupe
              </a>
            </li>
          </ul>
        </div>

        {/* Section Confidentialité */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Confidentialité</h2>
          <ul>
            <li>
              <a href="#" className="text-green-600 hover:text-green-800">
                Confidentialité du statut
              </a>
            </li>
            <li>
              <a href="#" className="text-green-600 hover:text-green-800">
                Paramètres de sécurité
              </a>
            </li>
          </ul>
        </div>

        {/* Section Aide */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Aide</h2>
          <ul>
            <li>
              <a href="#" className="text-green-600 hover:text-green-800">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="text-green-600 hover:text-green-800">
                Contactez-nous
              </a>
            </li>
          </ul>
        </div>

        {/* Section Déconnexion */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Déconnexion</h2>
          <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
