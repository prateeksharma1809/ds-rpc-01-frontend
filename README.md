# FinSolve Technologies Chatbot Frontend

This is the frontend for the **FinSolve Technologies Chatbot** project, built with React, TypeScript, and Vite. It provides a secure, role-based chat interface for users to interact with an AI assistant, as well as a powerful admin dashboard for user and document index management.

## Features

### Chat Interface
- **Role-based login**: Users log in with a username, password, and role.
- **AI Assistant**: Ask questions about your documents and receive detailed, sourced answers.
- **Source Table**: Each AI response includes a table of document sources (if available).
- **Responsive UI**: Works great on desktop and mobile.

### Admin Dashboard
- **User Management**: Create, search, and delete users. Assign roles: engineering, marketing, finance, hr, general, c-level, admin.
- **Index Management**: 
  - Initialize vector store
  - Index all documents (with batch size)
  - Get index stats (displayed in a beautiful table)
  - Clear vector store (with confirmation)
  - Reindex all documents (with batch size)
- **Role-based Access**: Only users with the `admin` role can access the admin dashboard.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Backend API running (see [FinSolve backend repo](https://github.com/prateeksharma1809/ds-rpc-01) for details)

### Installation

```bash
git clone <this-repo-url>
cd frontend
npm install
```

### Running the App

#### Development

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

#### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
frontend/
  ├── src/
  │   ├── components/
  │   │   ├── AdminPage.tsx      # Admin dashboard
  │   │   ├── ChatBox.tsx        # Chat interface
  │   │   └── LoginForm.tsx      # Login form
  │   ├── api.ts                 # API calls
  │   ├── App.tsx                # Main app logic
  │   └── App.css                # Styles
  ├── index.html
  ├── package.json
  └── ... (Vite, TypeScript, ESLint config)
```

## API Integration

The frontend expects a backend running at `http://localhost:8000` with the following endpoints:

- `POST /login` - User authentication
- `POST /chat` - Chat with the AI assistant
- `GET /admin/users` - List users
- `POST /admin/users` - Create user
- `DELETE /admin/users/{username}` - Delete user
- `POST /admin/index/init` - Initialize vector store
- `POST /admin/index/documents` - Index all documents
- `GET /admin/index/stats` - Get index stats
- `DELETE /admin/index/clear` - Clear vector store
- `POST /admin/index/reindex` - Reindex all documents

> **Note:** All admin endpoints require `admin` authentication.

## Customization

- **Roles:** You can easily add or remove user roles in `AdminPage.tsx`.
- **Styling:** All styles are in `src/App.css` and are easy to modify.
- **API URL:** Change the `BASE_URL` in `src/api.ts` if your backend runs elsewhere.

## Tech Stack

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Axios](https://axios-http.com/)
- [ESLint](https://eslint.org/)

## License

This project is for internal use at FinSolve Technologies.

## Contact

For questions or support, contact the FinSolve Technologies engineering team.


