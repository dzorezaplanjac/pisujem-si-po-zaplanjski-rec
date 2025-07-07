import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// Types based on database schema
export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  email: string;
  social_links?: {
    website?: string;
    twitter?: string;
    linkedin?: string;
  } | null;
  verified?: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
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
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  scheduled_at?: string | null;
  meta_description?: string | null;
  meta_keywords?: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  color: string;
  icon?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  parent_id?: string | null;
  created_at: string;
  updated_at: string;
}

// Custom hook for authors
export const useAuthors = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuthors = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAuthors(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const addAuthor = async (authorData: Omit<Author, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('authors')
      .insert([authorData])
      .select()
      .single();

    if (error) throw error;
    await fetchAuthors();
    return data;
  };

  const updateAuthor = async (id: string, updates: Partial<Author>) => {
    const { data, error } = await supabase
      .from('authors')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    await fetchAuthors();
    return data;
  };

  const deleteAuthor = async (id: string) => {
    const { error } = await supabase
      .from('authors')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchAuthors();
  };

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  return {
    authors,
    loading,
    error,
    refetch: fetchAuthors,
    addAuthor,
    updateAuthor,
    deleteAuthor
  };
};

// Custom hook for posts
export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('published_at', { ascending: false, nullsFirst: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const addPost = async (postData: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'view_count'>) => {
    const { data, error } = await supabase
      .from('posts')
      .insert([{ ...postData, view_count: 0 }])
      .select()
      .single();

    if (error) throw error;
    await fetchPosts();
    return data;
  };

  const updatePost = async (id: string, updates: Partial<Post>) => {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    await fetchPosts();
    return data;
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchPosts();
  };

  const incrementViewCount = async (postId: string, viewerIp?: string, userAgent?: string, referrer?: string) => {
    const { error } = await supabase.rpc('increment_post_view_count', {
      post_id_param: postId,
      viewer_ip_param: viewerIp || null,
      user_agent_param: userAgent || null,
      referrer_param: referrer || null
    });

    if (error) throw error;
    await fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts,
    addPost,
    updatePost,
    deletePost,
    incrementViewCount
  };
};

// Custom hook for categories
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const addCategory = async (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single();

    if (error) throw error;
    await fetchCategories();
    return data;
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    addCategory
  };
};

// Custom hook for search
export const useSearch = () => {
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.rpc('search_posts', {
        search_query: query
      });

      if (error) throw error;
      setResults(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clearResults
  };
};

// Custom hook for comments
export const useComments = (postId?: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!postId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .eq('status', 'approved')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const addComment = async (commentData: Omit<Comment, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
    const { data, error } = await supabase
      .from('comments')
      .insert([{ ...commentData, status: 'pending' }])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    loading,
    error,
    refetch: fetchComments,
    addComment
  };
};

// Custom hook for newsletter subscriptions
export const useNewsletter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = async (email: string, name?: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email, name }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Subscription failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async (email: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update({ 
          status: 'unsubscribed',
          unsubscribed_at: new Date().toISOString()
        })
        .eq('email', email);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unsubscribe failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    subscribe,
    unsubscribe
  };
};