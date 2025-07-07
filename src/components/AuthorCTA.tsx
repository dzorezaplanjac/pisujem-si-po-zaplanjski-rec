import React, { useState } from 'react';
import { PenTool, Users, BookOpen, UserPlus } from 'lucide-react';
import AuthModal from './AuthModal';

const AuthorCTA: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <section className="py-16 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">
              Желите да постанете аутор?
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Придружите се нашој заједници писаца и поделите ваше приче о Заплању. 
              Свако има причу коју вреди испричати.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <PenTool className="h-8 w-8 text-primary-200" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Пишите слободно</h3>
              <p className="text-primary-200">
                Делите ваше знање, искуства и приче о традицији и култури Заплања
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-200" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Придружите се заједници</h3>
              <p className="text-primary-200">
                Постаните део заједнице аутора који чувају и преносе наше наслеђе
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary-200" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Објављујте лако</h3>
              <p className="text-primary-200">
                Користите наш једноставан систем за објављивање и управљање чланака
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleOpenAuth('register')}
                className="inline-flex items-center px-8 py-3 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Региструјте се као аутор
              </button>
              <button
                onClick={() => handleOpenAuth('login')}
                className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-700 transition-all duration-300"
              >
                Већ имате налог? Пријавите се
              </button>
            </div>
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
};

export default AuthorCTA;