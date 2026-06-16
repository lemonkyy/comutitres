Before considering frontend changes complete, run Biome from `front/`.

Use `pnpm exec biome check --write .` to apply safe fixes, formatting, and import organization, then run `pnpm check` to verify the final state. If Biome still reports diagnostics, fix them or explicitly report why they remain.
