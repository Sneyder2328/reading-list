# Reading List Monorepo - Implementation Plan

## Overview

A cross-platform bookmark manager that allows users to quickly sav## Phase 3: React PWA (apps/web)

##### 3.3 Firebase Auth Integration

- [ ] Implement Google Sign-In button
- [ ] Create auth context/provider
- [ ] Protected route wrapper

### 3.4 Featuresoject Setup

- [ ] Initialize Vite + React project
- [ ] Configure PWA plugin (vite-plugin-pwa)
- [ ] Set up TypeScript with shared config
- [ ] Configure service worker for offline support

### 3.2 TanStack Query Setup

- [ ] Install TanStack Query (`@tanstack/react-query`)
- [ ] Create `QueryClientProvider` wrapper
- [ ] Create custom hooks for Firestore operations:
  - `useBookmarks()` - Fetch active bookmarks
  - `useArchivedBookmarks()` - Fetch archived bookmarks
  - `useToggleBookmark()` - Mutation for save/unsave
  - `useArchiveBookmark()` - Mutation for archiving
  - `useDeleteBookmark()` - Mutation for deletion

### 3.3 Firebase Auth Integration browser via a Chrome extension and manage their saved links through a React PWA. Each user has their own personal collection of bookmarks, synced across devices via Firebase Auth.

### Core Features

- **One-click save/unsave** from browser toolbar
- **Personal bookmark library** with user authentication
- **Archive functionality** to hide read/completed links without deleting
- **Cross-device sync** via cloud storage

## Tech Stack

- **Package Manager:** pnpm
- **Build System:** Turborepo
- **Language:** TypeScript
- **Database:** Firebase Firestore (direct client access)
- **Data Fetching:** TanStack Query
- **Authentication:** Firebase Auth (Google Provider)

---

## Project Structure

```
reading-list/
├── apps/
│   ├── chrome-extension/     # Chrome Extension (Manifest V3)
│   └── web/                  # React PWA
├── packages/
│   ├── ui/                   # Shared UI components
│   ├── firebase/             # Shared Firebase auth + Firestore utilities
│   └── config-typescript/    # Shared TypeScript configs
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── biome.json
└── tsconfig.json
```

---

## Phase 1: Monorepo Setup

### 1.1 Initialize Project

- [ ] Initialize pnpm workspace
- [ ] Create root `package.json`
- [ ] Create `pnpm-workspace.yaml`
- [ ] Initialize Turborepo with `turbo.json`
- [ ] Create root `tsconfig.json`

### 1.2 Configure Shared Packages

- [ ] Create `packages/config-typescript` with base TS configs
- [ ] Set up Biome for linting and formatting (`biome.json` at root)
- [ ] Set up path aliases and module resolution

---

## Phase 2: Firebase Authentication Setup

### 2.1 Firebase Project Configuration

- [ ] Create Firebase project in Firebase Console
- [ ] Enable Google Sign-In provider
- [ ] Configure authorized domains (localhost, production domain)
- [ ] Download Firebase config credentials

### 2.2 Shared Firebase Package

- [ ] Create `packages/firebase`
- [ ] Implement Firebase initialization
- [ ] Create auth utilities:
  - `signInWithGoogle()`
  - `signOut()`
  - `getCurrentUser()`
  - `onAuthStateChanged()` wrapper
- [ ] Create Firestore utilities:
  - `getBookmarks()` - Get user's active bookmarks
  - `getArchivedBookmarks()` - Get user's archived bookmarks
  - `isUrlSaved()` - Check if URL exists for user
  - `createBookmark()` - Save new bookmark
  - `toggleBookmark()` - Save or unsave by URL
  - `archiveBookmark()` - Archive a bookmark
  - `unarchiveBookmark()` - Restore from archive
  - `deleteBookmark()` - Permanently delete bookmark

### 2.3 Data Model

```typescript
interface Bookmark {
  id: string
  userId: string
  url: string
  title: string
  favicon?: string
  description?: string
  createdAt: Date
  archivedAt?: Date | null
}
```

### 2.4 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bookmarks/{bookmarkId} {
      // Users can only read/write their own bookmarks
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      
      // Users can create bookmarks with their own userId
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

---

## Phase 3: React PWA (apps/web)

### 5.1 Project Setup

- [ ] Initialize Vite + React project
- [ ] Configure PWA plugin (vite-plugin-pwa)
- [ ] Set up TypeScript with shared config
- [ ] Configure service worker for offline support

### 5.2 tRPC Client Setup

- [ ] Install tRPC client + TanStack Query
- [ ] Create tRPC client configuration
- [ ] Set up QueryClientProvider
- [ ] Configure auth header injection

### 5.3 Firebase Auth Integration

- [ ] Implement Google Sign-In button
- [ ] Create auth context/provider
- [ ] Protected route wrapper
- [ ] Token refresh handling

### 5.4 Features

- [ ] **Bookmark Dashboard**
  - List view of all active bookmarks
  - Display title, favicon, URL, and save date
  - Sort by date (newest/oldest)
- [ ] **Archive Section**
  - Separate view for archived bookmarks
  - Restore or permanently delete options
- [ ] **Bookmark Actions**
  - Open link in new tab
  - Archive bookmark
  - Delete bookmark permanently
  - Copy URL to clipboard
- [ ] **Search & Filter**
  - Search by title or URL
  - Filter by date range
