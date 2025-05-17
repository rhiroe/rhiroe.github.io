import Link from 'next/link'
import {
    Box,
    Card,
    CardContent,
    Chip,
    Typography,
    Grid
} from '~/components/common';

type Post = {
    slug: string;
    title: string;
    date: string;
    tags?: string[];
    excerpt?: string;
};

type BlogListProps = {
    posts: Post[];
};

export const BlogList = ({ posts }: BlogListProps) => {
    return (
        <Grid container spacing={2}>
            {posts.map((post) => (
                <Grid size={{ xs: 12 }} key={post.slug}>
                    <Card>
                        <Link href={`blog/${post.slug}`}>
                            <CardContent>
                                <Typography
                                    variant="h5"
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
    );
};