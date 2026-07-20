# Anonymous Feedback

Anonymous Feedback is a modern Next.js app for sharing honest opinions anonymously. Users can create an account, verify their email, share a public profile link, and receive messages from others without revealing their identity.

The app also includes a dashboard where users can manage whether they accept incoming messages, view received feedback, copy their profile link, and use AI-generated message prompts to encourage thoughtful responses.

## Features

- Secure sign-up and sign-in with NextAuth credentials
- Email verification flow using Resend
- Public profile pages at /u/[username]
- Anonymous message submission to a user’s profile
- Dashboard for viewing and managing received messages
- Toggle to enable or disable message acceptance
- Copyable profile link for easy sharing
- AI-generated suggestion prompts via Groq

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui components
- NextAuth
- MongoDB with Mongoose
- Resend for email delivery
- Groq SDK for message suggestions

## Project Structure

- src/app — app routes, pages, and API endpoints
- src/components — reusable UI components
- src/context — auth context providers
- src/model — Mongoose user schema and message model
- src/lib — database and service integrations
- src/Schemas — form validation schemas
- src/emails — email templates for verification

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Create a .env.local file in the project root with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
RESEND_API_KEY=your_resend_api_key
GROQ_API_KEY=your_groq_api_key
NEXTAUTH_URL=http://localhost:3000
```

3. Run the development server

```bash
npm run dev
```

4. Open http://localhost:3000 in your browser.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Demo Notes

The landing page includes a demo notice for previewing the experience. The app currently shows example demo credentials for trying the UI:

- Email: akashsharmaf15@gmail.com
- Password: 123456

If email delivery is not configured in your environment, verification emails may not be sent successfully.

## Deployment

This project is ready to be deployed on platforms such as Vercel or any Node.js-compatible hosting service. Make sure to configure the same environment variables in your deployment environment.

## Demo

<p align="center">
  <img src="./assets/Screen Recording 2026-06-26 113717.gif" alt="Anonymous Feedback demo" width="400">
</p>
