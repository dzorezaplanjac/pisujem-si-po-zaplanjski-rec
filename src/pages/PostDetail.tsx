import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Eye, User, Share2, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthors, usePosts } from '../hooks/useSupabase';
import { formatDate, formatRelativeTime } from '../lib/supabase';
import { supabase } from '../lib/supabase';
import SEOHead from '../components/SEOHead';
import SocialShare from '../components/SocialShare';
import LoadingSpinner from '../components/LoadingSpinner';

const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { authors, loading: authorsLoading } = useAuthors();
  const { posts, loading: postsLoading, incrementViewCount } = usePosts();
  const [viewRecorded, setViewRecorded] = useState(false);

  const post = posts.find(p => p.slug === slug);
  const author = post ? authors.find(a => a.id === post.author_id) : null;

  // Record view when post is loaded
  useEffect(() => {
    if (post && !viewRecorded) {
      const recordView = async () => {
        try {
          await incrementViewCount(
            post.id,
            undefined, // viewer IP will be handled by the function
            navigator.userAgent,
            document.referrer
          );
          setViewRecorded(true);
        } catch (error) {
          console.error('Failed to record view:', error);
        }
      };

      // Delay view recording to ensure it's a real view
      const timer = setTimeout(recordView, 2000);
      return () => clearTimeout(timer);
    }
  }, [post, incrementViewCount, viewRecorded]);

  if (postsLoading || authorsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Чланак није пронађен</h1>
          <Link to="/posts" className="text-primary-600 hover:text-primary-700">
            Назад на све чланке
          </Link>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const publishedDate = post.published_at || post.created_at;
  const currentUrl = window.location.href;

  return (
    <>
      <SEOHead
        title={post.title}
        description={post.excerpt}
        image={post.cover_image}
        url={currentUrl}
        type="article"
        publishedTime={post.published_at || undefined}
        modifiedTime={post.updated_at}
        author={author.name}
        tags={post.tags}
      />

      <motion.div 
        className="min-h-screen bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Hero Section */}
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link
              to="/posts"
              className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад на чланке
            </Link>

            {/* Featured Badge */}
            {post.featured && (
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">
                  ⭐ Издвојен чланак
                </span>
              </div>
            )}

            {/* Title */}
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-serif leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {post.title}
            </motion.h1>

            {/* Excerpt */}
            <motion.p 
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {post.excerpt}
            </motion.p>

            {/* Meta Information */}
            <motion.div 
              className="flex flex-wrap items-center gap-6 text-gray-500 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Author */}
              <Link 
                to={`/author/${author.id}`}
                className="flex items-center space-x-3 hover:text-primary-600 transition-colors"
              >
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-gray-900">{author.name}</div>
                  <div className="text-sm">Аутор</div>
                </div>
              </Link>

              {/* Date */}
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <div>
                  <div className="font-medium text-gray-900">
                    {formatDate(publishedDate)}
                  </div>
                  <div className="text-sm">
                    {formatRelativeTime(publishedDate)}
                  </div>
                </div>
              </div>

              {/* Reading Time */}
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <div>
                  <div className="font-medium text-gray-900">{post.reading_time} мин</div>
                  <div className="text-sm">Читање</div>
                </div>
              </div>

              {/* View Count */}
              {post.view_count > 0 && (
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <div>
                    <div className="font-medium text-gray-900">{post.view_count}</div>
                    <div className="text-sm">Прегледа</div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <motion.div 
                className="flex flex-wrap gap-2 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Social Share */}
            <motion.div 
              className="flex justify-end"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <SocialShare
                url={currentUrl}
                title={post.title}
                description={post.excerpt}
              />
            </motion.div>
          </div>
        </div>

        {/* Cover Image */}
        <motion.div 
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
          />
        </motion.div>

        {/* Article Content */}
        <motion.div 
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
            <div 
              className="prose prose-lg max-w-none article-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </motion.div>

        {/* Author Bio */}
        <motion.div 
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">О аутору</h3>
            <div className="flex items-start space-x-4">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  <Link 
                    to={`/author/${author.id}`}
                    className="hover:text-primary-600 transition-colors"
                  >
                    {author.name}
                  </Link>
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {author.bio}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default PostDetail;