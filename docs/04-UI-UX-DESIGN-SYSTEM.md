# Dronacharya — UI/UX Design System & Brand Identity

---

## 1. Design Philosophy: The Modern Indian Gurukul

The visual identity of **Dronacharya** reflects the sanctity, discipline, and intellectual clarity of a traditional Indian seat of learning, re-engineered for the digital frontier. It is intentionally understated, scholarly, and serene.

### Core Visual Tenets:
1. **Calm Intellectualism:** The interface prioritizes concentration over excitement. Screens are never visually noisy; ample whitespace creates cognitive breathing room.
2. **Craftsmanship & Restraint:** Subtle Indian motifs (fine jaali geometry, manuscript rules, antique brass seals) appear only as deliberate accents—never as overpowering cultural clichés.
3. **Typography-First Hierarchy:** Academic serifs for philosophical reflection and key milestones; pristine sans-serifs for technical IDE workspaces and data visualization.
4. **Zero AI Cliché:** No neon cyan/purple glows, no generic card glassmorphism, no rainbow gradients, and no gimmicky floating 3D robots.

---

## 2. Official Colour Tokens

All color decisions in Dronacharya adhere to an intentional 80/15/5 distribution rule:
* **75–85% Neutral Canvas:** Warm Ivory and Parchment provide a soft, non-glaring reading surface.
* **10–15% Brand Anchor:** Forest Green commands primary actions, success states, and progress indicators.
* **3–5% Precious Accents:** Antique Brass for mastery seals; Muted Terracotta for critical alerts and diagnostic nudges.

### 2.1 Design Token Specification

```css
:root {
  /* Canvas & Backgrounds */
  --color-bg-primary: #F6F1E7;       /* Warm Ivory: Primary light background */
  --color-bg-secondary: #E9DFC9;     /* Parchment: Secondary surfaces, card panels */
  --color-bg-card: #FFFFFF;          /* Pure Card: Clean contrast for code and input fields */
  --color-bg-subtle: #F0EAE1;        /* Subtle divider tint */

  /* Text & Ink */
  --color-text-primary: #252820;     /* Deep Ink: Main text, headings, prominent borders */
  --color-text-secondary: #575A51;   /* Muted Slate: Subheadings, metadata, descriptions */
  --color-text-muted: #7E8276;       /* Faded Ink: Disabled states, timestamps */
  --color-text-inverse: #F6F1E7;     /* Warm Ivory text on dark containers */

  /* Primary Brand Accent */
  --color-brand-primary: #354B3A;    /* Forest Green: Primary buttons, active states, progress */
  --color-brand-hover: #2B3D2F;      /* Deep Forest: Primary button hover */
  --color-brand-subtle: #E2E8E3;     /* Tinted Green: Selected item background */

  /* Accent & Highlight Colors */
  --color-accent-terracotta: #A65F43;/* Muted Terracotta: Action alerts, important tags */
  --color-accent-brass: #B49A65;     /* Antique Brass: Mastery seals, XP, achievements */
  --color-accent-sage: #A6AC9B;      /* Sage Grey: Neutral borders, inactive track lines */

  /* Functional Status Colors */
  --color-status-success: #354B3A;   /* Forest Green: Test passed, mission complete */
  --color-status-warning: #B49A65;   /* Antique Brass: Hints remaining, partial pass */
  --color-status-danger: #A65F43;    /* Muted Terracotta: Compilation error, failed test */
  --color-status-info: #556B72;      /* Slate Cyan: Informational tips */

  /* Borders & Shadows */
  --border-subtle: 1px solid #D8CFC0;
  --border-strong: 1px solid #252820;
  --border-brass: 1px solid #B49A65;
  --shadow-sm: 0 1px 3px rgba(37, 40, 32, 0.06);
  --shadow-md: 0 4px 12px rgba(37, 40, 32, 0.08);
  --shadow-lg: 0 10px 24px rgba(37, 40, 32, 0.12);
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
}
```

### 2.2 Dark Mode Tokens (Scholarly Nocturne)

Dark mode is not a cyberpunk theme; it is an evening study session in a stone courtyard under candlelight.

```css
[data-theme="dark"] {
  --color-bg-primary: #191B16;       /* Night Ink: Deep charcoal/ink base */
  --color-bg-secondary: #22251F;     /* Slate Hearth: Secondary surface */
  --color-bg-card: #282B24;          /* Elevated Card Surface */
  --color-text-primary: #F6F1E7;     /* Warm Ivory: Crisp contrast */
  --color-text-secondary: #B2B5AA;   /* Soft Sand */
  --color-brand-primary: #557A5D;    /* Sage Pine: Lighter forest green for dark mode */
  --color-brand-hover: #699473;
  --color-accent-brass: #CBB17C;     /* Glowing Brass */
  --border-subtle: 1px solid #3A3E34;
}
```

---

## 3. Typography Hierarchy

Dronacharya pairs a timeless classical serif for editorial gravitas with a modern sans-serif for interface clarity.

