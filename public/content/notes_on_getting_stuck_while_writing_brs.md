---
title: BRSコメント書いててちょっとハマったところ覚書
date: 2025/5/26
tags: ["RBS"]
---

# 動的に増えたメソッド

例えばActiveRecordのselect。

```rb
User.select("'hello' as foo")
```

`User::ActiveRecord_Relation`が返りますが、その中の`User`クラスには動的に `def foo: () -> String`のメソッドが生えている。

なので`User#foo`を呼び出そうものならNoMethodエラーになる。

```rb
user = User.select("'hello' as foo").take!
user.foo
```

```text
sample.rb:2:5: [error] Type `::User` does not have method `foo`
│ Diagnostic ID: Ruby::NoMethod
│
└ user.foo
       ~~~
```

こういう時はその場でinterfaceを定義し、`User`との積集合の型としてやれば良い。

```rb
# @rbs!
#   interface _StringFoo
#     def foo: () -> String
#   end

user = User.select("'hello' as foo").take! #: User & _StringFoo
user.foo
```

`User::ActiveRecord_Relation`のまま使う場合、その後に使うメソッドのインターフェイスを用意して積集合でメソッドを上書きするとエラーが出なくなる。

```rb
# @rbs!
#   interface _StringFoo
#     def foo: () -> String
#   end
#
#   interface _StringFooEach
#     def each: () { (::Bank & _StringFoo) -> untyped } -> void
#   end

users = User.select("'hello' as foo") #: User::ActiveRecord_Relation & _StringFooEach
users.each do |user|
  puts user.foo
end
```

いずれにせよ動的なコードを書くと大変なので覚悟して実装する必要がある。

# メモ化されたメソッドのnilガード

例えばこんなやつ

```rb
class A
  include ActiveModel::Model

  # @rbs! extend ActiveModel::Attributes::ClassMethods

  include ActiveModel::Attributes

  # @rbs! def foo: () -> String?
  attribute :foo, :string
end

a = A.new

unless a.foo.nil?
  # このスコープでは a.foo は String のはず
  a.foo.upcase!
end
```

```text
sample.rb:16:8: [error] Type `(::String | nil)` does not have method `upcase!`
│ Diagnostic ID: Ruby::NoMethod
│
└   a.foo.upcase!
          ~~~~~~~
```

これはメソッド呼び出しは呼び出すたびに型が変わる可能性があるため。メソッド呼び出しではnilガードに関係なく常に返し得る全ての型が候補となる。

こういうのは一旦変数に入れてやれば良い。

```rb
a = A.new
foo = a.foo

unless foo.nil?
  foo.upcase!
end
```

とはいえ変数に入れたくない場面もある。例えばfooメソッドがクラス内で呼び出される場合。

```rb
class A
  include ActiveModel::Model

  # @rbs! extend ActiveModel::Attributes::ClassMethods

  include ActiveModel::Attributes

  # @rbs! def foo: () -> String?
  attribute :foo, :string

  # @rbs () -> String?
  def bar
    return foo.nil?

    foo.upcase!
  end
end
```

こういう場合、変数に代入することなくnilガードを有効にしたいはず。

何度呼び出しても同じ型を返すようなメソッドの場合はpureアノテーションをつけるとnilガードなどが可能になる。

```rb
class A
  include ActiveModel::Model

  # @rbs! extend ActiveModel::Attributes::ClassMethods

  include ActiveModel::Attributes

  # @rbs!
  #   %a{pure}
  #   def foo: () -> String?
  attribute :foo, :string

  # @rbs () -> String?
  def bar
    return foo.nil?

    foo.upcase!
  end
end
```

# Genericsの継承

こういうやつ。

```rb
class A[T]
end

class B[T] < A[T]
end
```

`@rbs generics`を使う。

```rb
# @rbs generic T
class A
end

# @rbs generic T
class B < A #[T]
end
```

継承先のGenericsに上界を設けることもできる。

```rb
# @rbs generic T
class A
end

# @rbs generic T < Numeric
class B < A #[T]
end
```

```rbs
# @rbs generic T
class A[T]
end

# @rbs generic T < Numeric
class B[T < Numeric] < A[T]
end
```

他にもあった気がするが忘れた。思い出したら追記する。
