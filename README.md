# Reading List Platform

Cross-platform bookmark manager with:

- A React PWA (`apps/web`) for browsing, archiving, and deleting bookmarks
- A Chrome extension (`apps/chrome-extension`) for one-click save/unsave
- Shared packages for Firebase utilities and reusable UI

## Tech Stack

- pnpm workspaces + Turborepo
- TypeScript
- Firebase Auth + Firestore
- TanStack Query + TanStack Router
- Tailwind CSS + shadcn/ui-style components

## Project Structure

```text
.
├── apps/
│   ├── web/
│   └── chrome-extension/
├── packages/
│   ├── config-typescript/
│   ├── firebase/
│   └── ui/
├── turbo.json
├── biome.json
└── pnpm-workspace.yaml
```

## Setup

1. Copy env variables:

   ```bash
   cp .env.example .env
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Run quality checks:

   ```bash
   pnpm lint:fix
   pnpm lint
   pnpm type-check
   ```

4. Run the web app:

   ```bash
   pnpm dev:web
   ```

## Firebase

- Create a Firebase project and enable Google Auth + Firestore.
- Add your Firebase credentials in `.env`.
- Apply Firestore rules in `firebase/firestore.rules`.

