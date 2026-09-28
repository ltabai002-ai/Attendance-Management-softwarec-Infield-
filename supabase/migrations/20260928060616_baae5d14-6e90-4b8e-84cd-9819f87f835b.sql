CREATE TABLE public.demo_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  company text NOT NULL CHECK (char_length(company) BETWEEN 2 AND 150),
  phone text NOT NULL CHECK (phone ~ '^[6-9][0-9]{9}$'),
  email text CHECK (email IS NULL OR email = '' OR email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  city text NOT NULL CHECK (char_length(city) BETWEEN 2 AND 100),
  team_size text NOT NULL CHECK (team_size IN ('1–20', '21–50', '51–200', '200+')),
  industry text NOT NULL CHECK (industry IN ('Construction', 'Service Center', 'Hospital', 'Field Sales', 'Other')),
  message text CHECK (message IS NULL OR char_length(message) <= 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.demo_requests TO anon, authenticated;
GRANT ALL ON public.demo_requests TO service_role;

ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a demo request"
ON public.demo_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);