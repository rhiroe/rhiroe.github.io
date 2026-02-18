---
title: トランザクションスクリプトを書くのをやめよう
date: 2026/2/18
tags: ["Ruby", "OOD"]
---

## 1. トランザクションスクリプトとは何か

Martin Fowler の *Patterns of Enterprise Application Architecture* で定義されたパターンで、
**1つのユースケース（トランザクション）を1つの手続きとして上から下へ書き下す**スタイルです。

```ruby
# これがトランザクションスクリプト
class OrderService
  def self.place_order(user_id, item_ids, coupon_code)
    user = User.find(user_id)
    items = Item.where(id: item_ids)

    # 在庫チェック
    items.each do |item|
      raise "在庫切れ: #{item.name}" if item.stock <= 0
    end

    # 合計金額計算
    total = items.sum(&:price)

    # クーポン適用
    if coupon_code.present?
      coupon = Coupon.find_by!(code: coupon_code)
      raise "期限切れ" if coupon.expired?
      total = total * (1 - coupon.discount_rate)
    end

    # 注文作成
    order = Order.create!(user: user, total: total)
    items.each do |item|
      order.order_items.create!(item: item)
      item.update!(stock: item.stock - 1)
    end

    # 通知
    UserMailer.order_confirmation(user, order).deliver_later

    order
  end
end
```

一見シンプルですが、これは **手続き型プログラミング** です。

---

## 2. トランザクションスクリプトの何がダメなのか

### 2.1 ドメインモデルが貧血になる（Anemic Domain Model）

トランザクションスクリプトを書くと、モデルは getter/setter とバリデーションだけの「データの入れ物」になります。
ビジネスルールが分散し、モデルを見ただけではドメインの振る舞いが分かりません。

```ruby
# 貧血モデルの例 - 何ができるオブジェクトなのか分からない
class Coupon < ApplicationRecord
  validates :code, presence: true
  validates :discount_rate, numericality: { in: 0..1 }
end
```

### 2.2 ロジックが重複する

「クーポンが有効かどうか」のチェックが、あちこちにコピペされます。

```ruby
# OrderService にも...
raise "期限切れ" if coupon.expired_at < Time.current

# CouponValidationService にも...
return false if coupon.expired_at < Time.current

# Admin::CouponController にも...
if coupon.expired_at < Time.current
  # ...
end
```

モデルに `expired?` メソッドが1つあれば済む話です。

### 2.3 テストが書きにくい

トランザクションスクリプトは依存が多く、テストのセットアップが巨大になります。
「クーポンの期限切れ判定」をテストしたいだけなのに、ユーザー、商品、在庫、メーラーの全てをセットアップする必要が生じます。

### 2.4 変更に弱い

ビジネスルールの変更時に「どこのコードを直すべきか」が分かりません。
grep して全箇所を直す必要があり、修正漏れがバグになります。

### 2.5 オブジェクト指向の恩恵を捨てている

Ruby はオブジェクト指向言語です。トランザクションスクリプトは Ruby の強みである
カプセル化・ポリモーフィズム・継承を全て無視し、C言語の構造体＋関数のように書くことです。

---

## 3. 「でも Service Object は便利では？」への回答

### よくある誤解

> 「Fat Model を避けるために Service Object に切り出すのがベストプラクティス」

これは**誤り**です。Fat Model の解決策は Service Object ではなく **PORO への分解** です。

Service Object がやっていることを分析すると、大半は次のどれかです：

| Service がやっていること | 本来の置き場所 |
|---|---|
| 1つのモデルのデータだけで完結するロジック | **そのモデル自身** |
| バリデーション | **モデル or カスタムバリデータ** |
| 計算・変換 | **Value Object（PORO）** |
| 条件判定・認可 | **Policy Object（PORO）** |
| 複数モデルにまたがるドメイン概念 | **その概念を表すドメインモデル（PORO）** を設計する |
| 外部APIとの連携 | **Gateway / Adapter（PORO）** |

**Service Object を作る前に、本当にそれがモデルやPOROに置けないか考えてください。**

---

## 4. 正しいリファクタリングの実例

