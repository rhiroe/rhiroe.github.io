---
title: RSpecで環境変数をテストする - with_envヘルパーのすすめ
date: 2026/1/29
tags: ["Rails", "RSpec"]
---

RSpecで環境変数を使ったコードをテストするとき、`allow(ENV)`でスタブを書くことが多い。しかし、この方法には注意点があり、見落とすとテストが不安定になる。今回はこの問題を解決するために用意した`with_env`ヘルパーを紹介する。既存の`allow(ENV)`と比較して、リスクを抑えてテストを書ける方法だ。

## なぜ環境変数を使うのか

そもそもなぜ環境変数なのか。Railsには`credentials`や`config.x`といった設定管理の仕組みがあるのに、あえて環境変数を選んでいる。

自分が関わっているアプリケーションでは、設定値へのアクセス権限を厳密に管理する必要がある。APIキーやデータベース接続情報など、機密性の高い設定が多く、参照できる人間を限定しなければならない。

Railsの`credentials`は確かに暗号化されていて、復号には`master.key`が必要だ。ただ、開発チームで作業するためには結局そのキーを共有する必要がある。本番環境用のcredentialsと開発環境用のcredentialsを分けることもできるが、開発メンバー全員に本番のmaster.keyを配布してしまうと、結局全員が本番の機密情報にアクセスできてしまう。

一方、環境変数であればAWS Systems Manager Parameter Storeで集中管理できる。Parameter Storeならアクセス権限をIAMポリシーで細かく制御できるので、「この人は本番環境の設定を見られる」「この人は開発環境のみ」といった制御が可能だ。設定値ごとに異なる権限を設定することもできる。

この運用方針のため、環境変数が大量に使われている。だからこそ、環境変数のテストをきちんと書けることが重要になってくる。

## 既存の方法：allow(ENV)によるスタブ

環境変数を使うコードをテストする場合、テスト用の値に置き換える必要がある。RSpecには標準でモック機能があるので、`allow(ENV)`を使ってスタブするのが一般的だ。

特定のキーだけをスタブし、それ以外は元の動作を保持するには、`and_call_original`と組み合わせる必要がある。

```rb
RSpec.describe SomeApiClient do
  it 'uses API key from ENV' do
    allow(ENV).to receive(:[]).and_call_original
    allow(ENV).to receive(:[]).with('API_KEY').and_return('test_key')

    client = SomeApiClient.new
    expect(client.api_key).to eq 'test_key'
  end
end
```

正しく書けば動作する。ただし、いくつか注意点がある。

**注意点1: 実装の詳細に依存する**

`ENV`にアクセスするメソッドは複数ある。

```rb
ENV['API_KEY']           # []
ENV.fetch('API_KEY')     # fetch
ENV.key?('API_KEY')      # key?
```

`[]`をスタブした場合、コードが`fetch`を使っていると動かない。

```rb
# テストでは [] をスタブ
allow(ENV).to receive(:[]).and_call_original
allow(ENV).to receive(:[]).with('API_KEY').and_return('test_key')

# 実装が fetch を使っていると nil が返る
api_key = ENV.fetch('API_KEY')  # => nil
```

実装を`[]`から`fetch`に変更しただけでテストが壊れてしまう。

**注意点2: and_call_originalが必要**

単純に`allow(ENV).to receive(:[]).with('API_KEY').and_return('test_key')`だけを書くと、スタブしていない他のキーにアクセスすると`nil`になってしまう。

```rb
allow(ENV).to receive(:[]).with('API_KEY').and_return('test_key')

# これはnilになる
ENV['DATABASE_URL']  # => nil
```

これを避けるには`and_call_original`を先に書く必要がある。

```rb
allow(ENV).to receive(:[]).and_call_original
allow(ENV).to receive(:[]).with('API_KEY').and_return('test_key')
```

この書き方を知らないと、テスト対象のコードが内部で他の環境変数も参照していた場合、それらが`nil`になり、予期しない場所でテストが落ちる。

## 新たな方法：with_envヘルパー

これらの注意点を見落とすとテストが不安定になる。そこで、実際のENVオブジェクトを一時的に書き換える`with_env`ヘルパーを用意した。

