# initialxy-points App Summary

## App Description
A simple web app that helps track points earned by kids and allows them to redeem points for rewards. See docs/PRD.md for more context.

## Technical Stack
- Frontend: Vue.js with Nuxt 4 framework (additional modules: nuxt/fonts, nuxt/icon, nuxt/ui)
- Backend: Nuxt 4 (full-stack mode)
- Database: SQLite
- TypeScript: Full TypeScript safety
- Tailwind CSS for styling

## Codebase Knowledge
`docs` directory contains documentation for the app. All files of this project are indexed in a vector database and is searchable by the `codebase_search` tool. Feel free to use it to look up context.

## Code Guide
* Do not rely on JavaScript's truthy and falsy boolean conditions. All boolean conditions need to be evaluated explicitly. eg instead of `if (value)` use `if (value !== 0)` if `value` is `number`. null or undefined check should use `== null` or `!= null` instead.
* Use Tailwind CSS classes as much as possible
* Use nuxt/ui components as much as possible.
* All shared types are in `types/index.ts` file, which is auto imported across all source files. No need to import types explicitly.