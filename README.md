# Accessibility Audit & Full-Stack Foundation

A full-stack project foundation created after auditing a real public-facing website for accessibility and technical issues.

## 1. Project Overview

This project uses the DigiLocker website as the subject of an accessibility and architecture audit.

The audit was performed using:

- Google Lighthouse
- Chrome DevTools
- Keyboard-only navigation

The findings are documented in:

`docs/accessibility-audit.md`

The repository is structured as a monorepo-style full-stack application with separate frontend, backend, documentation, and testing areas.

## 2. Repository Structure

```text
accessibility-audit/
│
├── client/              # React frontend
│
├── server/              # Node.js + Express backend
│
├── docs/                # Project documentation
│   └── accessibility-audit.md
│
├── tests/               # Automated and integration tests
│
├── README.md            # Project architecture and setup
├── .gitignore           # Files excluded from Git
└── package.json         # Root project configuration
```

## 3. Architecture Boundaries

### Client

The `client` directory contains the React frontend.

Responsibilities:

- User interface
- Page components
- Forms and interactions
- Client-side state
- API requests to the backend

The frontend should not directly access the database.

### Server

The `server` directory contains the Node.js and Express backend.

Responsibilities:

- REST API endpoints
- Business logic
- Input validation
- Authentication and authorization
- Database communication

The backend acts as the boundary between the frontend and persistent data.

### Docs

The `docs` directory contains project documentation, including the accessibility audit.

### Tests

The `tests` directory is reserved for automated tests covering frontend, backend, and integration behaviour.

## 4. Local Setup

### Prerequisites

Install:

- Node.js
- npm
- Git

### Frontend

Navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend runs locally through the Vite development server.

### Backend

Open a separate terminal and navigate to:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
node server.js
```

The backend API runs on:

```text
http://localhost:5000
```

## 5. Communication Flow

The application follows this basic architecture:

```text
React Client
     │
     │ HTTP / REST API
     ▼
Express Server
     │
     │ Business Logic
     ▼
Database
```

The client is responsible for presentation and user interaction.

The server is responsible for API operations and business rules.

## 6. First Vertical Feature Slice

The first feature slice will be an **Accessibility Issue Tracker**.

A user will be able to:

1. View accessibility issues discovered during an audit.
2. View the issue description and evidence.
3. View the priority of each issue.
4. Add a new issue through the frontend.
5. Send the issue to the Express API.
6. Store and retrieve issue data through the backend.

The initial flow will be:

```text
React UI
   ↓
POST /api/issues
   ↓
Express API
   ↓
Issue data storage
   ↓
GET /api/issues
   ↓
React UI
```

This creates one complete feature from frontend to backend rather than building isolated parts of the application.

## 7. Initial API Design

### GET `/api/issues`

Returns the accessibility issues.

### POST `/api/issues`

Creates a new accessibility issue.

Example issue:

```json
{
  "title": "Form elements do not have associated labels",
  "category": "Accessibility",
  "priority": "High",
  "description": "Some form controls are not associated with labels."
}
```

## 8. Future Improvements

Possible future additions include:

- Database integration
- User authentication
- Accessibility issue filtering
- Search
- Dashboard and statistics
- Automated accessibility testing
- Unit and integration tests
- CI/CD
- Deployment
- Role-based access control

## 9. Audit Reference

The complete audit findings are available in:

`docs/accessibility-audit.md`
