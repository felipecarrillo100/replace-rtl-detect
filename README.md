# replace-rtl-detect

[![npm version](https://img.shields.io/badge/npm-v1.1.2-blue.svg)](https://www.npmjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Build Tool](https://img.shields.io/badge/Bundled%20with-tsup-indigo.svg)](https://github.com/egoist/tsup)
[![Test Tool](https://img.shields.io/badge/Tested%20with-vitest-green.svg)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](file:///d:/git/replace-rtl-detect/LICENSE.md)

A modernized, drop-in replacement for the original `rtl-detect` library. Rebuilt from scratch in TypeScript using native browser/runtime internationalization (`Intl.Locale`) capabilities to provide accurate, secure, and future-proof text direction detection.

---

## Why Modernize? (Engineering Rationale)

The original `rtl-detect` library, created in 2015, served a vital purpose but has become a legacy bottleneck. We modernised it to address critical technical limitations:

1. **Native Platform Capabilities**: The original library relied on custom regex parsing and a hardcoded list of RTL language codes. Today, JavaScript environments have built-in, highly-optimized internationalization mechanisms (`Intl.Locale`). By leveraging the native platform, we eliminate custom parsing bugs and runtime overhead.
2. **Script-Specific Accuracy**: Many languages are written in different scripts depending on the region or alphabet. For example:
   * **Kurdish** in Latin script (`ku-Latn`) is LTR, but in Arabic script (`ku-Arab` / `ckb`) is RTL.
   * **Azerbaijani** in Latin script (`az-Latn`) is LTR, but in Arabic script (`az-Arab`) is RTL.
   
   The original library only checked the base language code (e.g., `ku` or `az`), resulting in **incorrect direction classifications** for multi-script languages. `replace-rtl-detect` uses native script resolution to handle these edge cases accurately.
3. **Supply Chain & Security Safety**: Relying on a third-party package with a hardcoded list of languages introduces dependency security risks. In May 2021, the original library was modified by its maintainer to unilaterally remove Hebrew (`he`) and Yiddish (`yi`) for political reasons, breaking layout direction for thousands of downstream applications. By migrating to native runtime database lookups (Unicode CLDR via the browser/Node engine), `replace-rtl-detect` removes single-point-of-failure human intervention and ensures stability.

We thank the original author, **Shadi Abu Hilal**, and **Yahoo! Inc.** for the initial codebase and concept that helped developers handle RTL layouts for a decade.

---

## Requirements

* **Node.js**: `v18.0.0` or higher.
* **Browsers**: Any modern browser supporting the standard `Intl.Locale` API (Chrome 82+, Safari 14+, Firefox 79+, Edge 82+).
* **Text Direction Support**: For native script direction detection, the runtime environment should support `Intl.Locale.prototype.getTextInfo()` or the `textInfo` property (native in modern Node and browsers; falls back automatically to a standard locale map if unsupported).

---

## Installation

Install using npm:

```bash
npm install replace-rtl-detect
```

Or using yarn / pnpm:

```bash
yarn add replace-rtl-detect
# or
pnpm add replace-rtl-detect
```

---

## Usage

`replace-rtl-detect` is built to be a drop-in replacement, fully compatible with both ES Modules (ESM) and CommonJS (CJS).

### 1. Importing (ES Modules / TypeScript)

```typescript
import { isRtlLang, getLangDir } from 'replace-rtl-detect';

// Check if a language is RTL
isRtlLang('ar-JO'); // true
isRtlLang('en-US'); // false

// Handle multi-script languages correctly
isRtlLang('ku-Latn'); // false (Kurdish in Latin script)
isRtlLang('ku-Arab'); // true (Kurdish in Arabic script)

// Get direction string ('rtl' or 'ltr')
getLangDir('ar_JO'); // 'rtl'
getLangDir('en');    // 'ltr'
```

### 2. Requiring (CommonJS)

```javascript
const { isRtlLang, getLangDir } = require('replace-rtl-detect');

console.log(isRtlLang('he')); // true
console.log(getLangDir('fr-FR')); // 'ltr'
```

---

## API Reference

### `isRtlLang(strLocale)`
Checks if the given locale string represents a right-to-left language.

* **Parameters:** `strLocale` (string | null | undefined)
* **Returns:** `boolean | undefined`
  * `true`: Locale is a right-to-left language.
  * `false`: Locale is a left-to-right language.
  * `undefined`: The input is empty, invalid, or cannot be parsed as a BCP 47 locale.

### `getLangDir(strLocale)`
Gets the writing direction for the given locale.

* **Parameters:** `strLocale` (string | null | undefined)
* **Returns:** `'rtl' | 'ltr'`
  * Returns `'rtl'` if the language is RTL.
  * Defaults to `'ltr'` if the language is LTR, or if the input is empty or invalid.

---

## Interactive Demo

You can run and test the library locally using the interactive web demo:

1. Clone this repository.
2. Install development dependencies: `npm install`
3. Start the Vite dev server: `npm run demo`
4. Open the displayed URL in your browser to try presets and custom locale strings.

---

## License

Licensed under the MIT License. See [LICENSE.md](file:///d:/git/replace-rtl-detect/LICENSE.md) for details.
This project is a clean-room modernization written from scratch in 2026, inspired by the public API design of the original `rtl-detect` library by Yahoo! Inc. and Shadi Abu Hilal.
