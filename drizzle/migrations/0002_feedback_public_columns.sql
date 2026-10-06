REVOKE SELECT ON public.feedback FROM anon, authenticated;
GRANT SELECT (id, name, project, rating, message, status, created_at) ON public.feedback TO anon, authenticated;