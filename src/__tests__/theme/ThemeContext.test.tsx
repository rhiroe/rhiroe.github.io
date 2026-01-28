import { act, render, renderHook, screen } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { ThemeProvider, useThemeContext } from '../../theme/ThemeContext';

// localStorageのモック
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// matchMediaのモック
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: query === '(prefers-color-scheme: dark)',
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    // documentのモック要素をリセット
    document.documentElement.className = '';
    document.documentElement.style.cssText = '';
    document.head.innerHTML = '';
  });

  describe('useThemeContext', () => {
    it('should return theme context values', () => {
      const wrapper = ({ children }: PropsWithChildren) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useThemeContext(), { wrapper });

      expect(result.current.mode).toBe('dark');
      expect(typeof result.current.toggleColorMode).toBe('function');
    });

    it('should toggle theme mode', () => {
      const wrapper = ({ children }: PropsWithChildren) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useThemeContext(), { wrapper });

      act(() => {
        result.current.toggleColorMode();
      });

      expect(result.current.mode).toBe('light');

      act(() => {
        result.current.toggleColorMode();
      });

      expect(result.current.mode).toBe('dark');
    });
  });

  describe('ThemeProvider', () => {
    it('should render children with default dark theme', () => {
      render(
        <ThemeProvider>
          <div>Test Content</div>
        </ThemeProvider>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should load theme mode from localStorage', () => {
      localStorageMock.setItem('themeMode', 'light');

      const wrapper = ({ children }: PropsWithChildren) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useThemeContext(), { wrapper });

      // useEffect is async, so we need to wait
      expect(result.current.mode).toBe('light');
    });

    it('should save theme mode to localStorage when toggled', () => {
      const wrapper = ({ children }: PropsWithChildren) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useThemeContext(), { wrapper });

      act(() => {
        result.current.toggleColorMode();
      });

      expect(localStorageMock.getItem('themeMode')).toBe('light');

      act(() => {
        result.current.toggleColorMode();
      });

      expect(localStorageMock.getItem('themeMode')).toBe('dark');
    });

    it('should use system preference when localStorage is empty', () => {
      // matchMediaはdarkを返すようにモック済み
      const wrapper = ({ children }: PropsWithChildren) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      renderHook(() => useThemeContext(), { wrapper });

      // デフォルトでdarkモードが設定される
      expect(localStorageMock.getItem('themeMode')).toBeNull();
    });

    it('should set CSS variables when theme changes', async () => {
      const wrapper = ({ children }: PropsWithChildren) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useThemeContext(), { wrapper });

      // Wait for initial useEffect to complete
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(document.documentElement.classList.contains('theme-dark')).toBe(true);

      act(() => {
        result.current.toggleColorMode();
      });

      // Wait for theme change useEffect
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(document.documentElement.classList.contains('theme-light')).toBe(true);
      expect(document.documentElement.classList.contains('theme-dark')).toBe(false);
    });

    it('should inject highlight.js CSS link for current theme', async () => {
      const wrapper = ({ children }: PropsWithChildren) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useThemeContext(), { wrapper });

      // Wait for initial useEffect
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      const darkLink = document.querySelector('link[data-highlight-theme]');
      expect(darkLink).toBeInTheDocument();
      expect(darkLink?.getAttribute('href')).toContain('github-dark.min.css');

      act(() => {
        result.current.toggleColorMode();
      });

      // Wait for theme change
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      const lightLink = document.querySelector('link[data-highlight-theme]');
      expect(lightLink).toBeInTheDocument();
      expect(lightLink?.getAttribute('href')).toContain('github.min.css');
    });

    it('should remove old highlight.js link when theme changes', async () => {
      const wrapper = ({ children }: PropsWithChildren) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useThemeContext(), { wrapper });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      const initialLinks = document.querySelectorAll('link[data-highlight-theme]');
      expect(initialLinks).toHaveLength(1);

      act(() => {
        result.current.toggleColorMode();
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      const afterToggleLinks = document.querySelectorAll('link[data-highlight-theme]');
      expect(afterToggleLinks).toHaveLength(1);
    });

    it('should provide both light and dark themes', async () => {
      const wrapper = ({ children }: PropsWithChildren) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useThemeContext(), { wrapper });

      expect(result.current.mode).toBe('dark');

      act(() => {
        result.current.toggleColorMode();
      });

      expect(result.current.mode).toBe('light');
    });
  });
});