### Before: トランザクションスクリプト

```ruby
class ApplyCouponService
  def initialize(order, coupon_code)
    @order = order
    @coupon_code = coupon_code
  end

  def call
    coupon = Coupon.find_by!(code: @coupon_code)

    # クーポンの有効性チェック
    raise InvalidCouponError if coupon.expired_at < Time.current
    raise InvalidCouponError if coupon.usage_count >= coupon.usage_limit
    raise InvalidCouponError if coupon.minimum_amount > @order.total

    # 割引計算
    discount = if coupon.percentage?
                 @order.total * coupon.discount_rate
               else
                 coupon.discount_amount
               end
    discount = [discount, @order.total].min

    # 適用
    ActiveRecord::Base.transaction do
      @order.update!(discount: discount, coupon: coupon)
      coupon.increment!(:usage_count)
    end
  end
end
```

**問題点:**
- クーポンの有効性判定ロジックが Service に漏れている
- 割引額の計算ロジックが Service に漏れている
- Coupon モデルを見ても何ができるか分からない

### After: Rich Domain Model + PORO

```ruby
# クーポンの有効性判定と割引計算はクーポン自身が知っている
class Coupon < ApplicationRecord
  def applicable?(order)
    !expired? && within_usage_limit? && meets_minimum_amount?(order)
  end

  def expired?
    expired_at < Time.current
  end

  def calculate_discount(order_total)
    raw_discount = percentage? ? order_total * discount_rate : discount_amount
    [raw_discount, order_total].min
  end

  def consume
    increment!(:usage_count)
  end

  private

  def within_usage_limit?
    usage_count < usage_limit
  end

  def meets_minimum_amount?(order)
    minimum_amount <= order.total
  end
end
```

```ruby
# 注文へのクーポン適用は注文自身の責務
class Order < ApplicationRecord
  def apply_coupon(coupon_code)
    coupon = Coupon.find_by!(code: coupon_code)
    raise InvalidCouponError unless coupon.applicable?(self)

    transaction do
      update!(discount: coupon.calculate_discount(total), coupon: coupon)
      coupon.consume
    end
  end
end
```

```ruby
# Controller はシンプルに
class OrdersController < ApplicationController
  def apply_coupon
    order = current_user.orders.find(params[:order_id])
    order.apply_coupon(params[:coupon_code])
    render json: order
  end
end
```

**改善点:**
- `Coupon` を見れば「有効性判定」「割引計算」ができることが一目で分かる
- `Order` を見れば「クーポン適用」ができることが一目で分かる
- クーポンの有効性判定をテストするのに Order のセットアップが不要
- Service クラスが不要になった

---

## 5. Fat Model を避けるための PORO 分解パターン

「モデルに書けと言うが、モデルが肥大化するのでは？」という懸念への回答です。

### 5.1 Value Object - 値の概念を表現する

```ruby
# 注文の割引額をValue Objectに抽出
# app/models/order/discount.rb
class Order::Discount
  attr_reader :raw_amount, :order_total

  def initialize(raw_amount:, order_total:)
    @raw_amount = raw_amount
    @order_total = order_total
  end

  # 割引額は注文合計を超えない
  def amount
    [raw_amount, order_total].min
  end

  def discounted_total
    order_total - amount
  end

  def free?
    discounted_total.zero?
  end

  # Value Object は等価比較できる
  def ==(other)
    amount == other.amount && order_total == other.order_total
  end
end
```

```ruby
# Coupon#calculate_discount が Value Object を返すようにすると、
# 割引に関するロジックが1箇所に集約される
class Coupon < ApplicationRecord
  def calculate_discount(order_total)
    raw = percentage? ? order_total * discount_rate : discount_amount
    Order::Discount.new(raw_amount: raw, order_total: order_total)
  end
end
```

```ruby
# Ruby 3.2+ なら Data.define でイミュータブルな Value Object を簡潔に定義できる
Order::Money = Data.define(:amount, :currency) do
  def to_s
    "#{currency} #{amount}"
  end
end
```

### 5.2 Policy Object - 条件判定を抽出する

