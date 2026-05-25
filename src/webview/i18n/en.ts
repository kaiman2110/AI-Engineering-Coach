/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { TranslationDict } from './types';

export const en: TranslationDict = {
  'common.score.excellent': 'Excellent',
  'common.score.good': 'Good',
  'common.score.fair': 'Fair',
  'common.score.needsWork': 'Needs Work',
  'common.score.critical': 'Critical',
  'common.score.great': 'Great',
  'common.sessions': 'sessions',
  'common.requests': 'Requests',
  'common.noData': 'No data available',

  'loading.buildingIndex': 'Building Activity Index',
  'loading.preparing': 'Preparing parser and workspace inventory.',
  'loading.working': 'Working through your workspace history.',
  'loading.parserEvents': 'Parser events will appear here as workspaces are scanned.',
  'loading.phase.discoverDirs': 'Discovering log directories',
  'loading.phase.checkCache': 'Checking cache',
  'loading.phase.parseLogs': 'Parsing session logs',
  'loading.phase.scanHarnesses': 'Scanning external harnesses',
  'loading.phase.prepareAnalytics': 'Preparing analytics',
  'loading.phase.ready': 'Ready',
  'loading.linesGenerated': 'lines generated',
  'loading.toolCalls': 'tool calls',
  'loading.imagesAnalyzed': 'images analyzed',
  'loading.filesTouched': 'files touched',
  'loading.promptsSent': 'prompts sent',

  'error.failedToRender': 'Failed to render',
  'error.reloadHint': 'Try reloading the dashboard (Ctrl+Shift+P → "AI Engineer Coach: Reload Data")',
};
