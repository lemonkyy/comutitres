Before considering frontend changes complete, run Biome from `front/`.

Use `pnpm exec biome check --write .` to apply safe fixes, formatting, and import organization, then run `pnpm check` to verify the final state. If Biome still reports diagnostics, fix them or explicitly report why they remain.

When verifying the frontend locally, first check whether a dev server is already running and reuse its current port. If the app is already launched on a local port, use that URL for browser checks instead of starting another dev server.

Storybook is for design-system components and reusable UI primitives, not application routes, pages, or whole screens. Do not add Storybook stories for page-level compositions such as `HomeScreen` unless the user explicitly asks for a page/screen story.

Every design-system component should be represented in Storybook. When creating or changing a design-system component, add or update the relevant `.stories.*` file so Storybook reflects the current API, visual states, and expected usage.

Before considering frontend UI changes complete, visually verify the affected screen or Storybook story in the browser at both smartphone and desktop viewport sizes. Confirm the layout, spacing, typography, colors, and responsive behavior look correct at each size.
