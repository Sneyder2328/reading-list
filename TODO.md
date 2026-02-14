# Reading List Platform - Development Tasks

> **Progress Tracker**: Track completion by checking off tasks as you complete them.

## Overview

- **Project**: Cross-platform bookmark manager
- **Apps**: Chrome Extension + React PWA (no backend needed!)
- **Stack**: pnpm, Turborepo, TypeScript, TanStack Query, Firebase (Auth + Firestore)

---

## Phase 1: Monorepo Foundation

### 1.1 Initialize Workspace
- [x] Create root `package.json` with workspace scripts
- [x] Create `pnpm-workspace.yaml` defining workspace packages
- [x] Initialize git repository with `.gitignore`
- [x] Create root `tsconfig.json` with base TypeScript config
- [x] Create `turbo.json` with build pipeline configuration
- [x] Create `biome.json` with linting/formatting rules
- [x] Create `.env.example` with required environment variables
- [x] Create `README.md` with project overview and setup instructions

### 1.2 Directory Structure
- [x] Create `apps/` directory
- [x] Create `apps/web/` directory
- [x] Create `apps/chrome-extension/` directory
- [x] Create `packages/` directory
- [x] Create `packages/ui/` directory (shared components)
- [x] Create `packages/firebase/` directory (shared auth + Firestore utilities)
- [x] Create `packages/config-typescript/` directory

### 1.3 Shared TypeScript Config
- [x] Create `packages/config-typescript/package.json`
- [x] Create `packages/config-typescript/base.json` (base config)
- [x] Create `packages/config-typescript/react.json` (React apps)

### 1.4 Verify Setup
- [x] Run `pnpm install` successfully
- [x] Run `pnpm lint` successfully
- [x] Run `pnpm type-check` successfully

---

## Phase 2: Firebase Setup

### 2.1 Firebase Console Configuration
- [ ] Create new Firebase project in Firebase Console
- [ ] Enable Authentication service
- [ ] Enable Google Sign-In provider
- [ ] Add authorized domains (localhost:5173)
- [ ] Create web app and copy config credentials
- [ ] Enable Firestore database
- [ ] Set Firestore security rules for user isolation

