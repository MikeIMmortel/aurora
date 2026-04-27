# Design Tokens — Tailwind v4

Vervang de `@theme` block in `src/index.css` met onderstaande. Behoud Inter/Playfair niet meer — vervangen door Instrument Serif + Geist + JetBrains Mono.

## src/index.css (volledig)

```css
@import "tailwindcss";

@theme {
  /* ───────── Type ───────── */
  --font-display: "Instrument Serif", "Times New Roman", serif;
  --font-body: "Geist", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;

  /* ───────── Light theme (default) — warm paper ───────── */
  --color-bg: #f6f3ec;
  --color-bg-card: #fbfaf6;
  --color-bg-sunken: #ede9df;

  --color-ink: #1a1814;
  --color-ink-2: #4a463d;
  --color-ink-3: #8a8479;
  --color-ink-4: #b8b2a5;

  --color-rule: rgb(26 24 20 / 0.08);
  --color-rule-2: rgb(26 24 20 / 0.16);

  /* Aurora accent — keep "aurora-*" namespacing voor backwards-compat */
  --color-aurora-gold: #4a8a3a;        /* hergedefinieerd: groen ipv goud */
  --color-aurora-gold-dark: #2f5a24;
  --color-aurora-gold-light: rgb(74 138 58 / 0.12);

  --color-aurora-black: #f6f3ec;       /* legacy alias → bg */
  --color-aurora-surface: #fbfaf6;     /* legacy alias → card */
  --color-aurora-border: rgb(26 24 20 / 0.16);
  --color-aurora-surface-hover: #ede9df;

  --color-positive: #4a8a3a;
  --color-negative: #b85a2c;
}

/* ───────── Dark theme — opt-in via data-theme ───────── */
:root[data-theme="dark"] {
  --color-bg: #131210;
  --color-bg-card: #1c1a17;
  --color-bg-sunken: #0e0d0b;

  --color-ink: #f0ece2;
  --color-ink-2: #b8b2a5;
  --color-ink-3: #7a7468;
  --color-ink-4: #4a463d;

  --color-rule: rgb(240 236 226 / 0.08);
  --color-rule-2: rgb(240 236 226 / 0.16);

  --color-aurora-gold: #7fbc6c;
  --color-aurora-gold-dark: #aed99e;
  --color-aurora-gold-light: rgb(127 188 108 / 0.14);

  --color-aurora-black: #131210;
  --color-aurora-surface: #1c1a17;
  --color-aurora-border: rgb(240 236 226 / 0.16);
  --color-aurora-surface-hover: #221f1b;

  --color-positive: #7fbc6c;
  --color-negative: #e08a5a;
}

/* ───────── Density (optioneel) ───────── */
:root {
  --pad-card: 24px;
  --gap-grid: 20px;
}
:root[data-density="compact"] { --pad-card: 16px; --gap-grid: 14px; }
:root[data-density="comfy"]   { --pad-card: 32px; --gap-grid: 28px; }

/* ───────── Base ───────── */
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: var(--font-body);
  background-color: var(--color-bg);
  color: var(--color-ink);
  font-feature-settings: 'ss01', 'cv11';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--color-bg); }
::-webkit-scrollbar-thumb { background: var(--color-rule-2); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--color-aurora-gold-dark); }
```

## Tailwind class mapping

Met bovenstaande `@theme` block kun je in JSX schrijven:

| Class | Resolves to |
|---|---|
| `bg-aurora-black` | warm off-white in light, warm-zwart in dark |
| `bg-aurora-surface` | card background |
| `text-aurora-gold` | accent groen |
| `border-aurora-border` | rule-2 |
| `text-positive` / `text-negative` | groen / oranje-rood |
| `font-display` | Instrument Serif |
| `font-body` | Geist (default) |
| `font-mono` | JetBrains Mono |

## Backwards-compat

Alle bestaande `aurora-gold` / `aurora-surface` className gebruiken in de codebase blijven werken — ze pakken alleen de nieuwe waardes op. **Geen find-and-replace nodig** behalve waar je gewoon nicer namen wilt.

## Fonts toevoegen

In `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" />
```

## Spacing scale

Geen aanpassingen aan de Tailwind default spacing scale. Voor cards gebruik:

- `p-[var(--pad-card)]` → 16/24/32px afhankelijk van density
- `gap-[var(--gap-grid)]` → 14/20/28px

## Border radius

| Use | Class |
|---|---|
| Cards | `rounded-[14px]` |
| Pills (period switcher) | `rounded-full` |
| Inputs / buttons | `rounded-[7px]` |
| Theme toggle button | `rounded-full` (32×32px) |

## Type scale

| Use | Family | Size | Weight |
|---|---|---|---|
| Hero number (gewicht) | display | 112px | 400 |
| Page title | display | 38px | 400 |
| Card title | display italic | 22px | 400 |
| Hero delta value | display | 22px | 400 |
| Stat value | display | 26-28px | 400 |
| Macro value | display | 18px | 400 |
| Body | body | 14px | 400 |
| Meal name | body | 14px | 400 |
| Section label / meta | mono | 10.5-11px tracking 0.12em | 500 |
| Axis tick | mono | 10px | 400 |
