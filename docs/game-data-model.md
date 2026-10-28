# Game data model roadmap

The public site currently reads typed static records from `src/data/site-data.ts`. The `Game` interface already supports scheduled, final, postponed and canceled games; home, away and neutral sites; optional venues and addresses; period and overtime scores; related coverage; verification state; and soft-deletion timestamps.

## Supabase migration

The private editor should eventually store these records in normalized tables:

- `games`: immutable UUID, team, opponent, date/time, site designation, venue, status, final scores, verification state, timestamps and `deleted_at`.
- `game_period_scores`: game UUID, ordered period label, team score and opponent score. Quarter and overtime entries remain optional.
- `game_coverage`: game UUID plus an approved coverage record.
- `coverage`: publisher, headline, publication date, original URL, optional permitted preview image and approval status.
- `game_audit_log`: game UUID, editor, timestamp, action and before/after values.
- `score_reminders`: game UUID, scheduled send time, delivery state and a uniqueness constraint preventing duplicate active reminders.

Game UUIDs must never be derived from the opponent, date or venue. Those fields are editable. The current static IDs should be migrated once and retained as an optional legacy identifier.

## Import identity rules

- Every imported record receives an explicit immutable ID before it enters the public schedule array.
- Reordering, inserting or correcting records must never regenerate existing IDs.
- A future Supabase import should create a UUID once, retain any stable source-system identifier separately and reject duplicate IDs before publication.
- The repository validation tests reject missing, generated or duplicate IDs in the current static schedule.

## Scoring rules

- Quick entry saves the two final scores directly.
- Detailed entry stores period rows and calculates totals in the editor.
- Missing period data must not overwrite manually entered final scores.
- A game becomes final only through an explicit editorial status change.
- Reminder jobs should stop after a verified final result and should ignore canceled, postponed or soft-deleted games.

No recurring external schedule or score scraping is planned.
