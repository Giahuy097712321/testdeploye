-- Add failed_login_attempts column to track password attempts
ALTER TABLE users ADD COLUMN failed_login_attempts INT DEFAULT 0 AFTER is_approved;

-- Add last_failed_login timestamp for security
ALTER TABLE users ADD COLUMN last_failed_login TIMESTAMP NULL AFTER failed_login_attempts;
