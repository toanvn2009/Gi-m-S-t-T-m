# System Architecture Overview

## Project: Giám Sát Tổ Ấm - NHÀ QUÊ

### 1. High-Level Architecture
The application follows a **Client-Side SPA (Single Page Application)** architecture, primarily designed for offline-first capability and simplicity of deployment (no dedicated backend required for core functions).

- **Frontend:** React + Vite
- **State Management:** Zustand (Global Store)
- **Persistence:** LocalStorage (via Zustand middleware)
- **AI Integration:** Direct calls to Google Gemini API from client
- **Routing:** Conditional rendering based on `currentView` state (Simple Router)

### 2. Core Modules

#### 2.1. Store (`/store`)
- **useStore.ts**: The central brain of the application. It contains slices for:
    - `project`: Global settings (budget, info).
    - `timelineSteps`: Construction phases.
    - `dailyPhotos`: Photo gallery data.
    - `financeItems`: Expenses and invoices.
    - `aiLogs`: Chat history and analysis logs.
    - `ui`: View state, mobile menu, notifications.
    - `contractors`: Directory of workers.
    - `documents`: File references.
    - `issues`: Defect tracking.

#### 2.2. Services (`/services`)
- **geminiService.ts**: Handles communication with Google Gemini API for:
    - Image analysis (`analyzeConstructionImage`)
    - Chat/Advice (`getConstructionAdvice` - *To be implemented/refines*)
    - Progress prediction (`predictProgress` - *To be implemented*)
- **exportService.ts**: Handles data serialization:
    - `exportProjectData`: Dumps state to JSON.
    - `importProjectData`: Validates and parses JSON backup.

#### 2.3. Components (`/components`)
- **DashboardOverview**: Main view, aggregator of all modules.
- **FinanceDetail**: Budget tracking, charts, invoice management.
- **ProgressDetail**: Timeline visualization and management.
- **ContractorsPage**: Worker directory.
- **DocumentsPage**: File repository.
- **IssuesPage**: Defect tracker.
- **RiskAlerts**: Intelligent notifications based on progress/budget data.
- **ChatWidget**: Floating AI assistant interface.

### 3. Data Flow
1.  **User Action:** User interacts with UI (e.g., adds invoice).
2.  **State Update:** Component calls Zustand action (`addFinanceItem`).
3.  **Persistence:** Zustand middleware saves new state to `localStorage`.
4.  **Re-render:** Components subscribed to `financeItems` re-render (e.g., Charts, Lists).
5.  **AI Trigger (Optional):** Some actions (upload photo) trigger async calls to `geminiService`, which then updates state (`addAILog`, `updatePhoto`) upon completion.

### 4. Key Decisions & Trade-offs
- **LocalStorage vs Database:** Chosen LocalStorage for zero-config, instant setup, and privacy (data stays on device). Trade-off: Data is bound to browser/device (mitigated by Import/Export feature).
- **Client-side AI:** API keys stored in `.env.local` or input by user. Trade-off: Security risk if exposed publicy (acceptable for personal tool).
- **No Backend:** Simplifies deployment to static hosts (Vercel/Netlify/Github Pages).

### 5. Future Considerations
- **Sync:** Potential integration with Firebase/Supabase for multi-device sync if manual Export/Import becomes tedious.
- **PWA:** Manifest and Service Workers for installable app experience.
