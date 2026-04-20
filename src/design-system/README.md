# 🎨 Stacks Design System

Complete design system tokens and component definitions extracted from Figma's Stacks Design System.

## 📋 Contents

```
src/design-system/
├── tokens/
│   ├── typography.json       # Font styles, sizes, weights
│   ├── colors.json           # Color palette & semantic tokens
│   ├── spacing.json          # Spacing scale (padding, margin, gap)
│   ├── sizing.json           # Width, height, max-width scales
│   ├── border-radius.json    # Border radius tokens
│   ├── shadows.json          # Elevation & shadow system
│   ├── motion.json           # Animation, easing, transitions
│   └── breakpoints.json      # Responsive breakpoints & media queries
├── components/
│   ├── buttons.json          # Button variants & states
│   ├── inputs.json           # Form inputs (text, select, checkbox, etc.)
│   ├── cards.json            # Card, badge, chip components
│   ├── navigation.json       # Nav, breadcrumbs, pagination
│   └── feedback.json         # Alerts, modals, toasts
├── design-system.json        # Master index & metadata
└── README.md                 # This file
```

## 🚀 Quick Start

### 1. Import Tokens

```javascript
import tokens from '@/design-system/design-system.json';
import typography from '@/design-system/tokens/typography.json';
import colors from '@/design-system/tokens/colors.json';
import spacing from '@/design-system/tokens/spacing.json';
```

### 2. Use in CSS

```css
:root {
  --color-primary: #0066CC;
  --color-text-primary: #111827;
  --spacing-md: 16px;
  --font-heading: 'Poppins', sans-serif;
  --motion-duration-base: 200ms;
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.button {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
  font-family: var(--font-heading);
  transition: all var(--motion-duration-base) ease-out;
  box-shadow: var(--shadow-md);
}
```

### 3. Transform to Tailwind

```javascript
// tailwind.config.js
const tokens = require('./src/design-system/tokens');

module.exports = {
  theme: {
    colors: tokens.colors,
    spacing: tokens.spacing,
    fontSize: tokens.typography,
    borderRadius: tokens.borderRadius,
  }
};
```

### 4. Transform to CSS Variables

```javascript
import tokens from '@/design-system/design-system.json';

// Flatten and convert to CSS variables
function generateCSSVariables(obj, prefix = '') {
  let css = '';
  for (const [key, value] of Object.entries(obj)) {
    const varName = `--${prefix}${key}`.replace(/([A-Z])/g, '-$1').toLowerCase();
    if (typeof value === 'object') {
      css += generateCSSVariables(value, `${prefix}${key}-`);
    } else {
      css += `${varName}: ${value};\n`;
    }
  }
  return css;
}
```

## 📐 Token Structure

### Typography
- **Font Families**: Primary (DM Sans), Heading (Poppins), Mono (Courier New)
- **Heading Styles**: Hero, H1-H4 with specific sizes and weights
- **Body Text**: Large, Normal, Medium, Small (with bold variants)
- **Special**: Captions, Hairlines, Button text styles

```json
{
  "typography": {
    "headings": {
      "h1": {
        "fontSize": 64,
        "fontWeight": 700,
        "lineHeight": 80,
        "fontFamily": "Poppins"
      }
    }
  }
}
```

### Colors
- **Primitives**: 5-color ramp for each hue (Blue, Red, Green, Amber)
- **Semantic**: Primary, Secondary, Tertiary, Success, Warning, Error, Info
- **Semantic Tokens**: Background, Surface, Text, Border, Feedback
- **Dark Mode**: Complete dark theme support

```json
{
  "colors": {
    "primitives": {
      "blue": {
        "50": "#EFF6FF",
        "500": "#3B82F6",
        "900": "#1E3A8A"
      }
    },
    "semantic": {
      "primary": "#0066CC",
      "success": "#059669"
    }
  }
}
```

### Spacing
- **Base Unit**: 4px
- **Range**: 0px to 384px (0-96 tokens)
- **Semantic**: xs, sm, md, lg, xl, 2xl, 3xl, 4xl

```json
{
  "spacing": {
    "tokens": {
      "0": "0px",
      "4": "16px",
      "8": "32px",
      "12": "48px"
    },
    "semantic": {
      "md": "16px",
      "lg": "24px"
    }
  }
}
```

### Border Radius
- **Scale**: From sharp (2px) to fully rounded (9999px)
- **Component-Specific**: Presets for button, input, card, chip, avatar, etc.

```json
{
  "borderRadius": {
    "tokens": {
      "sm": "4px",
      "md": "6px",
      "lg": "8px"
    },
    "components": {
      "button": "6px",
      "card": "12px"
    }
  }
}
```

### Shadows
- **Elevation**: 7 levels (xs to 2xl) + inner
- **Component-Specific**: Different shadows for buttons, cards, inputs, etc.

```json
{
  "shadows": {
    "elevation": {
      "sm": "0 1px 3px rgba(0, 0, 0, 0.1)",
      "md": "0 4px 6px rgba(0, 0, 0, 0.1)"
    },
    "components": {
      "button": { "hover": "0 4px 6px rgba(0, 0, 0, 0.1)" }
    }
  }
}
```

### Motion
- **Durations**: Instant (0ms) to Slowest (700ms)
- **Easing**: 20+ cubic-bezier easing functions
- **Animations**: Fade, Slide, Scale, Pulse, Spin with keyframes

