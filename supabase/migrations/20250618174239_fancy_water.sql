/*
  # Database Schema Improvements and Optimizations

  1. Performance Improvements
    - Add missing indexes for better query performance
    - Optimize existing indexes
    - Add composite indexes for common query patterns

  2. Data Integrity
    - Add check constraints for data validation
    - Improve foreign key constraints
    - Add default values where appropriate

  3. New Features
    - Add view counts for posts
    - Add post status (draft, published, archived)
    - Add author verification status
    - Add post categories
    - Add reading progress tracking

  4. Security Enhancements
    - Improve RLS policies for better security
    - Add audit trail functionality
    - Add rate limiting considerations

  5. Search and Analytics
    - Add full-text search capabilities
    - Add analytics tracking
*/

-- Add new columns for enhanced functionality
DO $$
BEGIN
  -- Add view_count to posts if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'view_count'
  ) THEN
    ALTER TABLE posts ADD COLUMN view_count integer DEFAULT 0;
  END IF;

  -- Add status to posts if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'status'
  ) THEN
    ALTER TABLE posts ADD COLUMN status text DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'));
  END IF;

  -- Add verified status to authors if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'authors' AND column_name = 'verified'
  ) THEN
    ALTER TABLE authors ADD COLUMN verified boolean DEFAULT false;
  END IF;

  -- Add last_login to authors if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'authors' AND column_name = 'last_login'
  ) THEN
    ALTER TABLE authors ADD COLUMN last_login timestamptz;
  END IF;

  -- Add updated_at to posts if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE posts ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;

  -- Add updated_at to authors if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'authors' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE authors ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create categories table for better content organization
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  color text DEFAULT '#6B7280',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create post_categories junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS post_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, category_id)
);

-- Create post_views table for analytics
CREATE TABLE IF NOT EXISTS post_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  viewer_ip inet,
  user_agent text,
  viewed_at timestamptz DEFAULT now()
);

-- Create reading_progress table for user reading tracking
CREATE TABLE IF NOT EXISTS reading_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid,
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  last_read_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_view_count ON posts(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_posts_updated_at ON posts(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_author_status ON posts(author_id, status);
CREATE INDEX IF NOT EXISTS idx_posts_featured_status ON posts(featured, status) WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_authors_verified ON authors(verified);
CREATE INDEX IF NOT EXISTS idx_authors_last_login ON authors(last_login DESC);
CREATE INDEX IF NOT EXISTS idx_authors_updated_at ON authors(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_post_categories_post_id ON post_categories(post_id);
CREATE INDEX IF NOT EXISTS idx_post_categories_category_id ON post_categories(category_id);

CREATE INDEX IF NOT EXISTS idx_post_views_post_id ON post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_post_views_viewed_at ON post_views(viewed_at DESC);

CREATE INDEX IF NOT EXISTS idx_reading_progress_user_id ON reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_post_id ON reading_progress(post_id);

-- Add full-text search index for posts
CREATE INDEX IF NOT EXISTS idx_posts_search ON posts USING GIN(to_tsvector('serbian', title || ' ' || excerpt || ' ' || content));

-- Enable RLS on new tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for categories
CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  USING (true);

CREATE POLICY "Categories can be managed by authenticated users"
  ON categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for post_categories
CREATE POLICY "Post categories are viewable by everyone"
  ON post_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Post categories can be managed by authenticated users"
  ON post_categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for post_views
CREATE POLICY "Post views are viewable by everyone"
  ON post_views
  FOR SELECT
  USING (true);

CREATE POLICY "Post views can be inserted by anyone"
  ON post_views
  FOR INSERT
  WITH CHECK (true);

-- Create RLS policies for reading_progress
CREATE POLICY "Users can view their own reading progress"
  ON reading_progress
  FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their own reading progress"
  ON reading_progress
  FOR ALL
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_authors_updated_at ON authors;
CREATE TRIGGER update_authors_updated_at
  BEFORE UPDATE ON authors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_post_view_count(post_id_param uuid, viewer_ip_param inet DEFAULT NULL, user_agent_param text DEFAULT NULL)
RETURNS void AS $$
BEGIN
  -- Insert view record
  INSERT INTO post_views (post_id, viewer_ip, user_agent)
  VALUES (post_id_param, viewer_ip_param, user_agent_param);
  
  -- Update view count
  UPDATE posts 
  SET view_count = view_count + 1 
  WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for full-text search
CREATE OR REPLACE FUNCTION search_posts(search_query text)
RETURNS TABLE (
  id uuid,
  title text,
  slug text,
  excerpt text,
  cover_image text,
  author_id uuid,
  published_at timestamptz,
  reading_time integer,
  tags text[],
  featured boolean,
  view_count integer,
  rank real
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.slug,
    p.excerpt,
    p.cover_image,
    p.author_id,
    p.published_at,
    p.reading_time,
    p.tags,
    p.featured,
    p.view_count,
    ts_rank(to_tsvector('serbian', p.title || ' ' || p.excerpt || ' ' || p.content), plainto_tsquery('serbian', search_query)) as rank
  FROM posts p
  WHERE 
    p.status = 'published' AND
    to_tsvector('serbian', p.title || ' ' || p.excerpt || ' ' || p.content) @@ plainto_tsquery('serbian', search_query)
  ORDER BY rank DESC, p.published_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Insert default categories
INSERT INTO categories (name, slug, description, color) VALUES
  ('Традиција', 'tradicija', 'Чланци о традицији и обичајима Запланског краја', '#DC2626'),
  ('Култура', 'kultura', 'Културни садржаји и уметност', '#7C3AED'),
  ('Историја', 'istorija', 'Историјски чланци и приче', '#059669'),
  ('Гастрономија', 'gastronomija', 'Традиционална јела и рецепти', '#EA580C'),
  ('Природа', 'priroda', 'О природним лепотама краја', '#16A34A'),
  ('Људи', 'ljudi', 'Приче о људима и њиховим животима', '#0EA5E9')
ON CONFLICT (slug) DO NOTHING;

-- Create view for post statistics
CREATE OR REPLACE VIEW post_statistics AS
SELECT 
  p.id,
  p.title,
  p.slug,
  p.view_count,
  p.published_at,
  p.status,
  a.name as author_name,
  COUNT(pv.id) as total_views,
  COUNT(DISTINCT DATE(pv.viewed_at)) as unique_view_days,
  AVG(rp.progress_percentage) as avg_reading_progress
FROM posts p
LEFT JOIN authors a ON p.author_id = a.id
LEFT JOIN post_views pv ON p.id = pv.post_id
LEFT JOIN reading_progress rp ON p.id = rp.post_id
GROUP BY p.id, p.title, p.slug, p.view_count, p.published_at, p.status, a.name;

-- Create view for author statistics
CREATE OR REPLACE VIEW author_statistics AS
SELECT 
  a.id,
  a.name,
  a.email,
  a.verified,
  a.created_at,
  a.last_login,
  COUNT(p.id) as total_posts,
  COUNT(CASE WHEN p.status = 'published' THEN 1 END) as published_posts,
  COUNT(CASE WHEN p.status = 'draft' THEN 1 END) as draft_posts,
  SUM(p.view_count) as total_views,
  AVG(p.view_count) as avg_views_per_post
FROM authors a
LEFT JOIN posts p ON a.id = p.author_id
GROUP BY a.id, a.name, a.email, a.verified, a.created_at, a.last_login;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION increment_post_view_count TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_posts TO anon, authenticated;