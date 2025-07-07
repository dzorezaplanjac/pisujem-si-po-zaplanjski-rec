/*
  # Fix Database Schema Issues

  1. Database Schema Fix
    - Ensure status column exists on posts table
    - Update existing posts to have proper status values
    - Add proper constraints and defaults

  2. Slug Generation Enhancement
    - Prepare for unique slug generation by adding helper function
*/

-- Ensure the status column exists with proper constraints
DO $$
BEGIN
  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'status'
  ) THEN
    ALTER TABLE posts ADD COLUMN status text DEFAULT 'published';
  END IF;
  
  -- Add check constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'posts_status_check'
  ) THEN
    ALTER TABLE posts ADD CONSTRAINT posts_status_check 
    CHECK (status IN ('draft', 'published', 'archived'));
  END IF;
END $$;

-- Update existing posts to have proper status based on published_at
UPDATE posts 
SET status = CASE 
  WHEN published_at IS NOT NULL THEN 'published'
  ELSE 'draft'
END
WHERE status IS NULL;

-- Ensure status column has proper default
ALTER TABLE posts ALTER COLUMN status SET DEFAULT 'published';

-- Create function to generate unique slug
CREATE OR REPLACE FUNCTION generate_unique_slug(title_text text, post_id_param uuid DEFAULT NULL)
RETURNS text AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 0;
BEGIN
  -- Generate base slug
  base_slug := title_text
    .toLowerCase()
    .replace(/[čć]/g, 'c')
    .replace(/[đ]/g, 'd')
    .replace(/[š]/g, 's')
    .replace(/[ž]/g, 'z')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  -- Remove leading/trailing hyphens
  base_slug := trim(both '-' from base_slug);
  
  -- Start with base slug
  final_slug := base_slug;
  
  -- Check for uniqueness and append counter if needed
  WHILE EXISTS (
    SELECT 1 FROM posts 
    WHERE slug = final_slug 
    AND (post_id_param IS NULL OR id != post_id_param)
  ) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION generate_unique_slug TO authenticated;