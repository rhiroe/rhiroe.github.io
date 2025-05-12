import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

const Home: NextPage = () => {
  return (
      <>
        <Head>
          <title>{'Ryosuke "Rio" Hiroe'}</title>
          <meta name="description" content="My page." />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <Grid container sx={{ my: 4 }} spacing={2}>
            <Grid item xs={6}>
              <Paper sx={{ py: 0.5, px: 4 }}>
                <Link href="blog">
                  <h2>Blog &rarr;</h2>
                  <p>プログラミングの話</p>
                </Link>
              </Paper>
            </Grid>
            {/*<Grid item xs={6}>*/}
            {/*  <Paper sx={{ py: 0.5, px: 4 }}>*/}
            {/*    <Link href="english">*/}
            {/*      <h2>English &rarr;</h2>*/}
            {/*      <p>英語学習の記録</p>*/}
            {/*    </Link>*/}
            {/*  </Paper>*/}
            {/*</Grid>*/}
            <Grid item xs={6}>
              <Paper sx={{ py: 0.5, px: 4 }}>
                <a href="https://gist.github.com/rhiroe/62a5f0dbd9c44bbf539f6effc4ef5514">
                  <h2>Profile &rarr;</h2>
                  <p>職務経歴とか</p>
                </a>
              </Paper>
            </Grid>
          </Grid>
        </main>
      </>
  )
}

export default Home
