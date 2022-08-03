---
title: TypeScriptの型覚書
date: 2022/8/3
tags: ["TypeScript"]
---

# TypeScriptの型

ハンズオンでアプリ作りながら型もついでにってやり方だとうろ覚えになってしまったので、一旦「型とは」について学ぶことにする。

## プリミティブ型

JavaScriptのプリミティブ型に対応する型であり、利用するにあたって特に難しいところはない。
`string`, `number`, `boolean`, `symbol`, `bigint`, `null`, `undefined`が存在する。

```typescript
const num: number = 10 // 10はstring型ではないのでエラー
const str: string = null // --strictNullChecksがオンになっている場合はエラー
```

## ちょっと特別な型

### void型

やや特別な型。`void`と`undefined`に対応する。

```typescript
const foo: void = () => {}
const bar: void = undefined
```

逆に`void`は`undefined`型には対応しない。

```typescript
const bar: undefined = () => {}
// Type '() => void' is not assignable to type 'undefined'.
```

### Any型

なんでもありの型。これを使うことは敗北を意味する。

```typescript
let foo: any = 's' // OK
foo = 10           // OK
foo = null         // OK
```

### Never型

どんな値も属さない型。この型が宣言されたものはそんな値も受け取らない。

```typescript
const some: never = 0 // NG
```

実際にこの型が利用されるのは「絶対に値が返らない関数」や「可能性のない [型の絞り込み](#型の絞り込み) 」など。

```typescript
function func(): never {
  throw new Error('Hi')
}

const result: never = func() // OK
```

```typescript
const func = (arg: string | number): void => {
    if ('string' === typeof obj) {
    } else if ('number' === typeof obj) {
    } else {
        // argの型の候補であるstringとnumberが出し尽くされており
        // ここでのargはどんな型もあり得ない => never型
    }
}
```

## リテラル型

プリミティブ型のさらに限定的な型。指定したリテラルのみを許容する。

```typescript
const num: 1 = 10 // 許容されるのは1飲みのためエラーになる
```

リテラル型はその大分類のプリミティブ型に代入が可能。

```typescript
const ten_num: 10 = 10
const num: number = ten_num
```

## 型推論

リテラルが代入される場合、型の指定を省略しても型が推論される。`const`の場合は代入したリテラル型が、`let`の場合が代入したリテラルのプリミティブ型が推論される。

```typescript
const str = 'foo' // 'foo'型が推論される
let num = 10 // number型が推論される
```

## オブジェクト型

`{}`内にプロパティとその型を指定することでオブジェクト型とすることができる。型の定義には`type`や`interface`を使う。`type`と`interface`の違いは [こちら](https://zenn.dev/luvmini511/articles/6c6f69481c2d17) を参照する。

```typescript
type User = {
    name: string,
    age: number
}

const user: User = {
    name: 'Ryosuke Hiroe',
    age: 27
}
```

## 配列型

配列の要素となる型の後ろに`[]`を付けて配列であることを示す。

```typescript
const num_ary: number[] = [1, 2, 3]
```

## 関数型

引数と戻り値に型を指定した関数の型。

```typescript
type Func = (str: string) => boolean

const foo: Func = function(str) {
    return str == 'bar'
}

const bar: Func = (str) => str == 'bar'
```

ちなみに引数名が一致する必要はない。

```typescript
type Func = (str: string) => boolean
const foo: Func = (bar) => bar == 'bar' // OK
```

関数型ではないが、関数定義をするときに型を用いることもできる。

```typescript
function foo (str: string): boolean {
    return str == 'foo'
}
// アロー関数だと
// const foo = (srt: string): boolean => str == 'foo'
```

再代入が起きるとしても型推論があるので、基本的には関数定義側で型を用いれば良いと考える。

## 可長変引数の型指定

可長変な引数にも型指定が可能。`nums`の型を指定しているのであって、展開後の要素の型を指定しているわけではないので注意。

```typescript
const func = (...nums: number[]): void => {}

func(1, 2, 3)       // OK
func([1], [2], [3]) // NG
```

## クラス型

TypeScriptではクラスを定義すると同時に、そのインスタンスを示す型も同時に定義される。

```typescript
class Foo {
    method(): void {}
}

const foo: Foo = new Foo()
```

クラス型はそのメソッドをプロパティとして持つオブジェクト型で代用できる。

```typescript
class Foo {
    method(): void {}
}

type FooObject = {
    method: () => void
}

const foo: FooObject = new Foo() // OK
```

## ジェネリクス型

一言で言うと「引数を持つ型」。利用する側で型を指定する。

### オブジェクト型のジェネリクス

```typescript
type Foo<S, T> = {
  foo: S;
  bar: T;
}

const obj: Foo<number, string> = {
  foo: 3,
  bar: 'hi',
};
```

### 関数型でのジェネリクス

```typescript
type Func<T> = (str: T) => void

func<number>(3);
```

### 関数定義でのジェネリクス

```typescript
function func<T>(obj: T): void {}

func<number>(3);
```

アロー関数だと以下のようになる。

```typescript
const func = <T>(obj: T): void => {} 
// .tsxの場合は<T>がタグと認識されてしまうので`,`を足す
// const func = <T,>(obj: T): void => {} 

func<number>(3);
```

## タプル型

型の配列をタプル型として扱う。

```typescript
const foo: [string, number] = ['foo', 1]
```

ただし、配列のメソッドで操作可能であり、操作後の配列の型情報は操作前のもののままなので、タプル型を使用する際は注意する。

```typescript
const foo: [string, number] = ['foo', 1]
foo.pop()
foo.push('bar')

const num: string = foo[1] // OK
console.log('%o', num) //=> 'bar'
```

しかし、配列が１つのみの場合はちゃんとコンパイルエラーになるのでよくわからん。

```typescript
const foo: [number] = [1]
foo.pop()
foo.push('bar')
const num: string = foo[0] // コンパイルエラー
```

可長変のタプル型の宣言ができたりもする。ただし、可長変な要素の指定ができるのは変数の中で1部分のみ。

よくある使い方としては、関数の可長変引数の型をタプル型で宣言したりとか。

```typescript
const func = (...args: [...string[], number]): void => {}
func('A', 'B', 'C', 'D', 10)
```

## Union型

AもしくはBのような複数の型の可能性を宣言できる。

```typescript
const foo: string | number = 'foo'
const bar: string | number = 1
```

### 型の絞り込み

`in`演算子や`typeof`を用いることで以降のオブジェクト型を絞り込むことが可能。

```typescript
type A = {
    foo: string
}
type B = {
    bar: number
}

const func = (obj: A | B): void => {
    if ('foo' in obj) {
        // fooプロパティを持つのはA型なのでobjはA型
    } else {
        // objはB型
    }
}
```

```typescript
const func = (arg: string | number): void => {
    if ('string' === typeof obj) {
        // objはstring型
    } else {
        // objはnumber型
    }
}
```

### nullチェック

ここまでのunion型と絞り込みを使ってnullチェックを行えます。

```typescript
const func = (arg: string | null): void => {
    if (arg != null) {
        // Not Nullなのでstring型
    }
}
```

### Union型を使ったジェネリクス型

```typescript
type Some<T> = {
  type: 'Some';
  value: T;
}
type None = {
  type: 'None';
}
type Option<T> = Some<T> | None;

function map<T, U>(obj: Option<T>, f: (obj: T)=> U): Option<U> {
  if (obj.type === 'Some') {
    // ここではobjはSome<T>型
    return {
      type: 'Some',
      value: f(obj.value),
    };
  } else {
    return {
      type: 'None',
    };
  }
}
```
