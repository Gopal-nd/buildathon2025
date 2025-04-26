
## Getting Started


First run the Docker compose to start the services locally
```bash
docker-compose up
```

First, run the development server:

```bash
bun dev
```

Generate the Prisma client:

```bash
bunx prisma generate
bunx prisma db push
```


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To Access the RAG , make the samll changes in  the `app/dashboard/layout.tsx`

move to the `http://localhost:3000/dashboard/soil`

# 🚀 Buildathon 2025 Project

Welcome to the official repository for the **Buildathon 2025** project! This application leverages modern tools, AI capabilities, and powerful UI/UX libraries to deliver an innovative solution.

---

## 🧱 Tech Stack

This project leverages a modern full-stack web development setup with powerful tools and libraries for AI integration, UI components, database management, and more.

### ⚙️ Core Frameworks & Libraries

- **Next.js 15** – React-based framework for server-side rendering and full-stack features.
- **React 19** – Component-based UI library.
- **TypeScript** – Static typing for scalable and maintainable code.

### 🎨 Styling & UI

- **Tailwind CSS 4** – Utility-first CSS framework.
- **Radix UI** – Accessible, unstyled component primitives:
  - Dialog, Dropdown Menu, Accordion, Select, etc.
- **lucide-react** – Beautiful, consistent open-source icons.
- **sonner** – Stylish toast notifications.
- **tw-animate-css** – Tailwind-compatible animations.

### 📦 Form & Validation

- **react-hook-form** – Performant form management.
- **zod** – Type-safe schema validation.
- **@hookform/resolvers** – Integrates Zod with React Hook Form.

### 🧠 AI & ML

- **@google/generative-ai** & **@google/genai** – Google’s Generative AI SDKs.
- **@langchain/community** & **@langchain/qdrant** – LangChain integration for LLM-powered apps.

### 📂 File & PDF Handling

- **uploadthing** – Simplified file uploads.
- **pdf-parse** – Parse and extract text from PDF files.

### 🔍 Data Fetching & State Management

- **@tanstack/react-query** – Server state management and caching.
- **axios** – Promise-based HTTP client.

### 🧩 Utils

- **clsx** & **class-variance-authority** – Conditional and variant-based class handling.
- **use-debounce** – Debounce hook for controlled performance.

### 🧵 Backend & Database

- **Prisma** – Type-safe ORM for PostgreSQL and more.
store.
- **Qdrant** – Vector database for semantic search and embeddings.
- **better-auth** – Lightweight auth wrapper.

### 🧪 Dev Tools

- **ESLint** – Code linting and style enforcement.
- **TypeScript** – Static typing and developer tooling.
- **Tailwind Merge** – Resolves conflicting Tailwind classes.

---

