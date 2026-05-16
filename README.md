# Peblo – Collaborative AI Notes Workspace 🚀

An ultra-premium, AI-powered collaborative workspace engineered for the modern generation of thinkers, creators, and learners. Built as a production-oriented full-stack system for the **Peblo Full Stack Developer Challenge**, Peblo transforms traditional note-taking into an intelligent, real-time productivity ecosystem.

Designed with a strong focus on **AI orchestration, scalable architecture, seamless UX, and modern SaaS engineering principles**, the platform bridges the gap between raw information and structured intelligence.


<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/b3b86ff5-72cf-4c5b-bd72-23e36b39f960" />






link: https://peblo-lyart.vercel.app/
---

# 🌌 Product Philosophy

Most note-taking applications simply store information.

Peblo is designed to **understand**, **organize**, and **enhance** information.

By deeply integrating Large Language Models directly into the workflow, Peblo evolves from a passive editor into an active cognitive assistant capable of:

* Synthesizing large notes instantly
* Extracting actionable tasks
* Understanding note context
* Enhancing productivity through intelligent insights
* Creating a premium collaborative experience

The objective was not just to build another CRUD application, but to simulate a **real AI-native SaaS platform** with production-ready architecture and polished UX.

---

# ✨ Core Features

## 🧠 Neural AI Engine

Peblo includes a multi-provider AI orchestration layer built for resilience, extensibility, and intelligent note processing.

### AI Capabilities

* AI-generated summaries
* Suggested titles from raw note content
* Automatic extraction of action items
* Context-aware note assistant
* Real-time AI workflows
* Structured response formatting

### Multi-Provider Failover Architecture

The application implements a provider-chain architecture:

```text
Groq Llama-3.3-70B
        ↓
Fallback Mock Provider
        ↓
Gemini 1.5 Flash

```

This ensures:

* High availability
* Reduced downtime
* Better response reliability
* Provider redundancy

### Intelligent Prompt Engineering

The AI layer uses structured prompt pipelines for:

* Summarization
* Semantic extraction
* Context retention
* Consistent output formatting

---

# 📊 Productivity Intelligence Dashboard

Peblo includes a dedicated analytics engine that converts workspace activity into visual productivity insights.

## Dashboard Features


<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/b3b86ff5-72cf-4c5b-bd72-23e36b39f960" />

### Workspace Metrics

* Total notes created
* Recently edited notes
* Public share statistics
* AI request usage analytics
* Workspace engagement tracking

### Interactive Data Visualization

* Smooth SVG-based activity charts
* Weekly editing trends
* Real-time dashboard rendering
* Lightweight chart system with zero heavy charting libraries

### Tag Intelligence

* Most-used tag cloud
* Categorization insights
* Topic clustering behavior

---

# ✍️ High-Fidelity Writing Workspace

The editor experience was designed with strong inspiration from premium SaaS products such as:

* Notion
* Linear
* Arc
* Superhuman

## Workspace Experience

### ⚡ Auto-Save Engine

* Debounced persistence system
* Background synchronization
* Seamless editing experience
* Near real-time saving workflows

### 🎨 Premium Interface System
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/4d5b2d43-0ced-41ff-957a-5958948edee0" />


* Deep-dark visual system (`#0B0D11`)
* Glassmorphism-based UI
* Soft gradients & layered depth
* Advanced micro-interactions
* Motion-driven transitions using Framer Motion

### 📱 Responsive by Design

* Mobile-first architecture
* Tablet optimization
* Large-screen scaling support
* Adaptive layouts

---

# 🔗 Public Collaboration System

Users can generate immutable public share links for notes.

## Features

* Public access without authentication
* Clean public-facing viewer
* Visibility management
* Share-safe rendering
* Optimized read-only experience

This mimics collaborative publishing systems used in modern productivity platforms.

---

# 🛠 Tech Stack

| Layer              | Technology                        |
| :----------------- | :-------------------------------- |
| **Framework**      | Next.js 15 (App Router)           |
| **Language**       | TypeScript (Strict Mode)          |
| **Styling**        | Tailwind CSS + CSS Variables      |
| **Animations**     | Framer Motion                     |
| **Database**       | PostgreSQL (Neon)                 |
| **ORM**            | Prisma ORM                        |
| **Authentication** | NextAuth.js                       |
| **AI Providers**   | Gemini 1.5 Flash + Groq Llama-3.3 |
| **Icons**          | Lucide React                      |
| **Deployment**     | Vercel                            |

---

# 🏗 System Architecture

The application follows a modular, scalable clean-architecture pattern.

---

## 📡 API Layer

### Authentication APIs

Responsible for:

