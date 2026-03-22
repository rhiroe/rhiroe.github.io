# 依存関係自動更新セットアップ（個別PR版）

このリポジトリには、npmの依存関係を**個別に**自動で更新するシステムが構築されています。各パッケージは個別のPRとして作成され、より細かい制御と安全な更新が可能です。

## 🔧 構成要素

### 1. GitHub Actions ワークフロー

- **`update-dependencies.yml`**: 週次で依存関係をチェックし、**各パッケージを個別のPR**として自動作成
- **`auto-merge-dependabot.yml`**: DependabotのPRと自動更新PRを条件に応じて自動マージ

### 2. Dependabot設定

- **`.github/dependabot.yml`**: GitHub Dependabotによる個別パッケージ更新設定
- グループ化を無効にして、各依存関係が個別のPRとして作成される

### 3. 更新スクリプト

- **`scripts/update-dependencies.ts`**: 全パッケージの一括更新レポート生成（従来版）
- **`scripts/update-package.ts`**: 個別パッケージ更新スクリプト（新規）

## 📅 実行スケジュール

- **毎週月曜日 9:00 (JST)** に自動実行
- 手動実行も可能（GitHub ActionsのWorkflows画面から）

## 🎯 個別PR方式のメリット

### ✅ より安全な更新
- 各パッケージの影響を個別に評価
- 問題のあるパッケージのみ除外して他は進行可能
- テスト失敗時の原因特定が容易

### 📋 細かい制御
- パッケージごとに異なる更新戦略を適用可能
- 重要なパッケージとそうでないものを区別
- 特定のパッケージのみ手動レビューに回せる

### 🔍 明確な変更内容
- PRタイトルと本文でパッケージと変更内容が明確
- チェンジログの確認が容易
- レビュー時の負荷軽減

## 🤖 自動マージ条件

以下の条件を満たすPRは自動でマージされます：

1. **パッチ更新** または **マイナー更新** のみ
2. **ESLintチェック** が通る（または実行されない）
3. **テスト** が通る（または実行されない）
4. **ビルド** が成功する

メジャーバージョンアップデートは手動レビューが必要です。

## 📋 使用方法

### 手動実行（個別パッケージ）

```bash
# 特定のパッケージのみ更新
npm run update-package react

# 全パッケージを個別に更新（個別レポート生成）
npm run update-all-individual

# 更新可能なパッケージ一覧を確認
npm run update-package

# 現在の古い依存関係を確認のみ（レポート表示）
npm run update-deps:check

# 現在の古い依存関係を確認のみ（JSON出力 - CI/CD用）
npx tsx scripts/update-deps.ts --check --json
```

### GitHub Actions手動実行

1. GitHub > Actions > "Update Dependencies (Individual PRs)" を選択
2. "Run workflow" ボタンをクリック
3. 更新タイプを選択（all/patch/minor/major）

## 📊 生成されるPR

### PR例

- `chore(deps): update react to 19.1.1`
- `chore(deps): update @types/node to 22.15.29`
- `chore(deps): update next to 15.3.3`

### PR本文の内容

- パッケージ名と更新内容
- 前バージョンと新バージョン
- 更新タイプ（patch/minor/major）
- 依存関係タイプ（dependencies/devDependencies）
- パッケージのリンク
- テスト・ビルド結果

## 🛠 設定カスタマイズ

### 同時実行数の調整

`.github/workflows/update-dependencies.yml` の `max-parallel` を変更：

```yaml
strategy:
  matrix:
    package: ${{ fromJson(needs.check-updates.outputs.packages) }}
  fail-fast: false
  max-parallel: 3  # 同時実行数（1-10推奨）
```

### PR上限数の調整

`.github/dependabot.yml` の `open-pull-requests-limit` を変更：

```yaml
open-pull-requests-limit: 20  # 個別PRのため上限を増やす
```

### 自動マージ条件の変更

`.github/workflows/auto-merge-dependabot.yml` で条件を調整できます。

## 🎯 推奨ワークフロー

### 日常的な運用

1. **毎週自動実行**: システムが自動でPRを作成
2. **パッチ/マイナー**: 自動マージされる
3. **メジャー**: 手動でレビュー・マージ

### 急いで更新したい場合

```bash
# 特定パッケージのセキュリティパッチなど
npm run update-package パッケージ名
```

### 大型リリース前

```bash
# 全パッケージを確認してから個別に判断
npm run update-deps:check
npm run update-package 重要なパッケージ名
```

## 📈 メリット・デメリット

### ✅ メリット

- **安全性**: 各更新の影響を個別評価
- **可視性**: 変更内容が明確
- **制御性**: パッケージごとの更新戦略
- **効率性**: 問題のないものは自動処理
- **追跡性**: 更新履歴が明確

### ⚠️ 注意点

- **PR数増加**: 多くのPRが作成される可能性
- **リソース使用**: 個別ビルド・テストでCI時間増加
- **通知量**: GitHub通知が増える

## 🔄 従来の一括更新との比較

| 項目 | 個別PR方式 | 一括更新方式 |
|------|------------|--------------|
| 安全性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 可視性 | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| 効率性 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 制御性 | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| PR数 | 多い | 少ない |
| CI負荷 | 高い | 低い |

## 🚨 注意事項

- 多数のPRが作成される可能性があります
- CI実行時間とコストが増加する可能性があります
- GitHub通知設定を適切に調整することを推奨します
- 重要なアップデート前には手動でのテストも推奨します

## 🔐 必要な権限設定

以下の設定が必要です：

### リポジトリ設定

1. **Settings** > **Actions** > **General**
   - Workflow permissions: "Read and write permissions" を選択
   - "Allow GitHub Actions to create and approve pull requests" をチェック

2. **Settings** > **Pages**
   - Pages の権限が必要（GitHub Pages デプロイ用）

### Personal Access Token（必要に応じて）

より高度な機能を使用する場合：

1. GitHub > Settings > Developer settings > Personal access tokens
2. 以下の権限で新しいトークンを作成：
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
3. リポジトリの Settings > Secrets and variables > Actions で `GITHUB_TOKEN` として追加

## 📊 レポート機能

更新実行時に `dependency-update-report.md` が生成され、以下の情報が含まれます：

- 更新対象パッケージのリスト
- 更新タイプ（Major/Minor/Patch）の分類
- 変更前後のバージョン情報
- 統計サマリー

## 🛠 カスタマイズ

### 実行頻度の変更

`.github/workflows/update-dependencies.yml` の `cron` 設定を変更：

```yaml
schedule:
  # 毎日実行する場合
  - cron: '0 0 * * *'
  # 月2回実行する場合
  - cron: '0 0 1,15 * *'
```

### 自動マージ条件の変更

`.github/workflows/auto-merge-dependabot.yml` の条件を変更してください。

### Dependabotグループの調整

`.github/dependabot.yml` のグループ設定を編集してください。

## 🎯 メリット

- **セキュリティ**: 脆弱性のある依存関係を迅速に更新
- **保守性**: 手動でのアップデート作業を自動化
- **可視性**: 詳細な更新レポートで変更内容を把握
- **安全性**: テスト・ビルドの検証後にのみマージ
- **効率性**: 関連する依存関係をグループ化して整理

## 🚨 注意事項

- メジャーバージョンアップデートは手動レビューが必要
- テストが失敗した場合、PRは自動マージされません
- 重要な変更前には手動でのテストも推奨します
