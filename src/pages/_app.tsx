import '~/styles/globals.css'
import type { AppProps } from 'next/app'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Container, Box, Typography, IconButton, Button } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub'
import XIcon from '@mui/icons-material/X'
import HomeIcon from '@mui/icons-material/Home';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeProvider, useThemeContext } from '../theme/ThemeContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </ThemeProvider>
  );
}

// テーマ切り替えボタンを含むレイアウトコンポーネント
function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isHomePage = router.pathname === '/';
  const { mode, toggleColorMode } = useThemeContext();
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: (theme) => theme.palette.mode === 'light'
          ? 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)'
          : 'linear-gradient(135deg, #1a1d23 0%, #2d3039 50%, #3a3d47 100%)',
      }}
    >
      {/* テーマ切り替えボタン */}
      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 1300,
        }}
      >
        <IconButton 
          onClick={toggleColorMode} 
          aria-label="テーマの切り替え"
          sx={{
            width: 56,
            height: 56,
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.palette.mode === 'light'
              ? '0 4px 16px rgba(45, 55, 72, 0.08)'
              : '0 4px 16px rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(20px)',
            border: (theme) => `1px solid ${theme.palette.mode === 'light' 
              ? 'rgba(203, 213, 224, 0.4)' 
              : 'rgba(74, 85, 104, 0.4)'}`,
            color: 'text.secondary',
            borderRadius: 2,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: (theme) => theme.palette.mode === 'light'
                ? '0 8px 24px rgba(45, 55, 72, 0.12)'
                : '0 8px 24px rgba(0, 0, 0, 0.5)',
              color: 'primary.main',
              bgcolor: 'action.hover',
            }
          }}
        >
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
      
      {/* メインコンテンツ */}
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        py: { xs: 4, sm: 6, md: 8 }
      }}>
        <Container 
          maxWidth="md"
          sx={{
            px: { xs: 1, sm: 2, md: 3 }
          }}
        >
          {children}
        </Container>
      </Box>
      
      {/* フッター */}
      <Box
        component="footer"
        sx={{
          width: '100%',
          py: 6,
          mt: 'auto',
          background: 'action.hover',
          backdropFilter: 'blur(20px)',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}
          >
            {!isHomePage && (
              <Link href="/" style={{ textDecoration: 'none' }} passHref>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 2,
                    borderRadius: 2,
                    textDecoration: 'none',
                    color: 'text.secondary',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'action.hover',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <HomeIcon />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                    }}
                  >
                    ホームに戻る
                  </Typography>
                </Box>
              </Link>
            )}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton
                aria-label="email"
                href="mailto:ride.poke@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  width: 48,
                  height: 48,
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                <EmailIcon />
              </IconButton>
              <IconButton
                aria-label="github"
                href="https://github.com/rhiroe"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  width: 48,
                  height: 48,
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                <GitHubIcon />
              </IconButton>
              <IconButton
                aria-label="twitter"
                href="https://x.com/buta_botti"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  width: 48,
                  height: 48,
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                <XIcon />
              </IconButton>
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                textAlign: 'center',
              }}
            >
              © 2022 - {new Date().getFullYear()} rhiroe. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default MyApp;
