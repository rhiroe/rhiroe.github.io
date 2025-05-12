import type { InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import Link from 'next/link'
import { useState } from "react";
import styles from "~/styles/Blog.module.css";
import { getAllPosts } from "~/lib/getContentIndex";
import PageTitle from "~/components/common/pageTitle";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => {
    const allPosts = getAllPosts(["slug", "title", "date", "tags", "excerpt"])
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return {
        props: { allPosts },
    };
};

const POSTS_PER_PAGE = 10;

const BlogsPage: NextPage<Props> = ({ allPosts }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const paginatedPosts = allPosts.slice(startIndex, endIndex);

    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>rhiroeのブログ</title>
                <meta name="description" content="rhiroeのブログ" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <div className={styles.grid}>
                    {paginatedPosts.map((post) => (
                        <Link href={`blog/${post.slug}`} key={post.slug} className={styles.card}>
                            <article>
                                <h2 className={styles.postTitle}>{post.title}</h2>
                                <p className={styles.excerpt}>{post.excerpt}</p>
                                <div className={styles.postMeta}>
                                    <time className={styles.date}>
                                        {
                                            new Date(post.date)
                                                .toLocaleDateString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric' })
                                                .replace(/\-/g, '/')
                                        }
                                    </time>
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
                <div className={styles.pagination}>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
                        disabled={currentPage === 1}
                    >
                        <span className={styles.arrow}>{'<'}</span>
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => {
                        const page = index + 1;
                        if (
                            page >= (currentPage === totalPages ? currentPage - 2 : currentPage - 1)
                            && page <= (currentPage === 1 ? currentPage + 2 : currentPage + 1)
                        ) {
                            return (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(page)}
                                    className={`${styles.pageButton} ${page === currentPage ? styles.activePage : ''}`}
                                >
                                    {page}
                                </button>
                            );
                        } else if (page === 1 || page === totalPages) {
                            return (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(page)}
                                    className={`${styles.pageButton} ${page === currentPage ? styles.activePage : ''}`}
                                >
                                    {page}
                                </button>
                            );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return (
                                <span key={index} className={styles.ellipsis}>
                                    ...
                                </span>
                            );
                        }
                        return null;
                    })}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
                        disabled={currentPage === totalPages}
                    >
                        <span className={styles.arrow}>{'>'}</span>
                    </button>
                </div>
            </main>
        </div>
    );
};

export default BlogsPage;
