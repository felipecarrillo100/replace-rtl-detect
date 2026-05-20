import { isRtlLang, getLangDir } from '../src/index';

const PRESETS = [
  // ── RTL languages ──────────────────────────────────────────────────────────
  { name: 'Arabic (ar-EG)', code: 'ar-EG', sample: 'العربية هي لغة تُكتب من اليمين إلى اليسار ولها تاريخ عريق.' },
  { name: 'Hebrew (he-IL)', code: 'he-IL', sample: 'עברית היא שפה שמית הנכתבת מימין לשמאל.' },
  { name: 'Persian (fa)', code: 'fa', sample: 'فارسی یک زبان هندواروپایی است که با خط عربی نوشته می‌شود.' },
  { name: 'Urdu (ur)', code: 'ur', sample: 'اردو ایک جنوبی ایشیائی زبان ہے جو دائیں سے بائیں لکھی جاتی ہے۔' },
  { name: 'Kurdish (ku-Arab)', code: 'ku-Arab', sample: 'کوردیی ناوەندی یان سۆرانی بە ڕێنووسی عەرەبی دەنووسرێت.' },
  // ── Historic / minority RTL (bug-discovery locales) ────────────────────────
  { name: 'Kurdish base (ku) ⚡', code: 'ku', sample: 'Kurdî zimanek îranî ye ku bi alfabeyên cuda tê nivîsandin.' },
  { name: 'Avestan (ae) ⚡', code: 'ae', sample: 'Avestan is an ancient Iranian language written right-to-left.' },
  { name: 'Aramaic (arc) ⚡', code: 'arc', sample: 'Aramaic is a Semitic language historically written right-to-left.' },
  // ── Multi-script (LTR vs RTL depending on script) ──────────────────────────
  { name: 'Kurdish (ku-Latn)', code: 'ku-Latn', sample: 'Kurdî bi alfabeya Hawarê ya bi tîpên Latînî tê nivîsandin.' },
  { name: 'Azerbaijani (az-Arab)', code: 'az-Arab', sample: 'آذربایجان دیلی ایراندا عرب الیفباسی ایله یازیلیر.' },
  { name: 'Azerbaijani (az-Latn)', code: 'az-Latn', sample: 'Azərbaycan dili Latın qrafikalı əlifba ilə yazılır.' },
  // ── LTR languages ──────────────────────────────────────────────────────────
  { name: 'English (en-US)', code: 'en-US', sample: 'This is an example text written left-to-right in the Latin script.' },
  { name: 'Spanish (es-ES)', code: 'es-ES', sample: 'Este es un texto de ejemplo escrito de izquierda a derecha en español.' },
  { name: 'Russian (ru)', code: 'ru', sample: 'Русский язык пишется слева направо с использованием кириллического алфавита.' },
  { name: 'Chinese (zh-CN)', code: 'zh-CN', sample: '中文是从左到右书写的，使用汉字书写系统。' },
];

const localeInput = document.getElementById('locale-input') as HTMLInputElement;
const presetsContainer = document.getElementById('presets-container') as HTMLDivElement;
const rtlStatus = document.getElementById('rtl-status') as HTMLDivElement;
const dirStatus = document.getElementById('dir-status') as HTMLDivElement;
const metaLang = document.getElementById('meta-lang') as HTMLSpanElement;
const metaScript = document.getElementById('meta-script') as HTMLSpanElement;
const metaRegion = document.getElementById('meta-region') as HTMLSpanElement;
const metaMaximized = document.getElementById('meta-maximized') as HTMLSpanElement;
const previewText = document.getElementById('preview-text') as HTMLDivElement;
const previewIndicator = document.getElementById('preview-indicator') as HTMLSpanElement;

// Initialize Presets
PRESETS.forEach(preset => {
  const btn = document.createElement('button');
  btn.className = 'preset-btn';
  btn.textContent = preset.name;
  btn.addEventListener('click', () => {
    localeInput.value = preset.code;
    updateUI(preset.code, preset.sample);
    updateActivePreset(btn);
  });
  presetsContainer.appendChild(btn);
});

function updateActivePreset(activeBtn: HTMLButtonElement) {
  document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
  activeBtn.classList.add('active');
}

function updateUI(localeStr: string, customSample?: string) {
  const isRtl = isRtlLang(localeStr);
  const dir = getLangDir(localeStr);

  // Update RTL Status badge
  if (isRtl === undefined) {
    rtlStatus.textContent = 'INVALID';
    rtlStatus.className = 'result-value';
    rtlStatus.style.color = '#ef4444';
  } else if (isRtl) {
    rtlStatus.textContent = 'YES';
    rtlStatus.className = 'result-value badge-rtl';
    rtlStatus.style.color = '';
  } else {
    rtlStatus.textContent = 'NO';
    rtlStatus.className = 'result-value badge-ltr';
    rtlStatus.style.color = '';
  }

  // Update direction status
  dirStatus.textContent = dir.toUpperCase();
  dirStatus.className = `result-value ${dir === 'rtl' ? 'badge-rtl' : 'badge-ltr'}`;

  // Parse details using standard Intl.Locale if possible
  try {
    const clean = localeStr.trim().replace('_', '-');
    const parsed = new Intl.Locale(clean);
    const max = parsed.maximize();

    metaLang.textContent = parsed.language || '--';
    metaScript.textContent = parsed.script || max.script || '--';
    metaRegion.textContent = parsed.region || '--';
    metaMaximized.textContent = max.toString();
  } catch (e) {
    metaLang.textContent = 'Failed to parse';
    metaScript.textContent = '--';
    metaRegion.textContent = '--';
    metaMaximized.textContent = '--';
  }

  // Update preview box
  previewIndicator.textContent = `DIR: ${dir.toUpperCase()}`;
  previewIndicator.style.backgroundColor = dir === 'rtl' ? 'var(--rtl-glow)' : 'var(--ltr-glow)';
  previewIndicator.style.color = dir === 'rtl' ? 'var(--rtl-color)' : 'var(--ltr-color)';
  
  previewText.setAttribute('dir', dir);
  
  if (customSample) {
    previewText.textContent = customSample;
  } else {
    // Find sample or use generic
    const matchingPreset = PRESETS.find(p => p.code.toLowerCase() === localeStr.trim().toLowerCase().replace('_', '-'));
    if (matchingPreset) {
      previewText.textContent = matchingPreset.sample;
    } else {
      previewText.textContent = dir === 'rtl' 
        ? 'مرحبا بك! هذا النص مكتوب من اليمين إلى اليسار للمعاينة.'
        : 'Welcome! This is a left-to-right sample text for preview.';
    }
  }
}

// Attach input listener
localeInput.addEventListener('input', () => {
  // Clear active preset state if typing custom input
  document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
  updateUI(localeInput.value);
});

// Initial load
const initialPreset = PRESETS[0];
localeInput.value = initialPreset.code;
updateUI(initialPreset.code, initialPreset.sample);
const firstBtn = presetsContainer.querySelector('.preset-btn') as HTMLButtonElement;
if (firstBtn) firstBtn.classList.add('active');
