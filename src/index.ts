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

        // 1. If script is explicitly RTL, return true
        if (maximized.script && RTL_SCRIPTS.has(maximized.script)) {
            return true;
        }

        // 2. Check direction via native Intl API if available
        // Modern browsers/Node use getTextInfo().direction. Some earlier versions used textInfo.direction.
        const direction = (locale as any).getTextInfo?.().direction || (locale as any).textInfo?.direction;
        if (direction === 'rtl') {
            return true;
        } else if (direction === 'ltr') {
            return false;
        }

        // 3. Fallback to base language code check
        return RTL_LANGS.has(maximized.language || locale.language);
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
