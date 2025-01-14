import React from "react";

function Footer() {
  return (
    <section className="pt-16 pb-7 bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section principale avec icônes */}
        <div className="flex flex-col sm:flex-row items-center justify-between pb-14 border-b border-gray-500 gap-8">
          <div className="flex items-center gap-4">
            {/* Icones de réseaux sociaux */}
            <a href="javascript:;"
              className="p-3 rounded-full bg-white text-gray-700 group transition-all duration-500 hover:bg-amber-500 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M13.077 10.7339L13.4445 8.43347H11.1808V6.93821C11.1808 6.30919 11.4968 5.69455 12.5074 5.69455H13.5511V3.73561C12.9433 3.64013 12.3292 3.58847 11.7136 3.58105C9.8505 3.58105 8.63412 4.68453 8.63412 6.67941V8.43347H6.56885V10.7339H8.63412V16.298H11.1808V10.7339H13.077Z" fill="currentColor" />
              </svg>
            </a>
            {/* Autres icônes similaires */}
            {/* ... */}
          </div>
        </div>

        {/* Section des liens */}
        <div className="py-14 flex flex-col lg:flex-row justify-between gap-8 border-b border-gray-500">
          <div className="w-full max-lg:mx-auto flex flex-col sm:flex-row max-lg:items-center max-lg:justify-between gap-6 md:gap-12 lg:gap-24">
            <div className="flex flex-col flex-grow">
              <h6 className="text-lg font-medium text-white mb-7 max-lg:text-center">Pagedone</h6>
              <ul className="flex flex-col max-lg:items-center gap-6">
                <li><a href="javascript:;" className="text-base font-normal max-lg:text-center text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-amber-400 focus-within:outline-0 focus-within:text-amber-400">Home</a></li>
                <li><a href="javascript:;" className="text-base font-normal max-lg:text-center text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-amber-400 focus-within:outline-0 focus-within:text-amber-400">About</a></li>
                <li><a href="javascript:;" className="text-base font-normal max-lg:text-center text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-amber-400 focus-within:outline-0 focus-within:text-amber-400">Pricing</a></li>
                <li><a href="javascript:;" className="text-base font-normal max-lg:text-center text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-amber-400 focus-within:outline-0 focus-within:text-amber-400">Pro Version</a></li>
              </ul>
            </div>
            <div className="flex flex-col flex-grow">
              <h6 className="text-lg font-medium text-white mb-7 max-lg:text-center">Products</h6>
              <ul className="flex flex-col gap-6 max-lg:items-center">
                <li><a href="javascript:;" className="text-base font-normal text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-amber-400 focus-within:outline-0 focus-within:text-amber-400">Figma UI System</a></li>
                <li><a href="javascript:;" className="text-base font-normal text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-amber-400 focus-within:outline-0 focus-within:text-amber-400">Icons Assets</a></li>
                <li><a href="javascript:;" className="text-base font-normal text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-amber-400 focus-within:outline-0 focus-within:text-amber-400">Responsive Blocks</a></li>
                <li><a href="javascript:;" className="text-base font-normal text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-amber-400 focus-within:outline-0 focus-within:text-amber-400">Components Library</a></li>
              </ul>
            </div>
            <div className="flex flex-col flex-grow">
              <h6 className="text-lg font-medium text-white mb-7 max-lg:text-center">Resources</h6>
              {/* Ajouter des liens ici si nécessaire */}
            </div>
          </div>
          <div className="w-full lg:max-w-md max-lg:mx-auto ">
            <h6 className="text-lg font-medium text-white mb-7">Newsletter</h6>
            {/* Formulaire d'inscription à la newsletter */}
          </div>
        </div>

        {/* Footer Bas */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-5 pt-7">
          <span className="text-sm font-normal text-gray-400">
            <a href="https://pagedone.io/" class="">©pagedone 2023, All rights reserved.</a>
          </span>
          <div className="relative text-gray-500 focus-within:text-gray-900">
            <div className="absolute inset-y-0 right-6 flex items-center pl-3 pointer-events-none ">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M16.8192 5.15193L17.3925 4.59395L17.3836 4.58478L17.3743 4.5759L16.8192 5.15193ZM19.25 10.9796L20.0499 10.9904L20.0501 10.9776L20.0499 10.9648L19.25 10.9796ZM16.8481 16.8192L17.4061 17.3925L17.4152 17.3836L17.4241 17.3743L16.8481 16.8192ZM11.0204 19.25L11.0096 20.0499L11.0224 20.0501L11.0352 20.0499L11.0204 19.25ZM5.1808 16.8481L4.60752 17.4061L4.61645 17.4152L4.62566 17.4241L5.1808 16.8481ZM2.75 11.0204L1.95007 11.0096L1.9499 11.0224L1.95014 11.0352L2.75 11.0204ZM5.15193 5.1808L4.59395 4.60752L4.58478 4.61645L4.5759 4.62566L5.15193 5.1808ZM10.9796 2.75L10.9904 1.95007L10.9776 1.9499L10.9648 1.95014L10.9796 2.75ZM6.46726 3.90057L5.90927 3.32729L5.90927 3.32729L6.46726 3.90057ZM9.1444 2.78389L9.15917 3.58376L9.1444 2.78389ZM2.77481 9.18508L1.97488 9.17427L2.77481 9.18508ZM3.87823 6.93034L3.23757 6.13299L3.23757 6.13299L3.87823 6.93034ZM13.131 7.90857L13.0562 7.25232L13.0562 7.25232L13.131 7.90857Z" fill="currentColor" />
              </svg>
            </div>
            <input type="text" placeholder="Search..." className="text-sm border rounded-full w-64 pl-12 py-2 bg-gray-800 text-gray-400 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Footer;
