# Brain-Space

## Live Link: https://brain-space-five.vercel.app/

**brain-space** is a full-stack, AI-powered document knowledge base that allows users to create dedicated workspaces, upload PDF documents, and interact with their content through a RAG (Retrieval-Augmented Generation) chat interface.

## Tech Stack

* **Framework:** [Next.js](https://nextjs.org/).
* **Language:** [TypeScript](https://www.typescriptlang.org/).
* **Styling:** [Tailwind CSS](https://tailwindcss.com/).
* **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL with `pgvector`, Auth, and Storage).
* **AI Engine:** [AI SDK](https://sdk.vercel.ai/) by Vercel with Google Gemini 2.0 Flash.
* **UI Components:** Radix UI, Shadcn UI, and Lucide Icons.
* **Animations:** Streamdown (for animated AI responses).

## Features

* **Workspace Management:** Create and organize multiple workspaces for different projects or topics.
* **PDF Processing:** Upload PDF files which are automatically parsed, chunked, and vectorized.
* **Vector Search:** Utilizes Google's `gemini-embedding-001` model and Supabase's `pgvector` for semantic document retrieval.
* **AI Chat:** A streaming chat interface that uses document context to provide accurate, grounded answers.
* **Authentication:** Secure user login and signup powered by Supabase Auth with email confirmation flows.
* **Real-time Feedback:** Integrated toast notifications using `sonner` for actions like uploads and auth events.

## Getting Started

### Prerequisites

* Node.js 18+ and pnpm.
* A Supabase account and project.
* A Google AI (Gemini) API key.

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nvk222/brain-space.git
cd brain-space

```


2. Install dependencies:
```bash
pnpm install

```


3. Set up your environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key
```


4. Run the development server:
```bash
pnpm dev

```



##  Project Structure

* `src/app`: Next.js App Router pages and API routes.
* `/api/chat`: AI streaming and vector search endpoint.
* `/dashboard`: Workspace and file management.


* `src/components`: Reusable UI components including the `ChatInterface` and `UploadButton`.
* `src/lib`: Core utility functions and Supabase client configurations.
* `src/types`: TypeScript definitions for the database schema and application logic.
