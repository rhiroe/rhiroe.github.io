import '~/styles/globals.css'
import type { AppProps } from 'next/app'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Container, Box, Typography, IconButton, Button, ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub'
import XIcon from '@mui/icons-material/X'
import HomeIcon from '@mui/icons-material/Home';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#1a1a2e',
      paper: '#16213e',
    },
    primary: {
      main: '#4da3ff',
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isHomePage = router.pathname === '/';

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(135deg, ${darkTheme.palette.background.default} 0%, ${darkTheme.palette.background.paper} 100%)`,
      }}
    >
      <Box sx={{ minHeight: '100vh',
                 background: `linear-gradient(135deg, ${darkTheme.palette.background.default} 0%, ${darkTheme.palette.background.paper} 100%)`,
                 overflow: 'hidden',
                 display: 'flex',
                 alignItems: 'center',
                 flex: 1
                 }}>
        <Container maxWidth="md">
          <Component {...pageProps} />
        </Container>
      </Box>
      <Box
        component="footer"
        sx={{
          width: '100%',
          py: 4,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {!isHomePage && (
              <Link href="/" style={{ textDecoration: 'none' }} passHref>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.2,
                    mb: 1,
                    textDecoration: 'none',
                    color: 'text.secondary',
                    transition: 'color 0.3s',
                    '&:hover': {
                      color: 'text.primary',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  <HomeIcon sx={{ verticalAlign: 'middle', fontSize: 20 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'inherit',
                      fontSize: '0.8rem',
                      fontWeight: 400,
                      mb: 0,
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
                  color: 'text.secondary',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: 'text.primary',
                    transform: 'translateY(-2px)',
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
                  color: 'text.secondary',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: 'text.primary',
                    transform: 'translateY(-2px)',
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
                  color: 'text.secondary',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: 'text.primary',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <XIcon />
              </IconButton>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.875rem',
                fontWeight: 400,
              }}
            >
              © 2022 - {new Date().getFullYear()} rhiroe
            </Typography>
          </Box>
        </Container>
      </Box>
      </Box>
    </ThemeProvider>
  )
}

export default MyApp