- [ ] **Empty States**
  - Guide user to install extension when no bookmarks
  - Helpful messaging for empty archive

### 3.5 PWA Configuration

- [ ] Create manifest.json
- [ ] Design app icons (192x192, 512x512)
- [ ] Configure caching strategies
- [ ] Implement install prompt

---

## Phase 4: Chrome Extension (apps/chrome-extension)

### 4.1 Project Setup

- [ ] Create Manifest V3 structure
- [ ] Configure TypeScript for extension
- [ ] Set up build process (Vite/webpack)

### 4.2 Extension Components

```
chrome-extension/
├── src/
│   ├── background/
│   │   └── service-worker.ts    # Handle badge updates, context menu
│   ├── popup/
│   │   ├── Popup.tsx            # Mini view of recent bookmarks
│   │   └── index.tsx
│   └── options/
│       └── Options.tsx          # Login/logout, settings
├── public/
│   ├── manifest.json
│   └── icons/
│       ├── icon-saved.png       # Filled bookmark icon (URL is saved)
│       ├── icon-unsaved.png     # Outline bookmark icon (URL not saved)
│       ├── icon-16.png
│       ├── icon-48.png
│       └── icon-128.png
└── package.json
```

### 4.3 Firebase Auth in Extension

- [ ] Implement `chrome.identity` API for Google auth
- [ ] Handle token storage in `chrome.storage`
- [ ] Sync auth state with background service worker

### 4.4 Firestore Integration

- [ ] Import shared Firebase utilities from `packages/firebase`
- [ ] Handle Firestore calls from popup and service worker
- [ ] Implement message passing between components

### 4.5 Features

- [ ] **One-Click Save/Unsave**
  - Click toolbar icon to toggle save state
  - Icon changes based on whether current URL is saved
  - Visual feedback on save/unsave action
- [ ] **Dynamic Icon State**
  - Filled/colored icon = URL is saved
  - Outline/gray icon = URL is not saved
  - Update icon on tab change/URL change
- [ ] **Popup Window**
  - Show 5-10 most recent bookmarks
  - Quick delete option
  - Link to open full PWA
  - Login status indicator
- [ ] **Context Menu**
  - Right-click "Save to Reading List" option
- [ ] **Options Page**
  - Google Sign-In / Sign-Out
  - Account info display
  - Link to PWA

---

## Phase 5: Shared UI Package (packages/ui)

### 5.1 Component Library

- [ ] Set up with React + TypeScript
- [ ] Choose styling solution (Tailwind / CSS Modules / styled-components)
- [ ] Create shared components:
  - Button
  - Input
  - Card
  - Modal
  - Loading spinner
  - BookmarkItem (title, favicon, URL, actions)
  - BookmarkList
  - EmptyState

---

## Phase 6: Turborepo Configuration

### 6.1 Pipeline Setup

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [".env"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "format": {},
    "check": {
      "dependsOn": ["^build"]
    },
    "type-check": {
      "dependsOn": ["^build"]
    }
  }
}
```

### 6.2 Biome Configuration

```json
// biome.json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded"
    }
  }
}
```

### 6.3 Scripts

- [ ] `pnpm dev` - Run all apps in development
- [ ] `pnpm build` - Build all packages and apps
- [ ] `pnpm lint` - Lint entire monorepo with Biome
- [ ] `pnpm format` - Format entire monorepo with Biome
- [ ] `pnpm check` - Run Biome check (lint + format)
- [ ] `pnpm type-check` - TypeScript validation

---

## Phase 7: Environment & Deployment

### 7.1 Environment Variables

```
# Root .env.example
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### 7.2 Deployment Targets

- [ ] **PWA:** Vercel / Netlify / Firebase Hosting
- [ ] **Extension:** Chrome Web Store

---

## Phase 8: Testing & Quality

### 8.1 Testing Setup

- [ ] Unit tests with Vitest
- [ ] E2E tests with Playwright (for PWA)
- [ ] Extension testing setup

### 8.2 CI/CD

- [ ] GitHub Actions workflow
- [ ] Automated testing on PR
- [ ] Automated deployment on merge to main

---

## Implementation Order

1. **Week 1:** Phases 1-2 (Monorepo + Firebase setup)
2. **Week 2:** Phase 3 (React PWA)
3. **Week 3:** Phase 4 (Chrome Extension)
4. **Week 4:** Phases 5-6 (Shared UI + Turborepo optimization)
5. **Week 5:** Phases 7-8 (Deployment + Testing)

---

## Key Dependencies

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.x",
    "firebase": "^10.x",
    "zod": "^3.x"
  },
  "devDependencies": {
    "turbo": "^2.x",
    "typescript": "^5.x",
    "@biomejs/biome": "^1.9.x",
    "vite": "^5.x",
    "@vitejs/plugin-react": "^4.x",
    "vite-plugin-pwa": "^0.x"
  }
}
```

---

## Notes

- Chrome extension requires special handling for Firebase auth (use `chrome.identity`)
- Firestore Security Rules handle all authorization (no backend needed)
- PWA should work offline with cached data, sync when online
- Extension icon state must update on: tab switch, URL change, bookmark save/delete
- Use `chrome.tabs.onUpdated` and `chrome.tabs.onActivated` listeners for icon updates
- Store user's bookmarked URLs in local cache for fast icon state lookups
