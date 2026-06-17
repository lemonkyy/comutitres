Before considering frontend changes complete, run Biome from `front/`.

Use `pnpm exec biome check --write .` to apply safe fixes, formatting, and import organization, then run `pnpm check` to verify the final state. If Biome still reports diagnostics, fix them or explicitly report why they remain.

Demo users for local API testing all use the password `pass`:

- `jean.dupont@example.com`
- `alice.martin@example.com`
- `bob.lefevre@example.com`
- `emma.durand@example.com`

Yaak currently uses `emma.durand@example.com` / `pass` for its login request.

When verifying the frontend locally, never start dev servers manually. The user runs the app through Docker Compose. First check whether the Docker Compose frontend is already reachable and reuse it. If it is not running or not reachable, ask the user to start Docker Compose instead of running `pnpm dev`, `next dev`, Storybook, or another local server yourself.

Storybook is for design-system components and reusable UI primitives, not application routes, pages, or whole screens. Do not add Storybook stories for page-level compositions such as `HomeScreen` unless the user explicitly asks for a page/screen story.

Every design-system component should be represented in Storybook. When creating or changing a design-system component, add or update the relevant `.stories.*` file so Storybook reflects the current API, visual states, and expected usage.

Keep React components in their own files. Screen and page modules should compose imported components and may keep small non-component helpers, but visual components such as cards, section headings, panels, and CTAs belong in colocated component files.

When adding new UI, first go to `https://www.iledefrance-mobilites.fr/` and navigate through other relevant pages on the website to look for the same or similar element(s). Reuse the exact same design system patterns consistently whenever a matching pattern exists.

Before considering frontend UI changes complete, visually verify the affected screen or Storybook story in the browser at both smartphone and desktop viewport sizes. Confirm the layout, spacing, typography, colors, and responsive behavior look correct at each size.

Mobile proportion decisions from the June 2026 audit:

- Verify smartphone layouts at both 320px and around 390px wide, plus desktop. At 320px, content should reflow without page-level horizontal scrolling; use single-column/list reflows below 360px when compact cards become cramped.
- Use 44px as the practical minimum for app controls, icon buttons, and persistent navigation targets. WCAG 2.2 AA allows 24x24 CSS px minimum targets, but WCAG enhanced guidance and enterprise systems commonly use 44px+ for mobile app chrome.
- Persistent mobile nav labels should not drop to tiny caption sizes. Keep them at least 12px with a readable line height, and confirm labels fit in French and English.
- Audit brand assets and header media proportionally, not only typography and tap targets. In app chrome or page headers, logos should read as brand cues rather than dominate the first viewport. For the Comutitres home screen, the accepted mobile logo scale is about 144px wide at 320px and 160px wide around 390px, scaling back up on larger breakpoints.
- Sources used for these decisions: WCAG 2.2 Target Size Minimum (`https://www.w3.org/TR/WCAG22/#target-size-minimum`), WCAG Reflow (`https://www.w3.org/WAI/WCAG22/Understanding/reflow.html`), Microsoft Fluent layout/touch-target guidance (`https://fluent2.microsoft.design/layout`), Microsoft Fluent typography (`https://fluent2.microsoft.design/typography`), IBM Carbon typography scale (`https://carbondesignsystem.com/elements/typography/overview/`), and Tailwind responsive design docs (`https://tailwindcss.com/docs/responsive-design`).

Disabled controls and cards:

- Do not use parent/card opacity to style disabled cards, disabled option rows, or disabled input labels. Opacity compounds across text, icons, and flags and can make content unreadable.
- Use explicit disabled-state tokens instead: keep the card surface visible, use a subtle border, and set text to `text-muted-foreground` or a darker semantic token that preserves legibility.
- Disabled controls are inactive, but they still communicate available product states. Treat disabled card labels and descriptions as readable content; aim for WCAG AA text contrast (`4.5:1` for normal text, `3:1` for large text) whenever practical.
- For custom controls, visible boundaries, checkboxes, focus indicators, and selected/unselected state indicators should meet WCAG non-text contrast intent (`3:1`) unless the element is truly incidental.
- Sources: WCAG 2.2 Contrast Minimum (`https://www.w3.org/TR/WCAG22/#contrast-minimum`), Understanding Contrast Minimum (`https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html`), WCAG 2.2 Non-text Contrast (`https://www.w3.org/TR/WCAG22/#non-text-contrast`), and Understanding Non-text Contrast (`https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html`).

Use the ask user question tool when a frontend change depends on a product, UX, or API decision that cannot be inferred confidently from the codebase or request.

For new user-facing routes in this French-targeted service, use French public slugs. If an internal route key is English for framework ergonomics, map it to a French pathname in `src/i18n/pathnames.ts`.
