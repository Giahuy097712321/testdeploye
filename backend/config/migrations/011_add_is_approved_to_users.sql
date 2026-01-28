-- Add is_approved column to users table
ALTER TABLE users ADD COLUMN is_approved BOOLEAN DEFAULT FALSE AFTER is_active;

-- Update existing users to be approved
UPDATE users SET is_approved = 1 WHERE role = 'admin' OR role = 'instructor';
