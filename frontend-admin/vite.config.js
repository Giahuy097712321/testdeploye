import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,        // Ghim cứng cổng 5174 cho Admin
    strictPort: true,  // Nếu cổng bận thì báo lỗi chứ không tự đổi số
  },
})