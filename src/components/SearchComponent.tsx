import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSearch, useAuthors } from '../hooks/useSupabase';

interface SearchComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { results, loading, search } = useSearch();
  const { authors } = useAuthors();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        search(query);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, search]);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    
    setQuery(searchQuery);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const getAuthor = (authorId: string) => {
    return authors.find(author => author.id === authorId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      day: 'numeric',
      month: 'short'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center p-4 border-b border-gray-200">
          <Search className="h-5 w-5 text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                handleSearch(query);
              }
            }}
            placeholder="Претражите чланке..."
            className="flex-1 text-lg outline-none"
          />
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-6 w-6 animate-spin text-primary-600" />
            </div>
          )}

          {!query && !loading && (
            <div className="p-4">
              {recentSearches.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Недавне претраге
                    </h3>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Обриши све
                    </button>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Популарне претраге
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['традиција', 'култура', 'историја', 'гастрономија', 'обичаји'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleSearch(tag)}
                      className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full hover:bg-primary-200 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {query && !loading && results.length === 0 && (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Нема резултата
              </h3>
              <p className="text-gray-600">
                Покушајте са другим појмовима претраге
              </p>
            </div>
          )}

          {results.length > 0 && (
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Резултати претраге ({results.length})
              </h3>
              <div className="space-y-4">
                {results.map((post) => {
                  const author = getAuthor(post.author_id);
                  return (
                    <Link
                      key={post.id}
                      to={`/post/${post.slug}`}
                      onClick={onClose}
                      className="block p-4 hover:bg-gray-50 rounded-lg transition-colors group"
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                            {post.title}
                          </h4>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{author?.name}</span>
                            <span>{formatDate(post.published_at)}</span>
                            <span>{post.reading_time} мин</span>
                            {post.view_count > 0 && (
                              <span>{post.view_count} прегледа</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;