# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

ボードゲーム「ヘルパゴス」のWeb実装。サーバー不要のシングルHTML構成。  
`index.html` をブラウザで直接開くか、VSCode Live Server（ポート5502）で動作する。

## 絶対条件（最優先ルール）

1. **機能ごとにディレクトリ・ファイルを分けて作成する**（`features/<機能名>/` 単位）
2. **完成した機能は勝手に修正しない**。修正が必要なら必ずユーザーに確認してから行う
3. **完成済み機能は `completed/` ディレクトリに隔離して保護する**
4. **ルール追加はドキュメントも機能ごとに分けて作成する**（`docs/<機能名>/rules.md`）
5. **【絶対条件】タグ付きの指示は必ず記憶に追記する**

## アーキテクチャ

### ファイル構成

```
index.html              ← ゲーム本体（UI + ゲームループ）
features/<name>/<name>.js  ← 機能モジュール（window.XXX として公開）
docs/<name>/rules.md    ← 実装済みルールのドキュメント
docs/diff/<name>/rules.md  ← 原文ルールとの差異記録
docs/pending/<name>/rules.md  ← 未実装ルールの記録
rules/                  ← 原文ルール（読み取り専用・変更しない）
completed/              ← 完成・ロック済みの機能置き場
```

### モジュールシステム

フレームワーク・ビルドツールなし。各 `features/` ファイルは即時実行関数で `window.XXX` にグローバル公開する。

```js
(function () {
  const MyFeature = { ... };
  window.MyFeature = MyFeature;
})();
```

`index.html` の `<script>` タグで依存順に読み込む。モジュール間の依存は暗黙のグローバル参照（例: `WaterAction` は `Weather` に依存）。

### ゲーム状態（index.html 内 `G` オブジェクト）

```js
G = {
  food, water,          // 共有リソース
  round,                // 現在ラウンド
  phase,                // 'weather' | 'action' | 'ended'
  turnOrder[],          // このラウンドのプレイヤー順（leader起点）
  turnIndex,            // turnOrder 内の現在位置
  selectedCount,        // 伐採モーダルで選択中の本数
}
```

### ラウンドフロー

```
天候フェーズ（leader がカードめくる）
  → アクションフェーズ（turnOrder 順に1人1アクション）
    → 麻痺プレイヤーは自動スキップ
    → 釣り / 水汲み / 伐採（多段モーダル）/ 船あさり（秘密モーダル）
  → ラウンド終了: 食料・水 -= PLAYERS、round++
  → 勝利/敗北チェック
```

## 機能モジュール一覧

| window 変数 | ファイル | 役割 |
|------------|---------|------|
| `Leader` | features/leader/ | ランダム初期選出・ローテーション・ターン順生成 |
| `Weather` | features/weather/ | 天候デッキ（☀0 ×2, 🌦1 ×3, 🌧2 ×3, ⛈3 ×2 = 10枚） |
| `WaterAction` | features/water/ | `Weather.current` をそのまま返す |
| `FoodAction` | features/food/ | ランダム 1〜3 を返す |
| `RaftAction` | features/raft/ | 定数のみ（GUARANTEED=1, MAX_DEEPER=5） |
| `SnakeBag` | features/snake/ | 白5・黒1 計6個。n個引いて黒含有チェック |
| `Paralysis` | features/paralysis/ | 噛まれた round+1 にスキップ。`isParalyzed(idx, round)` |
| `RaftTrack` | features/rafttrack/ | position(0-5) + completed。6進むごとに completed++ |
| `Shipwreck` | features/shipwreck/ | 10枚デッキ（効果未定義）。切れたら再シャッフル |
| `Hand` | features/hand/ | プレイヤーごとの秘密手札。枚数のみ公開 |
| `Resources` | features/resources/ | 人数別初期値テーブル（3〜12人） |

## ルールドキュメントの管理方針

- `docs/<機能>/rules.md` → 実装済みルール（正）
- `docs/diff/<機能>/rules.md` → 原文ルール（`rules/`）との差異。**既存実装が正**
- `docs/pending/<機能>/rules.md` → 未実装ルール（投票・ハリケーン・アイテム効果）

原文ルール（`rules/` 以下）は変更しない。

## 実装済みと原文の主な差異

| 機能 | 原文 | 実装（正） |
|------|------|-----------|
| 釣り | 玉袋から引く | ランダム 1〜3 |
| 勝利条件 | 生存者1人につき水1・食料1 | 固定 ≥3 |
| 消費不足時 | 投票で脱落者決定 | 即ゲームオーバー |
| 行動不能状態 | 病気 | 麻痺（蛇噛まれ限定） |

## 未実装（優先度順）

1. **投票ルール** — 資源不足時に脱落者を決める。勝利条件・消費処理の差異も解消される
2. **ハリケーン** — 天候カードに追加。発生ラウンド終了時に強制脱出判定
3. **アイテム効果** — 難破船カードに食料/水/武器/特殊効果を定義
