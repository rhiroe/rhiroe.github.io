---
title: Next.jsのアプリケーションをGitHubPagesにデプロイする
date: 2022/8/3
tags: ["Nextjs"]
excerpt: 気軽にNext.jsのアプリを作って公開する
---

Next.jsでアプリを作ってある前提の話。

# 考え方

`next build`して`next export`したものをGitHubPagesにデプロイすれば良い。

つまり、`next export`してできたフォルダのみをデプロイ用のブランチとしてpushして、そのブランチをデプロイすれば良い。

でも、`main`ブランチに変更がある度にデプロイ用のブランチも更新してpushするのは面倒。

ならば、GitHubActionsで自動化すれば良い。

# 結論

## Workflowを設定する

`main`ブランチににpushされたら自動デプロイする。

```yml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  Deploy:

    runs-on: ubuntu-20.04

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build

      - name: export
        run: pnpm export

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: out
```

### 利用したActions

- [actions/checkout](https://github.com/actions/checkout)
  - 該当のブランチにチェックアウトします
- [actions/setup-node](https://github.com/actions/setup-node)
  - nodeが使える環境を用意します
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)
  - 指定したディレクトリを別ブランチ`gh-pages`にpushします

## デプロイブランチを設定する

リポジトリ > Settings > Pages > Build and deployment
から`gh-pages`ブランチを指定する。

# username.github.ioリポジトリ以外

username.github.ioリポジトリ以外からGitHubPagesにデプロイする場合、公開されるURLが`/リポジトリ名`になるので、 これに合わせて`next.config`の`basePath`を変更する必要がある。 ただし、単純に`"/リポジトリ名"`を指定してすると開発環境にまで影響するので都合が悪い。 なのでWorkflowでbuildする時だけ`basePath`を変更する。

```javascript
const nextConfig = {
  // ...,
  basePath: process.env.GITHUB_ACTIONS && "/リポジトリ名",
}
```
