import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PostCard from '../components/PostCard';
import SearchComponent from '../components/SearchComponent';
import { useAuthors, usePosts, useCategories } from '../hooks/useSupabase';
import SEOHead from '../components/SEOHead';
import LoadingSpinner from '../components/LoadingSpinner';

const Posts: React.FC = () => {
  const { authors, loading: authorsLoading } = useAuthors();
  const { posts, loading: postsLoading } = usePosts();
  const { categories, loading: categoriesLoading } = useCategories();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts.filter(post => post.status === 'published' && post.published_at);

    // Filter by category
    if (selectedCategory !== 'all') {
      // Note: This would need post_categories relationship data
      // For now, we'll filter by tags that match category names
      const category = categories.find(c => c.id === selectedCategory);
      if (category) {
        filtered = filtered.filter(post => 
          post.tags.some(tag => 
            tag.toLowerCase().includes(category.name.toLowerCase()) ||
            category.name.toLowerCase().includes(tag.toLowerCase())
          )
        );
      }
    }

    // Filter by featured
    if (showFeaturedOnly) {
      filtered = filtered.filter(post => post.featured);
    }

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.published_at || b.created_at).getTime() - 
                 new Date(a.published_at || a.created_at).getTime();
        case 'oldest':
          return new Date(a.published_at || a.created_at).getTime() - 
                 new Date(b.published_at || b.created_at).getTime();
        case 'popular':
          return (b.view_count || 0) - (a.view_count || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [posts, selectedCategory, categories, sortBy, showFeaturedOnly]);

  const getAuthor = (authorId: string) => {
    return authors.find(author => author.id === authorId);
  };

  if (postsLoading || authorsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Сви чланци - Заплањске приче"
        description="Прегледајте све објављене чланке о традицији, култури и историји Заплањског краја. Откријте приче које чувају наше наслеђе."
        url={`${window.location.origin}/posts`}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">
                Сви чланци
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Откријте богату колекцију прича о традицији, култури и историји Заплањског краја
              </p>
            </motion.div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Left side - Search and Filters */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Search Button */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Претражи чланке...
                </button>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Све категорије</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {/* Featured Filter */}
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFeaturedOnly}
                    onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Само издвојени</span>
                </label>
              </div>

              {/* Right side - Sort and View */}
              <div className="flex items-center space-x-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'popular')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="newest">Најновији</option>
                  <option value="oldest">Најстарији</option>
                  <option value="popular">Најпопуларнији</option>
                </select>

                {/* View Mode */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-white text-primary-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Мрежни приказ"
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-white text-primary-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Листа приказ"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-gray-600">
              Приказано {filteredAndSortedPosts.length} од {posts.filter(p => p.status === 'published').length} чланака
            </div>
          </motion.div>

          {/* Posts Grid/List */}
          <AnimatePresence mode="wait">
            {filteredAndSortedPosts.length > 0 ? (
              <motion.div
                key={`${viewMode}-${selectedCategory}-${sortBy}-${showFeaturedOnly}`}
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                    : 'space-y-6'
                }
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {filteredAndSortedPosts.map((post, index) => {
                  const author = getAuthor(post.author_id);
                  if (!author) return null;

                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={viewMode === 'list' ? 'max-w-4xl mx-auto' : ''}
                    >
                      <PostCard
                        post={post}
                        author={author}
                        className={viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white rounded-xl shadow-sm p-12">
                  <Filter className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Нема чланака за приказ
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Покушајте да промените филтере или претражите другачије термине.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setShowFeaturedOnly(false);
                      setSortBy('newest');
                    }}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Ресетуј филтере
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Search Modal */}
      <SearchComponent
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Posts;