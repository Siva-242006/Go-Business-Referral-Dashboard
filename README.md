# Go Business Referral Dashboard

A React web application for managing referral activity, tracking earnings, viewing partner details, and sharing referral links.

## Features

- Login with email and password using the provided authentication API.
- Stores the JWT token in a cookie named `jwt_token`.
- Protected dashboard and referral detail routes.
- Redirects unauthenticated users to `/login`.
- Redirects authenticated users away from `/login` to `/`.
- Dashboard overview metrics from API.
- Service summary section.
- Referral link and referral code with Copy buttons.
- Referrals table with search, date sort, and client-side pagination.
- Pagination shows 10 rows per page.
- Referral detail page loaded by referral id.
- Public 404 Not Found page.
- Logout clears the token and returns user to login.

## Routes

- `/login` - Login page
- `/` - Protected referral dashboard
- `/referral/:id` - Protected referral detail page
- `*` - Public Not Found page

## Test Credentials

```txt
Email: admin@example.com
Password: admin123
```

## Setup

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm start
```

Build for production:

```bash
npm run build
```

## Tech Used

- React
- React Router
- js-cookie
- CSS

## Project Summary

The app provides a secure referral management flow. Users sign in, view dashboard metrics, review referral performance, search and sort referral records, open individual referral details, copy referral sharing information, and log out securely.
