---
title: RubyとNodeの両方が入ったDockerイメージの作り方
excerpt: Ruby3.4 + Node20 & pnpm
date: 2025/5/20
tags: ["Docker"]
---

```Dockerfile
FROM node:20 AS node

FROM ruby:3.4

COPY --from=node /opt/yarn-* /opt/yarn
COPY --from=node /usr/local/bin/node /usr/local/bin/
COPY --from=node /usr/local/lib/node_modules/ /usr/local/lib/node_modules/

RUN ln -fs /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm && \
    ln -fs /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npx && \
    ln -fs /usr/local/lib/node_modules/corepack/dist/corepack.js /usr/local/bin/corepack && \
    ln -fs /usr/local/lib/node /usr/local/bin/nodejs && \
    ln -fs /opt/yarn/bin/yarn /usr/local/bin/yarn && \
    ln -fs /opt/yarn/bin/yarn /usr/local/bin/yarnpkg

RUN corepack enable && corepack prepare pnpm@10.11.0 --activate
```