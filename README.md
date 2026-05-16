# Peblo - AI-Powered Collaborative Notes Workspace

Peblo is a modern, collaborative notes workspace designed to help kids (and adults!) write, learn, and grow with the help of an AI buddy. This project is a full-stack application built for the Peblo Take-Home Challenge.

## Features

- **Secure Authentication**: User signup and login with secure session management via NextAuth.
- **Notes Workspace**: Create, edit, and manage notes with an intuitive UI. Features auto-save functionality.
- **AI Integration**: Powered by Google Gemini AI, generate 1-2 sentence summaries, extract action items, and suggest titles for your notes.
- **Search & Filtering**: Real-time keyword search and tag-based filtering.
- **Public Sharing**: Generate a secure, read-only public link to share notes without requiring the viewer to log in.
- **Productivity Dashboard**: View insights such as total notes, recently edited notes, top tags, and AI usage statistics.
- **Premium Design Aesthetics**: Custom-built CSS system featuring a dynamic dark mode, glassmorphism UI components, vibrant gradients, and smooth micro-animations.

## Technology Stack

- **Frontend & Backend**: Next.js (App Router, React 18)
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with Credentials provider and bcryptjs
- **AI Integration**: Google GenAI SDK (Gemini 2.5 Flash)
- **Styling**: Vanilla CSS (CSS Variables, Glassmorphism design tokens)
- **Icons**: Lucide React

## Setup Instructions

### Prerequisites
- Node.js (v20+ recommended)
- npm or yarn

### 1. Clone & Install
Clone the repository, then install the required dependencies:
```bash
npm install
```

### 2. Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Ensure you have the following in your `.env` file:
- `DATABASE_URL="file:./dev.db"`
- `NEXTAUTH_SECRET="your-secure-random-secret"`
- `NEXTAUTH_URL="http://localhost:3000"`
- `GEMINI_API_KEY="your-google-gemini-api-key"` (Optional: the app falls back to mocked AI if not provided, for demo purposes)

### 3. Database Setup
Initialize the SQLite database with Prisma:
```bash
npx prisma db push
npx prisma generate
```

### 4. Run the Application
Start the development server:
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your browser.

## Architecture

The project is built as a single cohesive Next.js full-stack application.
- **App Router (`src/app`)**: Contains pages and API route handlers.
- **Components (`src/components`)**: Reusable UI elements like `Navbar` and `AuthProvider`.
- **Database (`src/lib/prisma.ts`)**: Prisma client singleton pattern for serverless edge.
- **Styling (`src/app/globals.css`)**: Implements a robust CSS variable system mimicking Tailwind's utility concepts but keeping full manual control to deliver a stunning glassmorphic interface.
