# adapter-netlify 7: edge build fails on bare Node built-ins and `.wasm` imports

Minimal reproduction for `@sveltejs/adapter-netlify@7.0.0` with `edge: true`.

Created with `npx sv@1.1.0 create --template minimal --no-types --add sveltekit-adapter="adapter:netlify"`, then:

- `vite.config.js`: `adapter({ edge: true })`
- `src/routes/+page.server.js`: imports `crypto` (bare, no `node:` prefix), as many dependencies do
- `src/routes/wasm/+server.js`: uses `wasm-lib`, a tiny local package that does `import('./add.wasm')`
  (the pattern used by e.g. resvg/satori-based OG image libraries). `add.wasm` exports `add(a, b)`.
  `.npmrc` has `install-links=true` so it is installed as a real copy in `node_modules`, like a published package.

## Reproduce

```sh
npm install
npm run build
```

## Result

```
> Using @sveltejs/adapter-netlify
Generating edge functions...
error during build:
Error: Build failed with 2 errors:

[RESOLVE_ERROR] Could not resolve 'crypto' in .svelte-kit/output/server/entries/pages/_page.server.js
 1 │ import { createHash } from "crypto";
   │                                ╰───── Matched alias not found for 'crypto'
   │ Help 1: Maybe you expected `resolve.alias` to call other plugins resolveId hook? ...

[PARSE_ERROR] Invalid Character ` `
   ╭─[ node_modules/wasm-lib/add.wasm:1:1 ]
```

## Expected

The build succeeds, as it does with `@sveltejs/kit@2` + `@sveltejs/adapter-netlify@6.0.4` (esbuild),
where `crypto` is rewritten to `node:crypto` and `add.wasm` is copied next to the edge function.
