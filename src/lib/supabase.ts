import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  if (error?.message) {
    // Handle specific error types
    if (error.message.includes('duplicate key')) {
      return 'Ovaj sadržaj već postoji.';
    }
    if (error.message.includes('foreign key')) {
      return 'Povezani sadržaj ne postoji.';
    }
    if (error.message.includes('not found')) {
      return 'Sadržaj nije pronađen.';
    }
    if (error.message.includes('permission denied')) {
      return 'Nemate dozvolu za ovu akciju.';
    }
    return error.message;
  }
  return 'Došlo je do greške. Molimo pokušajte ponovo.';
};

// Helper function to generate slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    // Replace Serbian characters
    .replace(/č/g, 'c')
    .replace(/ć/g, 'c')
    .replace(/đ/g, 'd')
    .replace(/š/g, 's')
    .replace(/ž/g, 'z')
    // Remove special characters except spaces and hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, '');
};

// Helper function to format date for Serbian locale
export const formatDate = (dateString: string, options?: Intl.DateTimeFormatOptions): string => {
  const date = new Date(dateString);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return date.toLocaleDateString('sr-RS', defaultOptions);
};

// Helper function to format relative time
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Управо сада';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `Пре ${diffInMinutes} ${diffInMinutes === 1 ? 'минут' : 'минута'}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Пре ${diffInHours} ${diffInHours === 1 ? 'сат' : diffInHours < 5 ? 'сата' : 'сати'}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `Пре ${diffInDays} ${diffInDays === 1 ? 'дан' : 'дана'}`;
  }

  // For older dates, show formatted date
  return formatDate(dateString, { year: 'numeric', month: 'short', day: 'numeric' });
};

// Helper function to estimate reading time
export const estimateReadingTime = (content: string): number => {
  const wordsPerMinute = 200; // Average reading speed
  const words = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  return Math.max(1, readingTime); // Minimum 1 minute
};

// Helper function to truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Helper function to extract plain text from HTML
export const extractPlainText = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};