# Portfolio Application Style Guide

A comprehensive style guide for the portfolio application that can be used across other applications. This guide documents the design system, components, and styling patterns used throughout the application.

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Theme](#theme)
3. [Color System](#color-system)
4. [Typography](#typography)
5. [Spacing & Layout](#spacing--layout)
6. [Components](#components)
7. [BEM Naming Convention](#bem-naming-convention)
8. [Tailwind Configuration](#tailwind-configuration)
9. [Responsive Design](#responsive-design)
10. [Animations & Transitions](#animations--transitions)
11. [Utilities](#utilities)
12. [Implementation Examples](#implementation-examples)

---

## Design Philosophy

The portfolio application follows a **minimalist, glass-morphism design** with:

- **Clean Aesthetics**: Subtle borders, soft shadows, and translucent backgrounds
- **High Contrast**: Black text on light backgrounds for excellent readability
- **Smooth Interactions**: Gentle hover effects and transitions
- **Responsive First**: Mobile-first approach with progressive enhancement
- **Accessibility**: High contrast ratios and semantic HTML

### Key Design Principles

1. **Glass Morphism**: Translucent backgrounds with backdrop blur effects
2. **Subtle Depth**: Soft shadows and borders create visual hierarchy
3. **Minimal Color Palette**: Primarily black, white, and grays with subtle opacity variations
4. **Generous Spacing**: Ample whitespace for breathing room
5. **Consistent Transitions**: 300-500ms duration for smooth animations

---

## Theme

### Theme Overview

The portfolio application uses a **Light Minimalist Glass-Morphism Theme** characterized by:

- **Base**: Pure white background (`rgb(255, 255, 255)`)
- **Style**: Glass-morphism with translucent elements
- **Mood**: Clean, professional, modern, and approachable
- **Aesthetic**: Minimalist with subtle depth and texture

### Theme Characteristics

#### 1. Background System

**Primary Background**:
- Pure white (`rgb(255, 255, 255)`) for the main body
- Light gray (`rgb(245, 245, 245)`) for subtle variations

**Background Image Overlay**:
The application features a subtle background image overlay that adds texture without distraction:

```css
.portfolio__main::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/assets/profileimage/profileImage.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.03; /* Extremely subtle - 3% opacity */
  z-index: -1;
  pointer-events: none;
}
```

**Key Points**:
- Fixed positioning for parallax-like effect
- 3% opacity ensures it doesn't interfere with readability
- Behind all content (`z-index: -1`)
- Non-interactive (`pointer-events: none`)

#### 2. Glass Morphism Effect

The theme's signature visual style uses translucent glass-like elements:

**Glass Elements**:
- **Background**: `rgba(240, 240, 240, 0.8)` - Light gray with 80% opacity
- **Border**: `rgba(0, 0, 0, 0.1)` - Subtle black border at 10% opacity
- **Shadow**: Soft shadows (`0 2px 8px rgba(0, 0, 0, 0.08)`) for depth
- **Hover State**: Slightly darker background (`rgba(230, 230, 230, 0.9)`) with enhanced shadow

**Visual Hierarchy**:
- Cards and containers use glass-morphism to create depth
- Hover states enhance the glass effect with darker backgrounds
- Borders provide subtle definition without harsh lines

#### 3. Color Palette

**Primary Colors**:
- **Black**: `rgb(0, 0, 0)` - Primary text, strong elements
- **White**: `rgb(255, 255, 255)` - Background, contrast
- **Light Gray**: `rgb(240, 240, 240)` - Glass backgrounds
- **Medium Gray**: `rgb(245, 245, 245)` - Subtle backgrounds

**Opacity Variations**:
The theme uses black at various opacity levels to create a monochromatic palette:
- 95% - Primary text
- 80% - Secondary text
- 70% - Body text
- 60% - Icons, links
- 40% - Labels, metadata
- 20% - Dividers
- 10% - Borders
- 5% - Subtle backgrounds

#### 4. Visual Elements

**Borders**:
- Subtle, low-opacity borders (`rgba(0, 0, 0, 0.1)`)
- Rounded corners (`rounded-xl`, `rounded-lg`) for softness
- Border width: `1px` for most elements, `4px` for profile images

**Shadows**:
- Soft, subtle shadows for depth
- No harsh drop shadows
- Hover states enhance shadows slightly
- Shadow color: `rgba(0, 0, 0, 0.08)` to `rgba(0, 0, 0, 0.1)`

**Transparency**:
- Heavy use of opacity for layering
- Translucent backgrounds create depth
- Overlay effects for visual interest

#### 5. Typography Theme

**Font**: Courier Prime (monospace)
- Clean, technical aesthetic
- Excellent readability
- Professional appearance

**Text Treatment**:
- No text shadows (flat design)
- High contrast for accessibility
- Light font weight (300) for body text
- Bold (700) for headings

#### 6. Interactive Elements

**Hover States**:
- Subtle scale transforms (`scale-105`, `scale-110`)
- Background darkening on hover
- Enhanced shadows
- Smooth transitions (300-500ms)

**Active States**:
- Slight scale reduction for feedback
- Shadow reduction for pressed effect

#### 7. Theme Implementation

**CSS Variables**:
All theme colors are defined as CSS custom properties for easy theming:

```css
:root {
  --background: rgb(255, 255, 255);
  --background-dark: rgb(245, 245, 245);
  --text-primary: rgba(0, 0, 0, 0.95);
  --text-secondary: rgba(0, 0, 0, 0.7);
  --glass-bg: rgba(240, 240, 240, 0.8);
  --glass-bg-hover: rgba(230, 230, 230, 0.9);
  --glass-border: rgba(0, 0, 0, 0.1);
  --glass-border-hover: rgba(0, 0, 0, 0.2);
}
```

**Tailwind Extensions**:
Custom Tailwind colors for glass effects:

```typescript
colors: {
  glass: {
    DEFAULT: "rgba(240, 240, 240, 0.8)",
    dark: "rgba(0, 0, 0, 0.05)",
    border: "rgba(0, 0, 0, 0.1)",
    "border-dark": "rgba(0, 0, 0, 0.15)",
  },
}
```

### Theme Consistency Rules

1. **Always use CSS variables** for theme colors
2. **Maintain opacity hierarchy** for text elements
3. **Apply glass-morphism** to cards and containers
4. **Use subtle borders** (10% opacity) for definition
5. **Implement soft shadows** for depth
6. **Maintain high contrast** for accessibility
7. **Use smooth transitions** for all interactive elements
8. **Keep backgrounds minimal** - white with subtle texture

### Theme Customization

To adapt this theme to other applications:

1. **Change Background Image**: Update the `background-image` URL in `.portfolio__main::before`
2. **Adjust Opacity**: Modify the overlay opacity (currently 0.03) for more/less texture
3. **Modify Glass Colors**: Update `--glass-bg` and related variables for different tints
4. **Change Font**: Replace Courier Prime with your preferred font family
5. **Adjust Opacity Scale**: Modify the opacity values to match your brand

### Theme Examples

**Glass Card**:
```tsx
<div className="glass-card">
  {/* Translucent background, subtle border, soft shadow */}
</div>
```

**Text Hierarchy**:
```tsx
<h1 className="text-black">Primary Heading</h1>
<p className="text-black/70">Body Text</p>
<span className="text-black/40">Label</span>
```

**Interactive Element**:
```tsx
<button className="
  bg-black/5
  border border-black/10
  hover:bg-black/10
  hover:border-black/20
  transition-all duration-300
">
  Button
</button>
```

---

## Color System

### CSS Custom Properties

The application uses CSS custom properties defined in `globals.css`:

```css
:root {
  --background: rgb(255, 255, 255);
  --background-dark: rgb(245, 245, 245);
  --accent-light: rgba(0, 0, 0, 0.1);
  --accent-hover: rgba(0, 0, 0, 0.15);
  --text-primary: rgba(0, 0, 0, 0.95);
  --text-secondary: rgba(0, 0, 0, 0.7);
  --glass-bg: rgba(240, 240, 240, 0.8);
  --glass-bg-hover: rgba(230, 230, 230, 0.9);
  --glass-border: rgba(0, 0, 0, 0.1);
  --glass-border-hover: rgba(0, 0, 0, 0.2);
}
```

### Tailwind Color Extensions

Custom colors defined in `tailwind.config.ts`:

```typescript
colors: {
  glass: {
    DEFAULT: "rgba(240, 240, 240, 0.8)",
    dark: "rgba(0, 0, 0, 0.05)",
    border: "rgba(0, 0, 0, 0.1)",
    "border-dark": "rgba(0, 0, 0, 0.15)",
  },
}
```

### Color Usage Guidelines

| Color Variable | Usage | Example |
|---------------|-------|---------|
| `--text-primary` | Main headings, important text | `color: var(--text-primary)` |
| `--text-secondary` | Body text, descriptions | `color: var(--text-secondary)` |
| `--glass-bg` | Card backgrounds, containers | `background: var(--glass-bg)` |
| `--glass-border` | Card borders, dividers | `border-color: var(--glass-border)` |
| `rgba(0, 0, 0, 0.05)` | Subtle backgrounds, hover states | `background: rgba(0, 0, 0, 0.05)` |
| `rgba(0, 0, 0, 0.1)` | Borders, dividers | `border-color: rgba(0, 0, 0, 0.1)` |
| `rgba(0, 0, 0, 0.6)` | Secondary text, icons | `color: rgba(0, 0, 0, 0.6)` |
| `rgba(0, 0, 0, 0.4)` | Tertiary text, labels | `color: rgba(0, 0, 0, 0.4)` |

### Opacity Scale

- **95%**: Primary text (`rgba(0, 0, 0, 0.95)`)
- **80%**: Secondary text (`rgba(0, 0, 0, 0.8)`)
- **70%**: Tertiary text (`rgba(0, 0, 0, 0.7)`)
- **60%**: Icons, links (`rgba(0, 0, 0, 0.6)`)
- **40%**: Labels, metadata (`rgba(0, 0, 0, 0.4)`)
- **20%**: Dividers, subtle elements (`rgba(0, 0, 0, 0.2)`)
- **10%**: Borders (`rgba(0, 0, 0, 0.1)`)
- **5%**: Backgrounds (`rgba(0, 0, 0, 0.05)`)

---

## Typography

### Font Family

**Primary Font**: Courier Prime (Google Fonts)

```typescript
const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
});
```

### Font Sizes

The application uses a responsive font size system with a base of 90%:

```css
html {
  font-size: 90%;
}

@media (max-width: 640px) {
  html {
    font-size: 90%;
  }
}
```

### Typography Scale

| Element | Mobile | Tablet | Desktop | Usage |
|---------|--------|--------|---------|-------|
| Hero Title | `text-4xl` (2.25rem) | `text-6xl` (3.75rem) | `text-8xl` (6rem) | Main heading |
| Section Title | `text-3xl` (1.875rem) | `text-5xl` (3rem) | `text-6xl` (3.75rem) | Section headings |
| Subtitle | `text-lg` (1.125rem) | `text-2xl` (1.5rem) | `text-3xl` (1.875rem) | Role, tagline |
| Body Large | `text-base` (1rem) | `text-xl` (1.25rem) | `text-2xl` (1.5rem) | Important body text |
| Body | `text-base` (1rem) | `text-lg` (1.125rem) | `text-xl` (1.25rem) | Regular body text |
| Small | `text-sm` (0.875rem) | `text-base` (1rem) | `text-lg` (1.125rem) | Descriptions, metadata |
| XS | `text-xs` (0.75rem) | `text-xs` (0.75rem) | `text-sm` (0.875rem) | Labels, captions |

### Font Weights

- **400 (Regular)**: Body text, descriptions
- **700 (Bold)**: Headings, emphasis

### Typography Classes

```css
/* Headings */
.hero__title {
  @apply text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold;
  color: black;
}

.hero__subtitle {
  @apply text-base sm:text-lg md:text-xl lg:text-2xl;
  color: rgba(0, 0, 0, 0.7);
}

/* Body Text */
.hero__about-text {
  @apply text-base sm:text-lg md:text-xl lg:text-2xl;
  color: rgba(0, 0, 0, 0.7);
  font-weight: 300; /* Light weight for body */
}

/* Labels */
.hero__highlight-title {
  @apply text-xs uppercase tracking-wider;
  color: rgba(0, 0, 0, 0.4);
  font-weight: 500;
}
```

### Text Utilities

- **Line Height**: `leading-relaxed` for body text, `leading-tight` for headings
- **Letter Spacing**: `tracking-tight` for headings, `tracking-wider` for uppercase labels
- **Text Shadow**: None (clean, flat design)
- **Text Transform**: `uppercase` for labels and metadata

---

## Spacing & Layout

### Container System

```css
.portfolio__main {
  @apply container mx-auto;
  position: relative;
  min-height: 100vh;
}
```

### Padding Scale

| Size | Value | Usage |
|------|-------|-------|
| `p-1.5` | 0.375rem (6px) | Small buttons, icons |
| `p-2` | 0.5rem (8px) | Compact elements |
| `p-3` | 0.75rem (12px) | Small cards |
| `p-4` | 1rem (16px) | Standard padding |
| `p-6` | 1.5rem (24px) | Card padding |
| `p-8` | 2rem (32px) | Large containers |
| `p-12` | 3rem (48px) | Section padding (mobile) |
| `p-16` | 4rem (64px) | Section padding (tablet) |
| `p-20` | 5rem (80px) | Section padding (desktop) |
| `p-24` | 6rem (96px) | Section padding (large desktop) |
| `p-32` | 8rem (128px) | Section padding (xl desktop) |

### Responsive Padding

```css
/* Section Padding */
section {
  @apply py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32;
}

/* Container Padding */
.container {
  @apply px-4 sm:px-6 md:px-8 lg:px-12;
}
```

### Gap Scale

| Size | Value | Usage |
|------|-------|-------|
| `gap-1.5` | 0.375rem | Tight spacing |
| `gap-2` | 0.5rem | Small gaps |
| `gap-3` | 0.75rem | Standard gaps |
| `gap-4` | 1rem | Card gaps |
| `gap-6` | 1.5rem | Section gaps |
| `gap-8` | 2rem | Large gaps |

### Margin Scale

| Size | Value | Usage |
|------|-------|-------|
| `mb-2` | 0.5rem | Small margins |
| `mb-4` | 1rem | Standard margins |
| `mb-6` | 1.5rem | Medium margins |
| `mb-8` | 2rem | Large margins |
| `mb-10` | 2.5rem | Section spacing |
| `mb-12` | 3rem | Large section spacing |
| `mb-14` | 3.5rem | Extra large spacing |
| `mb-16` | 4rem | Maximum spacing |

### Max Width

- **Container**: `max-w-7xl` (80rem / 1280px)
- **Content**: `max-w-4xl` (56rem / 896px)
- **Narrow Content**: `max-w-2xl` (42rem / 672px)

---

## Components

### Glass Card

A reusable card component with glass-morphism effect.

**Component**: `GlassCard.tsx`

```tsx
<GlassCard className="custom-class" animate={true}>
  {children}
</GlassCard>
```

**Styles**:

```css
.glass-card {
  @apply relative overflow-hidden rounded-xl border p-6;
  background: var(--glass-bg);
  border-color: var(--glass-border);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
  transition: transform 300ms;
}

.glass-card:hover {
  background: var(--glass-bg-hover);
  border-color: var(--glass-border-hover);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1);
  transform: scale(1.01);
}
```

**Properties**:
- `background`: Translucent light gray
- `border`: Subtle black border (10% opacity)
- `border-radius`: `rounded-xl` (0.75rem)
- `box-shadow`: Soft shadow for depth
- `hover`: Slightly darker background and enhanced shadow

### Profile Image

```css
.hero__profile-image {
  @apply relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-48 lg:h-48;
  transition: transform 500ms;
}

.hero__profile-image:hover {
  transform: scale(1.05);
}

.hero__profile-image-wrapper {
  @apply rounded-full overflow-hidden border-4;
  border-color: rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.06);
}

.hero__profile-image-wrapper:hover {
  border-color: rgba(0, 0, 0, 0.4);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
}
```

### Social Links

```css
.hero__social-links {
  @apply flex justify-center lg:justify-start gap-4 sm:gap-6;
}

.hero__social-links a {
  @apply text-black/60 hover:text-black transition-all duration-300 p-2 rounded-full;
}

.hero__social-links a:hover {
  @apply transform scale-110 bg-black/5;
}
```

### Project Cards

```css
.hero__project-item {
  @apply relative overflow-hidden transition-all duration-500 flex flex-col;
  background: var(--glass-bg);
  height: 100%;
}

.hero__project-item:hover {
  @apply transform scale-[1.02];
  background: var(--glass-bg-hover);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1);
}

.hero__project-tech-item {
  @apply px-2 py-1 text-xs sm:text-sm rounded-full;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.15);
}

.hero__project-tech-item:hover {
  background: rgba(0, 0, 0, 0.1);
  border-color: rgba(0, 0, 0, 0.25);
  transform: translateY(-1px);
}
```

### Skill Items

```css
.hero__skill-item {
  @apply relative overflow-hidden transition-all duration-500 flex flex-col items-center justify-center gap-2;
  background: rgba(240, 240, 240, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  min-height: 100px;
  border-radius: 8px;
}

.hero__skill-item:hover {
  @apply transform scale-105;
  background: rgba(230, 230, 230, 0.9);
  border-color: rgba(0, 0, 0, 0.2);
}
```

### Buttons & Links

```css
.hero__project-link {
  @apply flex-1 text-center py-2.5 px-4 sm:px-6 rounded-lg text-sm sm:text-base font-medium
    transition-all duration-300 flex items-center justify-center gap-2;
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-primary);
  border: 1px solid rgba(0, 0, 0, 0.15);
}

.hero__project-link:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-color: rgba(0, 0, 0, 0.25);
}
```

---

## BEM Naming Convention

The application uses **BEM (Block Element Modifier)** methodology for class naming.

### Pattern

```
block__element--modifier
```

### Rules

1. **Block**: Standalone component (e.g., `hero`, `projects`)
2. **Element**: Part of a block (e.g., `hero__profile`, `projects__card`)
3. **Modifier**: Variation of block or element (e.g., `hero__social-link--github`)

### Examples

```tsx
// Block
<div className="hero">

  // Element
  <div className="hero__container">
    <div className="hero__profile">

      // Element of element
      <div className="hero__profile-image">
        <img className="hero__profile-img" />
      </div>

      // Element with modifier
      <a className="hero__social-link hero__social-link--github">
    </div>
  </div>
</div>
```

### BEM + Tailwind

BEM classes are used alongside Tailwind utility classes:

```tsx
<div className="hero__profile p-6 border border-black/10 rounded-xl">
  <h2 className="hero__profile-title text-xl font-bold">Profile</h2>
</div>
```

**Benefits**:
- Easy identification in DevTools
- No class name conflicts
- Clear component hierarchy
- Works with Tailwind utilities
- Better for E2E testing

See `PORTFOLIO_BEM_CLASSES.md` for complete BEM class reference.

---

## Tailwind Configuration

### Configuration File

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          DEFAULT: "rgba(240, 240, 240, 0.8)",
          dark: "rgba(0, 0, 0, 0.05)",
          border: "rgba(0, 0, 0, 0.1)",
          "border-dark": "rgba(0, 0, 0, 0.15)",
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
```

### Custom Utilities

- `bg-glass`: Glass background color
- `bg-glass-dark`: Dark glass background
- `border-glass`: Glass border color
- `border-glass-border-dark`: Dark glass border
- `backdrop-blur-xs`: Extra small backdrop blur

---

## Responsive Design

### Breakpoints

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small desktops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large desktops |

### Mobile-First Approach

Always start with mobile styles, then add larger breakpoint overrides:

```tsx
<div className="
  text-base          // Mobile default
  sm:text-lg         // Small tablets
  md:text-xl         // Tablets
  lg:text-2xl        // Desktops
  xl:text-3xl        // Large desktops
">
```

### Responsive Patterns

**Typography**:
```tsx
<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
```

**Spacing**:
```tsx
<div className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
```

**Layout**:
```tsx
<div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
```

**Grid**:
```css
.projects__grid {
  grid-template-columns: repeat(1, 1fr); /* Mobile */
}

@media (min-width: 768px) {
  .projects__grid {
    grid-template-columns: repeat(2, 1fr); /* Tablet */
  }
}

@media (min-width: 1280px) {
  .projects__grid {
    grid-template-columns: repeat(3, 1fr); /* Desktop */
  }
}
```

---

## Animations & Transitions

### Transition Durations

| Duration | Value | Usage |
|----------|-------|-------|
| `duration-300` | 300ms | Standard interactions |
| `duration-500` | 500ms | Complex animations |

### Common Transitions

```css
/* Standard hover */
transition-all duration-300

/* Transform animations */
transition-transform duration-500

/* Scale on hover */
hover:scale-105
hover:scale-110
hover:scale-[1.02]

/* Translate on hover */
hover:translateY(-1px)
hover:translateY(-2px)
```

### Custom Animations

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInFast {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-fade-in-delay {
  animation: fadeIn 0.5s ease-out 0.2s both;
}

.animate-fade-in-fast {
  animation: fadeInFast 0.3s ease-out;
}
```

### Animation Usage

```tsx
<div className="animate-fade-in">
  {/* Fades in on load */}
</div>

<div className="animate-fade-in-delay">
  {/* Fades in with 0.2s delay */}
</div>
```

### Hover Effects

**Scale**:
```css
.hover\:scale-105:hover { transform: scale(1.05); }
.hover\:scale-110:hover { transform: scale(1.1); }
.hover\:scale-\[1\.02\]:hover { transform: scale(1.02); }
```

**Background**:
```css
.hover\:bg-black\/5:hover { background: rgba(0, 0, 0, 0.05); }
.hover\:bg-black\/10:hover { background: rgba(0, 0, 0, 0.1); }
```

**Shadow**:
```css
.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

---

## Utilities

### Class Name Utility

The application uses `clsx` and `tailwind-merge` for conditional classes:

```typescript
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Usage**:
```tsx
import { cn } from "@/lib/utils";

<div className={cn(
  "base-class",
  condition && "conditional-class",
  anotherClass
)}>
```

### Custom Scrollbar

```css
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--glass-bg);
}

::-webkit-scrollbar-thumb {
  @apply rounded;
  background: rgba(0, 0, 0, 0.3);
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5);
}
```

---

## Implementation Examples

### Creating a Glass Card

```tsx
import { GlassCard } from "@/components/ui/GlassCard";

<GlassCard className="mb-6" animate={true}>
  <h2 className="text-2xl font-bold mb-4">Title</h2>
  <p className="text-black/70">Content goes here</p>
</GlassCard>
```

### Creating a Responsive Section

```tsx
<section className="hero py-12 sm:py-16 md:py-20 lg:py-24">
  <div className="hero__container max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
    <div className="hero__content max-w-4xl">
      <h1 className="hero__title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
        Heading
      </h1>
      <p className="hero__subtitle text-lg sm:text-xl md:text-2xl text-black/70">
        Subtitle
      </p>
    </div>
  </div>
</section>
```

### Creating a Project Card

```tsx
<div className="hero__project-item rounded-xl border border-glass-border p-6">
  <div className="hero__project-image mb-4 rounded-lg overflow-hidden">
    <img src="/image.jpg" alt="Project" className="w-full h-full object-cover" />
  </div>
  <div className="hero__project-content">
    <h3 className="hero__project-title text-xl font-semibold mb-2">
      Project Title
    </h3>
    <p className="hero__project-description text-sm text-black/80 mb-4">
      Description
    </p>
    <div className="hero__project-tech-list flex flex-wrap gap-2">
      <span className="hero__project-tech-item">React</span>
      <span className="hero__project-tech-item">TypeScript</span>
    </div>
  </div>
</div>
```

### Creating a Social Link

```tsx
<Link
  href="https://github.com/username"
  target="_blank"
  rel="noopener noreferrer"
  className="hero__social-link hero__social-link--github
    text-black/60 hover:text-black
    transition-colors p-2 rounded-full"
>
  <FaGithub className="w-5 h-5" />
</Link>
```

### Creating a Stat Card

```tsx
<div className="hero__stat glass-card p-6 text-center">
  <div className="hero__stat-value text-3xl font-bold mb-2">10+</div>
  <div className="hero__stat-label text-sm text-black/60">Years Experience</div>
</div>
```

---

## Best Practices

### 1. Always Use BEM Classes

```tsx
// ✅ Good
<div className="hero__profile p-6">

// ❌ Bad
<div className="profile p-6">
```

### 2. Combine BEM with Tailwind

```tsx
// ✅ Good
<div className="hero__profile p-6 border border-glass-border rounded-xl">

// ❌ Bad (only BEM)
<div className="hero__profile">

// ❌ Bad (only Tailwind)
<div className="p-6 border border-glass-border rounded-xl">
```

### 3. Use CSS Variables for Colors

```tsx
// ✅ Good
<div style={{ background: 'var(--glass-bg)' }}>

// ❌ Bad
<div style={{ background: 'rgba(240, 240, 240, 0.8)' }}>
```

### 4. Mobile-First Responsive Design

```tsx
// ✅ Good
<div className="text-base sm:text-lg md:text-xl">

// ❌ Bad
<div className="text-xl md:text-base">
```

### 5. Consistent Spacing

```tsx
// ✅ Good (using scale)
<div className="mb-4 sm:mb-6 md:mb-8">

// ❌ Bad (arbitrary values)
<div className="mb-5 sm:mb-7 md:mb-9">
```

### 6. Smooth Transitions

```tsx
// ✅ Good
<div className="transition-all duration-300 hover:scale-105">

// ❌ Bad
<div className="hover:scale-105">
```

---

## Migration Guide

To use this style guide in another application:

1. **Copy CSS Variables**: Add the `:root` variables from `globals.css` to your global styles
2. **Copy Tailwind Config**: Extend your `tailwind.config.ts` with the glass colors
3. **Copy Component Styles**: Add the component CSS classes to your stylesheet
4. **Install Dependencies**: Ensure `clsx` and `tailwind-merge` are installed
5. **Copy Utilities**: Add the `cn` utility function to your utils
6. **Update Font**: Import and apply Courier Prime or your preferred font
7. **Apply BEM Convention**: Use BEM naming for your components

---

## Resources

- **BEM Documentation**: [getbem.com](http://getbem.com/)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com/)
- **Glass Morphism**: Modern UI design trend with translucent elements
- **Portfolio BEM Classes**: See `PORTFOLIO_BEM_CLASSES.md` for complete reference

---

**Last Updated**: 2025-01-27
**Version**: 1.0.0
**Maintained By**: Portfolio Development Team
