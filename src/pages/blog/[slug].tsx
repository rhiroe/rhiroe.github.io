import { NextPage, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Head from "next/head";
import Link from "next/link";
import 'highlight.js/styles/github-dark.css';
import { getAllPosts, getPostBySlug } from "~/lib/getContentIndex";
import markdownToHtml from "~/lib/markdownToHtml";
import XIcon from '@mui/icons-material/X';
import { Box, InnerContainer, Typography, DarkPaper, Button } from '~/components/common'; // Button をインポート
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
        <>
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
            <InnerContainer>
                <Link href="/blog" passHref>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            marginTop: '1rem',
                            marginBottom: '2rem',
                            color: 'rgba(255, 255, 255, 0.7)',
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            textTransform: 'none',
                            '&:hover': {
                                borderColor: 'rgba(255, 255, 255, 0.7)',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            },
                        }}
                    >
                        記事一覧へ戻る
                    </Button>
                </Link>

                <DarkPaper>
                    <Typography variant="h1" sx={{ color: '#fff', fontSize: '2.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '1rem' }}>
                        {post.title}
                    </Typography>

                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', textAlign: 'right', marginBottom: '2rem' }}>
                        {new Date(post.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric' })}
                    </Typography>

                    <Box className="markdown">
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </Box>
                </DarkPaper>
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
                                backgroundColor: '#000',
                                color: '#fff',
                                borderRadius: '20px',
                                padding: '8px 16px',
                                textTransform: 'none',
                                fontWeight: 'bold',
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                                '&:hover': {
                                    backgroundColor: '#1a1a1a',
                                    borderColor: 'rgba(255, 255, 255, 0.8)',
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

