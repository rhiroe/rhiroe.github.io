import type { InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import Link from 'next/link'
import { useState } from "react";
import { getAllPosts } from "~/lib/getContentIndex";
import PageTitle from "~/components/common/pageTitle";
import {
    Box,
    Button,
    Container,
    Stack,
    Typography,
    Card,
    CardContent,
    Chip
} from '@mui/material';

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
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                pt: 4,
                pb: 8
            }}
        >
            <Head>
                <title>rhiroeのブログ</title>
                <meta name="description" content="rhiroeのブログ" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Container maxWidth="lg">
                <Typography
                    variant="h1"
                    sx={{
                        fontSize: { xs: '2rem', md: '2.5rem' },
                        fontWeight: 700,
                        color: '#fff',
                        mb: 4,
                        textAlign: 'center'
                    }}
                >
                    Blog
                </Typography>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                        gap: 3
                    }}
                >
                    {paginatedPosts.map((post) => (
                        <Box key={post.slug}>
                            <Link href={`blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            borderColor: 'rgba(255, 255, 255, 0.2)'
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Typography
                                            variant="h2"
                                            sx={{
                                                fontSize: '1.5rem',
                                                fontWeight: 600,
                                                color: '#fff',
                                                mb: 2
                                            }}
                                        >
                                            {post.title}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                mb: 2
                                            }}
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
                                                                color: '#4da3ff',
                                                                borderRadius: '16px'
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Box>
                    ))}
                </Box>
                <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="center"
                    mt={4}
                >
                    <Button
                        variant="outlined"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        sx={{
                            color: 'white',
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            '&:hover': {
                                borderColor: 'rgba(255, 255, 255, 0.5)'
                            }
                        }}
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
                                    sx={{
                                        color: 'white',
                                        borderColor: page === currentPage ? 'transparent' : 'rgba(255, 255, 255, 0.3)',
                                        backgroundColor: page === currentPage ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                        '&:hover': {
                                            borderColor: 'rgba(255, 255, 255, 0.5)',
                                            backgroundColor: page === currentPage ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                                        }
                                    }}
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
                                    sx={{
                                        color: 'white',
                                        borderColor: page === currentPage ? 'transparent' : 'rgba(255, 255, 255, 0.3)',
                                        backgroundColor: page === currentPage ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                        '&:hover': {
                                            borderColor: 'rgba(255, 255, 255, 0.5)',
                                            backgroundColor: page === currentPage ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                                        }
                                    }}
                                >
                                    {page}
                                </Button>
                            );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return (
                                <Typography
                                    key={index}
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.5)',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
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
                        sx={{
                            color: 'white',
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            '&:hover': {
                                borderColor: 'rgba(255, 255, 255, 0.5)'
                            }
                        }}
                    >
                        {'>'}
                    </Button>
                </Stack>
            </Container>
        </Box>
    );
};

export default BlogsPage;
