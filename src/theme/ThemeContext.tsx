import { CssBaseline, PaletteMode, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { createContext, FC, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { darkTheme, lightTheme } from './theme';

type ThemeContextType = {
  mode: PaletteMode;
  toggleColorMode: () => void;
};

// テーマコンテキストの作成
export const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  toggleColorMode: () => {},
});

// カスタムフック
export const useThemeContext = () => useContext(ThemeContext);

// テーマプロバイダー
export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  // ローカルストレージからテーマモードを取得するか、デフォルトでダークモードを使用
  const [mode, setMode] = useState<PaletteMode>('dark');

  useEffect(() => {
    // クライアントサイドでのみ実行
    if (typeof window !== 'undefined') {
      const storedMode = localStorage.getItem('themeMode') as PaletteMode | null;
      if (storedMode) {
        setMode(storedMode);
      } else {
        // プリファレンスがなければ、システムの設定を確認
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setMode(prefersDark ? 'dark' : 'light');
      }
    }
  }, []);

  // テーマの切り替え
  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'dark' ? 'light' : 'dark';
      // ローカルストレージに保存
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  // テーマコンテキスト値
  const themeContextValue = useMemo(
    () => ({
      mode,
      toggleColorMode,
    }),
    [mode]
  );

  // 現在のテーマ（ダークかライト）
  const currentTheme = useMemo(() => {
    return mode === 'dark' ? darkTheme : lightTheme;
  }, [mode]);

  // CSS変数を動的に設定
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      const theme = currentTheme;
      
      // HTML要素にテーマクラスを設定
      root.classList.remove('theme-light', 'theme-dark');
      root.classList.add(`theme-${mode}`);
      
      // パレット色をCSS変数として設定
      root.style.setProperty('--mui-palette-primary-main', theme.palette.primary.main);
      root.style.setProperty('--mui-palette-primary-light', theme.palette.primary.light);
      root.style.setProperty('--mui-palette-primary-dark', theme.palette.primary.dark);
      root.style.setProperty('--mui-palette-text-primary', theme.palette.text.primary);
      root.style.setProperty('--mui-palette-text-secondary', theme.palette.text.secondary);
      root.style.setProperty('--mui-palette-background-default', theme.palette.background.default);
      root.style.setProperty('--mui-palette-background-paper', theme.palette.background.paper);
      root.style.setProperty('--mui-palette-divider', theme.palette.divider);
      root.style.setProperty('--mui-palette-action-hover', theme.palette.action.hover);

      // highlight.jsのスタイルを動的に切り替え
      const existingHighlightLink = document.querySelector('link[data-highlight-theme]');
      if (existingHighlightLink) {
        existingHighlightLink.remove();
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.setAttribute('data-highlight-theme', 'true');
      link.href = mode === 'dark' 
        ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css'
        : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
      
      document.head.appendChild(link);
    }
  }, [currentTheme, mode]);

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <MuiThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