```rb
RSpec.describe SomeApiClient do
  it 'uses API key from ENV' do
    with_env('API_KEY' => 'test_key') do
      client = SomeApiClient.new
      expect(client.api_key).to eq 'test_key'
    end
  end
end
```

実装はシンプル。

```rb
# spec/support/env_helper.rb
module EnvHelpers
  def with_env(hash)
    original = ENV.to_hash
    hash.each { |k, v| ENV[k] = v }

    begin
      yield
    ensure
      ENV.replace(original)
    end
  end
end

RSpec.configure do |config|
  config.include EnvHelpers
end
```

実際のENVを書き換えるだけなので、`[]`でも`fetch`でもどのメソッドを使っても動作する。スタブしていない他のキーも正常に動作する。ブロックを抜けると自動的に元に戻る。

## 既存の方法と新しい方法の比較

新しく用意した`with_env`ヘルパーと、既存の`allow(ENV)`によるスタブを比較してみる。

|  | allow(ENV) + and_call_original | with_env |
|---|---|---|
| 実装の詳細への依存 | `[]`か`fetch`かを意識する必要がある | 意識する必要がない |
| 暗黙知の要求 | `and_call_original`を知っている必要がある | 特に必要ない |
| 複数メソッドへの対応 | `[]`と`fetch`を両方スタブする必要がある | 何もしなくても動く |
| クリーンアップ | RSpecが自動で戻す | `ensure`ブロックで自動で戻す |
| カスタムコップでの強制 | 順序や複数メソッドのチェックが複雑で難しい | シンプルに検知できる |

`allow(ENV)`と`and_call_original`を正しく組み合わせれば動作する。しかし、それには暗黙知が必要で、初心者には難しい。実装の詳細（`[]`か`fetch`か）に依存してしまうという問題もある。

一方、`with_env`ヘルパーはシンプルだ。実際のENVを書き換えるだけなので、どのメソッドを使っても動作する。`and_call_original`のような暗黙知も不要で、ブロックを抜ければ自動的に元に戻る。

## カスタムコップでwith_envヘルパーの使用を促す

`with_env`ヘルパーの方が理解しやすく、テストも書きやすい。チーム全体でこの新しい方法を使うようにしたいので、カスタムコップを作った。`allow(ENV)`の使用を検知して、`with_env`の使用を促すことができる。

```rb
# lib/custom_cops/rspec/avoid_allow_env.rb
module CustomCops
  module RSpec
    class AvoidAllowEnv < ::RuboCop::Cop::RSpec::Base
      MSG = '`allow(ENV)` の代わりに `with_env` ヘルパーを使用してください。'

      def_node_matcher :allow_env?, <<~PATTERN
        (send nil? :allow (const nil? :ENV))
      PATTERN

      def on_send(node)
        return unless allow_env?(node)

        add_offense(node)
      end
    end
  end
end
```

これで既存のコードベースにある`allow(ENV)`を発見して、段階的に`with_env`に移行できる。

`allow(ENV)`と`and_call_original`を正しく組み合わせているかをカスタムコップでチェックすることも理論上は可能だ。しかし、順序のチェックや複数メソッドのチェックなど、ASTの解析が非常に複雑になる。それよりも、注意点を見落とすリスクを根本的に排除する方が良い。だから`allow(ENV)`は使わず、新しく用意した`with_env`ヘルパーに統一する方針にした。そのために、`allow(ENV)`自体を検知するシンプルなカスタムコップを作った。

## まとめ

RSpecで環境変数のテストを書く場合、`allow(ENV)`によるスタブが使える。しかし、この方法には注意点があり、見落とすとテストが不安定になる。

そこで`with_env`ヘルパーという新しい方法を用意した。実際のENVを一時的に書き換えるシンプルな仕組みだ。

既存の`allow(ENV)`と比較すると、`with_env`ヘルパーの方がリスクを抑えて利用できる。実装の詳細に依存せず、暗黙知も不要で、カスタムコップでの強制もできる。

だから`with_env`ヘルパーを用意し、カスタムコップで`allow(ENV)`の使用を検知して、段階的に移行を進めている。

環境変数のテストは地味だが重要だ。`with_env`を使うことで、テストがシンプルでわかりやすくなり、安定性と保守性が大きく向上する。
