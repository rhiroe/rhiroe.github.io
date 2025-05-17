import type { InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { getAllPosts } from "~/lib/getContentIndex";
import { InnerContainer } from '~/components/common';
import { BlogList } from "~/components/blog/BlogList";
import { Pagination } from "~/components/blog/Pagination";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => {
    const allPosts = getAllPosts(["slug", "title", "date", "tags", "excerpt"])
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return {
        props: { allPosts },
    };
};

const POSTS_PER_PAGE = 5;

const BlogsPage: NextPage<Props> = ({ allPosts }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const paginatedPosts = allPosts.slice(startIndex, endIndex);

    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

    const handlePageChange = (page: number) => {
        if (page !== currentPage) {
            setCurrentPage(page);
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft' && currentPage > 1) {
                handlePageChange(currentPage - 1);
            } else if (event.key === 'ArrowRight' && currentPage < totalPages) {
                handlePageChange(currentPage + 1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentPage, totalPages]);

    return (
        <>
            <Head>
                <title>rhiroeのブログ</title>
                <meta name="description" content="rhiroeのブログ" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <InnerContainer sx={{ padding: '2rem' }}>
                <BlogList posts={paginatedPosts} />
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </InnerContainer>
        </>
    );
};

export default BlogsPage;
