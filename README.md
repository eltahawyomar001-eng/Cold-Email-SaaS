# ColdReach - Cold Email SaaS Platform

A modern, full-featured cold email outreach platform built with Next.js 14, featuring an Instantly.ai-inspired UI design with glassmorphism, Apple-style rounded buttons, and premium aesthetics.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

## Features

### Core Functionality
- **Email Account Management** - Connect unlimited Gmail, Outlook, or custom SMTP accounts
- **Smart Warm-up System** - Automated email warming with gradual volume increase
- **Unified Inbox** - Master inbox for all replies across accounts
- **Campaign Management** - Multi-step email sequences with personalization
- **Real-time Analytics** - Track opens, clicks, replies, and conversions
- **Lead Management** - Import, segment, and manage your prospects
- **Subscription Billing** - Stripe-integrated billing with multiple tiers
- **Team Collaboration** - Workspace-based multi-tenant architecture

### Technical Highlights
- **Modern Stack**: Next.js 14 App Router, TypeScript, Prisma, PostgreSQL
- **Authentication**: NextAuth.js with credentials provider
- **UI/UX**: Tailwind CSS with custom glassmorphism components
- **Background Jobs**: Built-in job runner for scheduled tasks
- **RBAC**: Role-based access control (Owner, Admin, Member)

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/eltahawyomar001-eng/Cold-Email-SaaS.git
   cd Cold-Email-SaaS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/coldreach"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Credentials
- **Email**: `demo@example.com`
- **Password**: `password123`

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, register)
│   ├── app/               # Main application pages
│   │   ├── billing/       # Subscription management
│   │   ├── campaigns/     # Campaign management
│   │   ├── email-accounts/# Email account settings
│   │   ├── inbox/         # Unified inbox
│   │   ├── leads/         # Lead management
│   │   ├── stats/         # Analytics dashboard
│   │   ├── team/          # Team management
│   │   └── warmup/        # Email warm-up
│   └── api/               # API routes
├── components/            # React components
│   ├── layout/            # Layout components (Sidebar, Header)
│   └── ui/                # Reusable UI components
├── lib/                   # Utilities and configurations
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Prisma client
│   └── utils.ts          # Helper functions
└── server/               # Server-side logic
    ├── rbac/             # Role-based access control
    └── simulation/       # Demo data simulation
```

## Design System

The UI follows Instantly.ai's modern design language:

- **Glassmorphism**: Backdrop blur with semi-transparent cards
- **Pill-shaped buttons**: Apple-style rounded corners
- **Gradient accents**: Blue-to-violet gradient text and backgrounds
- **Soft shadows**: Layered drop shadows for depth
- **Clean typography**: Inter font family

## Authentication

The app uses NextAuth.js with a credentials provider:
- Secure password hashing with bcrypt
- Session-based authentication
- Protected routes with middleware

## Database Schema

Key models include:
- **User** - User accounts with email/password
- **Workspace** - Multi-tenant workspaces
- **EmailAccount** - Connected email accounts
- **Campaign** - Email campaign configurations
- **Lead** - Prospect/contact records
- **EmailThread** - Inbox message threads

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 14 | React framework with App Router |
| TypeScript | Type-safe development |
| Prisma | Database ORM |
| PostgreSQL | Primary database |
| NextAuth.js | Authentication |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| date-fns | Date formatting |

## Roadmap

- [ ] Google OAuth integration
- [ ] Microsoft OAuth integration  
- [ ] Real email sending (Nodemailer/Resend)
- [ ] A/B testing for campaigns
- [ ] AI-powered email generation
- [ ] Advanced analytics dashboard
- [ ] Zapier/webhook integrations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

---

Built with Next.js and modern web technologies.
