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
  | ErrorKeys
  | NavKeys
  | DashboardKeys;

type CommonKeys =
  | 'common.score.excellent'
  | 'common.score.good'
  | 'common.score.fair'
  | 'common.score.needsWork'
  | 'common.score.critical'
  | 'common.score.great'
  | 'common.sessions'
  | 'common.requests'
  | 'common.aiLoc'
  | 'common.workspaces'
  | 'common.noData'
  | 'common.close'
  | 'common.more'
  | 'common.noIssuesDetected'
  | 'common.linesOfCode';

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
  | 'error.reloadHint'
  | 'error.title';

type NavKeys =
  | 'nav.observe'
  | 'nav.measure'
  | 'nav.improve'
  | 'nav.dashboard'
  | 'nav.timeline'
  | 'nav.codingMoments'
  | 'nav.output'
  | 'nav.burndown'
  | 'nav.patterns'
  | 'nav.antiPatterns'
  | 'nav.skillFinder'
  | 'nav.contextHealth'
  | 'nav.levelUp'
  | 'nav.workspace'
  | 'nav.current'
  | 'nav.all'
  | 'nav.searchWorkspaces'
  | 'nav.harness'
  | 'nav.allHarnesses';

type DashboardKeys =
  | 'dashboard.funScore.mergeWizard'
  | 'dashboard.funScore.shipGoblin'
  | 'dashboard.funScore.vibeGremlin'
  | 'dashboard.funScore.rubberDuck'
  | 'dashboard.funScore.stackTrace'
  | 'dashboard.vibesSampled'
  | 'dashboard.calibrating'
  | 'dashboard.antiPatternsSummary'
  | 'dashboard.viewAllAntiPatterns'
  | 'dashboard.skillFinder'
  | 'dashboard.openFullView'
  | 'dashboard.skillFinderDesc'
  | 'dashboard.skillFinderPrompt'
  | 'dashboard.scanForSkills'
  | 'dashboard.dailyActivity'
  | 'dashboard.topWorkspacesByRequests'
  | 'dashboard.requestsByHarness'
  | 'dashboard.activeWorkspaces'
  | 'dashboard.customOpportunities'
  | 'dashboard.communityMatches'
  | 'dashboard.noneDetected'
  | 'dashboard.noneMatched'
  | 'dashboard.noSkillOpportunities'
  | 'dashboard.openSkillFinder'
  | 'dashboard.exploreSkillFinder'
  | 'dashboard.scanningPromptHistory'
  | 'dashboard.aiTriageInProgress'
  | 'dashboard.matchingCatalog'
  | 'dashboard.scanFailed'
  | 'dashboard.tokenBannerTitle'
  | 'dashboard.tokenBannerDesc'
  | 'dashboard.findings'
  | 'dashboard.finding'
  | 'dashboard.repetitions'
  | 'dashboard.loc';
