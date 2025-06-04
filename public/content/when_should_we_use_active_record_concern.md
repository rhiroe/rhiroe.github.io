---
title: ActiveSupport::Concernの使い所を知る
date: 2025/6/4
tags: ["Rails"]
---

# ActiveSupport::Concern

関心事を分離するってやつ

参考: https://railsguides.jp/getting_started.html#%E5%85%B1%E9%80%9A%E3%82%B3%E3%83%BC%E3%83%89%E3%82%92concern%E3%81%AB%E6%8A%BD%E5%87%BA%E3%81%99%E3%82%8B

## あまり好きではない

前提として筆者は`ActiveSupport::Concern`が好きではない。

Concernはその性質上includeされるクラスに特定のメソッドが定義されていることを求めることがある。モジュールがinclude先のクラスの実装に依存すること自体がナンセンスだと思っているものの、そこはConcernの特性として目を瞑ることとする。

また、Concernを使ったもので感銘を受けた実装に出会ったことが一度もない。

## とはいえ「良い使い方」は抑えておきたい

自分が好きでなくとも使いたい人はいる。自分の好き嫌いを理由に使うのをやめてもらうよう説得するのは難しい。

良い使い方を抑えておき、Concernを使いたい人に対し「ならば上手に使ってくれ」という交渉を行えるようになっておきたい。

# Good concerns

https://dev.37signals.com/good-concerns/

Concernの上手な使い方を調べるとよく見るやつ。翻訳記事も多数あるので読みやすい。

<details><summary>Geminiによる要約</summary>

## Ruby on RailsにおけるActiveSupport::Concernの良い使い方：37signalsの設計原則
この記事は、Ruby on RailsのActiveSupport::Concern（以下、concern）について、批判的な意見も存在する中で、37signals社が大規模なコードベースで長年培ってきた効果的な活用方法と設計原則を紹介するものです。

### Concernとは何か、そして課題
Concernは、Rubyのmixinに共通の定型コードを削減するためのシンタックスシュガーを加えたものです。非常に自由度が高いため、誤った使い方をすると問題を引き起こす可能性があります。しかし、適切に利用すればコードの整理に役立つ強力なツールとなり得ます。

### Concernの配置場所
37signals社では、concernの用途に応じて配置場所を使い分けています。

- 共通のモデルconcern: 複数のモデルで共有されるconcernは、app/models/concernsディレクトリに配置します。
- モデル固有のconcern: 特定のモデル専用のconcernは、モデル名の名前空間を持つディレクトリ（例: app/models/recording/completable.rb）に配置し、Recording::Completableのように定義します。これにより、モデル内でconcernをincludeする際に名前空間の繰り返しを省略できます。
- コントローラーconcern: ほとんどのコントローラーconcernはcontrollers/concernsに、特定のサブシステムにのみ適用されるものはcontroller/concerns/\<subsystem>に配置します。

### Concernによる可読性の向上
Concernは、正しく使えば以下の2つの点で可読性を向上させると筆者は主張しています。

1. 複雑性の管理:
Concernは、複雑なシステムをより小さく管理しやすい単位に分割する手段となります。重要なのは、各concernがホストモデルの明確な特性（trait）を捉えた、凝集性の高いユニットであるべきという点です。「has trait」や「acts as」といった意味論を持つべきで、単に巨大なモデルを分割するための任意のコンテナとして扱うべきではありません。
例として、HEYアプリケーションのUserモデルが持つExaminerという役割（他のユーザーからのメール送信許可申請を審査する役割）をconcernとして切り出し、関連するコード（has_many関連付けやメソッド群）をまとめています。

2. ドメイン概念の反映:
Concernは、ドメインの概念をコード上に表現するための追加の抽象化レイヤーを提供します。HEYのTopicモデルがAccessible, Breakoutable, Deletableなど、ドメインの振る舞いを表す多数のconcernをincludeしている例が挙げられています。これらのconcern名は理解しやすく、ドメインをコードに反映させる上で有益です。

### リッチなオブジェクトモデルの補完であり、代替ではない
Concernは、クラス継承やコンポジションといった伝統的なオブジェクト指向（OO）技術の代替手段ではありません。ビジネスロジックをconcernではなく、Value ObjectやServiceといったより適切なクラスでモデル化すべきという意見もありますが、筆者はこれを誤った二分法だと指摘します。

