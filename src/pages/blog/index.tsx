import type { InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import Link from 'next/link'
import { useState } from "react";
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
        <div className="container">
            <Head>
                <title>rhiroeのブログ</title>
                <meta name="description" content="rhiroeのブログ" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="main">
                <div className="grid">
                    {paginatedPosts.map((post) => (
                        <Link href={`blog/${post.slug}`} key={post.slug} className="card">
                            <article>
                                <h2>{post.title}</h2>
                                <p>{post.excerpt}</p>
                                <div>
                                    <time style={{ color: '#999', fontSize: '0.75rem', fontWeight: 500 }}>
                                        {
                                            new Date(post.date)
                                                .toLocaleDateString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric' })
                                                .replace(/\-/g, '/')
                                        }
                                    </time>
                                    {post.tags && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                            {post.tags.map((tag: string) => (
                                                <span key={tag} style={{
                                                    backgroundColor: '#1e3a5f',
                                                    color: '#4da3ff',
                                                    padding: '0.25rem 0.65rem',
                                                    borderRadius: '999px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 500,
                                                    transition: 'all 0.3s ease'
                                                }}>
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
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={`pageButton ${currentPage === 1 ? 'disabled' : ''}`}
                        disabled={currentPage === 1}
                    >
                        <span>{'<'}</span>
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
                                    className={`pageButton ${page === currentPage ? 'activePage' : ''}`}
                                >
                                    {page}
                                </button>
                            );
                        } else if (page === 1 || page === totalPages) {
                            return (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(page)}
                                    className={`pageButton ${page === currentPage ? 'activePage' : ''}`}
                                    style={{
                                        background: '#333',
                                        color: '#fff',
                                        border: '1px solid #4da3ff',
                                        borderRadius: '4px',
                                        padding: '0.5rem 1rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {page}
                                </button>
                            );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return (
                                <span key={index} style={{ color: 'white' }}>
                                    ...
                                </span>
                            );
                        }
                        return null;
                    })}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={`pageButton ${currentPage === totalPages ? 'disabled' : ''}`}
                        disabled={currentPage === totalPages}
                    >
                        <span>{'>'}</span>
                    </button>
                </div>
            </main>
        </div>
    );
};

export default BlogsPage;
