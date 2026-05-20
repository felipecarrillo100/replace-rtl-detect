import { describe, it, expect } from 'vitest';
import { isRtlLang, getLangDir } from './index';

describe('replace-rtl-detect tests', () => {

    // ─── isRtlLang ────────────────────────────────────────────────────────────

    describe('isRtlLang — invalid / empty inputs', () => {
        it('returns undefined for non-string inputs', () => {
            // @ts-expect-error testing invalid arguments
            expect(isRtlLang()).toBeUndefined();
            // @ts-expect-error testing invalid arguments
            expect(isRtlLang(null)).toBeUndefined();
            // @ts-expect-error testing invalid arguments
            expect(isRtlLang(42)).toBeUndefined();
            // @ts-expect-error testing invalid arguments
            expect(isRtlLang(true)).toBeUndefined();
            // @ts-expect-error testing invalid arguments
            expect(isRtlLang({})).toBeUndefined();
        });

        it('returns undefined for empty / whitespace strings', () => {
            expect(isRtlLang('')).toBeUndefined();
            expect(isRtlLang(' ')).toBeUndefined();
            expect(isRtlLang('   ')).toBeUndefined();
        });

        it('returns undefined for garbage / injection strings', () => {
            expect(isRtlLang('1234')).toBeUndefined();
            expect(isRtlLang('!')).toBeUndefined();
            expect(isRtlLang('en US')).toBeUndefined();     // space inside
            expect(isRtlLang('<script>')).toBeUndefined();
            expect(isRtlLang('../../etc')).toBeUndefined();
        });
    });

    // ─── Full RTL language set ────────────────────────────────────────────────

    describe('isRtlLang — all known RTL base languages', () => {
        const rtlLangs = [
            ['ae',  'Avestan'],
            ['ar',  'Arabic'],
            ['arc', 'Aramaic'],
            ['bcc', 'Southern Balochi'],
            ['bqi', 'Bakthiari'],
            ['ckb', 'Sorani Kurdish'],
            ['dv',  'Dhivehi'],
            ['fa',  'Persian'],
            ['glk', 'Gilaki'],
            ['he',  'Hebrew'],
            ['ku',  'Kurdish (base)'],
            ['mzn', 'Mazanderani'],
            ['nqo', 'N\'Ko'],
            ['pnb', 'Western Punjabi'],
            ['prs', 'Dari'],
            ['ps',  'Pashto'],
            ['sd',  'Sindhi'],
            ['ug',  'Uyghur'],
            ['ur',  'Urdu'],
            ['yi',  'Yiddish'],
        ] as const;

        rtlLangs.forEach(([lang, name]) => {
            it(`detects ${name} (${lang}) as RTL`, () => {
                expect(isRtlLang(lang)).toBe(true);
            });
        });
    });

    // ─── RTL script subtags ───────────────────────────────────────────────────

    describe('isRtlLang — RTL script subtags', () => {
        it('detects Arab (Arabic) script as RTL', () => {
            expect(isRtlLang('ku-Arab')).toBe(true);
            expect(isRtlLang('az-Arab')).toBe(true);
            expect(isRtlLang('tg-Arab')).toBe(true);
            expect(isRtlLang('uz-Arab')).toBe(true);
        });

        it('detects Hebr (Hebrew) script as RTL', () => {
            expect(isRtlLang('he-Hebr')).toBe(true);
            expect(isRtlLang('yi-Hebr')).toBe(true);
        });

        it('detects Syrc (Syriac) script as RTL', () => {
            expect(isRtlLang('syr-Syrc')).toBe(true);
        });

        it('detects Thaa (Thaana) script as RTL', () => {
            expect(isRtlLang('dv-Thaa')).toBe(true);
        });
    });

    // ─── LTR script subtags (multi-script language correctness) ──────────────

    describe('isRtlLang — LTR script subtags on multi-script languages', () => {
        it('detects Kurdish in Latin script as LTR', () => {
            expect(isRtlLang('ku-Latn')).toBe(false);
        });

        it('detects Azerbaijani in Latin script as LTR', () => {
            expect(isRtlLang('az-Latn')).toBe(false);
        });

        it('detects Azerbaijani in Cyrillic script as LTR', () => {
            expect(isRtlLang('az-Cyrl')).toBe(false);
        });

        it('detects Tajik in Cyrillic script as LTR', () => {
            expect(isRtlLang('tg-Cyrl')).toBe(false);
        });

        it('detects Uzbek in Latin script as LTR', () => {
            expect(isRtlLang('uz-Latn')).toBe(false);
        });

        it('detects Uzbek in Cyrillic script as LTR', () => {
            expect(isRtlLang('uz-Cyrl')).toBe(false);
        });
    });

    // ─── LTR languages ────────────────────────────────────────────────────────

    describe('isRtlLang — common LTR languages', () => {
        const ltrLangs = [
            ['en',    'English'],
            ['en-US', 'English (US)'],
            ['en-GB', 'English (UK)'],
            ['fr',    'French'],
            ['fr-FR', 'French (France)'],
            ['es',    'Spanish'],
            ['es-ES', 'Spanish (Spain)'],
            ['es-MX', 'Spanish (Mexico)'],
            ['de',    'German'],
            ['de-DE', 'German (Germany)'],
            ['it',    'Italian'],
            ['pt',    'Portuguese'],
            ['pt-BR', 'Portuguese (Brazil)'],
            ['nl',    'Dutch'],
            ['pl',    'Polish'],
            ['ru',    'Russian'],
            ['zh',    'Chinese'],
            ['zh-CN', 'Chinese (Simplified)'],
            ['zh-TW', 'Chinese (Traditional)'],
            ['ja',    'Japanese'],
            ['ko',    'Korean'],
            ['tr',    'Turkish'],
            ['id',    'Indonesian'],
            ['vi',    'Vietnamese'],
            ['th',    'Thai'],
        ] as const;

        ltrLangs.forEach(([lang, name]) => {
            it(`detects ${name} (${lang}) as LTR`, () => {
                expect(isRtlLang(lang)).toBe(false);
            });
        });
    });

    // ─── RTL with region variants ─────────────────────────────────────────────

    describe('isRtlLang — RTL with region codes and case variations', () => {
        it('handles Arabic region variants', () => {
            expect(isRtlLang('ar-SA')).toBe(true);  // Saudi Arabia
            expect(isRtlLang('ar-EG')).toBe(true);  // Egypt
            expect(isRtlLang('ar-MA')).toBe(true);  // Morocco
            expect(isRtlLang('ar-IQ')).toBe(true);  // Iraq
            expect(isRtlLang('ar-SY')).toBe(true);  // Syria
            expect(isRtlLang('ar-DZ')).toBe(true);  // Algeria
        });

        it('handles case-insensitive locale tags', () => {
            expect(isRtlLang('AR')).toBe(true);
            expect(isRtlLang('HE')).toBe(true);
            expect(isRtlLang('FA')).toBe(true);
            expect(isRtlLang('EN')).toBe(false);
        });

        it('handles underscore separator (en_US style)', () => {
            expect(isRtlLang('ar_JO')).toBe(true);
            expect(isRtlLang('ar_SA')).toBe(true);
            expect(isRtlLang('en_US')).toBe(false);
            expect(isRtlLang('en_GB')).toBe(false);
        });

        it('handles Hebrew and Persian region variants', () => {
            expect(isRtlLang('he-IL')).toBe(true);
            expect(isRtlLang('fa-IR')).toBe(true);
            expect(isRtlLang('fa-AF')).toBe(true);
        });
    });

    // ─── getLangDir ───────────────────────────────────────────────────────────

    describe('getLangDir — return type contract', () => {
        it('always returns exactly "ltr" or "rtl" (never undefined)', () => {
            const results = [
                getLangDir('ar'),
                getLangDir('en'),
                getLangDir(''),
                getLangDir(' '),
                getLangDir('garbage'),
                // @ts-expect-error testing invalid arguments
                getLangDir(null),
                // @ts-expect-error testing invalid arguments
                getLangDir(),
            ];
            results.forEach(r => {
                expect(['ltr', 'rtl']).toContain(r);
            });
        });

        it('defaults to ltr for invalid or empty inputs', () => {
            // @ts-expect-error testing invalid arguments
            expect(getLangDir()).toEqual('ltr');
            // @ts-expect-error testing invalid arguments
            expect(getLangDir(null)).toEqual('ltr');
            expect(getLangDir('')).toEqual('ltr');
            expect(getLangDir(' ')).toEqual('ltr');
            expect(getLangDir('1234')).toEqual('ltr');
            expect(getLangDir('!@#$')).toEqual('ltr');
        });

        it('returns ltr for LTR languages', () => {
            expect(getLangDir('en')).toEqual('ltr');
            expect(getLangDir('EN')).toEqual('ltr');
            expect(getLangDir('en-US')).toEqual('ltr');
            expect(getLangDir('en_US')).toEqual('ltr');
            expect(getLangDir('fr-FR')).toEqual('ltr');
            expect(getLangDir('zh-CN')).toEqual('ltr');
            expect(getLangDir('ku-Latn')).toEqual('ltr');
            expect(getLangDir('az-Latn')).toEqual('ltr');
        });

        it('returns rtl for RTL languages', () => {
            expect(getLangDir('ar')).toEqual('rtl');
            expect(getLangDir('AR')).toEqual('rtl');
            expect(getLangDir('ar-JO')).toEqual('rtl');
            expect(getLangDir('ar_JO')).toEqual('rtl');
            expect(getLangDir('he')).toEqual('rtl');
            expect(getLangDir('he-IL')).toEqual('rtl');
            expect(getLangDir('fa')).toEqual('rtl');
            expect(getLangDir('ur')).toEqual('rtl');
            expect(getLangDir('yi')).toEqual('rtl');
            expect(getLangDir('ku-Arab')).toEqual('rtl');
            expect(getLangDir('az-Arab')).toEqual('rtl');
        });
    });

});
