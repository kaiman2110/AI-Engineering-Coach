/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { describe, it, expect, beforeEach } from 'vitest';
import { t, getLocale, setLocale, resolveLocale } from './index';
import { en } from './en';
import { ja } from './ja';

describe('i18n', () => {
  beforeEach(() => {
    setLocale('en');
  });

  it('defaults to English locale', () => {
    expect(getLocale()).toBe('en');
  });

  it('returns English translation by default', () => {
    expect(t('common.score.excellent')).toBe('Excellent');
    expect(t('common.score.good')).toBe('Good');
  });

  it('switches to Japanese locale', () => {
    setLocale('ja');
    expect(getLocale()).toBe('ja');
    expect(t('common.score.excellent')).toBe('優秀');
    expect(t('common.score.good')).toBe('良好');
  });

  it('switches back to English', () => {
    setLocale('ja');
    setLocale('en');
    expect(t('common.score.excellent')).toBe('Excellent');
  });

  it('translates loading phase labels', () => {
    expect(t('loading.phase.discoverDirs')).toBe('Discovering log directories');
    setLocale('ja');
    expect(t('loading.phase.discoverDirs')).toBe('ログディレクトリを探索中');
  });

  it('translates error messages', () => {
    expect(t('error.failedToRender')).toBe('Failed to render');
    setLocale('ja');
    expect(t('error.failedToRender')).toBe('レンダリングに失敗しました');
  });

  it('covers all translation keys in both locales', () => {
    const enKeys = Object.keys(en);
    const jaKeys = Object.keys(ja);
    expect(enKeys.length).toBeGreaterThan(0);
    expect(new Set(enKeys)).toEqual(new Set(jaKeys));
  });
});

describe('resolveLocale', () => {
  it('returns exact match for supported locales', () => {
    expect(resolveLocale('en')).toBe('en');
    expect(resolveLocale('ja')).toBe('ja');
  });

  it('extracts language prefix from regional codes', () => {
    expect(resolveLocale('ja-JP')).toBe('ja');
    expect(resolveLocale('en-US')).toBe('en');
    expect(resolveLocale('en-GB')).toBe('en');
  });

  it('falls back to English for unsupported locales', () => {
    expect(resolveLocale('fr')).toBe('en');
    expect(resolveLocale('zh-CN')).toBe('en');
    expect(resolveLocale('')).toBe('en');
  });
});
