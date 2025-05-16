import { NextPage, InferGetStaticPropsType } from "next";
import Head from "next/head";
import markdownToHtml from "~/lib/markdownToHtml";
import fs from 'fs';
import path from 'path';
import { Box, InnerContainer, Paper, Typography } from '~/components/common';

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
        <>
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

            <InnerContainer>
                <Paper elevation={0} sx={{
                    background: 'transparent',
                    color: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    padding: '2rem',
                    borderRadius: '0.5rem'
                }}>
                    <Typography variant="h1" sx={{ color: '#fff', fontSize: '2.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '1rem' }}>
                        Profile
                    </Typography>

                    <Box className="markdown">
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                    </Box>
                </Paper>
            </InnerContainer>
        </>
    );
};

export default ProfilePage;