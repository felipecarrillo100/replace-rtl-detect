import { describe, it, expect } from 'vitest';
import { isRtlLang, getLangDir } from './index';

describe('replace-rtl-detect tests', () => {
    describe('isRtlLang', () => {
        it('should return undefined for invalid or empty inputs', () => {
            // @ts-expect-error testing invalid arguments
            expect(isRtlLang()).toBeUndefined();
            // @ts-expect-error testing invalid arguments
            expect(isRtlLang(null)).toBeUndefined();
            expect(isRtlLang('')).toBeUndefined();
            expect(isRtlLang(' ')).toBeUndefined();
            expect(isRtlLang('1234')).toBeUndefined();
            expect(isRtlLang('!')).toBeUndefined();
        });

        it('should detect LTR locales correctly', () => {
            expect(isRtlLang('en')).toBeFalsy();
            expect(isRtlLang('EN')).toBeFalsy();
            expect(isRtlLang('en-US')).toBeFalsy();
            expect(isRtlLang('en_US')).toBeFalsy();
            expect(isRtlLang('en-us')).toBeFalsy();
            expect(isRtlLang('fr')).toBeFalsy();
            expect(isRtlLang('es')).toBeFalsy();
        });

        it('should detect RTL locales correctly', () => {
            expect(isRtlLang('ar')).toBeTruthy();
            expect(isRtlLang('AR')).toBeTruthy();
            expect(isRtlLang('ar-jo')).toBeTruthy();
            expect(isRtlLang('ar-JO')).toBeTruthy();
            expect(isRtlLang('ar_JO')).toBeTruthy();
            expect(isRtlLang('he')).toBeTruthy();
            expect(isRtlLang('he-IL')).toBeTruthy();
            expect(isRtlLang('fa')).toBeTruthy();
            expect(isRtlLang('ur')).toBeTruthy();
            expect(isRtlLang('yi')).toBeTruthy();
        });

        it('should correctly handle script subtags for multi-script languages', () => {
            // Kurdish written in Latin script is LTR, in Arabic script is RTL
            expect(isRtlLang('ku-Latn')).toBeFalsy();
            expect(isRtlLang('ku-Arab')).toBeTruthy();

            // Azerbaijani written in Arabic script is RTL, in Latin is LTR
            expect(isRtlLang('az-Arab')).toBeTruthy();
            expect(isRtlLang('az-Latn')).toBeFalsy();

            // Tajik written in Cyrillic is LTR, in Arabic is RTL
            expect(isRtlLang('tg-Cyrl')).toBeFalsy();
            expect(isRtlLang('tg-Arab')).toBeTruthy();
        });
    });

    describe('getLangDir', () => {
        it('should default to ltr for invalid or empty inputs', () => {
            // @ts-expect-error testing invalid arguments
            expect(getLangDir()).toEqual('ltr');
            // @ts-expect-error testing invalid arguments
            expect(getLangDir(null)).toEqual('ltr');
            expect(getLangDir('')).toEqual('ltr');
            expect(getLangDir(' ')).toEqual('ltr');
            expect(getLangDir('1234')).toEqual('ltr');
        });

        it('should return ltr for LTR languages', () => {
            expect(getLangDir('en')).toEqual('ltr');
            expect(getLangDir('EN')).toEqual('ltr');
            expect(getLangDir('en-US')).toEqual('ltr');
            expect(getLangDir('en_US')).toEqual('ltr');
            expect(getLangDir('en-us')).toEqual('ltr');
            expect(getLangDir('ku-Latn')).toEqual('ltr');
            expect(getLangDir('az-Latn')).toEqual('ltr');
        });

        it('should return rtl for RTL languages', () => {
            expect(getLangDir('ar')).toEqual('rtl');
            expect(getLangDir('AR')).toEqual('rtl');
            expect(getLangDir('ar-jo')).toEqual('rtl');
            expect(getLangDir('ar-JO')).toEqual('rtl');
            expect(getLangDir('ar_JO')).toEqual('rtl');
            expect(getLangDir('he')).toEqual('rtl');
            expect(getLangDir('ku-Arab')).toEqual('rtl');
            expect(getLangDir('az-Arab')).toEqual('rtl');
        });
    });
});
