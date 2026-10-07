# Animal-only PixiJS vendor build

Pinned PixiJS 8.22.0 and esbuild 0.28.1. To rebuild:

    npm ci --prefix scripts/pixi-vendor --ignore-scripts
    node scripts/pixi-vendor/build.mjs

The committed browser module contains only the WebGL renderer, containers, vector graphics, and required renderer systems. No Application, automatic ticker, text, interactive event extension, filters, assets loader or WebGPU backend is requested by the animal implementation. Pixi's required shared code remains in the compiled bundle.

The pinned renderer's default SchedulerSystem would start Ticker.system. The entry replaces that extension before construction with a clock-free scheduler and initializes the renderer with gcActive:false. The scene owns a bounded collection of graphics and explicitly destroys all contexts and the renderer on teardown, releasing global Pixi resources.

This build deliberately uses pinned internal module paths for a smaller bundle. Updating Pixi requires reviewing the scheduler and graphics system wiring and rerunning integration/lifecycle checks. The version guard rejects accidental upgrades. Third-party licenses ship alongside the module.
