---
title: Railsにクエリオブジェクトを導入してみました
date: 2026/5/22
tags: ["Rails"]
---

## はじめに

Railsを書いていると、複雑な集計をパフォーマンスよく行うために複雑なクエリを組み立てる場面があります。ActiveRecordにはscope機能があり、そこにクエリを書けばクラスメソッドがいい感じに生えて嬉しいのですが、クエリが複雑なためメンテしにくいです。またクエリが長文になりやすく、モデルのファイルの見通しが悪くなりがちです。

この記事では、そんな課題を解消するために **クエリオブジェクト** というパターンを導入した背景と、その具体的な実装方法の一例を紹介します。

---

## 導入前の課題感

プロジェクトが成長するにつれ、複雑な集計クエリをモデルのスコープやクラスメソッドとして書く機会が増えていきました。

```rb
class Order < ApplicationRecord
  scope :monthly_summary, ->(month:) {
    where(ordered_at: month)
      .joins(:user)
      .where(users: { active: true })
      .group("users.id", "users.name")
      .select("users.id", "users.name", "COUNT(orders.id) AS order_count", "SUM(orders.total_price) AS total_price")
  }
end
```

これは例なので比較的シンプルですが、実際はもっと複雑な生SQLがあちこちに埋め込まれていたりします。

処理は1箇所に詰め込まれており、何をしているのかが一読ではわかりません。クエリが複雑になるほど、次のような問題が出てきます。

- 何をしているかが一目でわからず、可読性が低い
- ロジックに名前がつかないため、処理の意図が伝わりにくい
- モデルファイルがSQL文で埋め尽くされる

---

## クエリオブジェクトとは何か

クエリオブジェクトとは、**データの抽出・検索・集計条件を定義した実体** です。

Railsの標準機能ではありませんが、広く使われている設計パターンのひとつです。

複雑なクエリロジックをクエリオブジェクトとして切り出すことは、クエリを意味ごとに切り分けて名前をつけたり、それによってモデルを汚染することもないため有効な手段だと考えました。

再利用可能であるかどうかについては重要視しておらず、むしろ単一のモデルでのみ使用可能である方が望ましいと思っています。異なるテーブルに対して同じクエリオブジェクトを用いたいというケースは現状想定していません。

---

## 導入にあたってのルール作成

クエリオブジェクトは自由度が高いぶん、チームで使う際は一定のルールを設けておく必要があると考えました。

クエリオブジェクトは実装方法や呼び出し方に自由度があります。それ自体は良いことですが、ルールがなければコードベースに統一性のない実装が散乱するだけになってしまいます。

特に回避するべきなのは、**サービスクラスの二の舞**です。とりあえず `call` メソッドを持っているだけのクラスが好き勝手に作られ、好き勝手に呼び出されるという状況は、クエリオブジェクトでも十分起こりえます。これを防ぐためにルールを設けました。

私たちのプロジェクトでは以下のルールを定めています。

### 配置・命名

1. `app/queries/` に配置すること
2. 利用するモデルクラスのインナーモジュールであること（例：`User::ActiveQuery`）
3. モジュールであること（クラスではない）
4. モジュール名が `Query` で終わること

### インターフェース

5. `self.call` メソッドを定義すること
6. `self.call` の第一引数にはデフォルト値を設定すること（例：`def self.call(scope = User.all)`）
7. 第二引数以降はキーワード引数にすること
8. publicクラスメソッドは `self.call` のみにすること

### 呼び出し方

9. クエリオブジェクトを直接呼び出さず、ActiveRecordの `scope` の引数としてのみ使用すること

```rb
# NG: 直接呼び出す
Order::ActiveQuery.call(month: Time.current.all_month)

# OK: scope の引数として渡す
class Order < ApplicationRecord
  scope :monthly_summary, MonthlySummaryQuery
end

Order.monthly_summary(month: Time.current.all_month)
```

---

## 実装方法

### ディレクトリ構成

`app/queries/` というカスタムディレクトリを作成します。

