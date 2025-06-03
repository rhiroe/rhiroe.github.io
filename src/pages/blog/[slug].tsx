import { NextPage, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Head from "next/head";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "~/lib/getContentIndex";
import markdownToHtml from "~/lib/markdownToHtml";
import XIcon from '@mui/icons-material/X';
import { Box, InnerContainer, Typography, GlassPaper, Button } from '~/components/common'; // Button をインポート
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { MermaidViewer } from '~/components/blog/MermaidViewer';

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
        <>
            <Head>
                <title>{post.title}</title>
                <meta name="description" content={post.excerpt} />
                <link rel="icon" href="/favicon.ico" />
                
                {/* RSS・Atomフィードリンク */}
                <link rel="alternate" type="application/rss+xml" title="rhiroe.github.io RSS Feed" href="/feeds/rss.xml" />
                <link rel="alternate" type="application/atom+xml" title="rhiroe.github.io Atom Feed" href="/feeds/atom.xml" />
                
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
            <InnerContainer>
                <Link href="/blog" passHref>
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
                </Link>

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
                        {new Date(post.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric' })}
                    </Typography>

                    <Box className="markdown">
                        <MermaidViewer content={post.content} />
                    </Box>
                </GlassPaper>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                    <Link
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title + '\n')}&url=${encodeURIComponent(`https://rhiroe.github.io${router.asPath}`)}`}
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
                                boxShadow: (theme) => theme.palette.mode === 'light'
                                    ? '0 4px 12px rgba(102, 126, 234, 0.25)'
                                    : '0 4px 12px rgba(144, 205, 244, 0.25)',
                                '&:hover': {
                                    backgroundColor: 'primary.dark',
                                    transform: 'translateY(-2px)',
                                    boxShadow: (theme) => theme.palette.mode === 'light'
                                        ? '0 6px 16px rgba(102, 126, 234, 0.35)'
                                        : '0 6px 16px rgba(144, 205, 244, 0.35)',
                                },
                            }}
                        >
                            Share
                        </Button>
                    </Link>
                </Box>
            </InnerContainer>
        </>
    );
};

export default BlogPage;

