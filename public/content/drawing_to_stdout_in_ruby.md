---
title: Rubyで標準出力に描画する
date: 2025/8/15
tags: ["Ruby"]
---

TRICKでよく目にする標準出力でのアニメーションや、普段見るところだと進捗バーのアニメーションなど

どうやってるのか気になっていたものの業務で使う場面もないので後回しにしていたやつをやっと調べた。

## 1行のアニメーション

改行コード`"\r"`でカーソルが行の先頭に移動し、その部分から上書きで出力することができる。

ただし、上書きできなかった部分はそのまま。

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

改行コード`"\r"`の代わりにANSIエスケープコードの`"\e[G"`などでも同様の動きができる。

表示する内容を工夫すれば、spinnerのようなこともできる。

```rb
%w[⠙ ⠹ ⠸ ⠼ ⠴ ⠦ ⠧ ⠇ ⠏ ⠋].cycle do |spinner|
  print "\r#{spinner}" # カーソルを行の先頭に移動し、上書き出力
  sleep 0.1
end
```

文字数が異なるものを順に表示したい場合は、カーソルを行の先頭に移動させた後に、ANSIエスケープコードの`"\e[K"`でカーソルより後ろの行削除を行うことで違和感なく出力できる。

```rb
loop do
  print "\r\e[K#{'1' * 10}"
  sleep 0.2
  print "\r\e[K#{'2' * 5}"
  sleep 0.2
end
```

## 複数行のアニメーション

ANSIエスケープコードの`"\e[H"`で画面上の先頭にカーソルを移動し、そこから上書きで出力することができる。

最初の出力前に、一度`"\e[2J"`で画面全体をクリアしておくと綺麗に出力できる。

```rb
puts "\e[2J" # 画面全体をクリア
loop do
  puts "\e[H" # 画面の先頭にカーソルを移動する
  puts Array.new(10).map { Array.new(10).map { ['@', ' '].sample }.join } # 上書き出力
  sleep(0.1)
end
```

ANSIエスケープコードを調べると他にどういったものがあるかがわかる。

これ、そのうち調べようと思ってから5年くらい経った気がする。

ANSIエスケープコードについては[このGitHub Gist](https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797)がよくまとまっていて参考になった。
