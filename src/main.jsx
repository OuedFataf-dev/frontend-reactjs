import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider } from "@material-tailwind/react";
import { BrowserRouter } from 'react-router-dom';
//import { Provider } from 'react-redux'; // Importez Provider
//import store from './store'; 
//import store from './components/store.jsx';
// Assurez-vous que le chemin est correct
import './index.css';

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <StrictMode>
    
        <BrowserRouter>
          <App />
        </BrowserRouter>
     
    </StrictMode>
  </ThemeProvider>
);
