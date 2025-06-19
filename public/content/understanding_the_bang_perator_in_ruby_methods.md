---
title: メソッド名の"!"について
date: 2025/6/19
tags: ["Ruby", "Rails"]
---

Rubyではよくメソッドの末尾に"!"のついたメソッドがある。

例えばRubyだと`String#upcase!`や`Array#map!`などレシーバを破壊的に変更するメソッド、RailsだとActiveRecordの`ActiveRecord::Persistence::ClassMethods#create!`や`ActiveRecord::Suppressor#save!`などレコードの保存に失敗した時に例外を投げるメソッドがある。

加えてアプリケーションのコードにはDBに変更を加えるような独自メソッドに`!`がついていることもある。

このようになんとなく「レシーバに変更を加える」「例外をなべる場合がある」「DBに変更を加える」などに該当するようなメソッドに対して`!`をつけるという認識の方も多いのではないだろうか。

自分もそのような認識で、なんとなく「気をつけろよ」的なお気持ちで`!`をつけていたが、社内のSlackで色々教えてもらったのでここでまとめたい。

# Rubyおけるメソッド名の"!"

実は[Rubyのドキュメント](https://docs.ruby-lang.org/ja/latest/doc/symref.html#ex)が存在する。

> 「!」はメソッド名の一部です。慣用的に、同名の(! の無い)メソッドに比べてより破壊的な作用をもつメソッド(例: tr と tr!)で使われます。

今までなんとなく認識していた「ちょっと危ない」というニュアンスは相対的なものとしてここで説明されている。

つまり同名のメソッドがなければ比較対象がないため、メソッド名に`!`をつける必要はないと読める。

[Airbnbのスタイルガイド](https://github.com/airbnb/ruby/blob/1939a2fb61db4e1f5cf7738e34d0c756f17f5afe/README.md)や[DHHのツイート](https://x.com/dhh/status/684126832887726080)で引用されている記事(のアーカイブ)でも同様のことが書かれている。

https://davidablack.net/dablog.html#2007/8/15/bang-methods-or-danger-will-rubyist

# 多くの誤解

先ほどの記事ではこう言及されている。

> The ! in method names that end with ! means, “This method is dangerous”—or, more precisely, this method is the “dangerous” version of an otherwise equivalent method, with the same name minus the !. “Danger” is relative; the ! doesn’t mean anything at all unless the method name it’s in corresponds to a similar but bang-less method name.

今までなんとなく危険っぽいから!をつけていた身としては、認識を大きくアップデータさせられた。

さらに、こうも言及されている。

> The ! does not mean “This method changes its receiver.” A lot of “dangerous” methods do change their receivers. But some don’t. I repeat: ! does not mean that the method changes its receiver.

つまり「レシーバを破壊的に変更するから危険」ではないということだ。

同じように「例外を投げるから危険」とも限らないと言えるのだろう。

これに関して面白いスライドを共有してもらった。

https://speakerdeck.com/alstrocrack/rubyno-mesotudowotiyantoli-jie-suru

> exit vs exit!
>
> exitは例外 SystemExit を出してくれるが、exit!は例外を出さずにプロセスを終了
> → より「危険」である可能性がある

# これからどうするか

今回読んだドキュメントや記事の内容に大きく納得したので、今後はこの規約に沿って実装していくようにしようと思う。

- `!`は**同様の処理を行う同名のメソッドが存在する**場合に「より危険」なバージョンとしてつける
  - 「危険」とは「破壊的変更」や「例外を投げる」ことを必ずしも指さない
  - 「通常とは異なる動作や注意すべき点がある」場合に「危険」と判断する
