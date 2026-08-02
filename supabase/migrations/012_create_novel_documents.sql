-- Create novel_documents table using JSONB for storing the entire novel state
CREATE TABLE IF NOT EXISTS public.novel_documents (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.novel_documents ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing public access for this prototyping phase)
CREATE POLICY "Enable read access for all users on novel_documents" 
ON public.novel_documents FOR SELECT 
USING (true);

CREATE POLICY "Enable insert access for all users on novel_documents" 
ON public.novel_documents FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update access for all users on novel_documents" 
ON public.novel_documents FOR UPDATE 
USING (true);
