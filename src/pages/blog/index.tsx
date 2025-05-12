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
                <PageTitle>rhiroeのブログ</PageTitle>

                <div>
                    {allPosts.map((post) => (
                        <Link href={`blog/${post.slug}`} key={post.slug}>
                            <h2>{post.title}</h2>
                            <p>{post.excerpt}</p>
                            <p>{post.date}</p>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default BlogsPage;
