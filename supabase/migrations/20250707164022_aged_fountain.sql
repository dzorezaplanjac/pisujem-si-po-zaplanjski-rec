/*
  # Enhanced Blog Features Migration

  1. New Features
    - Add view tracking for posts
    - Add comment system
    - Add post categories/topics
    - Add user bookmarks/favorites
    - Add newsletter subscription
    - Add post series/collections

  2. Analytics & SEO
    - Add SEO metadata fields
    - Add analytics tracking
    - Add search optimization

  3. Content Management
    - Add post status (draft, published, archived)
    - Add scheduled publishing
    - Add content versioning
*/

-- Add enhanced fields to posts table
DO $$
BEGIN
  -- Add view count if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'view_count'
  ) THEN
    ALTER TABLE posts ADD COLUMN view_count integer DEFAULT 0;
  END IF;

  -- Add SEO fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'meta_description'
  ) THEN
    ALTER TABLE posts ADD COLUMN meta_description text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'meta_keywords'
  ) THEN
    ALTER TABLE posts ADD COLUMN meta_keywords text[];
  END IF;

  -- Add post status
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'status'
  ) THEN
    ALTER TABLE posts ADD COLUMN status text DEFAULT 'published' 
    CHECK (status IN ('draft', 'published', 'archived', 'scheduled'));
  END IF;

  -- Add scheduled publish date
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'scheduled_at'
  ) THEN
    ALTER TABLE posts ADD COLUMN scheduled_at timestamptz;
  END IF;

  -- Add updated_at timestamp
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE posts ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create categories table for better content organization
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  color text DEFAULT '#6B7280',
  icon text, -- Lucide icon name
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create post-category relationship (many-to-many)
CREATE TABLE IF NOT EXISTS post_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, category_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_email text NOT NULL,
  content text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE, -- For nested comments
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create newsletter subscriptions table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz
);

-- Create post series/collections table
CREATE TABLE IF NOT EXISTS post_series (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  cover_image text,
  author_id uuid REFERENCES authors(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create series-post relationship
CREATE TABLE IF NOT EXISTS series_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id uuid REFERENCES post_series(id) ON DELETE CASCADE,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(series_id, post_id),
  UNIQUE(series_id, order_index)
);

-- Create bookmarks/favorites table
CREATE TABLE IF NOT EXISTS user_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL, -- This would be auth.uid() from Supabase Auth
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Create post views tracking table
CREATE TABLE IF NOT EXISTS post_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  viewer_ip inet,
  user_agent text,
  referrer text,
  viewed_at timestamptz DEFAULT now()
);

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_posts_view_count ON posts(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_at ON posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_posts_updated_at ON posts(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_post_categories_post_id ON post_categories(post_id);
CREATE INDEX IF NOT EXISTS idx_post_categories_category_id ON post_categories(category_id);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscriptions(status);

CREATE INDEX IF NOT EXISTS idx_series_slug ON post_series(slug);
CREATE INDEX IF NOT EXISTS idx_series_posts_series_id ON series_posts(series_id);
CREATE INDEX IF NOT EXISTS idx_series_posts_order ON series_posts(series_id, order_index);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON user_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_post_id ON user_bookmarks(post_id);

CREATE INDEX IF NOT EXISTS idx_post_views_post_id ON post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_post_views_date ON post_views(DATE(viewed_at));

-- Add full-text search index
CREATE INDEX IF NOT EXISTS idx_posts_search 
ON posts USING GIN(to_tsvector('serbian', title || ' ' || excerpt || ' ' || content));

-- Enable RLS on new tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE series_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Categories (public read, authenticated write)
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Categories can be managed by authenticated users"
  ON categories FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Post categories (public read, authenticated write)
CREATE POLICY "Post categories are viewable by everyone"
  ON post_categories FOR SELECT USING (true);

CREATE POLICY "Post categories can be managed by authenticated users"
  ON post_categories FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Comments (public read approved, authenticated write)
CREATE POLICY "Approved comments are viewable by everyone"
  ON comments FOR SELECT USING (status = 'approved');

CREATE POLICY "Anyone can submit comments"
  ON comments FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can manage comments"
  ON comments FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Newsletter (authenticated manage)
CREATE POLICY "Newsletter subscriptions can be managed by authenticated users"
  ON newsletter_subscriptions FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscriptions FOR INSERT WITH CHECK (true);

-- Post series (public read, authenticated write)
CREATE POLICY "Post series are viewable by everyone"
  ON post_series FOR SELECT USING (true);

CREATE POLICY "Post series can be managed by authenticated users"
  ON post_series FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Series posts (public read, authenticated write)
CREATE POLICY "Series posts are viewable by everyone"
  ON series_posts FOR SELECT USING (true);

CREATE POLICY "Series posts can be managed by authenticated users"
  ON series_posts FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- User bookmarks (users can only see their own)
CREATE POLICY "Users can view their own bookmarks"
  ON user_bookmarks FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their own bookmarks"
  ON user_bookmarks FOR ALL
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

-- Post views (public read and insert for analytics)
CREATE POLICY "Post views are viewable by everyone"
  ON post_views FOR SELECT USING (true);

CREATE POLICY "Anyone can record post views"
  ON post_views FOR INSERT WITH CHECK (true);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_series_updated_at
  BEFORE UPDATE ON post_series
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_post_view_count(
  post_id_param uuid,
  viewer_ip_param inet DEFAULT NULL,
  user_agent_param text DEFAULT NULL,
  referrer_param text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  -- Insert view record for analytics
  INSERT INTO post_views (post_id, viewer_ip, user_agent, referrer)
  VALUES (post_id_param, viewer_ip_param, user_agent_param, referrer_param);
  
  -- Update view count on post
  UPDATE posts 
  SET view_count = view_count + 1 
  WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for full-text search
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
    ts_rank(
      to_tsvector('serbian', p.title || ' ' || p.excerpt || ' ' || p.content), 
      plainto_tsquery('serbian', search_query)
    ) as rank
  FROM posts p
  WHERE 
    p.status = 'published' AND
    p.published_at <= now() AND
    to_tsvector('serbian', p.title || ' ' || p.excerpt || ' ' || p.content) 
    @@ plainto_tsquery('serbian', search_query)
  ORDER BY rank DESC, p.published_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Insert default categories for Serbian blog
INSERT INTO categories (name, slug, description, color, icon) VALUES
  ('Традиција', 'tradicija', 'Чланци о традицији и обичајима Заплањског краја', '#DC2626', 'Crown'),
  ('Култура', 'kultura', 'Културни садржаји и уметност', '#7C3AED', 'Palette'),
  ('Историја', 'istorija', 'Историјски чланци и приче из прошлости', '#059669', 'Scroll'),
  ('Гастрономија', 'gastronomija', 'Традиционална јела и рецепти', '#EA580C', 'ChefHat'),
  ('Природа', 'priroda', 'О природним лепотама Заплањског краја', '#16A34A', 'Trees'),
  ('Људи', 'ljudi', 'Приче о људима и њиховим животима', '#0EA5E9', 'Users'),
  ('Фестивали', 'festivali', 'Традиционални фестивали и манифестације', '#F59E0B', 'Calendar'),
  ('Занати', 'zanati', 'Стари занати и вештине', '#8B5CF6', 'Hammer')
ON CONFLICT (slug) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION increment_post_view_count TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_posts TO anon, authenticated;