---
title: 開発環境・本番環境のDockerイメージのRubyのタグを.ruby-versionから取得する
date: 2026/1/31
tags: ["Ruby", "Docker", "DevContainer"]
---

Rubyのバージョンが

- `.ruby-version`
- 開発環境の`Dockerfile`
- 本番環境の`Dockerfile`

の3箇所に書かれていて、これを`.ruby-version`1つだけで管理できたらなぁ、と思っていた。

# 結論

## 開発環境
DevContainerの`initializeCommand`でimageをbuildし、compose.yamlではそのイメージを指定して使う。

Dockerfile
```Dockerfile
ARG RUBY_VERSION
FROM ruby:${RUBY_VERSION}-trixie
```
devcontainer.json
```json
{
  "name": "MyApp",
  "dockerComposeFile": "compose.yml",
  "initializeCommand": "docker build --build-arg RUBY_VERSION=\"$(cat .ruby-version)\" -t my-application-dev",
```
compose.yaml
```yaml
services:
  app:
    image: my-application-dev
```

## 本番環境(GitHub Actions)
`.ruby-version`の値を`$GITHUB_OUTPUT`に出力し、`docker/build-push-action`の`build-args`に指定する

```yaml
    steps:
      - uses: actions/checkout@6

      - name: Set Ruby version
        id: ruby-version
        shell: bash
        run: |
          echo "ruby-version=$(cat .ruby-version)" >> "$GITHUB_OUTPUT"
      
      - name: Build an image from Dockerfile
        uses: docker/build-push-action@6
        with:
          context: .
          file: Dockerfile
          build-args: |
            RUBY_VERSION=${{ steps.ruby-version.outputs.ruby-version }}
```

# 解決までの物語

今日のokayama.rbで[pocke](https://x.com/p_ck_)さんの[`.ruby-version`の話](https://pocke.hatenablog.com/entry/2026/01/30/000756)を聞いた。

その中でDockerfileのベースイメージのタグを`.ruby-version`から取得するには、ビルド時に`--build-arg`を使用して`ARG`経由で渡せばいいという話があった。

確かに自分も`.ruby-version`・開発環境の`Dockerfile`・本番環境の`Dockerfile`の3つでRubyのバージョン番号を管理していて、`.ruby-version`の1つにできないかな、と思ったことはあった。

ビルド時に`--build-arg`を使用して`ARG`経由で渡すというのは当時も思いつきそうだが、どうして自分は解決できなかったのだろうと振り返ってみると、自分の場合は開発環境でDevContainerをDockerComposeで利用しており、その場合は`--build-arg`のオプションは`compose.yaml`に書くしか方法がなく、その場合`$(cat .ruby-version)`のような動的な指定はできないため諦めていた。

Dockerfile
```Dockerfile
ARG RUBY_VERSION
FROM ruby:${RUBY_VERSION}-trixie
```
devcontainer.json
```json
{
  "name": "My App",
  "dockerComposeFile": "compose.yml",
```
compose.yaml
```yaml
services:
  app:
    build:
      context: .
      args:
        RUBY_VERSION: $(cat .ruby-version) # これはうまく動かない
```

## 諦めた当時の解決案

compose.yamlでargを動的に指定することはできなかったが、環境変数であれば指定できることを利用してなんとかする方法があった。

```yaml
services:
  app:
    build:
      context: .
      args:
        RUBY_VERSION: ${RUBY_VERSION}
```
```shell
$ RUBY_VERSION=$(cat .ruby-version) docker compose config
services:
  app:
    build:
      context: .
      args:
        RUBY_VERSION: 4.0.1

$ RUBY_VERSION=$(cat .ruby-version) devcontainer build
```

コマンドのtype量が増えて微妙...。

`export`はバージョン変わるたびに実行しないといけないのでさらに微妙...。

ホストに余計な環境変数を不用意に増やしたくない...。

```yaml
services:
  app:
    build:
      context: .
      args:
        RUBY_VERSION:
      env_file:
        - .env
```

```shell
cat .ruby-version > .env
devcontainer build
```

`.env`には既に値が入っているので、`cat .ruby-version　> .env`で消されると困る...。

`cat .ruby-version　>> .env`にするとビルドの度に`RUBY_VERSION`の行が増える...。

毎回実行しないと今度はバージョンが変わるたびに忘れず実行しないといけなくなる...。

実行時に環境変数が存在すると`.env`の値より優先される...。

## 思い出したので再チャレンジすることにした

結論に書いてある方法で解決できたので良かった！
