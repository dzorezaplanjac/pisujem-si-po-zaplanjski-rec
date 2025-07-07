import React, { useState, useEffect } from 'react';
import { X, Save, Eye, Upload, Loader } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface PostEditorProps {
  isOpen: boolean;
  onClose: () => void;
  post?: any;
}

const PostEditor: React.FC<PostEditorProps> = ({ isOpen, onClose, post }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    cover_image: '',
    reading_time: 5,
    tags: '',
    featured: false,
    published: true
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        cover_image: post.cover_image || '',
        reading_time: post.reading_time || 5,
        tags: post.tags ? post.tags.join(', ') : '',
        featured: post.featured || false,
        published: !!post.published_at
      });
    } else {
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        cover_image: '',
        reading_time: 5,
        tags: '',
        featured: false,
        published: true
      });
    }
  }, [post]);

  const generateUniqueSlug = async (title: string, postId?: string) => {
    const baseSlug = title
      .toLowerCase()
      .replace(/[čć]/g, 'c')
      .replace(/[đ]/g, 'd')
      .replace(/[š]/g, 's')
      .replace(/[ž]/g, 'z')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

    let finalSlug = baseSlug;
    let counter = 0;

    // Check for uniqueness
    while (true) {
      const { data, error } = await supabase
        .from('posts')
        .select('id')
        .eq('slug', finalSlug)
        .neq('id', postId || '');

      if (error) throw error;

      if (!data || data.length === 0) {
        break; // Slug is unique
      }

      counter++;
      finalSlug = `${baseSlug}-${counter}`;
    }

    return finalSlug;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const slug = await generateUniqueSlug(formData.title, post?.id);

      const postData = {
        title: formData.title,
        slug,
        excerpt: formData.excerpt,
        content: formData.content,
        cover_image: formData.cover_image,
        author_id: user.id,
        reading_time: formData.reading_time,
        tags,
        featured: formData.featured,
        published_at: formData.published ? new Date().toISOString() : null
      };

      if (post) {
        // Update existing post
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', post.id);

        if (error) throw error;
        alert('Чланак је успешно ажуриран!');
      } else {
        // Create new post
        const { error } = await supabase
          .from('posts')
          .insert([postData]);

        if (error) throw error;
        alert('Чланак је успешно објављен!');
      }

      onClose();
    } catch (error) {
      alert('Грешка при чувању чланка: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {post ? 'Уреди чланак' : 'Нови чланак'}
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? 'Уреди' : 'Преглед'}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {previewMode ? (
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
              <div className="max-w-4xl mx-auto">
                {formData.cover_image && (
                  <img
                    src={formData.cover_image}
                    alt={formData.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}
                <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">
                  {formData.title || 'Наслов чланка'}
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  {formData.excerpt || 'Кратак опис чланка...'}
                </p>
                <div 
                  className="prose prose-lg max-w-none article-content"
                  dangerouslySetInnerHTML={{ __html: formData.content }}
                />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Наслов *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Унесите наслов чланка..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Кратак опис *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Кратак опис који ће се приказати на листи чланака..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover слика URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.cover_image}
                      onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="https://example.com/slika.jpg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Време читања (мин)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.reading_time}
                        onChange={(e) => setFormData(prev => ({ ...prev, reading_time: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Тагови
                      </label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="традиција, култура, историја"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Издвојен чланак</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.published}
                        onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Објави одмах</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Садржај *
                  </label>
                  <textarea
                    required
                    rows={20}
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                    placeholder="Унесите HTML садржај чланка..."
                  />
                </div>
              </div>
            </form>
          )}
        </div>

        {!previewMode && (
          <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Откажи
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Чува...' : (post ? 'Ажурирај' : 'Објави')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostEditor;