# Reading List Platform - Development Tasks

> **Progress Tracker**: Track completion by checking off tasks as you complete them.

## Overview

- **Project**: Cross-platform bookmark manager
- **Apps**: Chrome Extension + React PWA (no backend needed!)
- **Stack**: pnpm, Turborepo, TypeScript, TanStack Query, Firebase (Auth + Firestore)

---

## Phase 1: Monorepo Foundation

### 1.1 Initialize Workspace
- [ ] Create root `package.json` with workspace scripts
- [ ] Create `pnpm-workspace.yaml` defining workspace packages
- [ ] Initialize git repository with `.gitignore`
- [ ] Create root `tsconfig.json` with base TypeScript config
- [ ] Create `turbo.json` with build pipeline configuration
- [ ] Create `biome.json` with linting/formatting rules
- [ ] Create `.env.example` with required environment variables
- [ ] Create `README.md` with project overview and setup instructions

### 1.2 Directory Structure
- [ ] Create `apps/` directory
- [ ] Create `apps/web/` directory
- [ ] Create `apps/chrome-extension/` directory
- [ ] Create `packages/` directory
- [ ] Create `packages/ui/` directory (shared components)
- [ ] Create `packages/firebase/` directory (shared auth + Firestore utilities)
- [ ] Create `packages/config-typescript/` directory

### 1.3 Shared TypeScript Config
- [ ] Create `packages/config-typescript/package.json`
- [ ] Create `packages/config-typescript/base.json` (base config)
- [ ] Create `packages/config-typescript/react.json` (React apps)

### 1.4 Verify Setup
- [ ] Run `pnpm install` successfully
- [ ] Run `pnpm lint` successfully
- [ ] Run `pnpm type-check` successfully

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
- [ ] Create `packages/firebase/package.json`
- [ ] Create `packages/firebase/tsconfig.json`
- [ ] Create `packages/firebase/src/index.ts` (main exports)
- [ ] Create `packages/firebase/src/config.ts` (Firebase config from env)
- [ ] Create `packages/firebase/src/app.ts` (Firebase app initialization)

### 2.4 Auth Utilities
- [ ] Create `packages/firebase/src/auth.ts` with:
  - [ ] `signInWithGoogle()` function
  - [ ] `signOut()` function
  - [ ] `getCurrentUser()` function
  - [ ] `onAuthStateChanged()` wrapper
- [ ] Create `packages/firebase/src/types.ts` (User type definitions)

### 2.5 Firestore Utilities
- [ ] Create `packages/firebase/src/firestore.ts` with:
  - [ ] `getBookmarks(userId)` - Get user's active bookmarks
  - [ ] `getArchivedBookmarks(userId)` - Get user's archived bookmarks
  - [ ] `isUrlSaved(userId, url)` - Check if URL exists for user
  - [ ] `createBookmark(userId, data)` - Save new bookmark
  - [ ] `toggleBookmark(userId, url, data)` - Save or unsave by URL
  - [ ] `archiveBookmark(bookmarkId)` - Archive a bookmark
  - [ ] `unarchiveBookmark(bookmarkId)` - Restore from archive
  - [ ] `deleteBookmark(bookmarkId)` - Permanently delete bookmark
- [ ] Create `packages/firebase/src/types.ts` with `Bookmark` interface

### 2.6 Export Package
- [ ] Export all utilities from `packages/firebase/src/index.ts`
- [ ] Test Firebase connection locally

---

## Phase 3: React PWA (apps/web)

### 3.1 Project Setup
- [ ] Initialize Vite + React project
- [ ] Create `apps/web/package.json`
- [ ] Create `apps/web/tsconfig.json` extending shared config
- [ ] Create `apps/web/vite.config.ts`
- [ ] Install dependencies (React, TanStack Router)
- [ ] Set up path aliases (`@/` → `src/`)
- [ ] Create `apps/web/.env.example`

### 3.2 PWA Configuration
- [ ] Install `vite-plugin-pwa`
- [ ] Create `apps/web/public/manifest.json`
- [ ] Configure service worker in `vite.config.ts`
- [ ] Create PWA icons (192x192, 512x512)
- [ ] Configure caching strategies
- [ ] Test PWA installability

### 3.3 Styling Setup
- [ ] Install Tailwind CSS
- [ ] Create `apps/web/tailwind.config.js`
- [ ] Create `apps/web/src/index.css` with Tailwind directives
- [ ] Install shadcn/ui
- [ ] Initialize shadcn with `npx shadcn-ui@latest init`
- [ ] Install initial components (Button, Card, Input, etc.)

