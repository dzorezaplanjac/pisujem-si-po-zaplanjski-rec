import React, { useState } from 'react';
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Copy, 
  Check,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({
  url,
  title,
  description = '',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareData = {
    url: encodeURIComponent(url),
    title: encodeURIComponent(title),
    description: encodeURIComponent(description)
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareData.url}`,
    twitter: `https://twitter.com/intent/tweet?url=${shareData.url}&text=${shareData.title}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareData.url}`,
    whatsapp: `https://wa.me/?text=${shareData.title}%20${shareData.url}`
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const openShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <Share2 className="h-4 w-4" />
        <span>Подели</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Share Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full mb-2 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50 min-w-[280px]"
            >
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => openShare('facebook')}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Facebook className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Facebook</span>
                </button>

                <button
                  onClick={() => openShare('twitter')}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-sky-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Twitter className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Twitter</span>
                </button>

                <button
                  onClick={() => openShare('linkedin')}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Linkedin className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">LinkedIn</span>
                </button>

                <button
                  onClick={() => openShare('whatsapp')}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">WhatsApp</span>
                </button>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors w-full group"
                >
                  <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    {copied ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <Copy className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <span className="text-gray-700 font-medium">
                    {copied ? 'Копирано!' : 'Копирај линк'}
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialShare;