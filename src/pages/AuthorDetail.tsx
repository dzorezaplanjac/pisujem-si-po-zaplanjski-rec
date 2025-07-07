import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Twitter, Linkedin, Mail, Loader } from 'lucide-react';
import PostCard from '../components/PostCard';
import { useAuthors, usePosts } from '../hooks/useSupabase';

const AuthorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { authors, loading: authorsLoading } = useAuthors();
  const { posts, loading: postsLoading } = usePosts();

  const author = authors.find(a => a.id === id);
  const authorPosts = posts.filter(post => post.author_id === id);

  const transformPost = (post: any) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.cover_image,
    authorId: post.author_id,
    publishedAt: post.published_at,
    readingTime: post.reading_time,
    tags: post.tags,
    featured: post.featured
  });

  const transformAuthor = (author: any) => ({
    id: author.id,
    name: author.name,
    bio: author.bio,
    avatar: author.avatar,
    email: author.email,
    socialLinks: author.social_links
  });

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

  if (!author) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Autor nije pronađen</h1>
          <Link to="/authors" className="text-primary-600 hover:text-primary-700">
            Vrati se na sve autore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Author Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to="/authors"
            className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Nazad na autore
          </Link>

          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-32 h-32 rounded-full object-cover ring-4 ring-primary-100"
            />
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {author.name}
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {author.bio}
              </p>
              
              <div className="flex items-center space-x-4">
                <a
                  href={`mailto:${author.email}`}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Kontakt
                </a>
                
                {author.social_links && (
                  <div className="flex items-center space-x-2">
                    {author.social_links.website && (
                      <a
                        href={author.social_links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                        title="Website"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                    {author.social_links.twitter && (
                      <a
                        href={author.social_links.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                        title="Twitter"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {author.social_links.linkedin && (
                      <a
                        href={author.social_links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                        title="LinkedIn"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Author's Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Članci autora ({authorPosts.length})
          </h2>
          <p className="text-gray-600">
            Svi objavljeni članci od {author.name}
          </p>
        </div>

        {authorPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {authorPosts.map((post) => (
              <PostCard
                key={post.id}
                post={transformPost(post)}
                author={transformAuthor(author)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-sm p-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nema objavljenih članaka
              </h3>
              <p className="text-gray-600">
                Ovaj autor još uvek nije objavio nijedan članak.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorDetail;