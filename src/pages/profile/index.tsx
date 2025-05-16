import { NextPage, InferGetStaticPropsType } from "next";
import Head from "next/head";
import styles from "~/styles/Blog.module.css";
import markdownToHtml from "~/lib/markdownToHtml";
import fs from 'fs';
import path from 'path';

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
        <div className={styles.container}>
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

            <main className={styles.main}>
                <div className={styles.container}>
                    <article>
                        <div className={styles.grid}>
                            <div>
                                <div dangerouslySetInnerHTML={{ __html: content }} />
                            </div>
                        </div>
                    </article>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;