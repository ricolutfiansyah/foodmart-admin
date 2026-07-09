# FoodMart Admin

Admin panel untuk platform e-commerce FoodMart.
Dibangun dengan React + Vite + TypeScript.

## Tech Stack

- **React + Vite** — build tool & framework
- **TypeScript** — static typing
- **React Router v6** — routing
- **TanStack Query v5** — server state & data fetching
- **Zustand** — client state management (auth)
- **Axios** — HTTP client + interceptor
- **shadcn/ui + Tailwind CSS** — UI components & styling
- **React Hook Form + Zod** — form handling & validasi

## Requirements

- Node.js 18+
- Backend [foodmart-api](https://github.com/ricolutfiansyah/foodmart-api) running

## Getting Started

\`\`\`bash

# Clone repo

git clone https://github.com/ricolutfiansyah/foodmart-admin.git
cd foodmart-admin

# Install dependencies

npm install

# Setup environment variables

cp .env.example .env

# Edit .env sesuai kebutuhan

# Run development server

npm run dev
\`\`\`

## Environment Variables

| Variable     | Description          | Example               |
| ------------ | -------------------- | --------------------- |
| VITE_API_URL | Base URL backend API | http://localhost:3000 |

## Available Scripts

\`\`\`bash
npm run dev # development server
npm run build # production build
npm run preview # preview production build
npm run lint # lint check
\`\`\`

## Project Structure

src/
├── api/ # axios instance + fungsi API call
├── components/ # komponen reusable
├── hooks/ # custom hooks
├── layouts/ # AdminLayout, AuthLayout
├── pages/ # halaman per domain
├── router/ # konfigurasi routes
├── stores/ # Zustand stores
└── types/ # TypeScript types

## Related Repositories

- [foodmart-api](https://github.com/ricolutfiansyah/foodmart-api) — Backend REST API
- foodmart-mobile — React Native app (coming soon)
