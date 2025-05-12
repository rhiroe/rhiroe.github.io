---
title: 現在のブランチとデフォルトブランチ以外を全て削除するスクリプト
date: 2025/5/12
tags: ["Git"]
---

```shell
git branch | grep -v $(git remote show origin | grep 'HEAD branch' | awk '{print $NF}') | grep -v $(git branch | awk '/\*/ { print $2; }') | xargs git branch -D
```

とはいえ実際はこれで事足りる場面の方が多い

```shell
git branch | xargs git branch -D
```
