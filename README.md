# Frontend Test – Task Manager (Next.js + TypeScript)

A fully-featured Task Manager built with **React**, **Next.js**, and **TypeScript** as part of the LetsStopAIDS frontend coding test.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [How to Place the Code](#how-to-place-the-code)
- [Component Overview](#component-overview)
- [Bonus Features Implemented](#bonus-features-implemented)
- [Design Decisions](#design-decisions)

---

## Features

### Core (Required)
- **Add tasks** — Enter a title and select a priority (Low / Medium / High), then click "Add task" or press `Enter`
- **View tasks** — Tasks are listed newest-first with title and priority badge
- **Complete tasks** — Checkbox marks a task as done; completed tasks move below active ones and are visually distinct
- **Delete tasks** — Each task has its own Delete button
- **Filter by status** — Filter buttons: All, Active, Completed
- **Validation** — Empty or whitespace-only titles are rejected with a clear inline error message
- **Responsive** — Works on mobile (< 768px) and desktop (≥ 768px)

### Bonus
- **Persistence** — Tasks are saved to `localStorage` and survive a page refresh
- **Search** — Search bar filters tasks by title in real time
- **Edit** — Each task has an Edit button that opens an inline editor for title and priority (save with Enter, cancel with Escape)
- **Accessibility** — Semantic HTML (`<label>`, `<button>`, `<ul>`, `<li>`), `aria-label`, `aria-pressed`, `aria-invalid`, `aria-describedby`, and full keyboard navigation

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 14](https://nextjs.org/) | React framework with App Router |
| [React 18](https://react.dev/) | UI library |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| CSS Modules | Scoped, component-level styling |

> No external UI libraries or state management libraries were used — React, Next.js, and browser APIs only (as per the test requirements).

---

## Project Structure

```
Frontend-Test/
├── app/
│   └── page.tsx          ← Do not modify (renders the test component)
├── modules/
│   ├── test.tsx          ← ✅ Task Manager component (your work goes here)
│   └── test.module.css   ← ✅ Styles for the Task Manager
├── public/
├── package.json
├── tsconfig.json
└── README.md
```

---

## Getting Started

### Prerequisites

You need **Node.js** installed on your machine.

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS** version (recommended)
3. Run the installer — keep all default options and ensure **"Add to PATH"** is checked
4. **Restart your terminal** after installation

Verify the installation worked:

```bash
node -v
npm -v
```

Both commands should print version numbers (e.g., `v20.x.x` and `10.x.x`).

---

### Installation

**Step 1 — Fork the repository**

Go to [https://github.com/CatherineZM/Frontend-Test](https://github.com/CatherineZM/Frontend-Test) and click the **Fork** button (top right). This copies the repo to your own GitHub account.

**Step 2 — Clone your fork**

Open a terminal (PowerShell on Windows, Terminal on Mac/Linux) and run:

```bash
git clone https://github.com/YOUR_USERNAME/Frontend-Test.git
```

Replace `YOUR_USERNAME` with your actual GitHub username.

**Step 3 — Navigate into the project folder**

```bash
cd Frontend-Test
```

**Step 4 — Install dependencies**

```bash
npm install
```

---

### How to Place the Code

You need to place two files into the `modules/` folder of the cloned project.

**File 1: `test.tsx`**

Copy the `test.tsx` file into:

```
Frontend-Test/
└── modules/
    └── test.tsx   ← place it here
```

**File 2: `test.module.css`**

Copy the `test.module.css` file into the same folder:

```
Frontend-Test/
└── modules/
    └── test.module.css   ← place it here
```

After placing both files, your `modules/` folder should look like:

```
modules/
├── test.tsx
└── test.module.css
```

> ⚠️ Do not rename the files or move them anywhere else. The existing `app/page.tsx` imports directly from `modules/test.tsx` and this path must stay the same.

---

### Running the App

Once the files are in place, start the development server:

```bash
npm run dev
```

Then open your browser and go to:

```
http://localhost:3000
```

You should see the Task Manager running.

To stop the server at any time, press `Ctrl + C` in your terminal.

---

## Component Overview

The entire component lives in `modules/test.tsx`. Here is a summary of how it is structured:

### Types

```typescript
type Priority = "Low" | "Medium" | "High";
type FilterStatus = "All" | "Active" | "Completed";

interface Task {
  id: string;
  title: string;
  priority: Priority;
  completed: boolean;
  createdAt: number;
}
```

### State

| State variable | Type | Purpose |
|---|---|---|
| `tasks` | `Task[]` | The full list of tasks |
| `titleInput` | `string` | Controlled input for the new task title |
| `priorityInput` | `Priority` | Selected priority for the new task |
| `filter` | `FilterStatus` | Currently active filter tab |
| `searchQuery` | `string` | Current search string (bonus) |
| `titleError` | `string` | Validation error message |
| `editingId` | `string \| null` | ID of the task currently being edited (bonus) |
| `editTitle` | `string` | Draft title while editing (bonus) |
| `editPriority` | `Priority` | Draft priority while editing (bonus) |

### Key Logic

- **Add task** — validates the title, prepends the new task to the array (newest first)
- **Toggle complete** — maps over tasks and flips `completed` for the matching ID
- **Delete** — filters out the task with the matching ID
- **Edit** — sets `editingId` to open inline edit mode; saves by updating title and priority in the array
- **Filtering + searching** — chained `.filter()` calls: first by status, then by search query
- **Ordering** — active tasks always appear above completed tasks within the current filter view
- **Persistence** — `useEffect` reads from `localStorage` on mount and writes on every `tasks` change

---

## Bonus Features Implemented

### 1. Persistence (`localStorage`)
Tasks are loaded from `localStorage` on the first render and saved back whenever the `tasks` state changes. This means tasks survive a full page refresh.

### 2. Search
A search input sits alongside the filter buttons. It filters the visible task list in real time by matching the search string against task titles (case-insensitive).

### 3. Edit
Each task has an Edit button. Clicking it opens an inline edit form with the current title and priority pre-filled. Changes can be saved by clicking Save or pressing `Enter`. The edit can be cancelled with the Cancel button or by pressing `Escape`.

### 4. Accessibility
- All inputs and selects have associated `<label>` elements (visible or `sr-only`)
- Error messages use `role="alert"` and `aria-describedby` so screen readers announce them
- Filter buttons use `aria-pressed` to communicate the active state
- Checkboxes and action buttons have descriptive `aria-label` attributes
- All interactive elements are reachable and operable via keyboard

---

## Design Decisions

- **No external libraries** — as required, only React, Next.js, and browser APIs are used
- **CSS Modules** — styles are scoped to the component via `test.module.css`, avoiding any global style conflicts
- **Separation of active and completed tasks** — completed tasks are always rendered after active ones regardless of the filter, making the list easier to scan
- **Inline editing** — rather than a modal or separate page, editing happens directly in the task row to keep the interaction fast and lightweight
- **`generateId()`** — uses `Date.now()` combined with a short random string instead of a library like `uuid`, keeping external dependencies at zero