# Doctor Tracker – Frontend

A web-based doctor and patient management system designed to help administrators manage doctors, patients, and their associated records through a centralized dashboard.

The application provides a responsive interface with dashboard analytics, doctor and patient management, search functionality, and customizable user preferences.

## Features

- **Admin Authentication** – Login interface and protected application access.
- **Dashboard** – Overview of system statistics and visual data representation.
- **Doctor Management** – View, add, edit, and manage doctor records.
- **Patient Management** – View, add, edit, and manage patient records.
- **Doctor–Patient Association** – Manage relationships between doctors and patients.
- **Search and Filtering** – Find relevant doctor and patient records.
- **Global Search** – Search across available application records.
- **Theme Preferences** – Switch between light and dark themes.
- **Language Preferences** – English and Bangla interface support.
- **Responsive Interface** – Layout designed to work across different screen sizes.

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Frontend framework |
| React | User interface development |
| TypeScript | Type-safe application development |
| Tailwind CSS | Styling and responsive layouts |
| Recharts | Dashboard charts and data visualization |
| Lucide React | Interface icons |

## Project Structure

```text
doctor-tracker-frontend/
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── doctors/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── patients/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── dashboard/
│   │   │   └── StatCard.tsx
│   │   └── layout/
│   │       ├── AppShell.tsx
│   │       ├── Header.tsx
│   │       └── Sidebar.tsx
│   │
│   ├── context/
│   │   └── PreferencesContext.tsx
│   │
│   └── lib/
│       └── api.ts
│
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Prerequisites

Before running the project, make sure you have installed:

- Node.js (LTS version recommended)
- npm
- Git
- The Doctor Tracker backend running locally or deployed

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/tasfahim/doctor-tracker-frontend.git
```

### 2. Navigate to the project directory

```bash
cd doctor-tracker-frontend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the project root.

Configure the frontend API base URL using the environment variable referenced in `src/lib/api.ts`.

For local development, the backend API is available at:

```text
http://localhost:5000
```

Do not commit `.env.local` or expose private credentials.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the application for production |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint checks |

## Backend Integration

Doctor Tracker uses a separate backend repository built with Express.js, TypeScript, and MongoDB.

The frontend communicates with the backend through a centralized API integration layer:

```text
src/lib/api.ts
```

The backend handles authentication, database operations, doctor and patient management, and API responses.

**Backend Repository:**  
https://github.com/tasfahim/doctor-tracker-backend

## Application Repository

**Frontend Repository:**  
https://github.com/tasfahim/doctor-tracker-frontend

## Development Notes

- The application uses Next.js App Router.
- TypeScript is used throughout the frontend.
- API communication is centralized to maintain consistency.
- User preferences include theme and language settings.
- Environment-specific configuration should be maintained outside the source code.
