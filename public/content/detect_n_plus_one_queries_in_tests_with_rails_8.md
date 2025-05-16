---
title: Rails8でn+1をテストで検知する
date: 2025/5/16
tags: ["Rails"]
---

# Bulletの誤検知多くね？

特にActiveAdmin使ってるとより感じる。

# Railsの標準機能で検知できるじゃん

Rails7.2から strict loading に n_plus_one_only モードが追加された。
Rails8からデフォルトを設定できるようになった。

`config/environments/test.rb`の設定を以下のようにする。

```rb
Rails.application.configure do
  config.active_record.strict_loading_by_default = true
  config.active_record.strict_loading_mode = :n_plus_one_only
```

プロダクトコードに限らずテストコードによってN+1が発生する場合でも例外になるため注意。

# 感想

今のところ誤検知はないように思う。ただコードベースが小さいのでなんとも言えない。
Bulletよりはマシ。今までありがとうBullet。Bye。
