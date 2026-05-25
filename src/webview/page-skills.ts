/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Skills page -- AI triage for skill opportunities + community catalog discovery */

import { DateFilter, WorkflowCluster, WorkflowOptimizationData, SkillTriageResult, TriagedCluster, CatalogItem, CatalogDiscoverResult, CatalogTriageResult } from '../core/types';
import { rpc, COLORS } from './shared';
import { html, render } from './render';
import { consumeNavHint, updateNavBadge } from './app';
import { getSkillCache, setSkillCache } from './skill-cache';
import { t } from './i18n/index';

const CATALOG_BASE = 'https://awesome-copilot.github.com';

/** Set of cluster IDs the user has dismissed in this session */
const dismissed = new Set<string>();

/** Cached results so dismiss can re-render without re-fetching */
let lastTriaged: TriagedCluster[] = [];
let lastClusters: WorkflowCluster[] = [];
let lastResultsEl: HTMLElement | null = null;

/** Current page-level filter for cache scoping */
let activeFilter: DateFilter = {};

export async function renderSkills(container: HTMLElement, currentFilter: DateFilter): Promise<void> {
  activeFilter = currentFilter;
  // Fetch workspaces to populate the selector
  const workspaces = await rpc<{ id: string; name: string }[]>('getWorkspaces');

  // Default workspace: current sidebar filter if set
  const filterWsId = currentFilter.workspaceId
    ? (workspaces.find(w => w.id === currentFilter.workspaceId)?.id || '')
    : '';

  render(html`
    <div class="sk-header">
      <h1>${t('skills.title')}</h1>
      <p class="sk-subtitle">${t('skills.subtitle')}</p>
    </div>

    <div class="sk-toolbar">
      <div class="sk-toolbar-row">
        <label class="sk-lookback">
          <span>${t('skills.workspace')}</span>
          <select id="skWorkspaceSelect" class="sk-select">
            <option value="">${t('skills.allWorkspaces')}</option>
            ${workspaces.map(ws => html`<option value="${ws.id}" selected="${ws.id === filterWsId || undefined}">${ws.name}</option>`)}
          </select>
        </label>
      </div>
      <div class="sk-toolbar-row">
        <label class="sk-lookback">
          <span>${t('skills.lookBack')}</span>
          <select id="lookbackSelect" class="sk-select">
            <option value="1">${t('skills.month1')}</option>
            <option value="3">${t('skills.months3')}</option>
            <option value="6" selected>${t('skills.months6')}</option>
            <option value="12">${t('skills.months12')}</option>
            <option value="0">${t('skills.allTime')}</option>
          </select>
        </label>
      </div>
      <div class="sk-toolbar-row">
        <button id="analyzeBtn" class="sk-btn sk-btn-primary">${t('skills.analyze')}</button>
        <span id="analyzeStatus" class="sk-status"></span>
      </div>
    </div>

    <section class="sk-section" id="customSection">
      <h2 class="sk-section-title">${t('skills.customTitle')}</h2>
      <div id="customResults">
        <p class="sk-empty">${t('skills.customEmpty')}</p>
      </div>
    </section>

    <section class="sk-section" id="catalogSection">
      <h2 class="sk-section-title">${t('skills.communityTitle')}</h2>
      <p class="sk-section-desc">
        ${t('skills.communityDescPrefix')}${' '}
        <a href="${CATALOG_BASE}/" target="_blank">awesome-copilot</a>
        ${' '}${t('skills.communityDescSuffix')}
      </p>
      <div id="catalogResults">
        <p class="sk-empty">${t('skills.communityEmpty')}</p>
      </div>
    </section>
  `, container);

  document.getElementById('analyzeBtn')!.addEventListener('click', triggerRunAnalysis);

  // Check for cached results from dashboard scan
  const cached = getSkillCache(currentFilter);
  if (cached && cached.clusters.length > 0) {
    renderCachedResults(cached.clusters, cached.triaged, cached.catalogMatches);
    return;
  }

  // Auto-run if navigated from dashboard with hint (no cache available)
  const hint = consumeNavHint();
  if (hint === 'auto-run') {
    setTimeout(triggerRunAnalysis, 100);
  }
}

