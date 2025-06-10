# RevHC Monorepo

This repository contains a PNPM workspace with two applications:

- `apps/web` - A Vite + React application.
- `apps/mobile` - A React Native application using Expo.

## Getting started

Ensure you have [pnpm](https://pnpm.io/) installed. Then run:

```bash
pnpm install
```

Use the following scripts to start the applications:

```bash
pnpm --filter web dev
pnpm --filter mobile start
```
