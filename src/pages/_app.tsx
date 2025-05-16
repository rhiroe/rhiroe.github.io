import '~/styles/globals.css'
import type { AppProps } from 'next/app'
import Link from 'next/link';
import { useRouter } from 'next/router'; // useRouter をインポート
import { Container, Box, Typography, IconButton, Button } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'; // EmailIcon をインポート
import GitHubIcon from '@mui/icons-material/GitHub'
import XIcon from '@mui/icons-material/X'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter(); // useRouter を使用
  const isHomePage = router.pathname === '/';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      }}
    >
      <Box sx={{ minHeight: '100vh',
                 background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
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
            {!isHomePage && ( // トップページでない場合のみ表示
              <Link href="/" passHref>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    '&:hover': {
                      color: 'rgba(255, 255, 255, 0.8)',
                      textDecoration: 'underline',
                    },
                    marginBottom: 1, // ソーシャルアイコンとの間にマージンを追加
                  }}
                >
                  トップへ戻る
                </Typography>
              </Link>
            )}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton
                aria-label="email"
                href="mailto:ride.poke@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#fff',
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
                  color: 'rgba(255, 255, 255, 0.7)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#fff',
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
                  color: 'rgba(255, 255, 255, 0.7)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#fff',
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
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.875rem',
                fontWeight: 400,
              }}
            >
              © 2024 rhiroe
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default MyApp
