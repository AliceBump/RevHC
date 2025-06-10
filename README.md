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

## State management and storage

The web application uses [TanStack Store](https://tanstack.com/store) for client
side state management and [TanStack DB](https://tanstack.com/db) for local
storage. An initial schema defines a `users` table to keep track of patients and
healthcare providers and their roles. Utility helpers in `src/store` provide a
simple API to update and read the current user.

## Email configuration

Password reset emails are sent via a POST request to the URL provided in the
`EMAIL_API_URL` environment variable. Configure this variable to point to your
email service endpoint.
