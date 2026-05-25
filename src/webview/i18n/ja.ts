/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { TranslationDict } from './types';

export const ja: TranslationDict = {
  'common.score.excellent': '優秀',
  'common.score.good': '良好',
  'common.score.fair': '普通',
  'common.score.needsWork': '要改善',
  'common.score.critical': '要対応',
  'common.score.great': '良好',
  'common.sessions': 'セッション',
  'common.requests': 'リクエスト',
  'common.noData': 'データがありません',

  'loading.buildingIndex': 'アクティビティインデックスを構築中',
  'loading.preparing': 'パーサーとワークスペースを準備しています。',
  'loading.working': 'ワークスペースの履歴を処理しています。',
  'loading.parserEvents': 'ワークスペースのスキャン中にパーサーイベントがここに表示されます。',
  'loading.phase.discoverDirs': 'ログディレクトリを探索中',
  'loading.phase.checkCache': 'キャッシュを確認中',
  'loading.phase.parseLogs': 'セッションログを解析中',
  'loading.phase.scanHarnesses': '外部ハーネスをスキャン中',
  'loading.phase.prepareAnalytics': '分析を準備中',
  'loading.phase.ready': '完了',
  'loading.linesGenerated': '行を生成',
  'loading.toolCalls': 'ツール呼び出し',
  'loading.imagesAnalyzed': '画像を分析',
  'loading.filesTouched': 'ファイルを編集',
  'loading.promptsSent': 'プロンプト送信',

  'error.failedToRender': 'レンダリングに失敗しました',
  'error.reloadHint': 'ダッシュボードを再読み込みしてください (Ctrl+Shift+P → "AI Engineer Coach: Reload Data")',
};
