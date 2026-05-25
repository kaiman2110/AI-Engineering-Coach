/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const ruleNamesJa: Record<string, string> = {
  'abandon-sessions': '放棄されたセッション',
  'agent-mode-for-asks': 'シンプルな質問にエージェントモード',
  'agentic-no-tools': 'ツールなしのエージェント',
  'auto-approve-terminal': 'サンドボックスなしのターミナル実行',
  'auto-avoidance': '自動モデル回避',
  'broken-flow-state': 'フロー状態の中断',
  'cache-hit-starvation': 'プロンプトキャッシュの枯渇',
  'caps-lock': 'Caps Lock による怒り',
  'context-engineering-gaps': 'コンテキストエンジニアリングのギャップ',
  'copy-paste-blindness': 'コピー＆ペーストの盲信',
  'excessive-file-context': '過剰なファイルコンテキスト',
  'frustration-signals': 'フラストレーションのシグナル',
  'high-cancellation': '過剰なキャンセル',
  'instruction-bloat': 'インストラクションの肥大化',
  'late-night-coding': '深夜のコーディング',
  'lazy-prompting': '手抜きプロンプト',
  'low-constraint-usage': '制約の活用不足',
  'low-markdown-ratio': 'Markdown 出力比率の低さ',
  'mcp-tool-bloat': 'ツール/MCP の肥大化',
  'mega-sessions': 'メガセッション',
  'model-overreliance': 'モデルへの過度な依存',
  'no-custom-instructions': 'カスタム指示なし',
  'no-devcontainer': 'サンドボックスなしのターミナル実行',
  'no-file-context': 'ファイルコンテキストなし',
  'no-language-exploration': '言語の多様性なし',
  'no-plan-mode': 'プランモード未使用',
  'no-skills': 'スキル未使用',
  'no-slash-commands': 'スラッシュコマンド未使用',
  'no-spec-driven-development': 'スペック駆動開発なし',
  'no-spec-structure': '構造化されていないタスク開始',
  'premium-for-lookup-questions': '検索質問にプレミアムモデル',
  'premium-waste': 'プレミアムモデルの無駄遣い',
  'profanity': '不適切な言葉遣い',
  'reasoning-effort-overuse': '推論エフォートの過剰使用',
  'repeated-prompts': '繰り返しプロンプト',
  'runaway-agent-loops': 'エージェントループの暴走',
  'session-drift': 'セッションの脱線',
  'slow-responses': '遅いレスポンス',
  'speed-accept': 'レビューなしの即承認',
  'tunnel-vision': '単一ワークスペースのトンネルビジョン',
  'verbose-output': '冗長なモデル出力',
  'verbose-prompt-no-compression': '圧縮なしの冗長プロンプト',
  'vibe-coding': 'バイブコーディング',
  'weekend-overwork': '週末の過労',
  'yolo-mode': 'YOLO モード',
};

export const groupNamesJa: Record<string, string> = {
  'prompt-quality': 'プロンプト品質',
  'session-hygiene': 'セッション衛生',
  'code-review': 'コードレビュー',
  'tool-mastery': 'ツール習熟',
  'context-management': 'コンテキスト管理',
};

export const groupDescsJa: Record<string, string> = {
  'prompt-quality': 'AI に対するプロンプトの書き方、コンテキストの提供方法、タスクの構造化がどれだけ効果的か。',
  'session-hygiene': 'セッションの長さ、ペース配分、ワークライフバランスの管理がどれだけ適切か。',
  'code-review': 'AI が生成したコードのレビュー、検証、サンドボックス化がどれだけ慎重に行われているか。',
  'tool-mastery': 'AI 機能、モデル、エディタ機能をどれだけ幅広く活用しているか。',
  'context-management': 'コンテキストウィンドウのサイズ管理、肥大化の回避、コンパクション処理がどれだけ適切か。',
};
