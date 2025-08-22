import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">
                  Sistema de Tickets
                </h1>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Gestión de soporte técnico
            </div>
          </div>
        </div>
      </header>

      {/* Banner de modo demo - solo se muestra en GitHub Pages */}
      {window.location.hostname.includes('github.io') && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">
                  <strong>🎭 Modo Demo:</strong> Esta es una demostración funcional del sistema. 
                  Los datos son simulados para fines de presentación.
                  <a 
                    href="https://github.com/johnja1989/sistema-tickets-soporte" 
                    className="underline ml-2 hover:text-blue-800" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    📁 Ver código fuente
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;