```ruby
# クーポン適用可否の判定ロジックが複雑になったら Policy Object に抽出する
# app/models/coupon/applicability_policy.rb
class Coupon::ApplicabilityPolicy
  def initialize(coupon, order)
    @coupon = coupon
    @order = order
  end

  def applicable?
    !expired? && within_usage_limit? && meets_minimum_amount? && eligible_items?
  end

  def rejection_reasons
    reasons = []
    reasons << "クーポンの有効期限が切れています" if expired?
    reasons << "クーポンの利用上限に達しています" unless within_usage_limit?
    reasons << "注文金額が最低利用金額に達していません" unless meets_minimum_amount?
    reasons << "対象商品が含まれていません" unless eligible_items?
    reasons
  end

  private

  def expired?
    @coupon.expired_at < Time.current
  end

  def within_usage_limit?
    @coupon.usage_count < @coupon.usage_limit
  end

  def meets_minimum_amount?
    @coupon.minimum_amount <= @order.total
  end

  def eligible_items?
    return true if @coupon.target_item_ids.blank?

    (@coupon.target_item_ids & @order.item_ids).present?
  end
end
```

```ruby
# モデルから委譲する
class Coupon < ApplicationRecord
  def applicable?(order)
    applicability_policy(order).applicable?
  end

  def rejection_reasons(order)
    applicability_policy(order).rejection_reasons
  end

  private

  def applicability_policy(order)
    Coupon::ApplicabilityPolicy.new(self, order)
  end
end
```

### 5.3 複数モデルにまたがるドメイン概念

複数モデルの協調が必要なとき、まず考えるべきは「最も責務の近いモデルのメソッドにできないか」です。
たとえば注文確定は `Order#checkout` で十分です。

しかし、**既存のどのモデルにも属さない独立したドメイン概念**が存在する場合は、
それを表現するドメインモデル（PORO）を設計します。

ここでクラスの命名に注意が必要です。
**クラス名が動詞的だと、トランザクションスクリプトに陥りやすくなります。**

```ruby
# ダメなパターン: クラス名が動詞的 → 自然と「手続きを実行するクラス」になる
class Order::ItemExchange
  def initialize(order:, original_item:, replacement_item:)
    # ...
  end

  def complete  # complete, call, execute, perform... 汎用的な名前は手続き的発想の証拠
    validate_return_window
    validate_stock
    ActiveRecord::Base.transaction do
      # 手続きの羅列...
    end
  end
end
```

クラス名を動詞（`Exchange` = 交換する）にすると、「交換を実行するクラス」という
手続き的な発想になり、`complete` や `call` のような汎用的な単一エントリポイントに収束します。

**クラス名は名詞にしてください。** 名詞は「状態を持つもの」「振る舞いを持つもの」
という発想を誘い、複数のメソッドを持つ豊かなオブジェクトにつながります。

たとえば「返品申請」という名詞で設計すると：

```ruby
# 良いパターン: クラス名が名詞 → 状態と複数の振る舞いを持つドメインモデルになる
# app/models/order/return_claim.rb
class Order::ReturnClaim
  include ActiveModel::Model
  include ActiveModel::Validations

  attr_reader :order, :item

  validate :within_return_window
  validate :item_in_order

  def initialize(order:, item:)
    @order = order
    @item = item
    super()
  end

  def exchange_for(replacement)
    return false unless valid?
    return false unless verify_stock(replacement)

    ActiveRecord::Base.transaction do
      item.return_to_stock
      replacement.deduct_stock
      order.record_exchange(item, replacement)
    end
    true
  end

  def refund
    return false unless valid?

    ActiveRecord::Base.transaction do
      item.return_to_stock
      order.record_refund(item)
    end
    true
  end

  private

  def within_return_window
    errors.add(:base, "返品可能期間を過ぎています") unless order.within_return_window?
  end

  def item_in_order
    errors.add(:item, "この注文に含まれていません") unless order.includes_item?(item)
  end

  def verify_stock(replacement)
    return true unless replacement.out_of_stock?

    errors.add(:base, "交換先の商品の在庫がありません")
    false
  end
end
```

