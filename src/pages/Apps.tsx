import { Helmet } from '@dr.pogodin/react-helmet'
import { Box, Typography, Grid, Card, CardContent } from '~/components/common'

type App = {
  name: string
  description: string
  icon: string
  url: string
  platform: string
}

const apps: App[] = [
  {
    name: 'osaifu',
    description: '.pkpass ファイルを Android で管理できるウォレットアプリ。',
    icon: '💳',
    url: 'https://rhiroe.github.io/osaifu/',
    platform: 'Android',
  },
]

function Apps() {
  return (
    <Box component="div">
      <Helmet>
        <title>Apps - rhiroe</title>
        <meta name="description" content="rhiroe が開発したアプリケーション一覧" />
      </Helmet>

      <Box
        sx={{
          maxWidth: 'md',
          mx: 'auto',
          px: { xs: 1.5, sm: 2, md: 3 },
        }}
      >
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              color: 'text.primary',
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 800,
              letterSpacing: '-0.02em',
              mb: 2,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-8px',
                left: '0',
                width: '48px',
                height: '3px',
                background: (theme) =>
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[800]
                    : theme.palette.grey[300],
                borderRadius: '2px',
              },
            }}
          >
            📱 Apps
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              mt: 4,
              lineHeight: 1.7,
            }}
          >
            自作のアプリケーションを紹介します。
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {apps.map((app) => (
            <Grid key={app.name} size={{ xs: 12, sm: 6 }}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'box-shadow 0.2s',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: (theme) =>
                      theme.palette.mode === 'light'
                        ? '0 8px 25px rgba(0, 0, 0, 0.15)'
                        : '0 8px 25px rgba(0, 0, 0, 0.6)',
                  },
                }}
              >
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h4"
                      component="h3"
                      sx={{
                        color: 'text.primary',
                        fontWeight: 600,
                        mb: 1,
                        fontSize: '1.5rem',
                      }}
                    >
                      {app.icon} {app.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        display: 'inline-block',
                        mb: 2,
                        px: 1.2,
                        py: 0.4,
                        borderRadius: 1,
                        bgcolor: 'action.hover',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {app.platform}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.6,
                      }}
                    >
                      {app.description}
                    </Typography>
                  </CardContent>
                </a>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}

export default Apps
