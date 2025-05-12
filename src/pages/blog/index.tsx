import type { InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import Link from 'next/link'
import styles from "~/styles/Blog.module.css";
import { getAllPosts } from "~/lib/getContentIndex";
import PageTitle from "~/components/common/pageTitle";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => {
    const allPosts = getAllPosts(["slug", "title", "date", "tags", "excerpt"]);
    return {
        props: { allPosts },
    };
};

const BlogsPage: NextPage<Props> = ({ allPosts }) => {
    return (
        <div className={styles.container}>
            <Head>
                <title>rhiroeのブログ</title>
                <meta name="description" content="rhiroeのブログ" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <div className={styles.grid}>
                    {allPosts.map((post) => (
                        <Link href={`blog/${post.slug}`} key={post.slug} className={styles.card}>
                            <article>
                                <h2 className={styles.postTitle}>{post.title}</h2>
                                <p className={styles.excerpt}>{post.excerpt}</p>
                                <div className={styles.postMeta}>
                                    <time className={styles.date}>{post.date}</time>
                                    {post.tags && (
                                        <div className={styles.tags}>
                                            {post.tags.map((tag: string) => (
                                                <span key={tag} className={styles.tag}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default BlogsPage;