/* ── Render cached results from dashboard ─────────────────────────── */

function renderCachedResults(clusters: WorkflowCluster[], triaged: TriagedCluster[], catalogMatches: CatalogItem[]): void {
  const statusEl = document.getElementById('analyzeStatus')!;
  const customEl = document.getElementById('customResults')!;
  const catalogEl = document.getElementById('catalogResults')!;

  // Custom skills
  const strong = triaged.filter(tr => tr.verdict === 'strong').slice(0, 10);
  lastTriaged = strong;
  lastClusters = clusters;
  lastResultsEl = customEl;

  if (strong.length === 0) {
    statusEl.textContent = t('skills.patternsNoStrong').replace('{0}', String(clusters.length));
    render(html`<p class="sk-empty">${t('skills.noRepeatingTasks')}</p>`, customEl);
  } else {
    statusEl.textContent = t('skills.opportunitiesFound').replace('{0}', String(strong.length)) + ' ' + t('skills.fromDashboard');
    renderTriageResults(customEl, strong, clusters);
  }

  // Catalog
  if (catalogMatches.length > 0) {
    renderCatalogList(catalogEl, catalogMatches, catalogMatches.length);
  } else {
    render(html`<p class="sk-empty">${t('skills.noCommunityMatches')}</p>`, catalogEl);
  }

  updateNavBadge('badge-skills', strong.length + catalogMatches.length);
}

/* ── Analysis Flow ────────────────────────────────────────────────── */

