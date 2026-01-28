import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { getAllPosts, type Post } from '~/lib/postsApi'
import { InnerContainer } from '~/components/common'
import { BlogList } from '~/components/blog/BlogList'
import { Pagination } from '~/components/blog/Pagination'

const POSTS_PER_PAGE = 5

function BlogIndex() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllPosts(['slug', 'title', 'date', 'tags', 'excerpt'])
      .then(posts => {
        setAllPosts(posts)
        setLoading(false)
      })
      .catch(error => {
        console.error('Failed to load posts:', error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const page = Number(searchParams.get('page')) || 1
    setCurrentPage(page)
  }, [searchParams])

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const paginatedPosts = allPosts.slice(startIndex, endIndex)

  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE)

  const handlePageChange = useCallback(
    (page: number) => {
      if (page !== currentPage) {
        setSearchParams({ page: page.toString() })
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }
    },
    [currentPage, setSearchParams]
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && currentPage > 1) {
        handlePageChange(currentPage - 1)
      } else if (event.key === 'ArrowRight' && currentPage < totalPages) {
        handlePageChange(currentPage + 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentPage, totalPages, handlePageChange])

  return (
    <>
      <Helmet>
        <title>rhiroeのブログ</title>
        <meta name="description" content="rhiroeのブログ" />

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
      </Helmet>

      <InnerContainer sx={{ padding: '2rem' }}>
        {loading ? (
          <div>読み込み中...</div>
        ) : (
          <>
            <BlogList posts={paginatedPosts} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        )}
      </InnerContainer>
    </>
  )
}

export default BlogIndex
