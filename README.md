# rhiroe.github.io

Next.jsで作っています。

## ブログ

- `public/content/`以下のMarkdownで記事を管理

### 利用しているライブラリ

- [remarkjs](https://github.com/remarkjs) 各種ライブラリ
  - MarkdownからHTMLへの変換
- [rehypejs](https://github.com/rehypejs) 各種ライブラリ
  - HTMLの加工
- [highlight.js](https://github.com/highlightjs/highlight.js)
  - コードブロックのSyntaxHighlight表示

## デプロイ

GitHubActionsで自動デプロイ

### 利用しているActions

- [actions/checkout](https://github.com/actions/checkout)
- [actions/setup-node](https://github.com/actions/setup-node)
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)
