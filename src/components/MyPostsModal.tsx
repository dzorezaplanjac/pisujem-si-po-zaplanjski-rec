import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Eye, Calendar, Clock, Loader } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { usePosts } from '../hooks/useSupabase';
import PostEditor from './PostEditor';
import { supabase } from '../lib/supabase';

interface MyPostsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MyPostsModal: React.FC<MyPostsModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { posts, refetch } = usePosts();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const myPosts = posts.filter(post => post.author_id === user?.id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleNewPost = () => {
    setEditingPost(null);
    setIsEditorOpen(true);
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setIsEditorOpen(true);
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Да ли сте сигурни да желите да обришете овај чланак?')) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      
      await refetch();
      alert('Чланак је успешно обрисан!');
    } catch (error) {
      alert('Грешка при брисању чланка: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditorClose = async () => {
    setIsEditorOpen(false);
    setEditingPost(null);
    await refetch();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Моји чланци</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleNewPost}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Нови чланак
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader className="h-6 w-6 animate-spin text-primary-600" />
              </div>
            )}

            {myPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-50 rounded-xl p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Немате објављених чланака
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Започните писање вашег првог чланка
                  </p>
                  <button
                    onClick={handleNewPost}
                    className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Напиши први чланак
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {myPosts.map((post) => (
                  <div key={post.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
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
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(post.created_at)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{post.reading_time} мин</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {post.published_at && (
                          <a
                            href={`/post/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                            title="Погледај чланак"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleEditPost(post)}
                          className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                          title="Уреди чланак"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Обриши чланак"
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <PostEditor
        isOpen={isEditorOpen}
        onClose={handleEditorClose}
        post={editingPost}
      />
    </>
  );
};

export default MyPostsModal;