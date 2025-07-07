import React, { useState } from 'react';
import { Plus, X, Save, User, FileText } from 'lucide-react';
import { useAuthors, usePosts } from '../hooks/useSupabase';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { authors, addAuthor } = useAuthors();
  const { addPost } = usePosts();
  const [activeTab, setActiveTab] = useState<'authors' | 'posts'>('authors');
  const [loading, setLoading] = useState(false);

  // Author form state
  const [authorForm, setAuthorForm] = useState({
    name: '',
    bio: '',
    email: '',
    avatar: '',
    socialLinks: {
      twitter: '',
      linkedin: '',
      website: ''
    }
  });

  // Post form state
  const [postForm, setPostForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    authorId: '',
    readingTime: 5,
    tags: '',
    featured: false
  });

  const resetAuthorForm = () => {
    setAuthorForm({
      name: '',
      bio: '',
      email: '',
      avatar: '',
      socialLinks: { twitter: '', linkedin: '', website: '' }
    });
  };

  const resetPostForm = () => {
    setPostForm({
      title: '',
      excerpt: '',
      content: '',
      coverImage: '',
      authorId: '',
      readingTime: 5,
      tags: '',
      featured: false
    });
  };

  const generateUniqueSlug = async (title: string) => {
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
      .replace(/^-+|-+$/g, '');

    const timestamp = Date.now();
    return `${baseSlug}-${timestamp}`;
  };

  const handleAuthorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const socialLinks = Object.fromEntries(
        Object.entries(authorForm.socialLinks).filter(([_, value]) => value.trim() !== '')
      );

      await addAuthor({
        name: authorForm.name,
        bio: authorForm.bio,
        email: authorForm.email,
        avatar: authorForm.avatar,
        social_links: Object.keys(socialLinks).length > 0 ? socialLinks : null
      });

      resetAuthorForm();
      alert('Autor je uspešno dodat!');
    } catch (error) {
      alert('Greška pri dodavanju autora: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tags = postForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const slug = await generateUniqueSlug(postForm.title);

      await addPost({
        title: postForm.title,
        slug,
        excerpt: postForm.excerpt,
        content: postForm.content,
        cover_image: postForm.coverImage,
        author_id: postForm.authorId,
        reading_time: postForm.readingTime,
        tags,
        featured: postForm.featured,
        published_at: new Date().toISOString()
      });

      resetPostForm();
      alert('Članak je uspešno dodat!');
    } catch (error) {
      alert('Greška pri dodavanju članka: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('authors')}
            className={`flex items-center px-6 py-3 font-medium transition-colors ${
              activeTab === 'authors'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <User className="h-5 w-5 mr-2" />
            Dodaj Autora
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center px-6 py-3 font-medium transition-colors ${
              activeTab === 'posts'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="h-5 w-5 mr-2" />
            Dodaj Članak
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {activeTab === 'authors' && (
            <form onSubmit={handleAuthorSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ime i prezime *
                  </label>
                  <input
                    type="text"
                    required
                    value={authorForm.name}
                    onChange={(e) => setAuthorForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={authorForm.email}
                    onChange={(e) => setAuthorForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biografija *
                </label>
                <textarea
                  required
                  rows={3}
                  value={authorForm.bio}
                  onChange={(e) => setAuthorForm(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar URL *
                </label>
                <input
                  type="url"
                  required
                  value={authorForm.avatar}
                  onChange={(e) => setAuthorForm(prev => ({ ...prev, avatar: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={authorForm.socialLinks.twitter}
                    onChange={(e) => setAuthorForm(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={authorForm.socialLinks.linkedin}
                    onChange={(e) => setAuthorForm(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={authorForm.socialLinks.website}
                    onChange={(e) => setAuthorForm(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, website: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={resetAuthorForm}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Resetuj
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Čuva...' : 'Sačuvaj Autora'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'posts' && (
            <form onSubmit={handlePostSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Naslov *
                  </label>
                  <input
                    type="text"
                    required
                    value={postForm.title}
                    onChange={(e) => setPostForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Autor *
                  </label>
                  <select
                    required
                    value={postForm.authorId}
                    onChange={(e) => setPostForm(prev => ({ ...prev, authorId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Izaberi autora</option>
                    {authors.map(author => (
                      <option key={author.id} value={author.id}>
                        {author.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kratak opis *
                </label>
                <textarea
                  required
                  rows={2}
                  value={postForm.excerpt}
                  onChange={(e) => setPostForm(prev => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sadržaj *
                </label>
                <textarea
                  required
                  rows={8}
                  value={postForm.content}
                  onChange={(e) => setPostForm(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Koristite Markdown format za formatiranje teksta..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover slika URL *
                </label>
                <input
                  type="url"
                  required
                  value={postForm.coverImage}
                  onChange={(e) => setPostForm(prev => ({ ...prev, coverImage: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vreme čitanja (min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={postForm.readingTime}
                    onChange={(e) => setPostForm(prev => ({ ...prev, readingTime: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tagovi (odvojeni zarezom)
                  </label>
                  <input
                    type="text"
                    value={postForm.tags}
                    onChange={(e) => setPostForm(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="tradicija, kultura, istorija"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={postForm.featured}
                      onChange={(e) => setPostForm(prev => ({ ...prev, featured: e.target.checked }))}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Izdvojen članak</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={resetPostForm}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Resetuj
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Čuva...' : 'Objavi Članak'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;