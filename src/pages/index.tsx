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

const SkillsChart = () => {
  const [skillsData, setSkillsData] = useState<Array<{ language: string; value: number; percentage: number }>>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const fetchGitHubData = async () => {
      const octokit = new Octokit({
        auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN
      })
      try {
        const repos = await octokit.paginate(octokit.repos.listForUser, {
          username: 'rhiroe',
          per_page: 100,
          sort: 'updated'
        });

        const languages: { [key: string]: { size: number; stars: number; forks: number } } = {};
        const repoPromises = repos.filter(repo => !repo.fork).map(async repo => {
          const langResponse = await octokit.repos.listLanguages({
            owner: 'rhiroe',
            repo: repo.name
          });

          const totalSize = Object.values(langResponse.data).reduce((a, b) => a + b, 0);
          Object.entries(langResponse.data).forEach(([lang, bytes]) => {
            if (!languages[lang]) {
              languages[lang] = { size: 0, stars: 0, forks: 0 };
            }
            const percentage = bytes / totalSize;
            languages[lang].size += bytes * percentage;
            languages[lang].stars += (repo.stargazers_count || 0) * percentage;
            languages[lang].forks += (repo.forks_count || 0) * percentage;
          });
        });

        await Promise.all(repoPromises);

        const maxValues = {
          size: Math.max(...Object.values(languages).map(l => l.size)),
          stars: Math.max(...Object.values(languages).map(l => l.stars)),
          forks: Math.max(...Object.values(languages).map(l => l.forks))
        };

        const calculateScore = (lang: typeof languages[string]) => {
          const sizeScore = lang.size / maxValues.size * 100;
          const starsScore = (lang.stars / maxValues.stars || 0) * 100;
          const forksScore = (lang.forks / maxValues.forks || 0) * 100;
          return (sizeScore * 0.4) + (starsScore * 0.4) + (forksScore * 0.2);
        };

        const totalScore = Object.values(languages).reduce((acc, lang) => acc + calculateScore(lang), 0);

        const topLanguages = Object.entries(languages)
          .map(([name, data]) => ({
            language: name,
            value: calculateScore(data),
            percentage: (calculateScore(data) / totalScore) * 100
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5)

        setSkillsData(topLanguages)
      } catch (error) {
        console.error('Error fetching GitHub data:', error)
      }
    }

    if (isClient) {
      fetchGitHubData()
    }
  }, [isClient])

  if (!isClient) return null

  return (
    <Box
      sx={{
        width: '100%',
        height: 300,
        opacity: 0,
        animation: 'fadeIn 1s ease-out forwards 0.6s',
      }}
    >
      <ResponsiveContainer>
        <BarChart data={skillsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="hoverGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
          <XAxis
            dataKey="language"
            tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 13, fontWeight: 500 }}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 13 }}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
            tickLine={false}
            label={{
              value: '',
              angle: -90,
              position: 'insideLeft',
              fill: 'rgba(255, 255, 255, 0.8)',
              style: {
                textAnchor: 'middle',
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '0.05em'
              }
            }}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              color: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              padding: '8px 12px',
              fontSize: '0.875rem'
            }}
            formatter={(value: any) => [`${Number(value).toFixed(1)}`, '言語スコア']}
          />
          <Bar
            dataKey="value"
            fill="url(#colorGradient)"
            name="言語スコア"
            radius={[4, 4, 0, 0]}
            animationDuration={2000}
            animationEasing="ease-in-out"
            onMouseEnter={(data, index) => {
              document.querySelector(`path[name="言語スコア-${index}"]`)?.setAttribute('fill', 'url(#hoverGradient)');
            }}
            onMouseLeave={(data, index) => {
              document.querySelector(`path[name="言語スコア-${index}"]`)?.setAttribute('fill', 'url(#colorGradient)');
            }}
          />
        </BarChart>
      </ResponsiveContainer>
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

          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                color: '#fff',
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontWeight: 600,
                letterSpacing: '-0.02em',
                mb: 3,
                textAlign: 'center',
                opacity: 0,
                animation: 'fadeIn 1s ease-out forwards 0.4s',
              }}
            >
              言語別スコア
            </Typography>
            <SkillsChart />
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