### 2.2 Firestore Security Rules
- [ ] Deploy security rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bookmarks/{bookmarkId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
  }
}
```
- [ ] Test rules in Firebase Console Rules Playground

### 2.3 Shared Firebase Package
- [x] Create `packages/firebase/package.json`
- [x] Create `packages/firebase/tsconfig.json`
- [x] Create `packages/firebase/src/index.ts` (main exports)
- [x] Create `packages/firebase/src/config.ts` (Firebase config from env)
- [x] Create `packages/firebase/src/app.ts` (Firebase app initialization)

### 2.4 Auth Utilities
- [x] Create `packages/firebase/src/auth.ts` with:
  - [x] `signInWithGoogle()` function
  - [x] `signOut()` function
  - [x] `getCurrentUser()` function
  - [x] `onAuthStateChanged()` wrapper
- [x] Create `packages/firebase/src/types.ts` (User type definitions)

### 2.5 Firestore Utilities
- [x] Create `packages/firebase/src/firestore.ts` with:
  - [x] `getBookmarks(userId)` - Get user's active bookmarks
  - [x] `getArchivedBookmarks(userId)` - Get user's archived bookmarks
  - [x] `isUrlSaved(userId, url)` - Check if URL exists for user
  - [x] `createBookmark(userId, data)` - Save new bookmark
  - [x] `toggleBookmark(userId, url, data)` - Save or unsave by URL
  - [x] `archiveBookmark(bookmarkId)` - Archive a bookmark
  - [x] `unarchiveBookmark(bookmarkId)` - Restore from archive
  - [x] `deleteBookmark(bookmarkId)` - Permanently delete bookmark
- [x] Create `packages/firebase/src/types.ts` with `Bookmark` interface

### 2.6 Export Package
- [x] Export all utilities from `packages/firebase/src/index.ts`
- [ ] Test Firebase connection locally

---

## Phase 3: React PWA (apps/web)

### 3.1 Project Setup
- [x] Initialize Vite + React project
- [x] Create `apps/web/package.json`
- [x] Create `apps/web/tsconfig.json` extending shared config
- [x] Create `apps/web/vite.config.ts`
- [x] Install dependencies (React, TanStack Router)
- [x] Set up path aliases (`@/` → `src/`)
- [x] Create `apps/web/.env.example`

### 3.2 PWA Configuration
- [x] Install `vite-plugin-pwa`
- [x] Create `apps/web/public/manifest.json`
- [x] Configure service worker in `vite.config.ts`
- [x] Create PWA icons (192x192, 512x512)
- [x] Configure caching strategies
- [ ] Test PWA installability

### 3.3 Styling Setup
- [x] Install Tailwind CSS
- [x] Create `apps/web/tailwind.config.js`
- [x] Create `apps/web/src/index.css` with Tailwind directives
- [ ] Install shadcn/ui
- [ ] Initialize shadcn with `npx shadcn-ui@latest init`
- [x] Install initial components (Button, Card, Input, etc.)

### 3.4 TanStack Query Setup
- [x] Install TanStack Query (`@tanstack/react-query`)
- [x] Create `apps/web/src/lib/queryClient.ts`
- [x] Set up `QueryClientProvider` wrapper
- [x] Create custom hooks for Firestore operations:
  - [x] `useBookmarks()` - Fetch active bookmarks
  - [x] `useArchivedBookmarks()` - Fetch archived bookmarks
  - [x] `useToggleBookmark()` - Mutation for save/unsave
  - [x] `useArchiveBookmark()` - Mutation for archiving
  - [x] `useUnarchiveBookmark()` - Mutation for restoring
  - [x] `useDeleteBookmark()` - Mutation for deletion

### 3.5 Firebase Auth Integration
- [x] Import `@reading-list/firebase` package
- [x] Create `apps/web/src/contexts/AuthContext.tsx`
- [x] Implement `AuthProvider` with auth state
- [x] Create `useAuth()` hook
- [x] Create `apps/web/src/components/ProtectedRoute.tsx`
- [x] Handle auth loading states

### 3.6 Routing Setup
- [x] Set up TanStack Router
- [x] Create route structure:
  - [x] `/` - Landing/redirect
  - [x] `/login` - Login page
  - [x] `/dashboard` - Main bookmark list
  - [x] `/archive` - Archived bookmarks
- [x] Implement route guards for protected routes

### 3.7 Pages - Login
- [x] Create `apps/web/src/pages/Login/LoginPage.tsx`
- [x] Design login UI with Google Sign-In button
- [x] Implement sign-in flow
- [x] Handle redirect after successful login
- [x] Show loading state during auth

### 3.8 Pages - Dashboard
- [x] Create `apps/web/src/pages/Dashboard/DashboardPage.tsx`
- [x] Create `apps/web/src/pages/Dashboard/components/` folder
- [x] Implement bookmark list with TanStack Query
- [x] Create `BookmarkCard` component:
  - [x] Display favicon, title, URL
  - [x] Display save date
  - [x] Open link action
  - [x] Archive action
  - [x] Delete action
  - [x] Copy URL action
- [x] Implement empty state (no bookmarks)
- [x] Implement loading state
- [x] Implement error state

### 3.9 Pages - Archive
- [x] Create `apps/web/src/pages/Archive/ArchivePage.tsx`
- [x] Fetch archived bookmarks
- [x] Create archived bookmark list
- [x] Implement restore action
- [x] Implement permanent delete action
- [x] Implement empty state

### 3.10 Search & Filter
- [x] Add search input to Dashboard
- [x] Implement client-side search by title/URL
- [x] Add sort options (newest/oldest)
- [x] Persist filter preferences

### 3.11 UI Polish
- [x] Add toast notifications for actions
- [x] Add confirmation dialogs for destructive actions
- [x] Implement responsive design (mobile-first)
- [x] Add loading skeletons
- [x] Add keyboard shortcuts (optional)

### 3.12 PWA Features
- [ ] Test offline functionality
- [x] Implement optimistic updates
- [x] Add "Install App" prompt
- [ ] Test on mobile devices

---

## Phase 4: Chrome Extension (apps/chrome-extension)

### 4.1 Project Setup
- [x] Create `apps/chrome-extension/package.json`
- [x] Create `apps/chrome-extension/tsconfig.json`
- [x] Set up Vite for extension bundling (CRXJS or manual config)
- [x] Create build configuration for multiple entry points

### 4.2 Manifest Configuration
- [x] Create `apps/chrome-extension/public/manifest.json` (Manifest V3)
- [x] Configure permissions: `tabs`, `storage`, `identity`
- [x] Set up action (toolbar icon)
- [x] Configure icons for different sizes

### 4.3 Icons Design
- [x] Create saved state icon (filled bookmark) - 16, 48, 128px
- [x] Create unsaved state icon (outline bookmark) - 16, 48, 128px
- [x] Place icons in `apps/chrome-extension/public/icons/`

### 4.4 Service Worker (Background)
- [x] Create `apps/chrome-extension/src/background/service-worker.ts`
- [x] Implement URL saved status cache (in-memory + storage)
- [x] Implement `checkIfUrlSaved()` function
- [x] Implement `updateIcon()` function
- [x] Set up `chrome.tabs.onActivated` listener
- [x] Set up `chrome.tabs.onUpdated` listener
- [x] Implement toolbar icon click handler (toggle save)
- [x] Implement context menu "Save to Reading List"

### 4.5 Firebase in Extension
- [x] Create `apps/chrome-extension/src/lib/firebase.ts`
- [x] Initialize Firebase for extension context
- [x] Import Firestore utilities from `@reading-list/firebase`
- [x] Handle Firestore calls from service worker

### 4.6 Firebase Auth in Extension
- [x] Create `apps/chrome-extension/src/lib/auth.ts`
- [x] Implement `signInWithGoogle()` using `chrome.identity`
- [x] Implement auth state storage in `chrome.storage.local`
- [x] Implement `getStoredUser()` function
- [x] Implement `signOut()` function

### 4.7 Popup UI
- [x] Create `apps/chrome-extension/src/popup/index.html`
- [x] Create `apps/chrome-extension/src/popup/index.tsx` (entry)
- [x] Create `apps/chrome-extension/src/popup/Popup.tsx`
- [x] Show auth status (logged in/out)
- [x] Show current page save status
- [x] Display recent bookmarks (5-10 items)
- [x] Add "Open Reading List" link to PWA
- [x] Add quick delete action for items
- [x] Style with Tailwind CSS

### 4.8 Options Page
- [x] Create `apps/chrome-extension/src/options/index.html`
- [x] Create `apps/chrome-extension/src/options/Options.tsx`
- [x] Show user account info
- [x] Add Google Sign-In button (if logged out)
- [x] Add Sign Out button (if logged in)
- [x] Add link to full PWA

### 4.9 Extension Testing
- [x] Build extension (`pnpm build`)
- [ ] Load unpacked extension in Chrome
- [ ] Test toolbar icon click (save/unsave)
- [ ] Test icon state updates on tab switch
- [ ] Test icon state updates on URL change
- [ ] Test popup UI
- [ ] Test options page login flow
- [ ] Test context menu

---

## Phase 5: Shared UI Package (packages/ui)

### 5.1 Package Setup
- [x] Create `packages/ui/package.json`
- [x] Create `packages/ui/tsconfig.json`
- [x] Set up build process (tsup or unbuild)
- [x] Configure Tailwind for component library

### 5.2 Shared Components
- [x] Create `packages/ui/src/BookmarkItem.tsx`
- [x] Create `packages/ui/src/BookmarkList.tsx`
- [x] Create `packages/ui/src/EmptyState.tsx`
- [x] Create `packages/ui/src/LoadingSpinner.tsx`
- [x] Export all components from `packages/ui/src/index.ts`

### 5.3 Integration
- [x] Import shared components in `apps/web`
- [x] Import shared components in `apps/chrome-extension`
- [x] Verify components render correctly in both apps

---

## Phase 6: Turborepo Optimization

### 6.1 Pipeline Configuration
- [x] Configure `build` task dependencies
- [x] Configure `dev` task (persistent)
- [x] Configure `lint` task
- [x] Configure `type-check` task
- [x] Configure `test` task (when tests exist)

### 6.2 Root Scripts
- [x] Add `pnpm dev` - Run all apps in parallel
- [x] Add `pnpm dev:web` - Run web only
- [x] Add `pnpm build` - Build all packages and apps
- [x] Add `pnpm lint` - Lint all with Biome
- [x] Add `pnpm lint:fix` - Auto-fix lint issues
- [x] Add `pnpm type-check` - TypeScript validation
- [x] Add `pnpm clean` - Clean all build artifacts

### 6.3 Caching
- [x] Verify Turborepo caching works
- [x] Test incremental builds
- [x] Verify cache invalidation works correctly

---

## Phase 7: Environment & Deployment

### 7.1 Environment Variables
- [x] Document all required env vars in `.env.example`
- [x] Set up env validation in all apps
- [x] Create separate `.env.example` per app if needed

### 7.2 PWA Deployment
- [ ] Choose hosting platform (Vercel/Netlify/Firebase Hosting)
- [ ] Create deployment configuration
- [ ] Set up environment variables
- [ ] Deploy PWA
- [ ] Test deployed PWA
- [ ] Update Firebase authorized domains
- [ ] Test Google Sign-In on production

### 7.3 Chrome Extension Publishing
- [ ] Create Chrome Web Store developer account
- [ ] Prepare store listing assets:
  - [ ] Screenshots (1280x800 or 640x400)
  - [ ] Promo images (440x280 small, 920x680 large)
  - [ ] Description text
  - [ ] Privacy policy URL
- [ ] Build production extension
- [ ] Submit for review

---

## Phase 8: Testing & Quality

### 8.1 Unit Testing Setup
- [x] Install Vitest in workspace
- [x] Create test configuration
- [x] Set up test scripts in `package.json`

### 8.2 Firebase Tests
- [ ] Write tests for Firestore utilities (with emulator)
- [ ] Write tests for auth utilities

### 8.3 PWA Tests
- [ ] Write component tests for key UI components
- [ ] Write integration tests for auth flow
- [ ] Write tests for TanStack Query hooks

### 8.4 E2E Testing (Optional)
- [ ] Set up Playwright
- [ ] Write E2E tests for main user flows:
  - [ ] Login flow
  - [ ] Save bookmark (from PWA)
  - [ ] Archive bookmark
  - [ ] Delete bookmark

### 8.5 CI/CD Pipeline
- [x] Create `.github/workflows/ci.yml`
- [x] Run lint on PR
- [x] Run type-check on PR
- [x] Run tests on PR
- [ ] Auto-deploy on merge to main (optional)

---

## Progress Summary

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Monorepo Foundation | ✅ Complete |
| 2 | Firebase Setup | 🟡 In Progress |
| 3 | React PWA | 🟡 In Progress |
| 4 | Chrome Extension | 🟡 In Progress |
| 5 | Shared UI Package | ✅ Complete |
| 6 | Turborepo Optimization | ✅ Complete |
| 7 | Environment & Deployment | 🟡 In Progress |
| 8 | Testing & Quality | 🟡 In Progress |

**Legend:**
- ⬜ Not Started
- 🟡 In Progress
- ✅ Complete

---

## Quick Start Commands

Once set up, use these commands:

```bash
# Install dependencies
pnpm install

# Run all apps in development
pnpm dev

# Run web app only
pnpm dev:web

# Build all
pnpm build

# Lint and format
pnpm lint
pnpm lint:fix

# Type check
pnpm type-check

# Build extension
pnpm --filter chrome-extension build
```

---

## Notes & Decisions

- **No Backend Needed**: Firebase Firestore + Security Rules handle all data access and authorization
- **Database**: Firebase Firestore with direct client access
- **Auth**: Firebase Auth with Google provider (via Firebase SDK in PWA, `chrome.identity` in extension)
- **Styling**: Tailwind CSS + shadcn/ui for consistent design
- **State Management**: TanStack Query for server state (no Redux/Zustand needed)
- **Routing**: TanStack Router for type-safe routing in PWA
