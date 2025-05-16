import type { InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import Link from 'next/link'
import { useState } from "react";
import { getAllPosts } from "~/lib/getContentIndex";
import PageTitle from "~/components/common/pageTitle";
import {
    Box,
    Button,
    Card,
    CardContent,
    InnerContainer,
    Chip,
    Typography,
    Grid
} from '~/components/common';

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
        setCurrentPage(page);
    };

    return (
        <>
            <Head>
                <title>rhiroeのブログ</title>
                <meta name="description" content="rhiroeのブログ" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <InnerContainer sx={{ padding: '2rem' }}>
                <Grid container spacing={2}>
                    {paginatedPosts.map((post, index) => (
                        <Grid size={{ xs: 12 }} key={post.slug}>
                            <Card>
                                <Link href={`blog/${post.slug}`}>
                                    <CardContent>
                                        <Typography
                                            variant="h5" // h3 から h5 に変更
                                            component="h2"
                                            className="card-title"
                                        >
                                            {post.title}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            className="card-description"
                                        >
                                            {post.excerpt}
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <Typography
                                                component="time"
                                                sx={{
                                                    color: 'rgba(255, 255, 255, 0.5)',
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                {new Date(post.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric' }).replace(/\-/g, '/')}
                                            </Typography>
                                            {post.tags && (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                    {post.tags.map((tag: string) => (
                                                        <Chip
                                                            key={tag}
                                                            label={tag}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: 'rgba(77, 163, 255, 0.1)',
                                                                color: '#aaaaaa',
                                                                borderRadius: '16px'
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Link>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Box className="pagination">
                    <Button
                        variant="outlined"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pagination-button"
                    >
                        {'<'}
                    </Button>
                    {Array.from({ length: totalPages }, (_, index) => {
                        const page = index + 1;
                        if (
                            page >= (currentPage === totalPages ? currentPage - 2 : currentPage - 1)
                            && page <= (currentPage === 1 ? currentPage + 2 : currentPage + 1)
                        ) {
                            return (
                                <Button
                                    key={index}
                                    variant={page === currentPage ? "contained" : "outlined"}
                                    onClick={() => handlePageChange(page)}
                                    className={`pagination-button ${page === currentPage ? 'active' : ''}`}
                                >
                                    {page}
                                </Button>
                            );
                        } else if (page === 1 || page === totalPages) {
                            return (
                                <Button
                                    key={index}
                                    variant="outlined"
                                    onClick={() => handlePageChange(page)}
                                    className="pagination-button"
                                >
                                    {page}
                                </Button>
                            );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return (
                                <Typography key={index} className="pagination-ellipsis">
                                    ...
                                </Typography>
                            );
                        }
                        return null;
                    })}
                    <Button
                        variant="outlined"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="pagination-button"
                    >
                        {'>'}
                    </Button>
                </Box>
            </InnerContainer>
        </>
    );
};

export default BlogsPage;
