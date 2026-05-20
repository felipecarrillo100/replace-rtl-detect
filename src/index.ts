const RTL_SCRIPTS = new Set(['Arab', 'Hebr', 'Syrc', 'Thaa', 'Nkoo', 'Mand', 'Samr']);
const RTL_LANGS = new Set([
    'ae',  /* Avestan */
    'ar',  /* Arabic */
    'arc', /* Aramaic */
    'bcc', /* Southern Balochi */
    'bqi', /* Bakthiari */
    'ckb', /* Sorani Kurdish */
    'dv',  /* Dhivehi */
    'fa',  /* Persian */
    'glk', /* Gilaki */
    'he',  /* Hebrew */
    'ku',  /* Kurdish */
    'mzn', /* Mazanderani */
    'nqo', /* N'Ko */
    'pnb', /* Western Punjabi */
    'prs', /* Darī */
    'ps',  /* Pashto */
    'sd',  /* Sindhi */
    'ug',  /* Uyghur */
    'ur',  /* Urdu */
    'yi'   /* Yiddish */
]);

/**
 * Checks if the locale is a right-to-left language.
 * Returns true if the locale is RTL, false if LTR, or undefined if the input is invalid or cannot be parsed.
 */
export function isRtlLang(strLocale?: string | null): boolean | undefined {
    if (typeof strLocale !== 'string' || !strLocale.trim()) {
        return undefined;
    }

    // Basic sanitization and check to avoid RangeError in Intl.Locale for obviously garbage input
    const cleanLocale = strLocale.trim();
    if (!/^[a-zA-Z]{2,8}([-_][a-zA-Z0-9]{2,8})*$/.test(cleanLocale)) {
        return undefined;
    }

    try {
        // Parse with Intl.Locale and maximize to resolve default script
        const locale = new Intl.Locale(cleanLocale.replace('_', '-'));
        const maximized = locale.maximize();

        // 1. If an explicit script subtag was provided in the original locale string,
        //    use it for definitive direction — RTL_SCRIPTS wins, else treat as LTR.
        if (locale.script) {
            return RTL_SCRIPTS.has(locale.script);
        }

        // 2. If maximizing resolved a clear RTL script (e.g. ar → Arab), return true.
        if (maximized.script && RTL_SCRIPTS.has(maximized.script)) {
            return true;
        }

        // 3. Check known RTL base languages before falling through to native API,
        //    because getTextInfo() may return 'ltr' for historic/minority RTL languages
        //    (e.g. ae, arc) that CLDR maps to Latin by default.
        const baseLang = maximized.language || locale.language;
        if (RTL_LANGS.has(baseLang)) {
            return true;
        }

        // 4. Check direction via native Intl API if available (catches any remaining cases)
        const direction = (locale as any).getTextInfo?.().direction || (locale as any).textInfo?.direction;
        if (direction === 'rtl') {
            return true;
        }

        return false;
    } catch (e) {
        // RangeError or other issues parsing locale
        return undefined;
    }
}

/**
 * Gets the language direction ('rtl' or 'ltr') for the locale.
 * Defaults to 'ltr' if the locale is not RTL or input is invalid.
 */
export function getLangDir(strLocale?: string | null): 'rtl' | 'ltr' {
    return isRtlLang(strLocale) ? 'rtl' : 'ltr';
}
