import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Box, Typography, Grid, Card, CardContent } from '~/components/common'

function Home() {
  return (
    <Box component="div">
      <Helmet>
        <title>rhiroe</title>
        <meta name="description" content="My page." />
      </Helmet>

      <Box
        sx={{
          textAlign: 'center',
          maxWidth: 'md',
          mx: 'auto',
          px: { xs: 1.5, sm: 2, md: 3 },
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h1"
            sx={{
              color: 'text.primary',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 800,
              letterSpacing: '-0.02em',
              mb: 2,
              opacity: 0,
              animation: 'fadeIn 1s ease-out forwards',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '3px',
                background: (theme) =>
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[800]
                    : theme.palette.grey[300],
                borderRadius: '2px',
              },
            }}
          >
            rhiroe
          </Typography>
          <Typography
            variant="h2"
            sx={{
              color: 'text.secondary',
              fontSize: '1.25rem',
              fontWeight: 400,
              letterSpacing: '0.02em',
              opacity: 0,
              animation: 'fadeIn 1s ease-out forwards 0.3s',
              mt: 3,
            }}
          >
            ソフトウェアエンジニア
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card
              sx={{
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'light'
                      ? '0 8px 25px rgba(0, 0, 0, 0.15)'
                      : '0 8px 25px rgba(0, 0, 0, 0.6)',
                },
                opacity: 0,
                animation: 'fadeIn 1s ease-out forwards 0.6s',
              }}
            >
              <Link to="/blog" style={{ textDecoration: 'none', color: 'inherit' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h4"
                    component="h4"
                    sx={{
                      color: 'text.primary',
                      fontWeight: 600,
                      mb: 2,
                      fontSize: '1.5rem',
                    }}
                  >
                    📝 Blog
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6,
                    }}
                  >
                    技術的な学びや日々の気づきを記録しています
                  </Typography>
                </CardContent>
              </Link>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card
              sx={{
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'light'
                      ? '0 8px 25px rgba(0, 0, 0, 0.15)'
                      : '0 8px 25px rgba(0, 0, 0, 0.6)',
                },
                opacity: 0,
                animation: 'fadeIn 1s ease-out forwards 0.9s',
              }}
            >
              <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h4"
                    component="h4"
                    sx={{
                      color: 'text.primary',
                      fontWeight: 600,
                      mb: 2,
                      fontSize: '1.5rem',
                    }}
                  >
                    👤 Profile
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6,
                    }}
                  >
                    経歴やスキル、これまでの取り組みについて
                  </Typography>
                </CardContent>
              </Link>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card
              sx={{
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'light'
                      ? '0 8px 25px rgba(0, 0, 0, 0.15)'
                      : '0 8px 25px rgba(0, 0, 0, 0.6)',
                },
                opacity: 0,
                animation: 'fadeIn 1s ease-out forwards 1.2s',
              }}
            >
              <Link to="/presentations" style={{ textDecoration: 'none', color: 'inherit' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h4"
                    component="h4"
                    sx={{
                      color: 'text.primary',
                      fontWeight: 600,
                      mb: 2,
                      fontSize: '1.5rem',
                    }}
                  >
                    🎤 Presentations
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6,
                    }}
                  >
                    これまでに発表したプレゼンテーション資料
                  </Typography>
                </CardContent>
              </Link>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default Home