```
app/
└── queries/
    └── order/
        └── monthly_summary_query.rb
```

### クエリオブジェクトの実装

```rb

class Order < ApplicationRecord
  module MonthlySummaryQuery
    class << self
      def call(scope = Order.all, month:)
        scope = filter_by_month(scope, month)
          .then { filter_by_month(_1, month) }
          .then { join_users(_1) }
          .then { aggregate(_1) }
      end

      private

      def filter_by_month(scope, month)
        scope.where(ordered_at: month)
      end

      def join_users(scope)
        scope.joins(:user).where(users: { active: true })
      end

      def aggregate(scope)
        scope
          .group("users.id", "users.name")
          .select(
            "users.id",
            "users.name",
            "COUNT(orders.id) AS order_count",
            "SUM(orders.total_price) AS total_price"
          )
      end
    end
  end
end
```

この例だとほぼActiveRecordでクエリを組み立てられているため過剰かもしれませんが、実際には大きな生SQLがいくつかのprivateメソッドに切り分けられており、callメソッドで組み立てられているイメージです。

いくつかポイントを説明します。

- **`User` の名前空間の中に定義** することで、どのモデルに関するクエリかが明確になります。
- **`call` を入口にする** のはRubyのCallableオブジェクトの慣習で、`scope`に渡しやすくなります（後述）。
- **`scope` を引数に取る** ことで、呼び出し元のスコープと組み合わせられる柔軟な設計になっています。
- **複雑なクエリをprivateメソッドに分割する** ことで、それぞれに名前がつき、何をしているかが一目でわかるようになります。`call` を読むだけで処理の流れが把握できるのが理想です。

### 呼び出し方

Railsの `scope` はCallableオブジェクト（`call` メソッドを持つもの）を受け取れます。これを利用して、クエリオブジェクトをそのまま `scope` に渡せます。

```rb
class Order < ApplicationRecord
  scope :monthly_summary, MonthlySummaryQuery
end
```

```rb
# 使う側はいつものスコープと同じ感覚
Order.monthly_summary(month: Time.current.all_month)
```

クエリロジックが独立したモジュールになることで、**単体テストも書きやすくなります**。

```rb
RSpec.describe Order::MonthlySummaryQuery do
  describe ".call" do
    it "指定月のアクティブユーザーの注文を集計する" do
      month = Date.current.beginning_of_month
      active_user   = create(:user, active: true)
      inactive_user = create(:user, active: false)
      create(:order, user: active_user,   ordered_at: month + 1.day, total_price: 1000)
      create(:order, user: inactive_user, ordered_at: month + 1.day, total_price: 2000)

      result = described_class.call(month: month)

      expect(result.map(&:user_id)).to contain_exactly(active_user.id)
    end
  end
end
```

---

#### なぜこのルールなのか

**モジュールを強制する（ルール3）**のは、クエリオブジェクトがステートレスであるべきだからです。インスタンスを生成する必要がないことを明示するために、クラスではなくモジュールで定義します。

**`scope` の第二引数への受け渡しを強制する（ルール9）**のは、呼び出し方を統一するためです。Railsの `scope` はCallableオブジェクト（`call` メソッドを持つもの）を受け取れます。これを利用することで、「クエリオブジェクトを使いたければ必ずモデルにスコープを定義する」という一方向の流れが生まれます。また、`scope` に渡すという制約が、インターフェース（ルール5〜8）をある程度自然に強制する効果もあります。

### RuboCopのCustomCopで強制する

ルールを決めただけでは形骸化しがちです。そこで、これらのルールをRuboCopのCustomCopとして実装し、CIで自動的に検知できるようにしました。

守らせたいルールをAIに伝えてCustomCopを書かせることができるので、導入のハードルも下がっています。

---

## まとめ

クエリオブジェクトの導入によって、以下が改善されました。

- クエリロジックの責務が切り出され、モデルの肥大化を抑えられる
- クエリロジックを分割して名前をつけられるため理解しやすい
- クエリロジックを単独でテストできる