* Signup
* Login
* Session validation
* Secure access handling

### Notes APIs

Responsible for:

* CRUD operations
* Search handling
* Tag filtering
* Auto-save synchronization

### AI APIs

Responsible for:

* Summaries
* Action item extraction
* AI assistant workflows
* Provider failover logic

### Insights APIs

Responsible for:

* Analytics aggregation
* Dashboard statistics
* Activity generation

---

# 📂 Folder Structure

```bash
src/
 ├── app/
 │   ├── api/             # High-performance serverless endpoints
 │   ├── dashboard/       # Productivity analytics dashboard
 │   ├── notes/           # Notes grid & workspace
 │   ├── notes/[id]/      # Neural Editor + AI assistant
 │   ├── share/[id]/      # Public note rendering
 │   └── profile/         # User account & insights
 │
 ├── components/          # Reusable UI components
 │
 ├── context/             # Global workspace state
 │
 ├── hooks/               # Custom React hooks
 │
 ├── lib/
 │   ├── ai.ts            # AI orchestration engine
 │   └── prisma.ts        # Database singleton
 │
 ├── types/               # Shared TypeScript types
 │
 └── styles/              # Design tokens & global styles
```

---

# ⚙️ Database Design

The backend uses **Prisma ORM** with a relational PostgreSQL database.

## Core Models

### User

Stores:

* Authentication data
* Session ownership
* Workspace relations

### Note

Stores:

* Rich note content
* AI-generated outputs
* Metadata
* Sharing status

### Tag

Stores:

* Categorization data
* Relationships to notes

### Activity

Stores:

* Workspace analytics
* Editing frequency
* Productivity metrics

---

# 🔐 Authentication & Security

Security was treated as a first-class engineering concern.

## Security Features

* BcryptJS password hashing
* Session-based authentication
* Protected server routes
* Environment variable isolation
* Secure API handling
* Share visibility controls

---

# 🚀 Installation & Local Development

## 1. Clone Repository

```bash
git clone https://github.com/ankit18193/peblo.git
cd peblo
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

GEMINI_API_KEY=
GROQ_API_KEY=
HUGGINGFACE_API_KEY=
```

---

## 4. Setup Prisma

```bash
npx prisma generate
npx prisma db push
```

---

## 5. Start Development Server

```bash
npm run dev
```

Application runs on:

```bash
http://localhost:3000
```

---

# ☁️ Deployment Strategy

The project is optimized for deployment on **Vercel**.

## Deployment Architecture

| Service  | Platform        |
| :------- | :-------------- |
| Frontend | Vercel          |
| Database | Neon PostgreSQL |
| AI APIs  | Gemini + Groq   |
| ORM      | Prisma          |

## Production Optimizations

* Serverless API architecture
* Optimized Prisma client generation
* Static generation for public share pages
* Lazy rendering where applicable
* Efficient route handling

---

# ⚡ Performance Engineering

Several optimizations were implemented to improve responsiveness and scalability.

## Optimizations

* Debounced auto-save workflows
* Reduced unnecessary re-renders
* Optimized state updates
* Lightweight SVG visualizations
* Efficient Prisma query usage
* Motion performance tuning

---

# 🧪 Future Enhancements

Potential roadmap expansions include:

* Real-time collaborative editing
* WebSocket synchronization
* Markdown rendering
* AI voice assistant
* Workspace teams
* Rich-text editor
* File/image uploads
* Keyboard command palette
* Notification engine
* Offline-first support
* Automated testing pipeline

---

# 📸 Sample AI Output

```json
{
  "summary": "Weekly sprint planning discussion focused on frontend architecture and API integration workflows.",
  
  "action_items": [
    "Implement dashboard analytics",
    "Integrate AI provider failover",
    "Review Prisma schema"
  ],

  "suggested_title": "Sprint Planning Notes"
}
```

---

# 🧠 Engineering Challenges Solved

During development, several complex engineering problems were addressed:

* AI provider reliability
* Response consistency across LLMs
* Stateful workspace synchronization
* Responsive dashboard scaling
* Public/private access management
* High-fidelity animation performance
* Efficient search and filtering architecture

---

# 🎯 Product Thinking

Peblo was intentionally designed to feel like a real startup-grade SaaS product rather than a traditional assignment submission.

Core goals:

* Premium UX quality
* Scalable architecture
* Intelligent AI integration
* Production-oriented engineering
* Responsive workflows
* Maintainable codebase
* Strong visual identity

---

# 👨‍💻 Author

Developed by **Antigravity AI** for the Peblo Full Stack Developer Challenge.

---

# 📄 License

This project was created for evaluation and demonstration purposes only.
