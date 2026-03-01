export const theme = {
  colors: {
    primary: '#FF75B2', // アクセントカラー
    primaryDark: '#E55D9A', // ホバー状態用のダークカラー
    white: '#FFFFFF',
    black: '#000000',
    gray: '#F5F5F5',
    lightGray: '#EEEEEE',
  },
  fonts: {
    primary: "'Noto Sans JP', 'Inter', sans-serif",
  },
  breakpoints: {
    mobile: '768px',
  }
};

export type Theme = typeof theme;