async function runAnalysis(): Promise<void> {
  const btn = document.getElementById('analyzeBtn') as HTMLButtonElement;
  const statusEl = document.getElementById('analyzeStatus')!;
  const customEl = document.getElementById('customResults')!;
  const catalogEl = document.getElementById('catalogResults')!;

  const workspaceId = (document.getElementById('skWorkspaceSelect') as HTMLSelectElement).value;
  const workspaceName = workspaceId
    ? ((document.getElementById('skWorkspaceSelect') as HTMLSelectElement).selectedOptions[0]?.textContent || workspaceId)
    : undefined;
  const lookback = Number.parseInt((document.getElementById('lookbackSelect') as HTMLSelectElement).value, 10);

  btn.disabled = true;
  btn.textContent = t('skills.analyzing');
  statusEl.textContent = '';
  render(html`<p class="sk-loading">${t('skills.scanning')}</p>`, customEl);
  render(html`<p class="sk-loading">${t('skills.loadingCatalog')}</p>`, catalogEl);
  dismissed.clear();

  // Build filter
  const filter: Record<string, unknown> = {};
  if (lookback > 0) {
    const d = new Date();
    d.setMonth(d.getMonth() - lookback);
    filter.fromDate = d.toISOString().slice(0, 10);
  }
  if (workspaceId) filter.workspaceId = workspaceId;

  let clusters: WorkflowCluster[] = [];

  try {
    const data = await rpc<WorkflowOptimizationData>('getWorkflowOptimization', filter);
    clusters = data.clusters || [];

    if (clusters.length === 0) {
      render(html`<p class="sk-empty">${t('skills.noPatterns')}</p>`, customEl);
      render(html`<p class="sk-empty">${t('skills.noPatternsToMatch')}</p>`, catalogEl);
      return;
    }

    // Send top 20 most repeated clusters with full examples to AI
    const top20 = clusters.slice(0, 20);
    statusEl.textContent = t('skills.patternsFound').replace('{0}', String(clusters.length)).replace('{1}', String(top20.length));

    const result = await rpc<SkillTriageResult>('triageSkills', {
      clusters: top20.map(c => ({
        id: c.id, label: c.label, occurrences: c.occurrences,
        sessions: c.sessions, cancelRate: c.cancelRate,
        avgCorrectionTurns: c.avgCorrectionTurns,
        workspaces: c.workspaces,
        examples: c.examples.slice(0, 5),
      })),
      workspace: workspaceName,
    } as Record<string, unknown>);

    const strong = (result.triaged || []).filter(tr => tr.verdict === 'strong').slice(0, 10);
    lastTriaged = strong;
    lastClusters = clusters;
    lastResultsEl = customEl;

    if (strong.length === 0) {
      statusEl.textContent = t('skills.noStrongOpportunities');
      render(html`<p class="sk-empty">${t('skills.noRepeatingTasksDetailed')}</p>`, customEl);
    } else {
      statusEl.textContent = t('skills.opportunitiesFound').replace('{0}', String(strong.length));
      renderTriageResults(customEl, strong, clusters);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Analysis failed';
    render(html`<p class="sk-error">${t('skills.error').replace('{0}', msg)}</p>`, customEl);
  } finally {
    btn.disabled = false;
    btn.textContent = t('skills.analyze');
  }

  // Load community catalog after custom analysis and write to shared cache
  const catalogMatches = await loadCatalog(catalogEl, clusters, workspaceName);
  setSkillCache({ clusters, triaged: lastTriaged, catalogMatches, timestamp: Date.now() }, activeFilter);
  updateNavBadge('badge-skills', lastTriaged.length + catalogMatches.length);
}

function triggerRunAnalysis(): void {
  void runAnalysis();
}

/* ── Triage Results (Custom Skills) ───────────────────────────────── */

function renderTriageResults(container: HTMLElement, triaged: TriagedCluster[], clusters: WorkflowCluster[]): void {
  const visible = triaged.filter(tr => !dismissed.has(tr.id));
  if (visible.length === 0) {
    render(html`<p class="sk-empty">${t('skills.allDismissed')}</p>`, container);
    return;
  }
  render(html`<div class="sk-grid">${visible.map((item, i) => {
    const cluster = clusters.find(c => c.id === item.id);
    return html`
      <div class="sk-card" data-idx="${i}" data-id="${item.id}">
        <div class="sk-card-header">
          <span class="sk-rank">${i + 1}</span>
          <div class="sk-card-title">${item.suggestedSkillName || item.label}</div>
          <button class="sk-btn-dismiss" data-dismiss-id="${item.id}" title=${t('skills.dismiss')}>\u00d7</button>
        </div>
        <div class="sk-card-body">
          <p class="sk-card-reason">${item.reason}</p>
          ${cluster ? html`
            <div class="sk-card-meta">
              <span>${cluster.occurrences} ${t('skills.repetitions')}</span>
              <span>${cluster.sessions} ${t('skills.sessions')}</span>
              ${cluster.cancelRate > 0 ? html`<span>${cluster.cancelRate}% ${t('skills.cancelled')}</span>` : null}
            </div>
            ${cluster.examples.length > 0 ? html`<div class="sk-card-examples">${cluster.examples.slice(0, 3).map(ex => html`<div class="sk-card-example">${ex.length > 120 ? ex.slice(0, 117) + '...' : ex}</div>`)}</div>` : null}
            <div class="sk-card-actions">
              <button class="sk-btn sk-btn-install" data-cluster-idx="${i}">${t('skills.installSkill')}</button>
              <div class="sk-card-preview" data-cluster-idx="${i}"></div>
            </div>` : null}
        </div>
      </div>`;
  })}</div>`, container);

  // Install buttons
  for (const btn of container.querySelectorAll('.sk-btn-install')) {
    btn.addEventListener('click', (e) => {
      void (async () => {
        const el = e.currentTarget as HTMLButtonElement;
        const idx = Number.parseInt(el.dataset.clusterIdx || '0', 10);
        const item = visible[idx];
        if (!item) return;
        const cluster = clusters.find(c => c.id === item.id);
        if (!cluster) return;

        el.disabled = true;
        el.textContent = t('skills.generating');

        try {
          const res = await rpc<{ content: string; filename: string }>('generateSkillContent', {
            label: item.suggestedSkillName || item.label,
            pattern: cluster.label,
            occurrences: cluster.occurrences,
            sessions: cluster.sessions,
            examples: cluster.examples.slice(0, 5),
            skillDraft: cluster.skillDraft,
          } as Record<string, unknown>);

          const previewEl = el.parentElement?.querySelector<HTMLElement>('.sk-card-preview');
          if (previewEl) {
            render(html`
              <details class="sk-preview-details" open>
                <summary>${t('skills.preview').replace('{0}', res.filename)}</summary>
                <pre class="sk-preview-code">${res.content}</pre>
                <div class="sk-preview-actions">
                  <button class="sk-btn sk-btn-confirm">${t('skills.saveInstall')}</button>
                  <button class="sk-btn sk-btn-secondary sk-btn-cancel">${t('skills.cancel')}</button>
                </div>
              </details>`, previewEl);

            previewEl.querySelector<HTMLElement>('.sk-btn-confirm')?.addEventListener('click', () => {
              void (async () => {
                try {
                  await rpc<{ ok: boolean }>('installSkill', { filename: res.filename, content: res.content } as Record<string, unknown>);
                  el.textContent = t('skills.installed');
                  el.classList.add('sk-btn-done');
                  render(html`<span class="sk-installed-msg">${t('skills.skillInstalled')}</span>`, previewEl);
                } catch (err: unknown) {
                  const msg = err instanceof Error ? err.message : 'Install failed';
                  render(html`<span class="sk-error">${msg}</span>`, previewEl);
                }
              })();
            });

            previewEl.querySelector<HTMLElement>('.sk-btn-cancel')?.addEventListener('click', () => {
              render(null, previewEl);
              el.disabled = false;
              el.textContent = t('skills.installSkill');
            });
          }

          el.textContent = t('skills.reviewBelow');
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Generation failed';
          el.textContent = t('skills.installSkill');
          el.disabled = false;
          const previewEl = el.parentElement?.querySelector<HTMLElement>('.sk-card-preview');
          if (previewEl) render(html`<span class="sk-error">${msg}</span>`, previewEl);
        }
      })();
    });
  }

  // Dismiss buttons
  for (const btn of container.querySelectorAll('.sk-btn-dismiss')) {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.dismissId || '';
      if (!id) return;
      dismissed.add(id);
      if (lastResultsEl) renderTriageResults(lastResultsEl, lastTriaged, lastClusters);
    });
  }
}

