import { NextPage, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Head from "next/head";
import Link from "next/link";
import 'highlight.js/styles/github-dark.css';
import { getAllPosts, getPostBySlug } from "~/lib/getContentIndex";
import markdownToHtml from "~/lib/markdownToHtml";
import XIcon from '@mui/icons-material/X'

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
        <div className="container">
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
            <main className="main">
                <div className="container">
                    <article>
                        <Link href="/blog" style={{
                            display: 'block',
                            color: '#4da3ff',
                            textDecoration: 'none',
                            fontSize: '1.1rem',
                            marginBottom: '2rem',
                            transition: 'color 0.3s ease',
                            maxWidth: '1200px',
                            width: '100%',
                            margin: '0 auto 2rem'
                        }}>
                            &larr; 一覧
                        </Link>
                        <h1 style={{
                            color: '#ffffff',
                            fontSize: '2.5rem',
                            fontWeight: 700,
                            lineHeight: 1.3,
                            letterSpacing: '-0.02em',
                            textAlign: 'center',
                            maxWidth: '1200px',
                            width: '100%',
                            margin: '0 auto 2rem'
                        }}>{post.title}</h1>
                        <p style={{ textAlign: 'right', color: '#999' }}>{post.date}</p>
                        <div className="grid">
                            <div>
                                <div dangerouslySetInnerHTML={{ __html: post.content }} />
                            </div>
                        </div>
                    </article>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#999' }}>
                        <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title + '\n')}&url=${encodeURIComponent(`https://rhiroe.github.io${router.asPath}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                backgroundColor: '#1f2937',
                                color: 'white',
                                borderRadius: '0.75rem',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#374151';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = '#1f2937';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <XIcon />
                            <span>Share</span>
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BlogPage;

