Before considering frontend changes complete, run Biome from `front/`.

Use `pnpm exec biome check --write .` to apply safe fixes, formatting, and import organization, then run `pnpm check` to verify the final state. If Biome still reports diagnostics, fix them or explicitly report why they remain.

When verifying the frontend locally, first check whether a dev server is already running and reuse its current port. If the app is already launched on a local port, use that URL for browser checks instead of starting another dev server.

Storybook is for design-system components and reusable UI primitives, not application routes, pages, or whole screens. Do not add Storybook stories for page-level compositions such as `HomeScreen` unless the user explicitly asks for a page/screen story.

Every design-system component should be represented in Storybook. When creating or changing a design-system component, add or update the relevant `.stories.*` file so Storybook reflects the current API, visual states, and expected usage.

Before considering frontend UI changes complete, visually verify the affected screen or Storybook story in the browser at both smartphone and desktop viewport sizes. Confirm the layout, spacing, typography, colors, and responsive behavior look correct at each size.

Mobile proportion decisions from the June 2026 audit:

- Verify smartphone layouts at both 320px and around 390px wide, plus desktop. At 320px, content should reflow without page-level horizontal scrolling; use single-column/list reflows below 360px when compact cards become cramped.
- Use 44px as the practical minimum for app controls, icon buttons, and persistent navigation targets. WCAG 2.2 AA allows 24x24 CSS px minimum targets, but WCAG enhanced guidance and enterprise systems commonly use 44px+ for mobile app chrome.
- Persistent mobile nav labels should not drop to tiny caption sizes. Keep them at least 12px with a readable line height, and confirm labels fit in French and English.
- Audit brand assets and header media proportionally, not only typography and tap targets. In app chrome or page headers, logos should read as brand cues rather than dominate the first viewport. For the Comutitres home screen, the accepted mobile logo scale is about 144px wide at 320px and 160px wide around 390px, scaling back up on larger breakpoints.
- Sources used for these decisions: WCAG 2.2 Target Size Minimum (`https://www.w3.org/TR/WCAG22/#target-size-minimum`), WCAG Reflow (`https://www.w3.org/WAI/WCAG22/Understanding/reflow.html`), Microsoft Fluent layout/touch-target guidance (`https://fluent2.microsoft.design/layout`), Microsoft Fluent typography (`https://fluent2.microsoft.design/typography`), IBM Carbon typography scale (`https://carbondesignsystem.com/elements/typography/overview/`), and Tailwind responsive design docs (`https://tailwindcss.com/docs/responsive-design`).

Use the ask user question tool when a frontend change depends on a product, UX, or API decision that cannot be inferred confidently from the codebase or request.
