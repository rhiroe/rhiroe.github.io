---
title: Rubyで標準出力に描画する
date: 2025/8/15
tags: ["Ruby"]
---

TRICKでよく目にする標準出力でのアニメーションや、普段見るところだと進捗バーのアニメーションなど

どうやってるのか気になっていたものの業務で使う場面もないので後回しにしていたやつをやっと調べた。

## 進捗バー

サンプル
```rb
progress = 0
loop do
  progress = 100 if progress >= 100

  print "\r[#{'=' * (progress / 10).floor}#{' ' * (10 - progress / 10).ceil}] #{progress.round(1)}%"
  break puts ' Completed!🎉' if progress >= 100

  progress += Random.rand
  sleep(0.1)
end
```

`"\r"`でカーソルが行の先頭に移動し、その部分から出力内容を上書きしてくれる。ただし、上書きできなかった部分はそのまま。

```rb
loop do
  print '1' * 10
  sleep 0.2
  print "\r#{'2' * 5}"
  sleep 0.2
end
```

途中から"1111122222"が出力され続ける。

## アニメーション

サンプル
```rb
loop do
  puts "\e[H\e[2J"
  puts Array.new(10).map { Array.new(10).map { ['@', ' '].sample }.join }
  sleep(0.1)
end
```

`"\e[H\e[2J"`でclearコマンドと同様に画面がリセットされる。

ANSIエスケープコードを調べると他にどういったものがあるかがわかる。

これ、そのうち調べようと思ってから5年くらい経った気がする。
