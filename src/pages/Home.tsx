import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Heart, Target, PenTool, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthModal from '../components/AuthModal';
import SEOHead from '../components/SEOHead';
import AnimatedCounter from '../components/AnimatedCounter';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuthors, usePosts } from '../hooks/useSupabase';

const Home: React.FC = () => {
  const { authors, loading: authorsLoading } = useAuthors();
  const { posts, loading: postsLoading } = usePosts();
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<'login' | 'register'>('register');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  if (postsLoading || authorsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <>
      <SEOHead
        title="Заплањске приче - Блог о традицији и култури Заплањског краја"
        description="Блог посвећен чувању и преношењу традиције, културе и прича Заплањског краја. Место где се сусрећу прошлост и садашњост кроз речи наших писаца. Откријте богато наслеђе Зaplanja кроз аутентичне приче, традиционалне рецепте, историјске чланке и културне садржаје."
        type="website"
        image={`${window.location.origin}/ZAPLANJE_1.jpg`}
        tags={['Заплање', 'традиција', 'култура', 'Србија', 'наслеђе', 'приче', 'блог', 'историја', 'обичаји', 'гастрономија']}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Заплањске приче",
          "alternateName": "Zaplanjske priče",
          "description": "Блог посвећен чувању и преношењу традиције, културе и прича Заплањског краја",
          "url": window.location.origin,
          "image": `${window.location.origin}/ZAPLANJE_1.jpg`,
          "inLanguage": "sr-RS",
          "about": {
            "@type": "Thing",
            "name": "Заплање",
            "description": "Регион у југоисточној Србији познат по богатој традицији и култури"
          },
          "audience": {
            "@type": "Audience",
            "audienceType": "Љубитељи традиције и културе"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${window.location.origin}/posts?search={search_term_string}`,
            "query-input": "required name=search_term_string"
          },
          "mainEntity": {
            "@type": "Blog",
            "name": "Заплањске приче",
            "description": "Блог о традицији и култури Заплањског краја",
            "blogPost": posts.slice(0, 5).map(post => ({
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.excerpt,
              "url": `${window.location.origin}/post/${post.slug}`,
              "datePublished": post.published_at,
              "image": post.cover_image
            }))
          }
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section with Enhanced Animations */}
        <motion.section 
          className="relative bg-gradient-to-br from-red-700 via-red-800 to-red-900 text-white py-20 overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{ 
              backgroundImage: `url('/ZAPLANJE_1.jpg')`,
              backgroundBlendMode: 'overlay'
            }}
          />
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(226, 109, 45, 0.8)' }}>
            <motion.div
              className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-20 right-20 w-24 h-24 bg-white/5 rounded-full"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.6, 0.3, 0.6]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Content */}
            <motion.div className="text-center mb-16" variants={itemVariants}>
              <motion.h1 
                className="text-4xl md:text-6xl font-bold font-serif mb-6 text-shadow-lg"
                variants={itemVariants}
              >
                Заплањске приче
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl text-red-100 leading-relaxed font-medium mb-12 max-w-4xl mx-auto"
                variants={itemVariants}
              >
                Чувамо традицију, делимо приче и негујемо културу Заплањског краја кроз речи наших писаца
              </motion.p>
            </motion.div>

            {/* Author CTA Content */}
            <motion.div className="text-center mb-12" variants={itemVariants}>
              <motion.h2 
                className="text-3xl md:text-4xl font-bold font-serif mb-4"
                variants={itemVariants}
              >
                Желите да постанете аутор?
              </motion.h2>
              <motion.p 
                className="text-xl text-red-100 max-w-3xl mx-auto leading-relaxed"
                variants={itemVariants}
              >
                Придружите се нашој заједници писаца и поделите ваше приче о Заплању. 
                Свако има причу коју вреди испричати.
              </motion.p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
              variants={containerVariants}
            >
              {[
                {
                  icon: PenTool,
                  title: "Пишите слободно",
                  description: "Делите ваше знање, искуства и приче о традицији и култури Заплања"
                },
                {
                  icon: Users,
                  title: "Придружите се заједници",
                  description: "Постаните део заједнице аутора који чувају и преносе наше наслеђе"
                },
                {
                  icon: BookOpen,
                  title: "Објављујте лако",
                  description: "Користите наш једноставан систем за објављивање и управљање чланака"
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="text-center"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div 
                    className="bg-white/10 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <item.icon className="h-8 w-8 text-red-200" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-red-200">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div className="text-center" variants={itemVariants}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={() => handleOpenAuth('register')}
                  className="inline-flex items-center px-8 py-3 bg-white text-red-700 font-semibold rounded-lg hover:bg-red-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Региструјте се као аутор
                </motion.button>
                <motion.button
                  onClick={() => handleOpenAuth('login')}
                  className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-red-700 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Већ имате налог? Пријавите се
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Combined About and Stats Section */}
        <motion.section 
          className="py-16 bg-white/50 backdrop-blur-sm"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="text-center mb-12" variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
                О нама
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Чувамо традицију, делимо приче и негујемо културу Заплањског краја
              </p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl shadow-sm p-8 md:p-12 mb-12"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 font-serif">
                Наша мисија
              </h3>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  "Заплањске приче" је блог посвећен чувању и преношењу богате традиције, 
                  културе и историје Заплањског краја. Кроз речи наших талентованих аутора, 
                  трудимо се да сачувамо од заборава приче, обичаје и мудрост наших предака.
                </p>
                <p>
                  Овај крај, смештен у срцу Балкана, одувек је био раскрсница култура и цивилизација. 
                  Његове планине, реке и села чувају у себи небројене приче које заслужују да буду 
                  испричане и пренете будућим генерацијама.
                </p>
                <p>
                  Наш блог је место где се сусрећу прошлост и садашњост, где традиција живи кроз 
                  савремене речи, а где сваки чланак представља мост између онога што јесмо и 
                  онога одакле долазимо.
                </p>
              </div>
            </motion.div>

            {/* Statistics Cards - Mobile: 2 columns, Desktop: 3 columns */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12"
              variants={containerVariants}
            >
              {[
                {
                  icon: BookOpen,
                  count: posts.length,
                  label: "Објављених чланака"
                },
                {
                  icon: Users,
                  count: authors.length,
                  label: "Активних аутора"
                },
                {
                  icon: Heart,
                  count: "∞",
                  label: "Љубави према традицији"
                }
              ].map((stat, index) => (
                <motion.div 
                  key={index} 
                  variants={itemVariants}
                  className={index === 2 ? "col-span-2 md:col-span-1 mx-auto max-w-xs md:max-w-none" : ""}
                >
                  <motion.div 
                    className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-sm border border-white/50 text-center"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <stat.icon className="h-10 w-10 md:h-12 md:w-12 text-primary-600 mx-auto mb-3 md:mb-4" />
                    </motion.div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {typeof stat.count === 'number' ? (
                        <AnimatedCounter end={stat.count} />
                      ) : (
                        stat.count
                      )}
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">{stat.label}</p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            {/* Values Cards */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={containerVariants}
            >
              {[
                {
                  icon: BookOpen,
                  title: "Чување традиције",
                  description: "Документујемо и чувамо обичаје, приче и мудрост наших предака за будуће генерације."
                },
                {
                  icon: Heart,
                  title: "Љубав према култури",
                  description: "Негујемо дубоку љубав према култури и идентитету Заплањског краја."
                },
                {
                  icon: Users,
                  title: "Заједништво",
                  description: "Окупљамо ауторе и читаоце око заједничке љубави према нашој баштини."
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl shadow-sm p-6 text-center group cursor-pointer"
                  variants={itemVariants}
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <value.icon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                  </motion.div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h4>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
};

export default Home;