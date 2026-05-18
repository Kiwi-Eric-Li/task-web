# AGENTS.md

## Project Purpose

task-web is a Create React App frontend for a task marketplace. It includes task publishing, task browsing, login and registration, user profile views, messages, notifications, and account settings.

## Key Directory Structure

- `src/`: application source code.
- `src/components/`: page and business components.
- `src/components/task_dashboard/`: task publishing components, including `Publish.js` and `TaskLocationInput.js`.
- `src/components/dashboard/`: homepage, search, terms, privacy, FAQ, and marketing/info components.
- `src/components/login/`: login, registration, and password recovery components.
- `src/components/task_list/`: task list page components.
- `src/components/task_profile/`: task profile, review, rating, and KPI components.
- `src/components/hub/`: user hub, notifications, messages, and settings components.
- `src/store/`: Redux store and user/role state modules.
- `src/utils/`: request, theme, time, media validation, and token helpers.
- `public/`: static assets and HTML template.
- `build/`: production build output.

## Maintenance Notes

- Use npm as the package manager.
- The task publishing location field uses MUI `Autocomplete`. `Publish.js` owns the selected suburb text; `TaskLocationInput.js` only writes back on user input, clear, or confirmed selection so Back/Next remounts do not erase the suburb.
