## Elite Wealth Frontend

Frontend-only React application with an in-memory data mock for fast local development and demos. For full details, see `FRONTEND_DOCS.txt`.

### Quick Start
1. Install Node.js 18+ (recommend `nvm`).
2. Install dependencies:
   - `npm i`
3. Start the dev server:
   - `npm run dev`
4. Open `http://localhost:5173`.

### Documentation
- Comprehensive guide: see `FRONTEND_DOCS.txt` (architecture, auth, data model, RBAC, backend contract, troubleshooting).

### Tech Stack
- Vite, React, TypeScript
- Tailwind CSS, shadcn/ui
- React Router, TanStack Query

### Backend Status
- Frontend runs standalone with an in-memory mock. No DB/server required for local usage.

### Scripts
- `dev`: start Vite dev server
- `build`: production build
- `build:dev`: development-mode build
- `preview`: serve built app locally
- `lint`: run ESLint

### Authentication
- OTP flow against a backend API. Update the API base in `src/contexts/AuthContext.tsx` if pointing to your own backend.

### License
Proprietary. All rights reserved.
