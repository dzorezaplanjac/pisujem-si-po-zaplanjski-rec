import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Save, Eye, ArrowLeft, AlertCircle, LogIn, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { usePosts } from '../hooks/useSupabase';
import { supabase } from '../lib/supabase';
import AuthModal from '../components/AuthModal';
import RichTextEditor from '../components/RichTextEditor';
import SEOHead from '../components/SEOHead';
import LoadingSpinner from '../components/LoadingSpinner';

const Write: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { posts, refetch } = usePosts();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [slugGenerated, setSlugGenerated] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    reading_time: 5,
    tags: '',
    featured: false,
    published: true
  });

  // Load post for editing
  useEffect(() => {
    if (editId && user) {
      const post = posts.find(p => p.id === editId);
      if (post) {
        // Check if user owns this post
        if (post.author_id !== user?.id) {
          setError('Nemate dozvolu da uredite ovaj članak');
          return;
        }
        
        setFormData({
          title: post.title || '',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          content: post.content || '',
          cover_image: post.cover_image || '',
          reading_time: post.reading_time || 5,
          tags: post.tags ? post.tags.join(', ') : '',
          featured: post.featured || false,
          published: !!post.published_at
        });
      } else {
        setError('Članak nije pronađen');
      }
    }
  }, [editId, posts, user]);

  const generateSlugFromTitle = (title: string) => {
    if (!title || title.trim() === '') {
      return '';
    }

    return title
      .toLowerCase()
      .trim()
      // Zamena srpskih karaktera
      .replace(/č/g, 'c')
      .replace(/ć/g, 'c')
      .replace(/đ/g, 'd')
      .replace(/š/g, 's')
      .replace(/ž/g, 'z')
      // Uklanjanje specijalnih karaktera
      .replace(/[^a-z0-9\s-]/g, '')
      // Zamena razmaka sa crticama
      .replace(/\s+/g, '-')
      // Uklanjanje višestrukih crtica
      .replace(/-+/g, '-')
      // Uklanjanje crtica sa početka i kraja
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({ ...prev, title }));
    
    // Auto-generate slug only if it hasn't been manually set
    if (!slugGenerated && !editId) {
      const newSlug = generateSlugFromTitle(title);
      setFormData(prev => ({ ...prev, slug: newSlug }));
    }
  };

  const handleSlugChange = (slug: string) => {
    setSlugGenerated(true);
    setFormData(prev => ({ ...prev, slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '') }));
  };

  const generateNewSlug = () => {
    const newSlug = generateSlugFromTitle(formData.title);
    setFormData(prev => ({ ...prev, slug: newSlug }));
    setSlugGenerated(true);
  };

  const checkSlugUniqueness = async (slug: string) => {
    if (!slug.trim()) return false;

    try {
      let query = supabase
        .from('posts')
        .select('id')
        .eq('slug', slug);

      // Ako ažuriramo postojeći post, isključi ga iz provere
      if (editId && editId.trim() !== '') {
        query = query.neq('id', editId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error checking slug uniqueness:', error);
        return false;
      }

      return !data || data.length === 0;
    } catch (error) {
      console.error('Error checking slug uniqueness:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validacija
    if (!formData.title.trim()) {
      setError('Naslov je obavezan');
      return;
    }

    if (!formData.slug.trim()) {
      setError('Slug je obavezan');
      return;
    }

    if (!formData.excerpt.trim()) {
      setError('Kratak opis je obavezan');
      return;
    }

    if (!formData.content.trim()) {
      setError('Sadržaj je obavezan');
      return;
    }

    if (!formData.cover_image.trim()) {
      setError('Cover slika je obavezna');
      return;
    }

    // Proveri jedinstvenost slug-a
    const isSlugUnique = await checkSlugUniqueness(formData.slug);
    if (!isSlugUnique) {
      setError('Slug već postoji. Molimo izaberite drugi.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

      const postData = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        cover_image: formData.cover_image.trim(),
        author_id: user.id,
        reading_time: formData.reading_time,
        tags,
        featured: formData.featured,
        published_at: formData.published ? new Date().toISOString() : null
      };

      if (editId && editId.trim() !== '') {
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', editId);

        if (error) throw error;
        
        await refetch();
        navigate(`/post/${formData.slug}`);
      } else {
        const { data, error } = await supabase
          .from('posts')
          .insert([postData])
          .select()
          .single();

        if (error) throw error;
        
        await refetch();
        navigate(`/post/${formData.slug}`);
      }
    } catch (error) {
      setError('Greška pri čuvanju članka: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <SEOHead
          title="Prijava potrebna - Pisanje članka"
          description="Prijavite se da biste mogli da pišete članke na Zaplanjske priče blogu."
        />
        <motion.div 
          className="min-h-screen bg-gray-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full mx-4 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <LogIn className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Potrebna je prijava
            </h2>
            <p className="text-gray-600 mb-6">
              Da biste pisali članke, potrebno je da se prijavite kao autor.
            </p>
            <div className="space-y-3">
              <motion.button
                onClick={() => handleOpenAuth('login')}
                className="w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Prijavite se
              </motion.button>
              <motion.button
                onClick={() => handleOpenAuth('register')}
                className="w-full px-6 py-3 border border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Registrujte se kao autor
              </motion.button>
              <Link
                to="/"
                className="block w-full px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Nazad na početnu
              </Link>
            </div>
          </motion.div>
        </motion.div>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          mode={authMode}
          onModeChange={setAuthMode}
        />
      </>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full mx-4">
          <div className="flex items-center space-x-3 text-red-600 mb-4">
            <AlertCircle className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Greška</h2>
          </div>
          <p className="text-gray-700 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => setError(null)}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Pokušaj ponovo
            </button>
            <button
              onClick={() => navigate('/posts')}
              className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Nazad na članke
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={editId ? 'Uredi članak' : 'Napiši novi članak'}
        description="Koristite naš napredni editor za pisanje i objavljivanje članaka o tradiciji i kulturi Zaplanjskog kraja."
      />

      <motion.div 
        className="min-h-screen bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Enhanced Header */}
        <motion.div 
          className="bg-white shadow-sm border-b border-gray-200"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link
                  to="/posts"
                  className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Nazad
                </Link>
                <h1 className="text-xl font-semibold text-gray-900">
                  {editId ? 'Uredi članak' : 'Napiši novi članak'}
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {previewMode ? 'Uredi' : 'Pregled'}
                </motion.button>
                
                <motion.button
                  onClick={handleSubmit}
                  disabled={loading || !formData.title.trim() || !formData.slug.trim()}
                  className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                >
                  {loading ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {loading ? 'Čuva...' : (editId ? 'Ažuriraj' : 'Objavi')}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {previewMode ? (
            <motion.div 
              className="bg-white rounded-xl shadow-sm p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="max-w-4xl mx-auto">
                {formData.cover_image && (
                  <img
                    src={formData.cover_image}
                    alt={formData.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}
                <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">
                  {formData.title || 'Naslov članka'}
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  {formData.excerpt || 'Kratak opis članka...'}
                </p>
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: formData.content }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.form 
              onSubmit={handleSubmit} 
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                <motion.div 
                  className="bg-white rounded-xl shadow-sm p-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Osnovne informacije</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Naslov *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="Unesite naslov članka..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slug (URL adresa) *
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          required
                          value={formData.slug}
                          onChange={(e) => handleSlugChange(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-mono text-sm"
                          placeholder="moj-clanak-slug"
                        />
                        <button
                          type="button"
                          onClick={generateNewSlug}
                          className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                          title="Generiši slug iz naslova"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        <p className="mb-1">Slug će biti deo URL-a: <span className="font-mono bg-gray-100 px-1 rounded">zaplanjskeprice.rs/post/{formData.slug || 'vas-slug'}</span></p>
                        <p className="font-medium mb-1">Primeri dobrih slug-ova:</p>
                        <ul className="list-disc list-inside space-y-0.5 ml-2">
                          <li><span className="font-mono bg-gray-100 px-1 rounded">tradicija-zaplanskog-kraja</span></li>
                          <li><span className="font-mono bg-gray-100 px-1 rounded">stare-pesme-i-obicaji</span></li>
                          <li><span className="font-mono bg-gray-100 px-1 rounded">gastronomija-nasih-predaka</span></li>
                          <li><span className="font-mono bg-gray-100 px-1 rounded">istorija-sela-leskovac</span></li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kratak opis *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={formData.excerpt}
                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="Kratak opis koji će se prikazati na listi članaka..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cover slika URL *
                      </label>
                      <input
                        type="url"
                        required
                        value={formData.cover_image}
                        onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="https://example.com/slika.jpg"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vreme čitanja (min)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formData.reading_time}
                          onChange={(e) => setFormData(prev => ({ ...prev, reading_time: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tagovi
                        </label>
                        <input
                          type="text"
                          value={formData.tags}
                          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          placeholder="tradicija, kultura, istorija"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 transition-all"
                        />
                        <span className="text-sm font-medium text-gray-700">Izdvojen članak</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.published}
                          onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 transition-all"
                        />
                        <span className="text-sm font-medium text-gray-700">Objavi odmah</span>
                      </label>
                    </div>
                  </div>
                </motion.div>

                {/* Slug Help */}
                <motion.div 
                  className="bg-blue-50 rounded-xl p-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h3 className="text-sm font-semibold text-blue-900 mb-3">Saveti za slug</h3>
                  <div className="text-sm text-blue-800 space-y-1">
                    <div>• Koristite samo mala slova, brojevi i crtice</div>
                    <div>• Izbegavajte specijalne karaktere i razmake</div>
                    <div>• Kratko i opisno (3-6 reči)</div>
                    <div>• Slug mora biti jedinstven</div>
                  </div>
                </motion.div>

                {/* Rich Text Editor Help */}
                <motion.div 
                  className="bg-green-50 rounded-xl p-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <h3 className="text-sm font-semibold text-green-900 mb-3">Saveti za pisanje</h3>
                  <div className="text-sm text-green-800 space-y-1">
                    <div>• Koristite toolbar za formatiranje teksta</div>
                    <div>• Dodajte naslove za bolje strukturiranje</div>
                    <div>• Koristite liste za jasnije izlaganje</div>
                    <div>• Dodajte linkove za dodatne informacije</div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Rich Text Editor */}
              <motion.div 
                className="bg-white rounded-xl shadow-sm p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Sadržaj članka</h2>
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  placeholder="Započnite pisanje vašeg članka..."
                  className="min-h-[500px]"
                />
              </motion.div>
            </motion.form>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Write;