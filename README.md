# Wanderlast Client

A travel discovery and booking frontend built with the Next.js App Router. Wanderlast lets people browse destinations, sign in with email/password or Google, add and manage destinations, and book trips. Authentication is handled by Better Auth with MongoDB, and every protected server action forwards the signed-in user's JWT to the Wanderlast API.

## Overview

This repository contains only the client application. Destination and booking data live in a separate API server configured through `SERVER_URL` (for example `https://wanderlast-client-psi.vercel.app` in development). Server actions run on the Next.js server, verify the Better Auth session, obtain a JWT, and call the API with an `Authorization: Bearer <token>` header.

## Features

- **Destination catalog** — grid of destinations with image, category, price, departure time and description.
- **Destination details** — full detail page with price, departure, category and country.
- **Create, edit and delete destinations** — modal form for editing and confirmation dialogs for deletion.
- **Trip booking** — book a destination from its detail page; the signed-in user's id, name and email are attached server-side.
- **Booking list** — view and delete the current user's bookings.
- **Authentication** — email/password plus Google OAuth via Better Auth.
- **JWT-protected API calls** — server actions attach a Better Auth JWT to backend requests.
- **Route protection** — private pages redirect to `/sign-in` with a `next` parameter.
- **Responsive UI** — Tailwind CSS 4, shadcn/ui components, Lucide icons and Motion animations.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js  |
| UI | React  |
| Styling | Tailwind CSS, shadcn/ui (New York style) |
| Animation | Motion (`motion/react`) |
| Icons | Lucide React |
| Auth | Better Auth  |
| Auth storage | MongoDB via `@better-auth/mongo-adapter` |
| Database  | MongoDB  |


## Routes

| Route | Description | Protected |
| --- | --- | --- |
| `/` | Landing page with hero and calls to action | No |
| `/destinations` | Destination catalog | No |
| `/destinations/[id]` | Destination details, booking, edit and delete | Yes |
| `/add-destination` | Create a destination | Yes |
| `/bookings` | Current user's bookings | Yes (shows sign-in prompt) |
| `/sign-in` | Email/password and Google sign-in | No |
| `/sign-up` | Account registration | No |
| `/login` | Redirects to `/sign-in` | No |
| `/signup` | Redirects to `/sign-up` | No |
| `/api/auth/[...all]` | Better Auth handler (GET/POST) | — |

Route protection is implemented in `src/proxy.js` using Next.js 16's `proxy` convention. It validates the session with Better Auth before rendering `/destinations/:id` and `/add-destination`, then redirects unauthenticated visitors to `/sign-in?next=<path>`.



## Project Structure

```
.
├── src
│   ├── app
│   │   ├── add-destination/page.jsx
│   │   ├── api/auth/[...all]/route.js   # Better Auth handler
│   │   ├── bookings/page.jsx
│   │   ├── destinations
│   │   │   ├── [id]/page.jsx
│   │   │   └── page.jsx
│   │   ├── login/page.jsx               # redirects to /sign-in
│   │   ├── sign-in/page.jsx
│   │   ├── sign-up/page.jsx
│   │   ├── signup/page.jsx              # redirects to /sign-up
│   │   ├── globals.css
│   │   ├── layout.jsx
│   │   └── page.jsx
│   ├── components                        # UI, forms, cards, dialogs, navbar, footer
│   │   └── ui/button.jsx                 # shadcn/ui button
│   ├── lib
│   │   ├── auth.js                      # Better Auth server config
│   │   ├── auth-client.js               # Better Auth React client
│   │   ├── auth-token.js                # JWT helper for server actions
│   │   ├── categories.js                # destination category list
│   │   ├── format.js                    # price/date formatting
│   │   └── utils.js                     # cn() helper
│   ├── proxy.js                         # route protection (Next.js proxy)
│   └── server-action
│       ├── booking-action
│       ├── destination-action
│       └── request.js
├── components.json                      # shadcn/ui configuration
├── jsconfig.json                        # @/* path alias
├── next.config.mjs                      # React Compiler + Turbopack CSS loader
└── package.json
```

