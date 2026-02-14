# Global Store Actions Documentation

Location: `/store/useStore.ts`

## 1. Project Management
### `updateProject(project)`
- **Description:** Updates global project settings.
- **Payload:** `Partial<Project>` (name, budget, startDate, etc.)
- **Side Effects:** Triggers re-calculation of budget allocation charts if `budget` changes.

### `importData(data)`
- **Description:** **DESTRUCTIVE ACTION**. Overwrites current application state with imported JSON data.
- **Payload:** `Partial<AppState>`
- **Usage:** Used in `DashboardOverview.tsx` after successful file read.

## 2. Timeline & Progress
### `addTimelineStep(step)` / `updateTimelineStep(id, step)`
- **Description:** Manages construction phases.
- **Side Effects:** Updates timeline progress bar.

## 3. Daily Photos
### `addDailyPhoto(photo)`
- **Description:** Adds a new photo entry.
- **Payload:** `DailyPhoto` object (base64/url, timestamp, aiTag, phase).
- **AI Integration:** Usually called after `geminiService.analyzeConstructionImage`.

### `updatePhoto(id, updates)`
- **Description:** Updates photo metadata (Phase, AI Tag).
- **Usage:** Used in Photo Gallery edit mode.

## 4. Finance Management
### `addFinanceItem(item)`
- **Description:** Adds a new invoice or expense.
- **Payload:** `FinanceItem` (name, quantity, unitPrice, total).
- **Note:** `total` should be pre-calculated (`quantity * unitPrice`) by the UI component before calling this action.

## 5. Issues & Tasks
### `addIssue(issue)` / `updateIssue(id, updates)`
- **Description:** Core actions for the Defect Tracker.
- **Status Flow:** `open` -> `in_progress` -> `resolved`.
