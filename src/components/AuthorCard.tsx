import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Twitter, Linkedin } from 'lucide-react';
import { Author } from '../types';

interface AuthorCardProps {
  author: Author;
  postCount: number;
}

const AuthorCard: React.FC<AuthorCardProps> = ({ author, postCount }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-primary-100 group-hover:ring-primary-200 transition-all duration-300"
          />
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
              <Link to={`/author/${author.id}`}>
                {author.name}
              </Link>
            </h3>
            <p className="text-gray-500">
              {postCount} {postCount === 1 ? 'članak' : postCount < 5 ? 'članka' : 'članaka'}
            </p>
          </div>
        </div>

        <p className="text-gray-600 mb-4 leading-relaxed">
          {author.bio}
        </p>

        {author.socialLinks && (
          <div className="flex items-center space-x-3">
            {author.socialLinks.website && (
              <a
                href={author.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                title="Website"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            )}
            {author.socialLinks.twitter && (
              <a
                href={author.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                title="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            )}
            {author.socialLinks.linkedin && (
              <a
                href={author.socialLinks.linkedin}
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
  );
};

export default AuthorCard;