Concernは、PORO（Plain Old Ruby Objects）やデザインパターンを適切に使用したオブジェクト指向設計と共存し、それを補完するものです。Concernを利用することで、モデルのコードを整理しつつ、ドメイン指向の簡潔なAPIを提供できます。

例として、HEYにおけるアカウント終了処理が紹介されています。AccountモデルはClosable concernをincludeし、terminateメソッドを提供します。このメソッド内部では、アカウントの状態に応じてデータの完全削除（incinerate）または一部保持（purge）を行いますが、これらの複雑な処理はAccount::Closing::PurgingやAccount::Closing::Incinerationといった専用のクラス群（継承も活用）に委譲されています。Accountモデル自体はこれらの詳細ロジックから切り離され、account.terminateというシンプルなインターフェースを提供する役割に徹しています。

### まとめ
Concernは強力なツールですが、誤用すると問題を引き起こす可能性もあります。しかし、明確なガイドラインに従えば、Railsプログラマーにとってコードの構成を改善し、可読性と保守性を高める素晴らしいリソースとなります。

重要なのは、concernを優れたオブジェクト指向設計と組み合わせることです。Concernはソフトウェア設計の知識の必要性をなくすものではありませんが、大規模なRailsアプリケーション（BasecampやHEYなど）においても、伝統的なオブジェクト指向やパターンと共に効果的に活用できる実践的なメカニズムであると結論付けています。
</details><br />

## 良い使い方

<details><summary>Geminiによる解説</summary>

## 1. 明確な責任と凝集性の高いモジュールにする
単一責任の原則: Concernは、モデルが持つ特定の「関心事」や「役割」をカプセル化するために使用します。関連性の低い機能を一つのConcernにまとめないでください。
凝集性: Concern内のメソッドや関連付け、定数などは、そのConcernが表現する特定の機能や概念に密接に関連しているべきです。
例:
良い例: Publishable（公開・非公開のロジック）、Taggable（タグ付け機能）、Orderable（並び替えロジック）
悪い例: MiscellanousUserLogic（ユーザー関連の雑多なロジックの寄せ集め）
## 2. ドメインの概念を表現する
Concernは、ビジネスロジックやアプリケーションのドメインにおける重要な概念をコード上に明示的に表現する手段となります。
Concernの名前は、そのConcernがどのような「特性（trait）」や「振る舞い（behavior）」をモデルに付与するのかを明確に表すものにしましょう。
例: Userモデルが「記事を投稿できる」という役割を持つ場合、Publishable Concernを作成し、投稿に関連するロジック（publish, unpublish, published?など）をそこに含める。
## 3. 「has a」または「acts as」の関係性を意識する
Concernは、モデルが「ある特性を持つ (has a trait)」または「ある役割として振る舞う (acts as a role)」という関係性を表現するのに適しています。
これにより、モデルの主たる責務とは少し異なるが、モデルに付随する機能を綺麗に分離できます。
## 4. インターフェースを明確にする
Concernをincludeしたクラスが利用するパブリックなメソッドや、Concern内部で利用されるincludedブロック内のマクロ（has_many, scopeなど）が明確であるべきです。
Concernを利用する側が、そのConcernが何を提供し、どのように動作するのかを容易に理解できるようにします。
## 5. 再利用性を考慮する（ただし、無理に汎用化しすぎない）
複数のモデルで共通して必要となる機能はConcernに切り出すことで、コードの重複を避け、再利用性を高めることができます。
ただし、特定のモデルに強く依存するロジックを無理に汎用的なConcernにしようとすると、複雑性が増す場合があります。その場合は、モデル固有のConcern（例：app/models/user/authentication.rb）とする方が適切なこともあります。
## 6. 過度な利用を避け、他の設計パターンと使い分ける
Concernは万能薬ではありません。すべてのロジックをConcernに切り出すべきではありません。
Service Object: 複数のモデルにまたがる複雑なビジネスプロセスや、1つのアクションが多くの副作用を持つ場合。
Value Object: 値そのものに意味があり、不変なオブジェクト（例：Money, Address）。
PORO (Plain Old Ruby Object): 特定のフレームワークに依存しない、ビジネスロジックをカプセル化するための純粋なRubyクラス。
Concernは、主にモデルの責務を整理し、特定の振る舞いを追加する際に有効です。
## 7. 可読性を常に意識する
Concernを利用することで、モデル本体のコードがスリムになり、見通しが良くなることが期待されます。
しかし、Concernに処理が分散しすぎると、メソッドの定義場所を探すのが困難になるなど、かえって可読性が低下することもあります。
Concernの名前、Concern内のコードの整理、適切な粒度での分割を心がけましょう。
## 8. included ブロックの適切な利用
Concernがincludeされた際に実行したいクラスレベルの処理（関連付け、スコープ定義、バリデーションなど）はincluded do ... endブロック内に記述します。
インスタンスメソッドは通常通りmodule直下に定義します。

