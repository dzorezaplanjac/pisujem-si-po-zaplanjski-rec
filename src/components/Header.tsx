import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, LogIn, PenTool } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from './AuthModal';
import UserMenu from './UserMenu';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const location = useLocation();
  const { user, loading } = useAuth();

  const navigation = [
    { name: 'Чланци', href: '/posts' },
    { name: 'Аутори', href: '/authors' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <motion.header 
        className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <BookOpen className="h-8 w-8 text-primary-600 group-hover:text-primary-700 transition-colors" />
              </motion.div>
              <span className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
                Заплањске приче
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <motion.div key={item.name} whileHover={{ scale: 1.05 }}>
                  <Link
                    to={item.href}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              
              {!loading && (
                <>
                  {user ? (
                    <div className="flex items-center space-x-4">
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Link
                          to="/write"
                          className="flex items-center px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          <PenTool className="h-4 w-4 mr-1" />
                          Пиши
                        </Link>
                      </motion.div>
                      <UserMenu />
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Link
                          to="/admin"
                          className="flex items-center px-3 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors"
                          title="Админ панел"
                        >
                          Админ
                        </Link>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <motion.button
                        onClick={() => handleOpenAuth('login')}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <LogIn className="h-4 w-4 mr-1" />
                        Пријава
                      </motion.button>
                    </div>
                  )}
                </>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              {!loading && user && (
                <>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Link
                      to="/write"
                      className="p-2 rounded-md text-primary-600 hover:text-primary-700 hover:bg-gray-100 transition-colors"
                      title="Пиши чланак"
                    >
                      <PenTool className="h-5 w-5" />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Link
                      to="/admin"
                      className="px-2 py-1 rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors text-xs font-medium"
                      title="Админ панел"
                    >
                      Админ
                    </Link>
                  </motion.div>
                </>
              )}
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                className="md:hidden py-4 border-t border-gray-200"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <nav className="flex flex-col space-y-2">
                  {navigation.map((item) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`px-3 py-2 text-base font-medium transition-colors ${
                          isActive(item.href)
                            ? 'text-primary-600 bg-primary-50'
                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                        }`}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                  
                  {!loading && !user && (
                    <motion.div 
                      className="pt-2 border-t border-gray-200 space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <button
                        onClick={() => {
                          handleOpenAuth('login');
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                      >
                        Пријава
                      </button>
                    </motion.div>
                  )}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
};

export default Header;