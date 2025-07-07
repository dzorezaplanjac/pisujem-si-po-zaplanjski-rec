/*
  # Initial Schema for Zaplanjska Priča Đore

  1. New Tables
    - `authors`
      - `id` (uuid, primary key)
      - `name` (text)
      - `bio` (text)
      - `avatar` (text)
      - `email` (text, unique)
      - `social_links` (jsonb, nullable)
      - `created_at` (timestamp)
    
    - `posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `excerpt` (text)
      - `content` (text)
      - `cover_image` (text)
      - `author_id` (uuid, foreign key)
      - `published_at` (timestamp)
      - `reading_time` (integer)
      - `tags` (text array)
      - `featured` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated write access
*/

-- Create authors table
CREATE TABLE IF NOT EXISTS authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  bio text NOT NULL,
  avatar text NOT NULL,
  email text UNIQUE NOT NULL,
  social_links jsonb DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  cover_image text NOT NULL,
  author_id uuid REFERENCES authors(id) ON DELETE CASCADE,
  published_at timestamptz DEFAULT now(),
  reading_time integer NOT NULL DEFAULT 5,
  tags text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies for authors table
CREATE POLICY "Authors are viewable by everyone"
  ON authors
  FOR SELECT
  USING (true);

CREATE POLICY "Authors can be inserted by authenticated users"
  ON authors
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authors can be updated by authenticated users"
  ON authors
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for posts table
CREATE POLICY "Posts are viewable by everyone"
  ON posts
  FOR SELECT
  USING (true);

CREATE POLICY "Posts can be inserted by authenticated users"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Posts can be updated by authenticated users"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(featured);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN(tags);