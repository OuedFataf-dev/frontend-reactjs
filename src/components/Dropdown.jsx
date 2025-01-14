
import React, { useState} from 'react';

const Dropdown = ({ post, onDelete, onSave, token }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the dropdown
  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  // Close the dropdown when clicking outside of it
  const closeDropdown = (e) => {
    if (!e.target.closest(`#dropdownButton-${post.id}`) && !e.target.closest(`#dropdown-${post.id}`)) {
      setIsOpen(false);
    }
  };

  // Ajouter un écouteur pour fermer le dropdown si l'utilisateur clique en dehors
  React.useEffect(() => {
    document.addEventListener('click', closeDropdown);
    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, []);

  // Assurez-vous que vous passez le `token` et `postData` (le post) à `handleSave`
  const handleSaveClick = () => {
    const postData = { postId: post.id };  // Vous pouvez adapter ça selon les données que vous souhaitez envoyer
    onSave(post.id, postData, token);
  };

  return (
    <div className="relative">
      <button
        id={`dropdownButton-${post.id}`}
        onClick={toggleDropdown}
        className="bg-transparent text-sm p-1.5"
      >
        <span className="sr-only">Options</span>
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
          <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
        </svg>
      </button>

      {isOpen && (
        <div id={`dropdown-${post.id}`} className="z-10 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
          <ul className="py-2">
            <li>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Modifier</a>
            </li>
            <li>
              <a 
                onClick={handleSaveClick} 
                href="#" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Enregistrer
              </a>
            </li>
            <li>
              <a 
                onClick={() => onDelete(post.id)} 
                href="#" 
                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Supprimer
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