```rb
# app/models/concerns/publishable.rb
module Publishable
  extend ActiveSupport::Concern

  included do
    # クラスレベルの処理
    scope :published, -> { where(published_at: ..Time.current) }
    validates :title, presence: true, if: :published?
  end

  # インスタンスメソッド
  def publish
    update(published_at: Time.current)
  end

  def unpublish
    update(published_at: nil)
  end

  def published?
    published_at.present? && published_at <= Time.current
  end
end

# app/models/article.rb
class Article < ApplicationRecord
  include Publishable
  # ... 他のロジック ...
end
```
これらのガイドラインを守ることで、ActiveSupport::Concernを効果的に活用し、よりメンテナンスしやすく理解しやすいRailsアプリケーションを構築できるでしょう。
</details><br />


記事の要約やGeminiによる解説を見る限りだと、ドメインを表現する関心事であり、モデルの主となるロジックとは異なるものをConcernとして切り出すと良いという風に読める。そのConcernが複数のクラスで再利用できるものであれば`app/models/concerns/`に配置し、特定のクラスでしか使わないようなものであれば`app/models/user/authentication`のように特定のクラスと同名のリポジトリ配下に置くのが良いみたい。

RailsはActiveRecordを使う関係上、モデルクラスはリソースクラスとなりやすい。そういったモデルクラスに対して、そのリソースを作成・編集するようなイベントごとにConcernで分離し、ドメインを表現するというのが良い使用法と言えそう。

逆にRailsでも工夫してイベントクラスとして設計・実装されていれば、モデルクラスがドメインモデルとして機能するためConcernの出番はないとも言えそう。

こう考えると、Concernの使い道が見えてきた気がする。

一方でConcernはコントローラでも使えるはずだが、コントローラでの使用例は全く出てこなかった。ドメインを表現するという話なので、話に出てこないのは納得ではあるが。

# 感想

Concernがリソースクラスを量産しやすいRailsにおいてドメインを表現するのに有用であるということは理解できた。しかし、冒頭に挙げたようにConcernのモジュールはinclude先のクラスの実装に依存する場合が多く、なかなか受け入れ難い気持ちは変わらない。またドメインの表現に便利とはいえ、そもそもドメインを表現するために適切に設計するという行為自体が一般的に難易度が高いものであり、適切にConcernsを活用するのは一般的に難しいと言える。一流のエンジニア集団であれば有効に活用できるだろうが、多くの企業では安易に採用するといつの間にか負債の温床になっているというのも珍しくないのではないだろうか。

総じて[ServiceObject](https://medium.com/selleo/essential-rubyonrails-patterns-part-1-service-objects-1af9f9573ca1)と同じような印象を受ける。適切に使えれば有益な場面があるのだろうが、有益に使える人が少なすぎて負債の温床となるリスクの方が高すぎるツールである。個人開発では便利に使えるかもしれないが、チーム開発ではおいそれと使えるようなものではない。少なくともしっかりとガイドラインを設け、使用方法を厳格に定める必要があると思っているが、ガイドラインは時が経つと形骸化してくるもので、やはり極力使わないようにするのが安牌なのかなと思っている。

ちなみに異論は大歓迎で、`ActiveSupport::Concern`を使ってこんな素晴らしい実装をした！というサンプルがあれば話を伺いたい。特に一般企業でのチーム開発において上手に利用されているケースがあれば聞いてみたいものだ。
