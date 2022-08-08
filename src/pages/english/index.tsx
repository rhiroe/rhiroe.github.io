import type { NextPage } from "next";
import Head from "next/head";
import styles from "~/styles/Blog.module.css";
import PageTitle from "~/components/common/pageTitle";

const EnglishPage: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>英語学習の記録</title>
                <meta name="description" content="rhiroeのブログ" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <PageTitle>英語学習の記録</PageTitle>

                <div>
                    <h2>現在のレベル</h2>
                    <div>現在数値化できるものがないので不明</div>
                    <h2>僕の前提</h2>
                    <ul>
                        <li>英語は中高通して赤点ギリギリ</li>
                        <li>書けない読めない喋れない聞き取れない</li>
                        <li>洋楽はよく聞く(歌う時は適当)</li>
                    </ul>
                    <h2>今やっている勉強</h2>
                    <ul>
                        <li>中学英語復習</li>
                        <li>聞く英文法</li>
                        <li>YouTubeで単語暗記</li>
                        <li>Duolingo</li>
                    </ul>
                    <h2>やってよかったこと</h2>
                    <ul>
                        <li>
                            <a href={"https://www.youtube.com/playlist?list=PLtD8Q2q4WJw7lhaGJg0ija70fZHaejSCR"}>
                                スタフリ
                            </a>
                            の中学英語学習の動画を見た
                        </li>
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default EnglishPage;