### 3.4 TanStack Query Setup
- [ ] Install TanStack Query (`@tanstack/react-query`)
- [ ] Create `apps/web/src/lib/queryClient.ts`
- [ ] Set up `QueryClientProvider` wrapper
- [ ] Create custom hooks for Firestore operations:
  - [ ] `useBookmarks()` - Fetch active bookmarks
  - [ ] `useArchivedBookmarks()` - Fetch archived bookmarks
  - [ ] `useToggleBookmark()` - Mutation for save/unsave
  - [ ] `useArchiveBookmark()` - Mutation for archiving
  - [ ] `useUnarchiveBookmark()` - Mutation for restoring
  - [ ] `useDeleteBookmark()` - Mutation for deletion

### 3.5 Firebase Auth Integration
- [ ] Import `@reading-list/firebase` package
- [ ] Create `apps/web/src/contexts/AuthContext.tsx`
- [ ] Implement `AuthProvider` with auth state
- [ ] Create `useAuth()` hook
- [ ] Create `apps/web/src/components/ProtectedRoute.tsx`
- [ ] Handle auth loading states

### 3.6 Routing Setup
- [ ] Set up TanStack Router
- [ ] Create route structure:
  - [ ] `/` - Landing/redirect
  - [ ] `/login` - Login page
  - [ ] `/dashboard` - Main bookmark list
  - [ ] `/archive` - Archived bookmarks
- [ ] Implement route guards for protected routes

### 3.7 Pages - Login
- [ ] Create `apps/web/src/pages/Login/LoginPage.tsx`
- [ ] Design login UI with Google Sign-In button
- [ ] Implement sign-in flow
- [ ] Handle redirect after successful login
- [ ] Show loading state during auth

### 3.8 Pages - Dashboard
- [ ] Create `apps/web/src/pages/Dashboard/DashboardPage.tsx`
- [ ] Create `apps/web/src/pages/Dashboard/components/` folder
- [ ] Implement bookmark list with TanStack Query
- [ ] Create `BookmarkCard` component:
  - [ ] Display favicon, title, URL
  - [ ] Display save date
  - [ ] Open link action
  - [ ] Archive action
  - [ ] Delete action
  - [ ] Copy URL action
- [ ] Implement empty state (no bookmarks)
- [ ] Implement loading state
- [ ] Implement error state

### 3.9 Pages - Archive
- [ ] Create `apps/web/src/pages/Archive/ArchivePage.tsx`
- [ ] Fetch archived bookmarks
- [ ] Create archived bookmark list
- [ ] Implement restore action
- [ ] Implement permanent delete action
- [ ] Implement empty state

### 3.10 Search & Filter
- [ ] Add search input to Dashboard
- [ ] Implement client-side search by title/URL
- [ ] Add sort options (newest/oldest)
- [ ] Persist filter preferences

### 3.11 UI Polish
- [ ] Add toast notifications for actions
- [ ] Add confirmation dialogs for destructive actions
- [ ] Implement responsive design (mobile-first)
- [ ] Add loading skeletons
- [ ] Add keyboard shortcuts (optional)

### 3.12 PWA Features
- [ ] Test offline functionality
- [ ] Implement optimistic updates
- [ ] Add "Install App" prompt
- [ ] Test on mobile devices

---

## Phase 4: Chrome Extension (apps/chrome-extension)

### 4.1 Project Setup
- [ ] Create `apps/chrome-extension/package.json`
- [ ] Create `apps/chrome-extension/tsconfig.json`
- [ ] Set up Vite for extension bundling (CRXJS or manual config)
- [ ] Create build configuration for multiple entry points

### 4.2 Manifest Configuration
- [ ] Create `apps/chrome-extension/public/manifest.json` (Manifest V3)
- [ ] Configure permissions: `tabs`, `storage`, `identity`
- [ ] Set up action (toolbar icon)
- [ ] Configure icons for different sizes

### 4.3 Icons Design
- [ ] Create saved state icon (filled bookmark) - 16, 48, 128px
- [ ] Create unsaved state icon (outline bookmark) - 16, 48, 128px
- [ ] Place icons in `apps/chrome-extension/public/icons/`

### 4.4 Service Worker (Background)
- [ ] Create `apps/chrome-extension/src/background/service-worker.ts`
- [ ] Implement URL saved status cache (in-memory + storage)
- [ ] Implement `checkIfUrlSaved()` function
- [ ] Implement `updateIcon()` function
- [ ] Set up `chrome.tabs.onActivated` listener
- [ ] Set up `chrome.tabs.onUpdated` listener
- [ ] Implement toolbar icon click handler (toggle save)
- [ ] Implement context menu "Save to Reading List"