/* ── Community Catalog ────────────────────────────────────────────── */

const kindIcons: Record<string, string> = {
  skill: 'S', agent: 'A', instruction: 'I', hook: 'H',
};
const kindColors: Record<string, string> = {
  skill: COLORS.green, agent: COLORS.purple,
  instruction: COLORS.blue, hook: COLORS.yellow,
};

async function loadCatalog(container: HTMLElement, clusters: WorkflowCluster[], workspace?: string): Promise<CatalogItem[]> {
  try {
    // Fetch ALL catalog items (no pre-filtering)
    const result = await rpc<CatalogDiscoverResult>('discoverCatalog', {} as Record<string, unknown>);
    if (!result.items || result.items.length === 0) {
      render(html`<p class="sk-empty">${t('skills.noCatalogItems')}</p>`, container);
      return [];
    }

    render(html`<p class="sk-loading">${t('skills.aiReviewing').replace('{0}', String(result.items.length))}</p>`, container);

    const topClusters = clusters
      .sort((a, b) => b.occurrences - a.occurrences)
      .slice(0, 20)
      .map(c => ({ label: c.label, occurrences: c.occurrences, workspaces: c.workspaces, examples: c.examples.slice(0, 3) }));

    try {
      const triaged = await rpc<CatalogTriageResult>('triageCatalog', {
        items: result.items,
        clusters: topClusters,
        workspace: workspace || undefined,
      } as Record<string, unknown>);

      const items = triaged.items && triaged.items.length > 0 ? triaged.items : [];
      if (items.length === 0) {
        render(html`<p class="sk-empty">${t('skills.noCommunityMatch').replace('{0}', String(result.totalScanned))}</p>`, container);
      } else {
        renderCatalogList(container, items, result.totalScanned);
      }
      return items;
    } catch {
      render(html`<p class="sk-empty">${t('skills.aiTriageFailed')}</p>`, container);
      return [];
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to load catalog';
    render(html`<p class="sk-error">${t('skills.catalogError').replace('{0}', msg)}</p>`, container);
    return [];
  }
}

function renderCatalogList(container: HTMLElement, items: CatalogItem[], totalScanned: number): void {
  render(html`
    <p class="sk-section-count">${t('skills.curatedFrom').replace('{0}', String(items.length)).replace('{1}', String(totalScanned))}</p>
    <div class="sk-grid">${items.map(item => renderCatalogCard(item))}</div>
  `, container);

  for (const btn of container.querySelectorAll('.sk-btn-install-catalog')) {
    btn.addEventListener('click', (e) => {
      void (async () => {
        const el = e.currentTarget as HTMLButtonElement;
        const path = el.dataset.path || '';
        const kind = el.dataset.kind || 'skill';
        const title = el.dataset.title || '';
        if (!path) return;

        el.disabled = true;
        el.textContent = t('skills.fetching');

        try {
          const res = await rpc<{ content: string; filename: string }>('installCatalogItem', {
            path, kind, title,
          } as Record<string, unknown>);

          el.textContent = t('skills.installed');
          el.classList.add('sk-btn-done');
          const parent = el.closest('.sk-card');
          const msgEl = parent?.querySelector<HTMLElement>('.sk-install-msg');
          if (msgEl) msgEl.textContent = t('skills.installedAs').replace('{0}', res.filename);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Install failed';
          el.textContent = t('skills.install');
          el.disabled = false;
          const parent = el.closest('.sk-card');
          const msgEl = parent?.querySelector<HTMLElement>('.sk-install-msg');
          if (msgEl) { msgEl.textContent = msg; msgEl.classList.add('sk-error'); }
        }
      })();
    });
  }
}

const kindLabelKeys: Record<string, 'skills.kindSkill' | 'skills.kindAgent' | 'skills.kindInstruction' | 'skills.kindHook'> = {
  skill: 'skills.kindSkill', agent: 'skills.kindAgent',
  instruction: 'skills.kindInstruction', hook: 'skills.kindHook',
};

function renderCatalogCard(item: CatalogItem): ReturnType<typeof html> {
  const color = kindColors[item.kind] || COLORS.blue;
  const icon = kindIcons[item.kind] || '?';
  const kindLabel = kindLabelKeys[item.kind] ? t(kindLabelKeys[item.kind]) : item.kind.charAt(0).toUpperCase() + item.kind.slice(1);
  const ghUrl = `https://github.com/github/awesome-copilot/blob/main/${encodeURI(item.path)}`;

  return html`
    <div class="sk-card sk-card-catalog">
      <div class="sk-card-header">
        <span class="sk-kind-icon" style="background:${color}">${icon}</span>
        <div>
          <div class="sk-card-title">
            <a href="${ghUrl}" target="_blank">${item.title}</a>
          </div>
          <div class="sk-card-badges">
            <span class="sk-badge" style="color:${color}">${kindLabel}</span>
            ${item.category ? html`<span class="sk-badge">${item.category}</span>` : null}
          </div>
        </div>
      </div>
      <div class="sk-card-body">
        <p class="sk-card-desc">${item.description.length > 200 ? item.description.slice(0, 200) + '...' : item.description}</p>
        ${item.matchReasons.length > 0 ? html`
          <div class="sk-card-reasons">
            ${item.matchReasons.map(r => html`<span class="sk-reason">${r}</span>`)}
          </div>` : null}
        <div class="sk-card-actions">
          <button class="sk-btn sk-btn-install-catalog" data-path="${item.path}" data-kind="${item.kind}" data-title="${item.title}">${t('skills.install')}</button>
          <span class="sk-install-msg"></span>
        </div>
      </div>
    </div>`;
}
