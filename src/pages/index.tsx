import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import styles from '~/styles/Home.module.css'
import PageTitle from "~/components/common/pageTitle";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>{'Ryosuke "Rio" Hiroe'}</title>
        <meta name="description" content="My page." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <PageTitle>{'Ryosuke "Rio" Hiroe'}</PageTitle>

        <img className={styles.thumbnail} src={'/rhiroe_icon.jpg'} alt={"Icon of rhiroe"} />

        <p className={styles.description}>
          岡山でRuby書いたりTypeScript書いたりしてます。
        </p>

        <div className={styles.grid}>
          <Link href="blog">
            <a className={styles.card}>
              <h2>Blog &rarr;</h2>
              <p>プログラミングの話</p>
            </a>
          </Link>

          <Link href="english">
            <a className={styles.card}>
              <h2>English &rarr;</h2>
              <p>英語学習の記録</p>
            </a>
          </Link>

          {/*<a*/}
          {/*  href="https://github.com/vercel/next.js/tree/canary/examples"*/}
          {/*  className={styles.card}*/}
          {/*>*/}
          {/*  <h2>Examples &rarr;</h2>*/}
          {/*  <p>Discover and deploy boilerplate example Next.js projects.</p>*/}
          {/*</a>*/}

          {/*<a*/}
          {/*  href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"*/}
          {/*  className={styles.card}*/}
          {/*>*/}
          {/*  <h2>Deploy &rarr;</h2>*/}
          {/*  <p>*/}
          {/*    Instantly deploy your Next.js site to a public URL with Vercel.*/}
          {/*  </p>*/}
          {/*</a>*/}
        </div>
      </main>
    </div>
  )
}

export default Home
