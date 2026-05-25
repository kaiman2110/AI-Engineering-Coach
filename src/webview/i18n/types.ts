/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export type Locale = 'en' | 'ja';

export type TranslationDict = {
  readonly [K in TranslationKey]: string;
};

export type TranslationKey =
  | CommonKeys
  | LoadingKeys
  | ErrorKeys;

type CommonKeys =
  | 'common.score.excellent'
  | 'common.score.good'
  | 'common.score.fair'
  | 'common.score.needsWork'
  | 'common.score.critical'
  | 'common.score.great'
  | 'common.sessions'
  | 'common.requests'
  | 'common.noData';

type LoadingKeys =
  | 'loading.buildingIndex'
  | 'loading.preparing'
  | 'loading.working'
  | 'loading.parserEvents'
  | 'loading.phase.discoverDirs'
  | 'loading.phase.checkCache'
  | 'loading.phase.parseLogs'
  | 'loading.phase.scanHarnesses'
  | 'loading.phase.prepareAnalytics'
  | 'loading.phase.ready'
  | 'loading.linesGenerated'
  | 'loading.toolCalls'
  | 'loading.imagesAnalyzed'
  | 'loading.filesTouched'
  | 'loading.promptsSent';

type ErrorKeys =
  | 'error.failedToRender'
  | 'error.reloadHint';
