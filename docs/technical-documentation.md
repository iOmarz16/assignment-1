# Technical Records

 ## Architecture: **index.html:** Semantic layout (footer, sections, header/nav).

 - **css/styles.css:** CSS variables, light/dark themes, helpers (.hidden,.fade), and transitions.
 - **js/script.js:** Theme toggle (LocalStorage), greeting + stored name, smooth scroll, projects (filter/search + empty state), API fetch (loading/error/retry), validation of contact forms, AI draft).

 ## Data Management: **LocalStorage:** `username`, `pref-theme`.
 - **API:** `GET https://catfact.ninja/fact` with error fallback + retry and loading.

 ## User Experience/Error Management
 - `aria-invalid` and inline field errors.
 - `aria-live="polite"` for status updates.
 An API loading indicator and retry button.
 The project grid is in an empty state.

 ## Performance & Animations
 - Light hover micro-interactions and CSS fade-in on mount (`.fade.show`).
 To prevent layout thrash when revealing cards, use `requestAnimationFrame`.
 Minimal footprint due to the lack of heavy dependencies.

 ## Compatibility: Operates on contemporary web browsers.  Progressive enhancement: when JS is enabled, the user experience is improved, but content is still accessible without it.
