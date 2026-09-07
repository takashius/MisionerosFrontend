import type { ThemeConfig } from 'antd';

export const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#2563EB',
    colorInfo: '#2563EB',
    colorSuccess: '#10B981',
    colorBgLayout: '#F8F9FF',
    colorBgContainer: '#FFFFFF',
    colorText: '#0B1C30',
    colorTextSecondary: '#444651',
    borderRadius: 12,
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
    controlHeight: 48,
  },
  components: {
    Layout: {
      headerBg: 'rgba(255,255,255,0.92)',
      headerHeight: 80,
      bodyBg: '#F8F9FF',
      siderBg: '#FFFFFF',
    },
    Button: {
      controlHeight: 48,
      borderRadius: 12,
      fontWeight: 600,
    },
    Card: {
      borderRadiusLG: 16,
    },
  },
};

export const brand = {
  navy: '#1E3A8A',
  navyDeep: '#00236F',
  secondary: '#2563EB',
  surface: '#F8F9FF',
};
