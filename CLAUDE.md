# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development
```bash
# Install dependencies
pnpm install

# Run development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Format code with Prettier
pnpm format

# Update dependencies
pnpm up:patch   # Patch updates only
pnpm up:minor   # Minor updates
pnpm up:semver  # Semver-compatible updates
pnpm up:latest  # Latest versions
```

### Environment Setup
Create a `.env.local` file with:
```
# OpenAI API key for chat functionality
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## High-Level Architecture

This is an [assistant-ui](https://github.com/Yonom/assistant-ui) starter project using Next.js 15 with App Router.

### Core Architecture Patterns

1. **Next.js App Router**: All pages and routes are in the `/app` directory
2. **API Route**: Chat functionality is handled by `/app/api/chat/route.ts` using Vercel AI SDK with OpenAI
3. **Assistant UI Integration**: The main assistant component (`/app/assistant.tsx`) uses:
   - `AssistantRuntimeProvider` for runtime context
   - `useChatRuntime` hook with AI SDK integration
   - Stream-based responses for real-time chat
4. **Authentication**: Clerk authentication integrated with:
   - `clerkMiddleware()` in `/middleware.ts` for protecting routes
   - `<ClerkProvider>` wrapping the app in `/app/layout.tsx`
   - Auth UI components (SignIn/SignUp/UserButton) in the header

### Component Structure

- **UI Components** (`/components/ui/`): Shadcn/ui components built on Radix UI primitives
- **Assistant Components** (`/components/assistant-ui/`):
  - `thread.tsx`: Main chat interface
  - `thread-list.tsx`: Thread management
  - `markdown-text.tsx`: Markdown rendering with syntax highlighting
  - `tool-fallback.tsx`: Tool call fallback UI

### Key Technical Patterns

1. **Styling**: Tailwind CSS v4 with OKLCH color space, component classes merged with `cn()` utility
2. **State Management**: Runtime state via assistant-ui providers, no external state libraries
3. **Component Patterns**: Compound components (`.Root`, `.Content`, `.Trigger`), conditional rendering with `.If`
4. **TypeScript**: Strict mode enabled with path aliases (`@/` for root imports)

### Important Files for Understanding the Codebase

- `/app/assistant.tsx`: Main assistant setup and runtime configuration
- `/app/api/chat/route.ts`: Chat API endpoint with AI SDK integration
- `/components/assistant-ui/thread.tsx`: Core chat UI implementation
- `/components/app-header.tsx`: Extracted header component with navigation and auth
- `/components/app-sidebar.tsx`: Sidebar component for navigation
- `/app/layout.tsx`: Root layout with ClerkProvider and auth components
- `/middleware.ts`: Clerk middleware for route protection