### 3.1 Font Families
* **Headings & Key Milestones:** `Lora` (Primary) or `DM Serif Display` (Fallback: `Georgia`, `serif`).
* **UI Controls, Body & Metadata:** `Inter` or `DM Sans` (Fallback: `system-ui`, `sans-serif`).
* **Hindi & Devanagari Scripts:** `Noto Sans Devanagari` (Fallback: `Mangal`, `sans-serif`).
* **Code & Terminal Output:** `JetBrains Mono` or `Fira Code` (Fallback: `ui-monospace`, `monospace`).

### 3.2 Type Scale

| Style | Font Family | Weight | Size | Line Height | Usage |
|:---|:---|:---|:---|:---|:---|
| **Display 1** | Lora | 600 SemiBold | $48\text{px}$ ($3.0\text{rem}$) | $1.15$ | Landing hero, major mastery completion |
| **Heading 1** | Lora | 600 SemiBold | $32\text{px}$ ($2.0\text{rem}$) | $1.25$ | Page titles, mission headers |
| **Heading 2** | Lora | 500 Medium | $24\text{px}$ ($1.5\text{rem}$) | $1.30$ | Section headers, card group titles |
| **Heading 3** | Inter | 600 SemiBold | $18\text{px}$ ($1.125\text{rem}$) | $1.40$ | Component headers, modal titles |
| **Body Large** | Inter | 400 Regular | $16\text{px}$ ($1.0\text{rem}$) | $1.60$ | Mission briefs, explanation text |
| **Body Default**| Inter | 400 Regular | $14\text{px}$ ($0.875\text{rem}$) | $1.50$ | Standard UI, table cells, form labels |
| **Caption** | Inter | 500 Medium | $12\text{px}$ ($0.75\text{rem}$) | $1.40$ | Metadata, test status, timestamps |
| **Code Block** | JetBrains Mono| 400 Regular | $13\text{px}$ ($0.8125\text{rem}$)| $1.55$ | IDE editor, terminal stdout/stderr |

---

## 4. Logo & Brand Mark Principles

The emblem represents **The Arrow of Ekagrata** (single-pointed focus).
* **Core Symbol:** An arrow feather merging into a fine geometric quill, pointed precisely at a subtle geometric concentric circle (the bird's eye).
* **Wordmark:** "DRONACHARYA" set in refined tracked uppercase serif letterforms.
* **Sub-mark:** For favicons ($16\text{px}$ and $32\text{px}$) and mobile headers, a pure geometric arrow crossing a minimal circle crafted in Antique Brass (`#B49A65`) and Forest Green (`#354B3A`).
* **Strict Anti-patterns:**
  * No cartoonish archers with bows.
  * No AI brain icons with sparkling stars.
  * No multi-colored gradients on the mark.

---

## 5. Component Styling Specifications

### 5.1 Buttons

```css
/* Primary Action Button */
.btn-primary {
  background-color: var(--color-brand-primary);
  color: var(--color-bg-primary);
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-brand-primary);
  box-shadow: var(--shadow-sm);
  transition: all 150ms ease-in-out;
  cursor: pointer;
}
.btn-primary:hover {
  background-color: var(--color-brand-hover);
  border-color: var(--color-brand-hover);
  box-shadow: var(--shadow-md);
}

/* Secondary / Outline Button */
.btn-secondary {
  background-color: transparent;
  color: var(--color-text-primary);
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-text-primary);
  transition: all 150ms ease-in-out;
}
.btn-secondary:hover {
  background-color: var(--color-bg-secondary);
}

/* Terracotta Nudge Button (For AI Hints) */
.btn-hint {
  background-color: #FAF4F0;
  color: var(--color-accent-terracotta);
  border: 1px solid var(--color-accent-terracotta);
  border-radius: var(--radius-sm);
  padding: 8px 16px;
  font-size: 13px;
}
```

### 5.2 Cards & Containers
* **Background:** `--color-bg-card` or `--color-bg-secondary`.
* **Border:** `--border-subtle` ($1\text{px}$ solid `#D8CFC0`).
* **Radius:** `--radius-md` ($8\text{px}$).
* **Shadow:** `--shadow-sm`.

### 5.3 Indian-Inspired Visual Accents
* **Manuscript Divider:** A horizontal $1\text{px}$ subtle rule interrupted in the center by a small diamond motif ($\diamondsuit$).
* **Jaali Grid:** A faint $12\text{px}$ geometric dotted or diamond pattern used exclusively on page hero backgrounds with 4% opacity.

---

## 6. Design Do's and Don'ts

| Do | Don't |
|:---|:---|
| **Do** use Warm Ivory (`#F6F1E7`) as the primary background. | **Don't** use stark pure white (`#FFFFFF`) for full-screen backdrops. |
| **Do** use Deep Ink (`#252820`) for high-contrast, readable text. | **Don't** use harsh `#000000` pitch black text. |
| **Do** preserve serene Forest Green for primary calls to action. | **Don't** use electric neon purple, magenta, or glowing cyan buttons. |
| **Do** use Antique Brass (`#B49A65`) exclusively for earned mastery seals. | **Don't** splatter brass/gold across arbitrary UI cards or borders. |
| **Do** use subtle $1\text{px}$ dividers and understated card shadows. | **Don't** apply heavy 3D skeuomorphic gradients or blurry frosted glass. |
| **Do** support fluid bilingual Hindi-English typography. | **Don't** paste decorative Sanskrit slogans that have no contextual meaning. |
