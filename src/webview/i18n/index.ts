/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Locale, TranslationDict, TranslationKey } from './types';
import { en } from './en';
import { ja } from './ja';

export type { Locale, TranslationKey };

const dictionaries: Record<Locale, TranslationDict> = { en, ja };

let currentLocale: Locale = 'en';

export function getLocale(): Locale {
  return currentLocale;
}

export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

export function t(key: TranslationKey): string {
  return dictionaries[currentLocale][key] ?? dictionaries.en[key] ?? key;
}
