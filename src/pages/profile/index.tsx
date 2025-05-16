import { NextPage, InferGetStaticPropsType } from "next";
import Head from "next/head";
import markdownToHtml from "~/lib/markdownToHtml";
import fs from 'fs';
import path from 'path';
import { Box, Container, Paper, Typography } from '@mui/material';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => {
    const resumePath = path.join(process.cwd(), 'public', 'resume.md');
    const content = fs.readFileSync(resumePath, 'utf8');
    const htmlContent = await markdownToHtml(content);

    return {
        props: {
            content: htmlContent,
        },
    };
};

const ProfilePage: NextPage<Props> = ({ content }) => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                py: 4
            }}
        >
            <Head>
                <title>プロフィール - rhiroe.github.io</title>
                <meta name="description" content="廣江 亮佑のプロフィール" />
                <link rel="icon" href="/favicon.ico" />
                
                {/* OGP Tags */}
                <meta property="og:title" content="プロフィール - rhiroe.github.io" />
                <meta property="og:description" content="廣江 亮佑のプロフィール" />
                <meta property="og:url" content="https://rhiroe.github.io/profile" />
                <meta property="og:type" content="profile" />
                <meta property="og:site_name" content="rhiroe.github.io" />
                {/* Twitter Card */}
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:site" content="@rhiroe" />
            </Head>

            <Container maxWidth="lg">
                <Typography
                    variant="h1"
                    sx={{
                        fontSize: { xs: '2rem', md: '2.5rem' },
                        fontWeight: 700,
                        color: '#fff',
                        textAlign: 'center',
                        mb: 4
                    }}
                >
                    Profile
                </Typography>

                <Paper
                    elevation={0}
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        p: 4,
                        borderRadius: 2,
                        '& > div': {
                            color: 'rgba(255, 255, 255, 0.9)',
                            '& h1, & h2, & h3, & h4, & h5, & h6': {
                                color: '#fff',
                                mt: 4,
                                mb: 2
                            },
                            '& p': {
                                mb: 2,
                                lineHeight: 1.7
                            },
                            '& a': {
                                color: '#4da3ff',
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            },
                            '& ul, & ol': {
                                pl: 3,
                                mb: 2,
                                '& li': {
                                    mb: 1
                                }
                            },
                            '& table': {
                                width: '100%',
                                borderCollapse: 'collapse',
                                mb: 3,
                                '& th, & td': {
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                                    p: 2,
                                    textAlign: 'left'
                                },
                                '& th': {
                                    color: '#fff',
                                    fontWeight: 600
                                }
                            }
                        }
                    }}
                >
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </Paper>
            </Container>
        </Box>
    );
};

export default ProfilePage;