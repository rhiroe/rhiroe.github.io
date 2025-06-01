# rhiroe.github.io

個人ブログサイト・ポートフォリオサイトです。Next.js + TypeScript + Material-UIで構築しています。

## 🚀 Tech Stack

- **Framework**: Next.js 15.3.2 (Static Site Generation)
- **Language**: TypeScript 5.8.3
- **UI Library**: Material-UI (MUI) 7.1.0
- **Styling**: Emotion + Styled Components
- **Package Manager**: pnpm 10.10.0
- **Testing**: Jest + React Testing Library
- **E2E Testing**: Playwright
- **Deployment**: GitHub Pages

## 📝 Features

### ブログ機能
- `public/content/`以下のMarkdownファイルで記事を管理
- Syntax Highlightingによるコードブロック表示
- Mermaid記法によるダイアグラム表示
- GitHub Flavored Markdown (GFM) サポート
- レスポンシブデザイン対応

### プロフィール機能
- `public/profile/resume.md`でプロフィール情報を管理
- 経歴・スキル情報の表示

### テーマ機能
- ダークモード・ライトモード対応
- モノクロトーンでモダンなデザイン
- レスポンシブフォントサイズ

## 🛠️ Development

### 必要な環境
- Node.js (最新のLTS版推奨)
- pnpm

### セットアップ
```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev

# ビルド
pnpm build

# テスト実行
pnpm test

# Linting
pnpm lint
```

## 📦 主要ライブラリ

### Markdown処理
- [remark](https://github.com/remarkjs/remark) - Markdownパーサー
- [remark-gfm](https://github.com/remarkjs/remark-gfm) - GitHub Flavored Markdown
- [remark-breaks](https://github.com/remarkjs/remark-breaks) - 改行処理
- [rehype-highlight](https://github.com/rehypejs/rehype-highlight) - Syntax Highlighting
- [highlight.js](https://github.com/highlightjs/highlight.js) - コードハイライト
- [mermaid](https://github.com/mermaid-js/mermaid) - ダイアグラム描画

### UI・スタイリング
- [@mui/material](https://mui.com/) - Material-UI コンポーネント
- [@emotion/react](https://emotion.sh/) - CSS-in-JS
- [styled-components](https://styled-components.com/) - スタイリング

### その他
- [gray-matter](https://github.com/jonschlinkert/gray-matter) - Front Matter パーサー
- [@octokit/rest](https://github.com/octokit/rest.js/) - GitHub API クライアント

## 🚀 デプロイ

GitHub Actionsによる自動デプロイ（mainブランチへのpush時）

### ワークフロー
1. **ESLint**: コード品質チェック
2. **Test**: ユニットテスト実行
3. **Build**: 静的サイト生成
4. **Deploy**: GitHub Pagesへデプロイ

### 使用しているActions
- [actions/checkout@v4](https://github.com/actions/checkout)
- [actions/setup-node@v4](https://github.com/actions/setup-node)
- [actions/upload-pages-artifact@v3](https://github.com/actions/upload-pages-artifact)
- [actions/deploy-pages@v4](https://github.com/actions/deploy-pages)

## 📁 Project Structure

```
src/
├── components/           # Reactコンポーネント
│   ├── blog/            # ブログ関連コンポーネント
│   └── common/          # 共通コンポーネント
├── lib/                 # ユーティリティライブラリ
├── pages/               # Next.jsページ
├── styles/              # スタイルファイル
├── theme/               # MUIテーマ設定
└── types/               # TypeScript型定義

public/
├── content/             # ブログ記事（Markdown）
├── profile/             # プロフィール情報
└── images/              # 画像ファイル
```

## 🤖 Built with GitHub Copilot Agent

このプロジェクトは、**GitHub Copilot Agent**によって大部分が設計・実装されています！

### 🧠 AI Agentとしての実行プロセス

Copilot Agentは、以下のような思考プロセスでプロジェクト全体を構築しました：

1. **🔍 要件分析**: 「個人ブログサイト」という要求から必要な機能を自動的に洗い出し
2. **🎯 技術選定**: 最新のベストプラクティスに基づいてNext.js + TypeScript + MUIを選択
3. **🏗️ アーキテクチャ設計**: 拡張性と保守性を考慮したディレクトリ構造とコンポーネント設計
4. **⚡ 段階的実装**: 基盤→UI→機能→テスト→デプロイの順序で体系的に開発
5. **🔧 継続的改善**: ユーザーフィードバックに基づく機能追加とリファクタリング

### 🤖 Copilot Agentが自律的に実装した機能

- 📝 **ブログエンジン**: Markdown処理パイプライン（remark → rehype → highlight.js）の構築
- 🎨 **デザインシステム**: Material-UIベースのカスタムコンポーネントライブラリ
- 🌙 **テーマエンジン**: モノクロトーンなダーク/ライトモード切替システム
- 📱 **レスポンシブUI**: モバイルファーストなレイアウト設計
- 📊 **Mermaid統合**: 図表描画機能の組み込み
- 🔧 **開発環境**: TypeScript + ESLint + Jest + Playwrightの完全設定
- 🚀 **CI/CDパイプライン**: GitHub Actionsによる自動化されたテスト・ビルド・デプロイ
- 📚 **プロジェクト文書化**: この包括的なREADMEとコメント

### 🚀 GitHub Copilot Agentの特徴

#### 🧭 **自律的な判断力**
- 要求から最適な技術スタックを自動選択
- 業界標準のベストプラクティスを自然に適用
- 将来の拡張性を見越した設計判断

#### ⚡ **超高速開発**
- 複雑なシステムを数時間で構築
- バグの少ない高品質なコードを初回から生成
- 手作業では膨大な時間がかかる設定作業を瞬時に完了

#### 🎯 **一貫性の維持**
- プロジェクト全体で統一されたコーディングスタイル
- 命名規則やディレクトリ構造の一貫性
- UIデザインの統一感

#### 🔄 **学習・適応能力**
- ユーザーの要求を理解して機能を改善
- 最新技術トレンドに自動的に対応
- プロジェクト固有の要件に柔軟に適応

**GitHub Copilot Agent** は、もはや単なるコード生成ツールではありません。プロジェクトの企画・設計・実装・テスト・デプロイ・保守まで、ソフトウェア開発の全工程を担える**真のAI開発パートナー**です！

*AI Agentと協働する次世代の開発体験を、あなたも体験してみませんか？* 🤖✨

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
