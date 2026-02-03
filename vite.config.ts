
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages 배포 시 레포지토리 이름과 상관없이 리소스를 로드할 수 있도록 상대 경로('./')를 사용합니다.
  // 이 앱은 React Router(BrowserRouter)를 사용하지 않으므로 이 설정이 안전하고 편리합니다.
  base: '/jarayo_02/',
})
