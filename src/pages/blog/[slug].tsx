import { NextPage, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Head from "next/head";
import 'highlight.js/styles/default.css';
import styles from "~/styles/Blog.module.css";
import { getAllPosts, getPostBySlug } from "~/lib/getContentIndex";
import markdownToHtml from "~/lib/markdownToHtml";

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
        <div className={styles.container}>
            <Head>
                <title>{post.title}</title>
                <meta name="description" content={post.excerpt} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <article>
                    <h1 className={styles.title}>{post.title}</h1>
                    <div className={styles.grid}>
                        <div>
                            <p>{post.date}</p>
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        </div>
                    </div>
                </article>
            </main>
        </div>
    );
};

export default BlogPage;
