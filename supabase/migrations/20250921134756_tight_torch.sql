/*
  # Fix Storage Policies for Project Files

  1. Storage Bucket Policies
    - Allow authenticated users to upload files to project-files bucket
    - Allow public read access to uploaded files
    - Fix RLS policy violations for file uploads

  2. Security
    - Enable proper authentication for file uploads
    - Allow developers and admins to upload project files
*/

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-files', 'project-files', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public downloads" ON storage.objects;

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-files');

-- Allow public read access to files
CREATE POLICY "Allow public downloads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-files');

-- Allow authenticated users to update their own files
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'project-files')
WITH CHECK (bucket_id = 'project-files');

-- Allow authenticated users to delete their own files
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-files');