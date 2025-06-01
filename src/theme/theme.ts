// モノクロトーンでモダンなテーマファイル
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { Components, PaletteMode, PaletteOptions, Theme } from '@mui/material/styles';

// モノクロトーンでモダンなデザイントークン
const getDesignTokens = (mode: PaletteMode): PaletteOptions => ({
  mode,
  ...(mode === 'light'
    ? {
        // ライトモード - モノクロトーンで洗練されたパレット
        primary: {
          main: '#2d3748',
          light: '#4a5568',
          dark: '#1a202c',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#718096',
          light: '#a0aec0',
          dark: '#4a5568',
          contrastText: '#ffffff',
        },
        background: {
          default: '#fafbfc',
          paper: '#ffffff',
        },
        text: {
          primary: '#1a202c',
          secondary: '#4a5568',
          disabled: '#a0aec0',
        },
        divider: '#e2e8f0',
        action: {
          active: '#2d3748',
          hover: 'rgba(45, 55, 72, 0.04)',
          selected: 'rgba(45, 55, 72, 0.08)',
          disabled: '#a0aec0',
          disabledBackground: '#f7fafc',
        },
        grey: {
          50: '#fafbfc',
          100: '#f7fafc',
          200: '#edf2f7',
          300: '#e2e8f0',
          400: '#cbd5e0',
          500: '#a0aec0',
          600: '#718096',
          700: '#4a5568',
          800: '#2d3748',
          900: '#1a202c',
        },
      }
    : {
        // ダークモード - モノクロトーンで深みのあるパレット
        primary: {
          main: '#e2e8f0',
          light: '#f7fafc',
          dark: '#cbd5e0',
          contrastText: '#1a202c',
        },
        secondary: {
          main: '#a0aec0',
          light: '#cbd5e0',
          dark: '#718096',
          contrastText: '#1a202c',
        },
        background: {
          default: '#0d1117',
          paper: '#161b22',
        },
        text: {
          primary: '#f0f6fc',
          secondary: '#c9d1d9',
          disabled: '#8b949e',
        },
        divider: '#30363d',
        action: {
          active: '#e2e8f0',
          hover: 'rgba(226, 232, 240, 0.08)',
          selected: 'rgba(226, 232, 240, 0.12)',
          disabled: '#484f58',
          disabledBackground: '#21262d',
        },
        grey: {
          50: '#0d1117',
          100: '#161b22',
          200: '#21262d',
          300: '#30363d',
          400: '#484f58',
          500: '#656c76',
          600: '#8b949e',
          700: '#b1bac4',
          800: '#c9d1d9',
          900: '#f0f6fc',
        },
      }),
  error: {
    main: mode === 'light' ? '#d63031' : '#fd7979',
    light: mode === 'light' ? '#fab1a0' : '#fdcb6e',
    dark: mode === 'light' ? '#a4262c' : '#d63031',
  },
  warning: {
    main: mode === 'light' ? '#e17055' : '#fdcb6e',
    light: mode === 'light' ? '#fab1a0' : '#ffeaa7',
    dark: mode === 'light' ? '#b8431c' : '#e17055',
  },
  info: {
    main: mode === 'light' ? '#718096' : '#a0aec0',
    light: mode === 'light' ? '#a0aec0' : '#cbd5e0',
    dark: mode === 'light' ? '#4a5568' : '#718096',
  },
  success: {
    main: mode === 'light' ? '#34a853' : '#5fb85f',
    light: mode === 'light' ? '#7fd37f' : '#a4d65e',
    dark: mode === 'light' ? '#2e7d32' : '#34a853',
  },
});

