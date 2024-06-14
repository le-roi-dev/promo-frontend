import React from 'react';
import googleLogo from './assets/google.png'; // Replace with the path to your Google logo

const LoginPage = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">APLICATIVO DE SOLICITUD DE PROMOCIONES</h1>
        <button
          onClick={onLoginClick}
          className="cursor-pointer group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <span className="absolute left-0 inset-y-0 flex items-center pl-3">
            <img src={googleLogo} alt="Google logo" className="h-5 w-5" />
          </span>
          Iniciar Sesion
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
