import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SidebarWithSearch from "./SidebarWithSearch";
import { faBars ,faBell ,faHome, faFileAlt, faComments, faNewspaper, faVideo} from '@fortawesome/free-solid-svg-icons';
import {
   
  
    MobileNav,

  Button,
  IconButton,
  Typography,
 
  
  

} from "@material-tailwind/react"; // Ensure these components are imported

 function Navbar() {
    const [openNav, setOpenNav] = useState(false);
    const[SidebarOpen,setOpenbar]=useState(false);

    const navList = (
        <>
          
          <div className="flex justify-between mb-5 lg:mb-0 lg:mt-0 lg:flex-row lg:gap-6">
              <div>  </div>
         
              <div className="text-lg font-bold">Application</div>
    
            <IconButton variant="text" className="text-inherit">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="9" cy="9" r="6" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l4 4" />
              </svg>
            </IconButton>
      
            {/* Icône "+" */}
            <IconButton variant="text" className="text-inherit">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>

                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </IconButton>
            <IconButton variant="text" className="text-inherit"  onClick={
                 ( ()=> setOpenNav(!SidebarOpen))
            }>
            <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
</IconButton>

          </div>
      
          <ul className="mt-2 flex flex-col gap-2 lg:mb-0 lg:flex-row lg:items-center lg:gap-6">
          <IconButton variant="text" size="sm" className="hidden lg:inline-block">
             <FontAwesomeIcon icon={faHome} className="h-6 w-6" />
           </IconButton>
            {/* Ajoutez d'autres éléments de liste ici */}
            <IconButton variant="text" size="sm" className="hidden lg:inline-block">
             <FontAwesomeIcon icon={faNewspaper} className="h-6 w-6" />
           </IconButton>

            <IconButton variant="text" size="sm" className="hidden lg:inline-block">
             <FontAwesomeIcon icon={faComments} className="h-6 w-6" />
           </IconButton>

    <IconButton variant="text" size="sm" className="hidden lg:inline-block">
             <FontAwesomeIcon icon={faVideo} className="h-6 w-6" />
           </IconButton>

    <IconButton variant="text" size="sm" className="hidden lg:inline-block">
             <FontAwesomeIcon icon={faBell} className="h-6 w-6" />
           </IconButton>

           <IconButton variant="text" size="sm" className="hidden lg:inline-block">
             <FontAwesomeIcon icon={faFileAlt} className="h-6 w-6" />
           </IconButton>
          </ul>
         
        </>
       
      );

    return (
        <>  
         <div className="bg-white-600 text-white py-4 px-6">
          
         
        <nav className="mx-auto max-w-screen-xl px-4 py-2 lg:px-8 lg:py-4">
            <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
                <div>
                    {/* Texte "Application Réseau Social" */}
                    <span className="text-xl font-bold"></span>
                </div>

                <div className="hidden lg:block">{navList}</div>

                <div className="relative flex items-center gap-x-1">
                    {/* Icône de notification avec badge */}
            <IconButton variant="text" size="sm" className="hidden lg:inline-block">
             <FontAwesomeIcon icon={faBell} className="h-6 w-6" />
           </IconButton>
          <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
             4
           </span>
                  </div>


                <IconButton
                    variant="text"
                    className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
                    ripple={false}
                    onClick={() => setOpenNav(!openNav)}
                >
                    {openNav ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </IconButton>
            </div>

            <MobileNav open={openNav}>
                <div className="container mx-auto">
                    
                    <SidebarWithSearch></SidebarWithSearch>
                </div>
            </MobileNav>
                {/* Affichage de la barre latérale */}
    
                
        </nav>

       
        </div>
       
        </>
        
    );
}


export default Navbar;

