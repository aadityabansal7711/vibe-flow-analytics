
-- Add a UNIQUE constraint to user_management.user_id to allow ON CONFLICT to work
ALTER TABLE public.user_management
ADD CONSTRAINT user_management_user_id_unique UNIQUE(user_id);