### 4.5 Firebase in Extension
- [ ] Create `apps/chrome-extension/src/lib/firebase.ts`
- [ ] Initialize Firebase for extension context
- [ ] Import Firestore utilities from `@reading-list/firebase`
- [ ] Handle Firestore calls from service worker

### 4.6 Firebase Auth in Extension
- [ ] Create `apps/chrome-extension/src/lib/auth.ts`
- [ ] Implement `signInWithGoogle()` using `chrome.identity`
- [ ] Implement auth state storage in `chrome.storage.local`
- [ ] Implement `getStoredUser()` function
- [ ] Implement `signOut()` function

### 4.7 Popup UI
- [ ] Create `apps/chrome-extension/src/popup/index.html`
- [ ] Create `apps/chrome-extension/src/popup/index.tsx` (entry)
- [ ] Create `apps/chrome-extension/src/popup/Popup.tsx`
- [ ] Show auth status (logged in/out)
- [ ] Show current page save status
- [ ] Display recent bookmarks (5-10 items)
- [ ] Add "Open Reading List" link to PWA
- [ ] Add quick delete action for items
- [ ] Style with Tailwind CSS

### 4.8 Options Page
- [ ] Create `apps/chrome-extension/src/options/index.html`
- [ ] Create `apps/chrome-extension/src/options/Options.tsx`
- [ ] Show user account info
- [ ] Add Google Sign-In button (if logged out)
- [ ] Add Sign Out button (if logged in)
- [ ] Add link to full PWA

### 4.9 Extension Testing
- [ ] Build extension (`pnpm build`)
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
- [ ] Create `packages/ui/package.json`
- [ ] Create `packages/ui/tsconfig.json`
- [ ] Set up build process (tsup or unbuild)
- [ ] Configure Tailwind for component library

### 5.2 Shared Components
- [ ] Create `packages/ui/src/BookmarkItem.tsx`
- [ ] Create `packages/ui/src/BookmarkList.tsx`
- [ ] Create `packages/ui/src/EmptyState.tsx`
- [ ] Create `packages/ui/src/LoadingSpinner.tsx`
- [ ] Export all components from `packages/ui/src/index.ts`

### 5.3 Integration
- [ ] Import shared components in `apps/web`
- [ ] Import shared components in `apps/chrome-extension`
- [ ] Verify components render correctly in both apps

---

## Phase 6: Turborepo Optimization

### 6.1 Pipeline Configuration
- [ ] Configure `build` task dependencies
- [ ] Configure `dev` task (persistent)
- [ ] Configure `lint` task
- [ ] Configure `type-check` task
- [ ] Configure `test` task (when tests exist)

### 6.2 Root Scripts
- [ ] Add `pnpm dev` - Run all apps in parallel
- [ ] Add `pnpm dev:web` - Run web only
- [ ] Add `pnpm build` - Build all packages and apps
- [ ] Add `pnpm lint` - Lint all with Biome
- [ ] Add `pnpm lint:fix` - Auto-fix lint issues
- [ ] Add `pnpm type-check` - TypeScript validation
- [ ] Add `pnpm clean` - Clean all build artifacts

### 6.3 Caching
- [ ] Verify Turborepo caching works
- [ ] Test incremental builds
- [ ] Verify cache invalidation works correctly

---

## Phase 7: Environment & Deployment

### 7.1 Environment Variables
- [ ] Document all required env vars in `.env.example`
- [ ] Set up env validation in all apps
- [ ] Create separate `.env.example` per app if needed

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
- [ ] Install Vitest in workspace
- [ ] Create test configuration
- [ ] Set up test scripts in `package.json`

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
- [ ] Create `.github/workflows/ci.yml`
- [ ] Run lint on PR
- [ ] Run type-check on PR
- [ ] Run tests on PR
- [ ] Auto-deploy on merge to main (optional)

---

## Progress Summary

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Monorepo Foundation | ⬜ Not Started |
| 2 | Firebase Setup | ⬜ Not Started |
| 3 | React PWA | ⬜ Not Started |
| 4 | Chrome Extension | ⬜ Not Started |
| 5 | Shared UI Package | ⬜ Not Started |
| 6 | Turborepo Optimization | ⬜ Not Started |
| 7 | Environment & Deployment | ⬜ Not Started |
| 8 | Testing & Quality | ⬜ Not Started |

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
