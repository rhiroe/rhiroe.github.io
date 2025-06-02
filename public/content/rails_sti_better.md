---
title: RailsのSTIでよく踏むアンチパターン
date: 2025/5/26
tags: ["Rails"]
---

# RailsでSTI

RailsではSTI(単一テーブル継承)がサポートされている。サポートされているからには適切な場面では積極的に使っていきたい。しかしSTIは開発現場では比較的忌避されている傾向にあるように感じる。

# アンチパターンと解決策

忌避されているように感じるのは、おそらくSTIを採用した結果失敗した経験があるからだろう。自分もサービスクラスに同じような感覚を抱いている。ここではSTIでのアンチパターンであろうものと、その解決策をいくつか書いておく。

## Nullableなカラム

そもそも特定の仮装テーブルでしか使わないようなnullableなカラムが発生するのであればSTIを採用すべきではない。RailsでSTIを使うよくあるパターンとしては、紐づくテーブルがtypeによって変わるみたいなものだろうか。

```mermaid
erDiagram

animals {
  bigint id PK
  bigint dog_category_id FK
  bigint cat_category_id FK
  string type
  string name
}

dog_categories {
  bigint id PK
  string name
}

cat_categories {
  bigint id PK
  string name
}

dog_categories |o--o{ animals: is
cat_categories |o--o{ animals: is
```

```rb
class Animal < ApplicationRecord
  belongs_to :dog_category, optional: true
  belongs_to :cat_category, optional: true
end

class Dog < Animal
  class << self
    alias category dog_category
  end
end

class Cat < Animal
  class << self
    alias category cat_category
  end
end
```

これだと、`dog_category_id`と`cat_category_id`カラムはnullableになってしまう。

```mermaid
erDiagram

animals {
  bigint id PK
  string type
  string name
}

animal_dog_categories {
  bigint id PK
  bigint animal_id FK
  bigint dog_category_id FK
}

animal_cat_categories {
  bigint id PK
  bigint animal_id FK
  bigint cat_category_id FK
}

dog_categories {
  bigint ID PK
  string name
}

cat_categories {
  bigint ID PK
  string name
}

animals ||--o| animal_dog_categories: has
animals ||--o| animal_cat_categories: has
dog_categories ||--o| animal_dog_categories: has
cat_categories ||--o| animal_cat_categories: has
```

```rb
class Animal < ApplicationRecord
end

class Dog < Animal
  has_one: animal_dog_category
  has_one: category, through: :animal_dog_category,
                     class_name: 'DogCategory'
end

class Cat < Animal
  has_one: animal_cat_category
  has_one: category, through: :animal_cat_category,
                     class_name: 'CatCategory'
end
```

このようにCTI(クラステーブル継承)と組み合わせることで、同じように`category`で`DogCategory`や`CatCategory`にアクセスしつつ、nullableなカラムは発生しない。
