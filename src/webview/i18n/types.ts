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
  | DashboardKeys
  | AntiPatternsKeys
  | OutputKeys
  | TimelineKeys
  | PatternsKeys
  | ContextMgmtKeys;

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

type AntiPatternsKeys =
  | 'antipatterns.title'
  | 'antipatterns.rulesTab'
  | 'antipatterns.noIssues'
  | 'antipatterns.allChecksPassing'
  | 'antipatterns.problem'
  | 'antipatterns.action'
  | 'antipatterns.high'
  | 'antipatterns.medium'
  | 'antipatterns.low';

type OutputKeys =
  | 'output.title'
  | 'output.codeOutput'
  | 'output.tokenUsage'
  | 'output.byLanguage'
  | 'output.byWorkspace'
  | 'output.byHarness'
  | 'output.dailyProduction'
  | 'output.aiGeneratedLoc';

type TimelineKeys =
  | 'timeline.title'
  | 'timeline.searchSessions'
  | 'timeline.selectSession'
  | 'timeline.noSessions'
  | 'timeline.sessionNotFound'
  | 'timeline.prev'
  | 'timeline.next';

type PatternsKeys =
  | 'patterns.title'
  | 'patterns.workHours'
  | 'patterns.calendar'
  | 'patterns.projects'
  | 'patterns.hourlyActivity'
  | 'patterns.weeklyTrend'
  | 'patterns.noActivityData'
  | 'patterns.noProjectData'
  | 'patterns.weekday'
  | 'patterns.weekend';

type ContextMgmtKeys =
  | 'contextMgmt.noSessionData'
  | 'contextMgmt.noSessionDataDesc'
  | 'contextMgmt.contextScore'
  | 'contextMgmt.compactions'
  | 'contextMgmt.utilizationTrend'
  | 'contextMgmt.totalAvg'
  | 'contextMgmt.perWorkspace'
  | 'contextMgmt.trendDesc'
  | 'contextMgmt.notEnoughData'
  | 'contextMgmt.wsHealthTitle'
  | 'contextMgmt.wsHealthDesc'
  | 'contextMgmt.avgUtilizationPct'
  | 'contextMgmt.utilizationPct'
  | 'contextMgmt.degraded'
  | 'contextMgmt.limited'
  | 'contextMgmt.optimal'
  | 'contextMgmt.loadingSessions'
  | 'contextMgmt.sessions'
  | 'contextMgmt.avgUtil'
  | 'contextMgmt.saturation'
  | 'contextMgmt.todoEvents'
  | 'contextMgmt.date'
  | 'contextMgmt.harness'
  | 'contextMgmt.verdict'
  | 'contextMgmt.reqs'
  | 'contextMgmt.avgTokens'
  | 'contextMgmt.avgTokensTooltip'
  | 'contextMgmt.sat'
  | 'contextMgmt.events'
  | 'contextMgmt.tokenCurve'
  | 'contextMgmt.insights'
  | 'contextMgmt.noWorkspaces'
  | 'contextMgmt.workspace'
  | 'contextMgmt.score'
  | 'contextMgmt.noTokenData'
  | 'contextMgmt.sessionLevelOnly'
  | 'contextMgmt.noPerTurnData'
  | 'contextMgmt.tokenUsageTooltip'
  | 'contextMgmt.compactionCountTooltip'
  | 'contextMgmt.todoEventCountTooltip'
  | 'contextMgmt.request';
