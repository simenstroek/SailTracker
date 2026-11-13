# Sail Roadmap Tracker
Single-page roadmap tracker (epics, stories, tasks, milestones) on Supabase (login + shared data). Hosted with GitHub Pages from `main`.
- `index.html` the whole app. The publishable key in it is public by design; Row Level Security protects the data.
- `schema.sql` run once in the Supabase SQL editor.
- `tools/import.mjs` one-off import of the old Drive JSON tracker.
Users are created by hand in Supabase (Authentication -> Users); sign-ups are disabled.
