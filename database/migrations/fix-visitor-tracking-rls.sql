-- Fix RLS policy for visitor tracking to allow anonymous reads for statistics
-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Authenticated users can view visit data" ON coversong_page_visits;

-- Create new policy that allows anyone to read visit data (for statistics)
CREATE POLICY "Anyone can view visit data" ON coversong_page_visits
  FOR SELECT USING (true);

-- Keep the existing insert policy
-- CREATE POLICY "Anyone can insert visit data" ON coversong_page_visits
--   FOR INSERT WITH CHECK (true);
-- This already exists, so we don't need to recreate it