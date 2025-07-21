# Phase 1: Project Setup and Core UI (Sprint 1)

**Goal:** Set up the SvelteKit project and build the basic UI components.

### Task 1.1: Initialize SvelteKit Project
- **Action:** Run `npx sv create my-app tomah-client` to scaffold a new SvelteKit project.
- **Configuration:**
  - Select the "Skeleton project" option.
  - Add type checking with "TypeScript".
  - Enable "ESLint" for code linting.
  - Enable "Prettier" for code formatting.
- **Post-Setup:**
  - Run `bun install` to install all the necessary dependencies.
  - Initialize a new Git repository using `git init`.
  - Create an initial commit with all the generated files.

### Task 1.2: Setup Styling with Tailwind CSS and Skeleton UI
- **Action:** Integrate Tailwind CSS and Skeleton UI for a consistent and modern design.
- **Steps:**
  1. Install all required dependencies: `bun add -D tailwindcss postcss autoprefixer svelte-preprocess @skeletonlabs/skeleton @skeletonlabs/tw-plugin`.
  2. Configure `tailwind.config.cjs` to include the Skeleton UI plugin.
  3. Configure `postcss.config.cjs` and `svelte.config.js` to process Tailwind CSS.
  4. Create a root `+layout.svelte` to import the main app CSS and set up the Skeleton theme.
  5. Create a `src/app.postcss` file for Tailwind directives.

### Task 1.3: Create Basic UI Components
- **Goal:** Develop a set of reusable, fundamental UI components.
- **Directory:** `src/lib/components/common/`
- **Components to Create:**
  - **Button (`Button.svelte`):**
    - **Props:** `label`, `variant` (e.g., 'primary', 'secondary'), `disabled`.
    - **Events:** `click`.
    - **Styling:** Use Tailwind CSS classes for styling.
  - **Input (`Input.svelte`):**
    - **Props:** `type`, `label`, `placeholder`, `value`, `error`.
    - **Events:** `input`, `change`.
    - **Styling:** Use Tailwind CSS classes for styling.
  - **Card (`Card.svelte`):**
    - **Content:** Use `<slot>` to allow for generic content.
    - **Styling:** Style with rounded corners, shadow, and padding using Tailwind CSS.
  - **Index File (`index.ts`):** Create an `index.ts` file in `src/lib/components/common/` to export all common components for easy importing.

### Task 1.4: Set Up Basic Project Structure
- **Goal:** Establish a clean and scalable project structure.
- **Routing (`src/routes/`):**
  - `+page.svelte`: The main landing page.
  - `menu/[restaurantId]/+page.svelte`: A placeholder page for displaying a restaurant's menu.
  - `order/+page.svelte`: A placeholder page for the order summary and checkout process.
  - `auth/login/+page.svelte`: The user login page.
  - `auth/register/+page.svelte`: The user registration page.
- **Layouts (`src/routes/`):**
  - `+layout.svelte`: The root layout that will contain the header, footer, and the main content area for all pages.
- **Library Folders (`src/lib/`):**
  - `components/`: For all Svelte components.
  - `types/`: For all TypeScript type definitions.
  - `utils/`: For any utility functions.
  - `stores/`: For all Svelte stores.
  - `assets/`: For static assets like images, icons, etc.
