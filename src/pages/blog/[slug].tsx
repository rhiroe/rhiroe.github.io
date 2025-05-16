import { NextPage, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Head from "next/head";
import Link from "next/link";
import 'highlight.js/styles/github-dark.css';
import { getAllPosts, getPostBySlug } from "~/lib/getContentIndex";
import markdownToHtml from "~/lib/markdownToHtml";
import XIcon from '@mui/icons-material/X';
import { Box, Container, Typography, IconButton, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticPaths = async () => {
    const posts = getAllPosts(["slug"]);
    return {
        paths: posts.map((post) => {
            return {
                params: {
                    slug: post.slug,
                },
            };
        }),
        fallback: false,
    };
};

/**
 * 記事の内容を取得する
 */
export const getStaticProps = async ({ params }: any) => {
    const post = getPostBySlug(params.slug, ["slug", "title", "date", "content", "excerpt"]);
    // Markdown を HTML に変換する
    const content = await markdownToHtml(post.content);
    // content を詰め直して返す
    return {
        props: {
            post: {
                ...post,
                content,
            },
        },
    };
};

const BlogPage: NextPage<Props> = ({ post }) => {
    const router = useRouter();
    if (!router.isFallback && !post?.slug) {
        return <ErrorPage statusCode={404} />;
    }
    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                py: 4
            }}
        >
            <Head>
                <title>{post.title}</title>
                <meta name="description" content={post.excerpt} />
                <link rel="icon" href="/favicon.ico" />
                
                {/* OGP Tags */}
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt} />
                <meta property="og:url" content={`https://rhiroe.github.io${router.asPath}`} />
                <meta property="og:type" content="article" />
                <meta property="og:site_name" content="rhiroe.github.io" />
                {/* Twitter Card */}
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:site" content="@rhiroe" />
            </Head>
            <Container maxWidth="lg">
                <Box sx={{ mb: 4 }}>
                    <Link href="/blog" style={{ textDecoration: 'none' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                color: 'rgba(255, 255, 255, 0.7)',
                                transition: 'color 0.3s ease',
                                '&:hover': {
                                    color: '#4da3ff'
                                }
                            }}
                        >
                            <ArrowBackIcon />
                            <Typography>一覧</Typography>
                        </Box>
                    </Link>
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        p: 4,
                        borderRadius: 2
                    }}
                >
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '2rem', md: '2.5rem' },
                            fontWeight: 700,
                            color: '#fff',
                            textAlign: 'center',
                            mb: 3
                        }}
                    >
                        {post.title}
                    </Typography>

                    <Typography
                        sx={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            textAlign: 'right',
                            mb: 4
                        }}
                    >
                        {new Date(post.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric' })}
                    </Typography>

                    <Box
                        sx={{
                            '& > div': {
                                color: 'rgba(255, 255, 255, 0.9)',
                                '& h1, & h2, & h3, & h4, & h5, & h6': {
                                    color: '#fff',
                                    mt: 4,
                                    mb: 2
                                },
                                '& p': {
                                    mb: 2,
                                    lineHeight: 1.7
                                },
                                '& a': {
                                    color: '#4da3ff',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                },
                                '& code': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                    padding: '0.2em 0.4em',
                                    borderRadius: '0.3em',
                                    fontSize: '0.9em'
                                },
                                '& pre': {
                                    mt: 2,
                                    mb: 3,
                                    p: 2,
                                    borderRadius: 1,
                                    overflow: 'auto'
                                }
                            }
                        }}
                    >
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                        <Link
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title + '\n')}&url=${encodeURIComponent(`https://rhiroe.github.io${router.asPath}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'none' }}
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    px: 2,
                                    py: 1,
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    borderRadius: 2,
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                <XIcon />
                                <Typography>Share</Typography>
                            </Paper>
                        </Link>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default BlogPage;

