import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import basicSsl from '@vitejs/plugin-basic-ssl';
import path from 'path';

const apiProxy = {
  target: 'http://127.0.0.1:3040',
  changeOrigin: true,
};

export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    host: true,
    port: 3050,
    strictPort: true,
    proxy: {
      '/user': apiProxy,
      '/participant': apiProxy,
      '/scan': apiProxy,
      '/schedule': apiProxy,
      '/active-response': apiProxy,
    },
  },
  resolve: {
    alias: {
      '@api': path.resolve(__dirname, 'src/api'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@app-types': path.resolve(__dirname, 'src/types'),
      '@context': path.resolve(__dirname, 'src/context'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@layouts': path.resolve(__dirname, 'src/layouts'),
      '@data': path.resolve(__dirname, 'src/data'),
    },
  },
});
