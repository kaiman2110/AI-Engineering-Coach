/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Locale, TranslationDict, TranslationKey } from './types';
import { en } from './en';
import { ja } from './ja';
import { ruleNamesJa, groupNamesJa, groupDescsJa } from './rules-ja';

export type { Locale, TranslationKey };

const dictionaries: Record<Locale, TranslationDict> = { en, ja };
const supportedLocales = new Set<string>(Object.keys(dictionaries));

let currentLocale: Locale = 'en';

export function getLocale(): Locale {
  return currentLocale;
}

export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

export function resolveLocale(raw: string): Locale {
  if (supportedLocales.has(raw)) return raw as Locale;
  const prefix = raw.split('-')[0];
  if (supportedLocales.has(prefix)) return prefix as Locale;
  return 'en';
}

export function initLocaleFromDocument(): void {
  const raw = document.documentElement.dataset.locale ?? 'en';
  currentLocale = resolveLocale(raw);
}

export function t(key: TranslationKey): string {
  return dictionaries[currentLocale][key] ?? dictionaries.en[key] ?? key;
}

export function tRuleName(ruleId: string, fallback: string): string {
  if (currentLocale === 'ja' && ruleNamesJa[ruleId]) return ruleNamesJa[ruleId];
  return fallback;
}

export function tGroupName(group: string, fallback: string): string {
  if (currentLocale === 'ja' && groupNamesJa[group]) return groupNamesJa[group];
  return fallback;
}

export function tGroupDesc(group: string, fallback: string): string {
  if (currentLocale === 'ja' && groupDescsJa[group]) return groupDescsJa[group];
  return fallback;
}
