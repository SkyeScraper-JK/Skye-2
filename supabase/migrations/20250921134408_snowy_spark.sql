/*
  # Create Storage Buckets for Project Files

  1. Storage Buckets
    - Create `project-files` bucket for brochures and Excel files
    - Set up proper policies for authenticated users

  2. Security
    - Allow authenticated users to upload files
    - Allow public read access to uploaded files
*/

-- Create the project-files bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-files', 'project-files', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload project files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-files');

-- Policy to allow public read access to project files
CREATE POLICY "Public read access to project files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'project-files');

-- Policy to allow users to update their own uploaded files
CREATE POLICY "Users can update own project files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'project-files');

-- Policy to allow users to delete their own uploaded files
CREATE POLICY "Users can delete own project files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'project-files');