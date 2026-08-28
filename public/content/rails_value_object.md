---
title: 値オブジェクトとcomposed_ofとAttributes API(CustomType)
date: 2026/08/28
tags: ["Rails"]
---

"値オブジェクト"という言葉をDDDの流行とともによく耳にするようになりました。

そして値オブジェクトというワードとともにcomposed_ofをいうRailsの機能を耳にすることも増えました。

## 値オブジェクトとは

不変性と等価性の性質を持つ「値」を表現するため抽象化された概念を値オブジェクトと言います。

## composed_of

RailsにはRails2系から存在する複数の値を1つのオブジェクトにまとめるcomposed_ofという機能があります。

値オブジェクト云々が広く話題になる前から存在する機能ですが、値オブジェクトのための機能かのように語られるのをよく見ます。

## Rubyで値オブジェクトを作る

よく例として目にするのは"お金"です。

Rubyには値オブジェクトを定義するための`Data`クラスがあるため、こちらを利用して簡単に作ることができます。

```rb
Money = Data.define(:amount, :currency)
Money.new(amount: 1_000, currency: '¥')
```

## 値オブジェクトとcomposed_of

composed_ofは複数のカラムの値で構成されたオブジェクトを扱うための機能です。

composed_ofは値オブジェクトのための機能ではありませんが、値オブジェクトを活用するために使える機能です。

```rb
class User < ApplicationRecord
  Address = Data.define(:postal_code, :prefecture, :city, :street, :building)
  composed_of :address, class_name: 'Address', mapping: {
    postal_code: :postal_code, prefecture: :prefecture,
    city: :city, street: :street, building: :building
  }
  FullName = Data.define(:first_name, :middle_name, :last_name)
  composed_of :fullname, class_name: 'FullName', mapping: {
    first_name: :first_name, middle_name: :middle_name, last_name: :last_name
  }
end
```

最初に書いた通り、composed_ofは値オブジェクトのために作られた機能ではありません。

composed_ofは値オブジェクトのための機能と思って使うと下記のような状態になることがあります。

```rb
class Invoice < ApplicationRecord
  YearMonth = Data.define(:reference_date) do
    def initialize(**kwargs)
      kwargs[:reference_date] = kwargs[:reference_date].beginning_of_month
      super
    end
  end
  composed_of :target_month, class_name: 'YearMonth', mapping: {
    reference_date: :reference_date
  }
end
```

こちらは複数の値で構成されたオブジェクトを扱っているわけではなく、カラムの値を別の型に変換するために使われています。

composed_ofは代入時の等価性比較や演算子オーバーロード、mappingで指定したアクセサを介したクエリ発行など、値オブジェクトを「組み立てる」ための複雑な機構を前提にした機能です。単にカラムの値を別の型に変換したいだけであれば、そうした機構は不要なオーバーヘッドになってしまいます。

何か重大な問題があるわけではありませんが、composed_ofの本来の使い方ではないため今回の用途には適していません。

## もう一つの選択肢 Attributes API(CustomType)

型を変換するための機能もRailsには備わっています。

```rb
class Invoice < ApplicationRecord
  YearMonth = Data.define(:reference_date) do
    def initialize(**kwargs)
      kwargs[:reference_date] = kwargs[:reference_date].beginning_of_month
      super
    end
  end

  class YearMonthType < ActiveRecord::Type::Date
    def cast(value)
      if value.is_a?(YearMonth)
        value
      elsif value.is_a?(::Date)
        YearMonth.new(reference_date: value)
      elsif value.respond_to?(:to_date)
        YearMonth.new(reference_date: value.to_date)
      end
    end

    def serialize(value) = super(value&.reference_date)
  end

  attribute :reference_date, YearMonthType.new
  alias_attribute :target_month, :reference_date
end
```

カラムの値を別の型に変換するだけの場合はこちらの機能を使う方が適しています。

## まとめ

値オブジェクトを活かすためのRailsの機能を2つ紹介しましたが、どちらも値オブジェクトのための機能ではありません。

Railsの機能を目的に合わせて適切に使い分けていきましょう。

## 蛇足

composed_ofは過去に削除が検討された機能です。いまだにエッジケースでバグが残っていたりします。

https://github.com/rails/rails/pull/6743

便利な機能なのでもっと使いやすくしたいなという気持ちがあるのですが、構成後のオブジェクトを使ってクエリを発行するための機能が結構複雑で、あんまり積極的に開発・メンテナンスがされていない印象です。

自分のやりたいことがクエリの変換部分にどういった影響を与えるのか分かりづらく、変更のPRを出すことも躊躇ってしまっています。

そこで、複数のカラムと構成後のオブジェクトのマッピングの機能のみを残し、whereでのクエリのための機能は削除し、composed_ofをシンプルにしてメンテナンス可能な機能にしませんか？という議論を起票しました。

https://github.com/rails/rails/discussions/58598

賛同いただけると嬉しいです。
