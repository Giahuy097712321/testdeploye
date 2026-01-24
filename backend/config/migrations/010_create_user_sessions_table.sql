-- Migration: Tạo bảng sessions để quản lý single device login
CREATE TABLE IF NOT EXISTS user_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(500) UNIQUE,
  device_id VARCHAR(255),
  device_name VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  INDEX idx_user_id (user_id),
  INDEX idx_token (token),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Thêm cột session_token vào table users (nếu chưa có)
ALTER TABLE users ADD COLUMN IF NOT EXISTS active_session_id INT DEFAULT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS active_device_id VARCHAR(255) DEFAULT NULL;
