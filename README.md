# 🏦 Chama Hub — Super Admin Dashboard

A centralized Chama management platform built with **Next.js**, **Supabase**, and **Tailwind CSS**. The super admin has full visibility and control over all registered chamas, with a secure and automated onboarding flow for admins and members.

---

## 🌐 Live Demo

🔗 [Live URL](https://chama-superadmin.vercel.app/) 

---

## ✨ Features

- 🏗️ **Super Admin Controls** — Create chamas and assign admins directly from the dashboard
- 📧 **Automated Credential Delivery** — Admins and members receive login credentials via email upon being added
- 🔐 **Role-Based Access Control** — Super admins, chama admins, and members each have scoped permissions
- 👥 **Member Management** — Add members, assign roles, and manage profiles
- 💰 **Contributions & Payments Tracking** — Monitor financial activity per chama in real time
- 🏦 **Loan Management** — Track loan requests, approvals, and repayments
- 📅 **Meetings & Announcements** — Schedule meetings and broadcast announcements to members
- 🔑 **First-Login Credential Update** — Admins and members can update their credentials after first login

---

## 🧪 Test Credentials

Use the credentials below to explore the dashboard:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `owinogabrieel@gmail.com` | `takemeback` |

---

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| [Next.js](https://nextjs.org) | Frontend framework (App Router) |
| [Supabase](https://supabase.com) | Database, authentication & real-time |
| [Tailwind CSS](https://tailwindcss.com) | Styling & responsive design |
| [TypeScript](https://www.typescriptlang.org) | Type safety |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project set up

### Installation

```bash
# Clone the repository
git clone [https://github.com](https://github.com/owinogabriel/chama-hub.git).  # Replace with your GitHub URL
cd chama-hub

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
chama-hub/
├── app/                  # Next.js App Router pages
├── components/           # Reusable UI components
├── lib/                  # Supabase client & utilities
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

---

## 📦 Deployment

This project is deployed on **Vercel**. To deploy your own:

1. Push your code to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. Deploy 🚀

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
