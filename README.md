# Clinical Concept Search

A small React and TypeScript app showcasing an accessible autocomplete search for clinical concepts. The page keeps the focus on the search: a short introduction and one search field with matching suggestions.

## Run locally

From this directory:

```sh
npm install
npm run dev
```

Vite prints the local URL when the development server starts.

## Try it out

Search for a clinical term, for example:

- `ALT` — Alanine Aminotransferase (ALT) Elevation
- `AST` — Aspartate Aminotransferase (AST) Spike
- `rash` — Maculopapular Rash (Infusion Reaction)

Suggestions show the concept category and active patient count. Select a suggestion with the mouse or keyboard.

## What this demonstrates

- A React search component with controlled input and asynchronously loaded suggestions.
- Mock clinical data filtered by the entered term, with a short delay to represent a data request.
- Request cancellation when the search changes, so stale requests do not update the results.
- Keyboard navigation: use **Up** and **Down** to move through suggestions, **Enter** to select, and **Escape** or **Tab** to close the list.
- Combobox and listbox ARIA attributes to expose the suggestion state to assistive technology.
- Loading and no-results states.
- A compact, responsive page layout for presenting the component.

The data is mock data defined in `src/services/mock-clinical-data-service.tsx`; this app does not connect to a clinical database or API.

## Project scripts

```sh
npm run dev      # Start the Vite development server
npm run build    # Type-check and create a production build
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```

## Built with

- React
- TypeScript
- Vite
