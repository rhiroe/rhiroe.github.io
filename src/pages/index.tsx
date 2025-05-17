import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { Box, Container, Typography, Grid, Card, CardContent } from '~/components/common'
import { useEffect, useState } from 'react'

const Home: NextPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <Box component="div">
      <Head>
        <title>Ryosuke Hiroe</title>
        <meta name="description" content="My page." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h1" className="gradient-title">
            Ryosuke Hiroe
          </Typography>
          <Typography
            variant="h2"
            sx={{  color: 'rgba(255, 255, 255, 0.7)',
                   fontSize: '1.25rem',
                   fontWeight: '400',
                   letterSpacing: '0.02em',
                   opacity: '0',
                   animation: 'fadeIn 1s ease-out forwards 0.3s'  }}
          >
            ソフトウェアエンジニア
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card>
              <Link href="/blog">
                <CardContent>
                  <Typography
                    variant="h4"
                    component="h4"
                    className="card-title"
                  >
                    Blog
                  </Typography>
                  <Typography
                    variant="body2"
                    className="card-description"
                  >
                    プログラミングの話とか
                  </Typography>
                </CardContent>
              </Link>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card>
              <Link href="/profile">
                <CardContent>
                  <Typography
                    variant="h4"
                    component="h4"
                    className="card-title"
                  >
                    Profile
                  </Typography>
                  <Typography
                    variant="body2"
                    className="card-description"
                  >
                    職務経歴とか
                  </Typography>
                </CardContent>
              </Link>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Home
