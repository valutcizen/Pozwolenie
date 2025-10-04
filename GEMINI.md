# GEMINI.md: Project "Pozwolenie"

## Project Overview

This is a Vue.js web application designed to help users prepare for the Polish firearm possession permit exam (pozwolenie na broń). The application provides two main modes: a learning mode ("Nauka") and an exam simulation mode ("Egzamin").

The project is built with a modern frontend stack:

*   **Framework:** Vue.js 3 (using the Composition API with `<script setup>`)
*   **UI Library:** Vuetify 3
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **Routing:** File-system based routing via `unplugin-vue-router`.
*   **Styling:** SASS/SCSS with Vuetify's styling system.

The application's core data, the exam questions, are stored in a local JSON file at `src/data/questions.json`. The business logic for managing, randomizing, and serving these questions is located in the `src/services` directory. The UI is structured into reusable Vue components found in `src/components`.

## Building and Running

The project uses `yarn` as its package manager.

*   **Install Dependencies:**
    ```bash
    yarn
    ```

*   **Run Development Server:**
    Starts a local development server with hot-reloading.
    ```bash
    yarn dev
    ```

*   **Build for Production:**
    Compiles and minifies the application for production. The output is placed in the `dist/` directory.
    ```bash
    yarn build
    ```

*   **Preview Production Build:**
    Starts a local server to preview the production build from the `dist/` directory.
    ```bash
    yarn preview
    ```

## Development Conventions

*   **Code Style:** The project uses ESLint with the `eslint-config-vuetify` configuration to enforce code style and quality. Run `yarn lint` to check and fix issues.
*   **Type Checking:** TypeScript is used throughout the project. Run `yarn type-check` to perform a static type analysis.
*   **Component & Page Structure:**
    *   Reusable UI components are located in `src/components`. They are automatically imported into other components as needed, configured in `vite.config.mts`.
    *   Application pages are located in `src/pages`. The router is configured to automatically create routes based on the file names in this directory. For example, `src/pages/index.vue` corresponds to the `/` route.
*   **Data Models:** TypeScript types and interfaces for the application's data structures (like questions, stats, and options) are defined in the `src/model` directory.
*   **State Management:** Application state is managed locally within components using Vue's reactivity system (`ref`). The state of the learning mode is persisted to the browser's `localStorage` via the `PersistLearnState` service to allow users to continue their session.
*   **Styling:** Global styles and Vuetify SASS variables are configured in `src/styles/settings.scss`.