```ruby
# Controller は ReturnClaim に命じるだけ。判断はオブジェクトが行う
class OrdersController < ApplicationController
  def exchange
    claim = Order::ReturnClaim.new(
      order: current_user.orders.find(params[:id]),
      item: Item.find(params[:item_id])
    )

    if claim.exchange_for(Item.find(params[:replacement_item_id]))
      render json: claim.order
    else
      render json: { errors: claim.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
```

**なぜこれはトランザクションスクリプトではないのか：**
- `Order::ReturnClaim`（返品申請）は名詞であり、状態と複数の振る舞いを持つドメインモデル
- `exchange_for` と `refund` という**異なる振る舞い**がある（単一エントリポイントではない）
- 返品可否の判断はオブジェクト自身が行う（Tell, Don't Ask）
- Controller は `claim.exchange_for(replacement)` と**命じるだけ**
- `Order` でも `Item` でもない、交差する概念に対してのみ別クラスを作っている

---

## 6. 判断フローチャート

新しいロジックを書く場所に迷ったら、以下の順で考えてください。

```
1. そのロジックは1つのモデルのデータだけで完結するか？
   → YES: そのモデルにメソッドを追加する
   → NO: 次へ

2. そのロジックは「値」や「計算」に関するものか？
   → YES: Value Object (PORO) を作る
   → NO: 次へ

3. そのロジックは「条件判定」「認可」に関するものか？
   → YES: Policy Object (PORO) を作る
   → NO: 次へ

4. 複数モデルにまたがるドメイン概念か？
   → YES: その概念を表すドメインモデル（PORO）を設計する
         命じれば自ら判断・行動できるオブジェクトにすること
   → NO: 次へ

5. 外部APIとの連携か？
   → YES: Gateway / Adapter (PORO) を作る
   → NO: 既存のモデルに追加できないか再検討する
```

---

## 7. Service Object を使ってよい場合

以下のような場合は、例外的に Service Object が許容されます。

- **インフラ層の処理**: メール送信のオーケストレーション、外部APIバッチ呼び出しなど、ドメインロジックではない技術的関心事

ただし、以下をチェックしてください：

- [ ] Service の中にビジネスルール（条件分岐、計算）が書かれていないか？
- [ ] そのロジックはモデルや PORO に移せないか？
- [ ] Service は単にモデルのメソッドを呼び出しているだけの「中間層」になっていないか？

---

## 8. コードレビューで指摘すべきサイン

以下のサインが見えたら、ドメインモデルにロジックを移すべきです：

1. **新しい Service クラスが追加されている** - そのロジックはモデルか PORO に置けないか検討する
2. **モデルの属性を外部から参照して条件分岐している** - その判定はモデル自身のメソッドにすべき
3. **同じ条件判定が複数箇所に現れる** - モデルのメソッドとして一箇所に集約すべき
4. **モデルに `validates` と `belongs_to` しかない** - 貧血モデルの兆候。ビジネスロジックが別の場所に漏れている
5. **テストで大量の fixture/factory が必要** - ロジックの置き場所が間違っている。モデルに移せば単体でテストできる

---

## 9. まとめ

| やめてほしいこと | 代わりにやってほしいこと |
|---|---|
| ビジネスロジックを手続き的なクラスに羅列する | モデル自身にビジネスロジックを持たせる |
| モデルの外にロジックを集める | PORO (Value Object, Policy Object) に分解してモデルから委譲する |
| モデルをただのデータ入れ物にする | Rich Domain Model を育てる |

**「このロジックはどのオブジェクトが知っているべきか？」**

この問いを常に自分に投げかけてください。
答えは大抵、Service Object ではなく、ドメインモデルか、ドメインの概念を表す PORO です。

---

## 参考文献

- Martin Fowler, *Patterns of Enterprise Application Architecture* - "Transaction Script" と "Domain Model" の定義
- Martin Fowler, [AnemicDomainModel](https://martinfowler.com/bliki/AnemicDomainModel.html) - 貧血ドメインモデルのアンチパターン
- Sandi Metz, *Practical Object-Oriented Design in Ruby* - Ruby における OOD の実践
