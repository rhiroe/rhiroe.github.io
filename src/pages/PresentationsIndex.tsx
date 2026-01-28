import { Helmet } from 'react-helmet-async'
import { useEffect, useState } from 'react'
import { Box, Container, Typography } from '~/components/common'
import { getAllPresentations, type Presentation } from '~/lib/presentationsApi'

function PresentationsIndex() {
  const [presentations, setPresentations] = useState<Presentation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllPresentations()
      .then(data => {
        setPresentations(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Failed to load presentations:', error)
        setLoading(false)
      })
  }, [])

  return (
    <Box component="div">
      <Helmet>
        <title>プレゼンテーション一覧 | rhiroe</title>
        <meta name="description" content="技術発表資料のコレクション" />
      </Helmet>

      <Box
        sx={{
          minHeight: '100vh',
          py: { xs: 5, md: 8 },
          px: { xs: 2.5, md: 5 },
        }}
      >
        <Container maxWidth="xl">
          {/* Header */}
          <Box
            sx={{
              textAlign: 'center',
              mb: { xs: 6, md: 8 },
            }}
          >
            <Typography
              variant="h1"
              sx={{
                color: 'text.primary',
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 700,
                mb: 1.5,
                opacity: 0,
                animation: 'fadeIn 1s ease-out forwards',
                '@keyframes fadeIn': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(-20px)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              プレゼンテーション一覧
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '1rem', md: '1.2rem' },
              }}
            >
              技術発表資料のコレクション
            </Typography>
          </Box>

          {/* Presentations Grid */}
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography>読み込み中...</Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(auto-fill, minmax(500px, 1fr))',
              },
              gap: { xs: 4, md: 5 },
              py: 2.5,
            }}
          >
            {presentations.map((presentation) => (
              <a
                key={presentation.id}
                href={presentation.path}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    background: 'background.paper',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: (theme) =>
                      theme.palette.mode === 'light'
                        ? '0 2px 8px rgba(0, 0, 0, 0.1)'
                        : '0 2px 8px rgba(0, 0, 0, 0.4)',
                    transition: 'all 0.2s ease',
                    aspectRatio: '16 / 9',
                    display: 'block',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: (theme) =>
                        theme.palette.mode === 'light'
                          ? '0 8px 25px rgba(0, 0, 0, 0.15)'
                          : '0 8px 25px rgba(0, 0, 0, 0.6)',
                      '& .card-overlay': {
                        background: 'rgba(0, 0, 0, 0.2)',
                      },
                      '& .play-icon': {
                        opacity: 1,
                        transform: 'scale(1)',
                      },
                    },
                  }}
                >
                  {/* Card Thumbnail */}
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      overflow: 'hidden',
                      background: (theme) =>
                        theme.palette.mode === 'light'
                          ? theme.palette.grey[100]
                          : theme.palette.grey[900],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <iframe
                      src={presentation.path}
                      scrolling="no"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '100%',
                        height: '100%',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                        border: 'none',
                      }}
                    />

                    {/* Card Overlay */}
                    <Box
                      className="card-overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0)',
                        transition: 'background 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {/* Play Icon */}
                      <Box
                        className="play-icon"
                        sx={{
                          width: { xs: '70px', md: '90px' },
                          height: { xs: '70px', md: '90px' },
                          background: 'background.paper',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transform: 'scale(0.8)',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                          '&::after': {
                            content: '""',
                            width: 0,
                            height: 0,
                            borderLeft: (theme) => ({
                              xs: `20px solid ${theme.palette.text.primary}`,
                              md: `24px solid ${theme.palette.text.primary}`,
                            }),
                            borderTop: { xs: '12px solid transparent', md: '15px solid transparent' },
                            borderBottom: {
                              xs: '12px solid transparent',
                              md: '15px solid transparent',
                            },
                            marginLeft: { xs: '5px', md: '6px' },
                          },
                        }}
                      >
                        {null}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </a>
            ))}
          </Box>
          )}
        </Container>
      </Box>
    </Box>
  )
}

export default PresentationsIndex