```json
{
  "motion": {
    "durations": {
      "fast": "100ms",
      "base": "200ms",
      "slow": "300ms"
    },
    "easing": {
      "easeOut": "cubic-bezier(0, 0, 0.2, 1)",
      "easeInOut": "cubic-bezier(0.4, 0, 0.2, 1)"
    },
    "animations": {
      "fadeIn": { "duration": "200ms", "keyframes": {...} }
    }
  }
}
```

### Breakpoints
- **Sizes**: xs (320px) to 2xl (1536px)
- **Media Queries**: Mobile, Tablet, Desktop, Wide, UltraWide
- **Accessibility**: Reduced Motion, High Contrast preferences
- **Grid**: 4-col (mobile), 8-col (tablet), 12-col (desktop)

```json
{
  "breakpoints": {
    "tokens": {
      "md": "768px",
      "lg": "1024px"
    },
    "mediaQueries": {
      "tablet": "@media (min-width: 640px) and (max-width: 1023px)"
    }
  }
}
```

## 🧩 Component Definitions

### Button
- **Variants**: Primary, Secondary, Outline, Ghost, Danger
- **Sizes**: xs, sm, md, lg, xl
- **States**: Default, Hover, Active, Focus, Disabled, Loading

```json
{
  "components": {
    "button": {
      "primary": {
        "background": "{colors.semantic.primary}",
        "states": {
          "hover": { "background": "{colors.semantic.primaryDark}" }
        }
      }
    }
  }
}
```

### Input
- **Variants**: Default, Filled, Flushed
- **Types**: Text, Email, Password, Number, Search
- **Sizes**: sm, md, lg
- **States**: Default, Focus, Disabled, Error, Success

### Form Components
- **Checkbox**: With indeterminate state
- **Radio**: Single selection
- **Select**: Dropdown with styling
- **Textarea**: Multi-line input
- **Toggle**: On/off switch

### Card
- **Variants**: Elevated, Outlined, Filled
- **Parts**: Header, Body, Footer

### Badge & Chip
- **Badge**: Static labels (5 color variants)
- **Chip**: Interactive filters/tags

## 🌓 Dark Mode

All color tokens include dark mode support:

```json
{
  "colors": {
    "dark_mode": {
      "background": {
        "primary": "#111827",
        "secondary": "#1F2937"
      },
      "text": {
        "primary": "#F9FAFB",
        "secondary": "#D1D5DB"
      }
    }
  }
}
```

## ♿ Accessibility

- **WCAG AA** compliance standards
- **Contrast**: Minimum 4.5:1 ratio for text
- **Focus Indicators**: 2px solid outline
- **Motion**: Respects `prefers-reduced-motion` media query
- **Color**: Not sole means of conveying information

## 📱 Responsive Design

### Breakpoints
```javascript
{
  "xs": "320px",   // Mobile
  "sm": "640px",   // Tablet
  "md": "768px",   // Small Desktop
  "lg": "1024px",  // Desktop
  "xl": "1280px",  // Large Desktop
  "2xl": "1536px"  // Ultra Wide
}
```

### Grid System
- **Mobile**: 4 columns, 16px gutter
- **Tablet**: 8 columns, 16px gutter
- **Desktop**: 12 columns, 16px gutter

## 🔄 TypeScript Support

Create a TypeScript definition file for better IDE support:

```typescript
// design-system.types.ts
export interface DesignTokens {
  colors: ColorTokens;
  spacing: SpacingTokens;
  typography: TypographyTokens;
  // ... more tokens
}

export interface ColorTokens {
  primitives: {
    neutrals: Record<string, string>;
    blue: Record<string, string>;
    // ... more colors
  };
  semantic: Record<string, string>;
}
```

## 📦 Integration Examples

### React with Styled Components
```javascript
import styled from 'styled-components';
import tokens from '@/design-system/design-system.json';

const StyledButton = styled.button`
  background-color: ${tokens.colors.semantic.primary};
  padding: ${tokens.spacing.semantic.md};
  border-radius: ${tokens.borderRadius.tokens.md};
  transition: all ${tokens.motion.durations.base} ${tokens.motion.easing.easeOut};
`;
```

### Vue with CSS Variables
```vue
<template>
  <button class="btn btn--primary">Click me</button>
</template>

<style scoped>
.btn {
  --color: v-bind("colors.semantic.primary");
  background-color: var(--color);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
}
</style>
```

### Tailwind CSS
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: colors.primitives,
      spacing: spacing.tokens,
      fontSize: typography.body,
      borderRadius: borderRadius.tokens,
      boxShadow: shadows.elevation,
    }
  }
};
```

## 🔗 References

- **Source**: [Stacks Design System (Figma Community)](https://www.figma.com/design/J7EKMQhqRFBzUWp7WN7OUo/stacks-design-system--Community-)
- **Libraries**: Material Design 3, Simple Design System, iOS/macOS/watchOS/visionOS
- **Version**: 1.0.0
- **Last Updated**: 2026-04-20

## 📄 License

MIT - Feel free to use in your projects

## 🤝 Contributing

To extend or modify tokens:

1. Edit the relevant JSON file in `tokens/` or `components/`
2. Update `design-system.json` with new references
3. Test integration with your framework
4. Document changes in the `CHANGELOG.md`

## 📞 Support

For questions or issues with the design system:
- Check the source Figma file for visual reference
- Review component definitions for implementation details
- Refer to integration examples in this README

---

**Happy designing!** 🎨✨
