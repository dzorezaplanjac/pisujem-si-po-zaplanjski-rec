import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Shield, Users, FileText, AlertTriangle, Loader, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAuthors, usePosts } from '../hooks/useSupabase';
import { supabase } from '../lib/supabase';
import AuthModal from '../components/AuthModal';

const AdminPanel: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { authors, refetch: refetchAuthors } = useAuthors();
  const { posts, refetch: refetchPosts } = usePosts();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'authors'>('posts');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleDeletePost = async (postId: string, title: string) => {
    if (!confirm(`Да ли сте сигурни да желите да обришете чланак "${title}"?`)) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      
      await refetchPosts();
      alert('Чланак је успешно обрисан!');
    } catch (error) {
      alert('Грешка при брисању чланка: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAuthor = async (authorId: string, name: string) => {
    if (!confirm(`Да ли сте сигурни да желите да обришете аутора "${name}"? Ово ће обрисати и све њихове чланке!`)) {
      return;
    }

    setLoading(true);
    try {
      // First delete all posts by this author
      const { error: postsError } = await supabase
        .from('posts')
        .delete()
        .eq('author_id', authorId);

      if (postsError) throw postsError;

      // Then delete the author
      const { error: authorError } = await supabase
        .from('authors')
        .delete()
        .eq('id', authorId);

      if (authorError) throw authorError;
      
      await refetchAuthors();
      await refetchPosts();
      alert('Аутор и сви његови чланци су успешно обрисани!');
    } catch (error) {
      alert('Грешка при брисању аутора: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAuthorPostCount = (authorId: string) => {
    return posts.filter(post => post.author_id === authorId).length;
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Проверава се аутентификација...</p>
        </div>
      </div>
    );
  }

  // Show authentication required message if not logged in
  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full mx-4 text-center">
            <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Потребна је пријава
            </h2>
            <p className="text-gray-600 mb-6">
              Да бисте приступили админ панелу, потребно је да се пријавите као аутор.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleOpenAuth('login')}
                className="w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                Пријавите се
              </button>
              <button
                onClick={() => handleOpenAuth('register')}
                className="w-full px-6 py-3 border border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
              >
                Региструјте се као аутор
              </button>
              <Link
                to="/"
                className="block w-full px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Назад на почетну
              </Link>
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
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Назад
              </button>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-primary-600" />
                <h1 className="text-xl font-semibold text-gray-900">Админ панел</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Упозорење</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Ове акције су неповратне. Молимо будите опрезни при брисању садржаја.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('posts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'posts'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Управљање чланцима ({posts.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('authors')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'authors'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Управљање ауторима ({authors.length})</span>
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader className="h-6 w-6 animate-spin text-primary-600" />
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Сви чланци
                </h2>
                {posts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Нема објављених чланака.</p>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => {
                      const author = authors.find(a => a.id === post.author_id);
                      return (
                        <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                {post.featured && (
                                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                    Истакнуто
                                  </span>
                                )}
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  post.published_at ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {post.published_at ? 'Објављено' : 'Нацрт'}
                                </span>
                              </div>
                              
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {post.title}
                              </h3>
                              
                              <p className="text-gray-600 mb-3 line-clamp-2">
                                {post.excerpt}
                              </p>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>Аутор: {author?.name || 'Непознат'}</span>
                                <span>Објављено: {formatDate(post.created_at)}</span>
                                <span>Читање: {post.reading_time} мин</span>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleDeletePost(post.id, post.title)}
                              disabled={loading}
                              className="ml-4 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Обриши чланак"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'authors' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Сви аутори
                </h2>
                {authors.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Нема регистрованих аутора.</p>
                ) : (
                  <div className="space-y-4">
                    {authors.map((author) => {
                      const postCount = getAuthorPostCount(author.id);
                      return (
                        <div key={author.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                              <img
                                src={author.avatar}
                                alt={author.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                  {author.name}
                                </h3>
                                <p className="text-gray-600 mb-2 line-clamp-2">
                                  {author.bio}
                                </p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span>Email: {author.email}</span>
                                  <span>Чланци: {postCount}</span>
                                  <span>Регистрован: {formatDate(author.created_at)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleDeleteAuthor(author.id, author.name)}
                              disabled={loading}
                              className="ml-4 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Обриши аутора"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;