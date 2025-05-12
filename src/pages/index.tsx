import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { Box, Container, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Octokit } from '@octokit/rest'

const Card = ({ href, title, description, index }: { href: string; title: string; description: string; index: number }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Box
      component="div"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        opacity: 0,
        animation: 'fadeSlideIn 0.6s ease-out forwards',
        animationDelay: `${index * 0.15}s`,
        '@keyframes fadeSlideIn': {
          from: {
            opacity: 0,
            transform: 'translateY(20px)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
    >
      <Link href={href} style={{ textDecoration: 'none' }}>
        <Box
          sx={{
            padding: '1.5rem',
            background: isHovered ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            mb: 2,
            border: '1px solid',
            borderColor: isHovered ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              transform: 'translateY(-4px)',
            },
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            sx={{
              color: '#fff',
              fontSize: '1.75rem',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              mb: 1,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1rem',
            }}
          >
            {description}
          </Typography>
        </Box>
      </Link>
    </Box>
  )
}

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

      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', py: 8 }}>
          <Box
            sx={{
              textAlign: 'center',
              mb: 8,
            }}
          >
            <Typography
              variant="h1"
              sx={{
                color: '#fff',
                fontSize: { xs: '2rem', md: '3.5rem' },
                fontWeight: 700,
                letterSpacing: '-0.03em',
                mb: 2,
                opacity: 0,
                animation: 'fadeIn 1s ease-out forwards',
                '@keyframes fadeIn': {
                  from: { opacity: 0, transform: 'translateY(-20px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              Ryosuke Hiroe
            </Typography>
            <Typography
              variant="h2"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: { xs: '1rem', md: '1.25rem' },
                fontWeight: 400,
                letterSpacing: '0.02em',
                opacity: 0,
                animation: 'fadeIn 1s ease-out forwards 0.3s',
              }}
            >
              ソフトウェアエンジニア
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 3,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Card
              href="/blog"
              title="Blog"
              description="プログラミングの話とか"
              index={0}
            />
            <Card
              href="https://gist.github.com/rhiroe/62a5f0dbd9c44bbf539f6effc4ef5514"
              title="Profile"
              description="職務経歴とか"
              index={1}
            />
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default Home
