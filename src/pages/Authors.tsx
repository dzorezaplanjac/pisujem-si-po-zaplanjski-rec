import React, { useState } from 'react';
import { Loader, UserPlus } from 'lucide-react';
import AuthorCard from '../components/AuthorCard';
import AuthModal from '../components/AuthModal';
import { useAuthors, usePosts } from '../hooks/useSupabase';

const Authors: React.FC = () => {
  const { authors, loading: authorsLoading } = useAuthors();
  const { posts, loading: postsLoading } = usePosts();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');

  const getPostCount = (authorId: string) => {
    return posts.filter(post => post.author_id === authorId).length;
  };

  const transformAuthor = (author: any) => ({
    id: author.id,
    name: author.name,
    bio: author.bio,
    avatar: author.avatar,
    email: author.email,
    socialLinks: author.social_links
  });

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  if (authorsLoading || postsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Učitava se sadržaj...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Naši autori
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Upoznajte talentovane pisce koji čuvaju i prenose bogatu tradiciju Zaplanjskog kraja
            </p>
            
            {/* Call to Action for becoming an author */}
            <div className="bg-primary-50 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-primary-900 mb-2">
                Želite da se pridružite našim autorima?
              </h3>
              <p className="text-primary-700 mb-4">
                Podelite vaše priče i znanje o tradiciji Zaplanjskog kraja
              </p>
              <button
                onClick={() => handleOpenAuth('register')}
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Postanite autor
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {authors.map((author) => (
              <AuthorCard
                key={author.id}
                author={transformAuthor(author)}
                postCount={getPostCount(author.id)}
              />
            ))}
          </div>
        </div>
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

export default Authors;