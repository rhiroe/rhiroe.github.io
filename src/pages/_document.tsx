import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        {/* RSS and Atom feeds for automatic discovery */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="rhiroe.github.io RSS Feed"
          href="/feeds/rss.xml"
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="rhiroe.github.io Atom Feed"
          href="/feeds/atom.xml"
        />
        {/* Additional meta tags for better SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
