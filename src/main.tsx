import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp, ConfigProvider } from 'antd';
import esES from 'antd/locale/es_ES';
import { BrowserRouter } from 'react-router-dom';
import { createAppQueryClient } from '@api/createAppQueryClient';
import { AuthProvider } from '@context/AuthContext';
import { themeConfig } from './theme/config';
import App from './App';
import './index.css';

const queryClient = createAppQueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={esES} theme={themeConfig}>
        <AntApp>
          <AuthProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </AuthProvider>
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  </StrictMode>
);
