import { Helmet } from 'react-helmet-async'
import { useEffect, useState } from 'react'
import markdownToHtml from '~/lib/markdownToHtml'
import { Box, InnerContainer, GlassPaper, Typography } from '~/components/common'

function Profile() {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/content/profile/resume.md')
        const markdown = await response.text()
        const html = await markdownToHtml(markdown)
        setContent(html)
      } catch (error) {
        console.error('Failed to load profile:', error)
        setContent('<p>プロフィールの読み込みに失敗しました</p>')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  if (loading) {
    return (
      <InnerContainer>
        <Typography>読み込み中...</Typography>
      </InnerContainer>
    )
  }

  return (
    <>
      <Helmet>
        <title>プロフィール - rhiroe.github.io</title>
        <meta name="description" content="廣江 亮佑のプロフィール" />

        {/* OGP Tags */}
        <meta property="og:title" content="プロフィール - rhiroe.github.io" />
        <meta property="og:description" content="廣江 亮佑のプロフィール" />
        <meta property="og:url" content="https://rhiroe.github.io/profile" />
        <meta property="og:type" content="profile" />
        <meta property="og:site_name" content="rhiroe.github.io" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@rhiroe" />
      </Helmet>

      <InnerContainer>
        <GlassPaper
          elevation={0}
          sx={{
            padding: { xs: '1rem', sm: '1.5rem', md: '2rem' },
            borderRadius: '1rem',
          }}
        >
          <Typography
            variant="h1"
            sx={{
              textAlign: 'center',
              marginBottom: '2rem',
            }}
          >
            Profile
          </Typography>

          <Box className="markdown">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </Box>
        </GlassPaper>
      </InnerContainer>
    </>
  )
}

export default Profile