// モノクロトーンでモダンなコンポーネントスタイル定義
const getComponents = (mode: PaletteMode): Components<Omit<Theme, 'components'>> => ({
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarWidth: 'thin',
        scrollbarColor: mode === 'light' ? '#cbd5e0 #f7fafc' : '#484f58 #161b22',
        '&::-webkit-scrollbar': {
          width: 8,
        },
        '&::-webkit-scrollbar-track': {
          background: mode === 'light' ? '#f7fafc' : '#161b22',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: mode === 'light' ? '#cbd5e0' : '#484f58',
          borderRadius: 4,
          '&:hover': {
            backgroundColor: mode === 'light' ? '#a0aec0' : '#656c76',
          },
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '0.875rem',
        padding: '8px 20px',
        boxShadow: 'none',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: mode === 'light' 
            ? '0 2px 8px rgba(45, 55, 72, 0.15)' 
            : '0 2px 8px rgba(0, 0, 0, 0.3)',
        },
      },
      contained: {
        background: mode === 'light'
          ? '#2d3748'
          : '#e2e8f0',
        color: mode === 'light' ? '#ffffff' : '#1a202c',
        '&:hover': {
          background: mode === 'light'
            ? '#1a202c'
            : '#f7fafc',
        },
      },
      outlined: {
        borderWidth: 1,
        borderColor: mode === 'light' ? '#2d3748' : '#e2e8f0',
        color: mode === 'light' ? '#2d3748' : '#e2e8f0',
        '&:hover': {
          borderWidth: 1,
          backgroundColor: mode === 'light' ? 'rgba(45, 55, 72, 0.08)' : 'rgba(226, 232, 240, 0.08)',
        },
      },
      text: {
        color: mode === 'light' ? '#2d3748' : '#e2e8f0',
        '&:hover': {
          backgroundColor: mode === 'light' ? 'rgba(45, 55, 72, 0.08)' : 'rgba(226, 232, 240, 0.08)',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        background: mode === 'light'
          ? '#ffffff'
          : '#161b22',
        border: `1px solid ${mode === 'light' ? '#e2e8f0' : '#30363d'}`,
        boxShadow: mode === 'light'
          ? '0 1px 3px rgba(0, 0, 0, 0.1)'
          : '0 1px 3px rgba(0, 0, 0, 0.5)',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: mode === 'light'
            ? '0 4px 12px rgba(0, 0, 0, 0.15)'
            : '0 4px 12px rgba(0, 0, 0, 0.6)',
          border: `1px solid ${mode === 'light' ? '#cbd5e0' : '#484f58'}`,
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        background: mode === 'light'
          ? '#ffffff'
          : '#161b22',
        border: `1px solid ${mode === 'light' ? '#e2e8f0' : '#30363d'}`,
      },
      elevation1: {
        boxShadow: mode === 'light'
          ? '0 1px 3px rgba(0, 0, 0, 0.1)'
          : '0 1px 3px rgba(0, 0, 0, 0.5)',
      },
      elevation2: {
        boxShadow: mode === 'light'
          ? '0 2px 6px rgba(0, 0, 0, 0.15)'
          : '0 2px 6px rgba(0, 0, 0, 0.6)',
      },
    },
  },
  MuiContainer: {
    styleOverrides: {
      root: {
        // スマホでは左右余白を最小限に
        paddingLeft: 12,
        paddingRight: 12,
        '@media (min-width: 600px)': {
          paddingLeft: 24,
          paddingRight: 24,
        },
        '@media (min-width: 900px)': {
          paddingLeft: 32,
          paddingRight: 32,
        },
      },
    },
  },
  MuiTypography: {
    styleOverrides: {
      h1: {
        fontSize: '3rem',
        fontWeight: 800,
        lineHeight: 1.2,
        marginBottom: '2rem',
        color: mode === 'light' ? '#1a202c' : '#f0f6fc',
        letterSpacing: '-0.02em',
        '@media (max-width: 768px)': {
          fontSize: '2.5rem',
        },
      },
      h2: {
        fontSize: '2.25rem',
        fontWeight: 700,
        lineHeight: 1.3,
        marginBottom: '1.5rem',
        color: mode === 'light' ? '#1a202c' : '#f0f6fc',
        letterSpacing: '-0.01em',
        '@media (max-width: 768px)': {
          fontSize: '1.875rem',
        },
      },
      h3: {
        fontSize: '1.875rem',
        fontWeight: 600,
        lineHeight: 1.4,
        marginBottom: '1rem',
        color: mode === 'light' ? '#2d3748' : '#e2e8f0',
        letterSpacing: '-0.01em',
        '@media (max-width: 768px)': {
          fontSize: '1.5rem',
        },
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
        marginBottom: '0.75rem',
        color: mode === 'light' ? '#2d3748' : '#e2e8f0',
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.5,
        marginBottom: '0.5rem',
        color: mode === 'light' ? '#4a5568' : '#c9d1d9',
      },
      h6: {
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.5,
        marginBottom: '0.5rem',
        color: mode === 'light' ? '#4a5568' : '#c9d1d9',
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.7,
        fontWeight: 400,
        color: mode === 'light' ? '#4a5568' : '#c9d1d9',
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
        fontWeight: 400,
        color: mode === 'light' ? '#718096' : '#8b949e',
      },
      caption: {
        fontSize: '0.75rem',
        lineHeight: 1.5,
        fontWeight: 500,
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
        color: mode === 'light' ? '#a0aec0' : '#656c76',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        fontWeight: 500,
        fontSize: '0.75rem',
        height: 28,
        padding: '0 10px',
        transition: 'all 0.2s ease',
      },
      filled: {
        background: mode === 'light'
          ? '#f7fafc'
          : '#21262d',
        color: mode === 'light' ? '#4a5568' : '#c9d1d9',
        border: `1px solid ${mode === 'light' ? '#e2e8f0' : '#30363d'}`,
        '&:hover': {
          background: mode === 'light'
            ? '#edf2f7'
            : '#30363d',
        },
      },
      outlined: {
        borderColor: mode === 'light' ? '#e2e8f0' : '#30363d',
        color: mode === 'light' ? '#4a5568' : '#c9d1d9',
        borderWidth: 1,
        '&:hover': {
          backgroundColor: mode === 'light' ? 'rgba(45, 55, 72, 0.08)' : 'rgba(226, 232, 240, 0.08)',
        },
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: 8,
        transition: 'all 0.2s ease',
        color: mode === 'light' ? '#4a5568' : '#c9d1d9',
        '&:hover': {
          backgroundColor: mode === 'light' ? 'rgba(45, 55, 72, 0.08)' : 'rgba(226, 232, 240, 0.08)',
        },
      },
    },
  },
  MuiLink: {
    styleOverrides: {
      root: {
        color: mode === 'light' ? '#2d3748' : '#e2e8f0',
        textDecoration: 'none',
        fontWeight: 500,
        transition: 'all 0.2s ease',
        '&:hover': {
          color: mode === 'light' ? '#1a202c' : '#f7fafc',
          textDecoration: 'underline',
        },
      },
    },
  },
  MuiPaginationItem: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 500,
        transition: 'all 0.2s ease',
        color: mode === 'light' ? '#4a5568' : '#c9d1d9',
      },
      outlined: {
        borderColor: mode === 'light' ? '#e2e8f0' : '#30363d',
        '&:hover': {
          borderColor: mode === 'light' ? '#2d3748' : '#e2e8f0',
          backgroundColor: mode === 'light' ? 'rgba(45, 55, 72, 0.08)' : 'rgba(226, 232, 240, 0.08)',
        },
      },
      page: {
        '&.Mui-selected': {
          background: mode === 'light' ? '#2d3748' : '#e2e8f0',
          color: mode === 'light' ? '#ffffff' : '#1a202c',
          '&:hover': {
            background: mode === 'light' ? '#1a202c' : '#f7fafc',
          },
        },
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: mode === 'light' ? '#e2e8f0' : '#30363d',
        opacity: 1,
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        background: mode === 'light'
          ? 'rgba(255, 255, 255, 0.95)'
          : 'rgba(22, 27, 34, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${mode === 'light' ? '#e2e8f0' : '#30363d'}`,
        boxShadow: 'none',
      },
    },
  },
});

// テーマ生成関数
export const createAppTheme = (mode: PaletteMode) => {
  // テーマの作成
  let theme = createTheme({
    palette: getDesignTokens(mode),
    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
    },
    shape: {
      borderRadius: 8,
    },
    spacing: 8,
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
      easing: {
        easeInOut: 'ease',
        easeOut: 'ease-out',
        easeIn: 'ease-in',
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
    },
    components: getComponents(mode),
  });

  // レスポンシブフォントサイズを適用
  theme = responsiveFontSizes(theme, {
    breakpoints: ['sm', 'md', 'lg'],
    factor: 1.5,
  });

  return theme;
};

// デフォルトテーマ（モノクロトーンのダークモードとライトモード）
export const darkTheme = createAppTheme('dark');
export const lightTheme = createAppTheme('light');

export default darkTheme; // デフォルトはダークテーマ
