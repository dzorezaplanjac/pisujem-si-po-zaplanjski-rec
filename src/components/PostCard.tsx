import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Eye, User, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate, formatRelativeTime, extractPlainText } from '../lib/supabase';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author_id: string;
  published_at: string | null;
  reading_time: number;
  tags: string[];
  featured: boolean;
  view_count: number;
  status: string;
  created_at: string;
}

interface Author {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  email: string;
  social_links?: any;
}

interface PostCardProps {
  post: Post;
  author: Author;
  showAuthor?: boolean;
  className?: string;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  author, 
  showAuthor = true,
  className = '' 
}) => {
  const publishedDate = post.published_at || post.created_at;
  const plainTextExcerpt = extractPlainText(post.excerpt);

  return (
    <motion.article
      className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group ${className}`}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Cover Image */}
      <div className="relative overflow-hidden">
        <Link to={`/post/${post.slug}`}>
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>
        
        {/* Featured Badge */}
        {post.featured && (
          <div className="absolute top-3 left-3">
            <div className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <Star className="h-3 w-3" />
              <span>Издвојено</span>
            </div>
          </div>
        )}

        {/* View Count */}
        {post.view_count > 0 && (
          <div className="absolute top-3 right-3">
            <div className="bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>{post.view_count}</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
          <Link to={`/post/${post.slug}`}>
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {plainTextExcerpt}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            {/* Author */}
            {showAuthor && (
              <Link 
                to={`/author/${author.id}`}
                className="flex items-center space-x-2 hover:text-primary-600 transition-colors"
              >
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="font-medium">{author.name}</span>
              </Link>
            )}

            {/* Reading Time */}
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{post.reading_time} мин</span>
            </div>
          </div>

          {/* Published Date */}
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <time 
              dateTime={publishedDate}
              title={formatDate(publishedDate)}
            >
              {formatRelativeTime(publishedDate)}
            </time>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default PostCard;