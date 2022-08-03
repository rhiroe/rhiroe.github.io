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

でも、mainブランチに変更がある度にデプロイ用のブランチも更新してpushするのは面倒。

ならば、GitHubActionsで自動化すれば良い

# 結論

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
        uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 14.x
          cache: yarn

      - name: Install dependencies
        run: yarn --frozen-lockfile

      - name: Build
        run: next build

      - name: export
        run: next export

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: out
```

# 利用したActions

- [actions/checkout](https://github.com/actions/checkout)
- [actions/setup-node](https://github.com/actions/setup-node)
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)
