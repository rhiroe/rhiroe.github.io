import { Helmet } from '@dr.pogodin/react-helmet'
import { useParams, Link as RouterLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getPostBySlug } from '~/lib/postsApi'
import markdownToHtml from '~/lib/markdownToHtml'
import XIcon from '@mui/icons-material/X'
import { Box, InnerContainer, Typography, GlassPaper, Button } from '~/components/common'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { MermaidViewer } from '~/components/blog/MermaidViewer'

interface Post {
  slug: string
  title: string
  date: string
  content: string
  excerpt?: string
}

function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const location = useLocation()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return

    const loadPost = async () => {
      try {
        const postData = await getPostBySlug(slug, ['slug', 'title', 'date', 'content', 'excerpt'])
        // Extract front matter from markdown content
        const lines = postData.content.split('\n')
        let contentStart = 0
        if (lines[0] === '---') {
          const endIndex = lines.findIndex((line, i) => i > 0 && line === '---')
          if (endIndex > 0) {
            contentStart = endIndex + 1
          }
        }
        const markdownContent = lines.slice(contentStart).join('\n')
        const content = await markdownToHtml(markdownContent)
        setPost({
          ...postData,
          content,
        })
      } catch (error) {
        console.error('Failed to load post:', error)
        setPost(null)
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [slug])

  if (loading) {
    return (
      <InnerContainer>
        <Typography>読み込み中...</Typography>
      </InnerContainer>
    )
  }

  if (!post) {
    return (
      <InnerContainer>
        <Typography>記事が見つかりませんでした</Typography>
      </InnerContainer>
    )
  }

  return (
    <>
      <Helmet>
        <title>{post.title}</title>
        <meta name="description" content={post.excerpt} />

        {/* RSS・Atomフィードリンク */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="rhiroe.github.io RSS Feed"
          href="/feeds/rss.xml"
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="rhiroe.github.io Atom Feed"
          href="/feeds/atom.xml"
        />

        {/* OGP Tags */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={`https://rhiroe.github.io${location.pathname}`} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="rhiroe.github.io" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@rhiroe" />
      </Helmet>
      <InnerContainer>
        <RouterLink to="/blog" style={{ textDecoration: 'none' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            sx={{
              marginTop: '1rem',
              marginBottom: '2rem',
              color: 'text.primary',
              borderColor: 'primary.main',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                borderColor: 'primary.light',
                backgroundColor: 'action.hover',
                transform: 'translateY(-1px)',
              },
            }}
          >
            記事一覧へ戻る
          </Button>
        </RouterLink>

        <GlassPaper
          sx={{
            padding: { xs: '1rem', sm: '1.5rem', md: '2rem' },
            borderRadius: '1rem',
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              textAlign: 'center',
              marginBottom: '1rem',
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {post.title}
          </Typography>

          <Typography
            sx={{
              color: 'text.secondary',
              textAlign: 'right',
              marginBottom: '2rem',
            }}
          >
            {new Date(post.date).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            })}
          </Typography>

          <Box className="markdown">
            <MermaidViewer content={post.content} />
          </Box>
        </GlassPaper>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              post.title + '\n'
            )}&url=${encodeURIComponent(`https://rhiroe.github.io${location.pathname}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <Button
              variant="contained"
              startIcon={<XIcon />}
              sx={{
                marginBottom: '1rem',
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                borderRadius: '24px',
                padding: '10px 20px',
                textTransform: 'none',
                fontWeight: 600,
                border: (theme) => `1px solid ${theme.palette.primary.light}`,
                boxShadow: (theme) =>
                  theme.palette.mode === 'light'
                    ? '0 4px 12px rgba(102, 126, 234, 0.25)'
                    : '0 4px 12px rgba(144, 205, 244, 0.25)',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  transform: 'translateY(-2px)',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'light'
                      ? '0 6px 16px rgba(102, 126, 234, 0.35)'
                      : '0 6px 16px rgba(144, 205, 244, 0.35)',
                },
              }}
            >
              Share
            </Button>
          </a>
        </Box>
      </InnerContainer>
    </>
  )
}

export default BlogPost
