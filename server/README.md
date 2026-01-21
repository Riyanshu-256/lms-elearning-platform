# Server — LMS API (Express + MongoDB)

This folder implements the backend API for LMS-PROJECT. It provides course management, educator workflows, user profile & enrollments, Stripe-based purchases, webhook handlers, and Cloudinary file uploads.

The server emphasizes clear layering: routes → controllers → models, with middleware handling auth and validation.

## What this server does

- Manage courses (create, list, fetch details)
- Allow educators to add courses (thumbnail upload + course JSON payload)
- Handle Stripe Checkout sessions and webhook-driven enrollment confirmation
- Persist user profiles synced from Clerk via webhooks
- Track per-user course progress and allow marking lectures complete
- Provide educator analytics (earnings, enrollments)

## Quick Start

1. Install dependencies

```bash
cd server
npm install
```

2. Create `.env` (see required variables below)

3. Run in dev

```bash
npm run dev
```

Server listens on `PORT` (default 5000). Health endpoint: `GET /` returns "API Working".

## Environment Variables

Create a `.env` (do NOT commit) with at least:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLERK_WEBHOOK_SECRET=svix_...
CLERK_SECRET_KEY=clerk_secret_key_used_for_token_verification
```

- `STRIPE_WEBHOOK_SECRET` and `CLERK_WEBHOOK_SECRET` are used to verify incoming raw webhook payloads.
- `CLERK_SECRET_KEY` is used by `authMiddleware` to verify the `Authorization: Bearer <token>` header for protected educator endpoints.

## Important Endpoints (summary)

- Public course listing
  - `GET /api/course/all` — returns published courses (no content fields)
  - `GET /api/course/:id` — full course details (lecture URLs are hidden if not preview)

- User routes (require Clerk authentication via middleware)
  - `GET /api/user/profile` — returns user record
  - `GET /api/user/courses` — enrolled courses
  - `POST /api/user/purchase` — create Stripe checkout session (body: `{ courseId }`)
  - `POST /api/user/confirm-purchase` — confirm purchase (body: `{ sessionId }`)
  - `POST /api/user/update-course-progress` — mark lecture complete (body: `{ courseId, lectureId }`)
  - `POST /api/user/get-course-progress` — get user progress (body: `{ courseId }`)
  - `POST /api/user/add-rating` — add rating for enrolled course
  - `GET /api/user/course-status/:courseId` — check enrollment & rating status

- Educator routes (require educator protection middleware and `Authorization` header)
  - `POST /api/educator/update-role` — set user as educator
  - `POST /api/educator/add-course` — multipart form upload; expects `image` (file) and `courseData` (JSON string)
  - `GET /api/educator/courses` — list educator's courses
  - `GET /api/educator/dashboard` — earnings and enrollment overview
  - `GET /api/educator/enrolled-students` — list enrolled students across educator courses

- Webhooks (must be raw body)
  - `POST /stripe` — Stripe webhook handler (configured to use `express.raw`) — used to mark purchases completed/failed
  - `POST /clerk` — Clerk webhook handler (Svix) to sync user creation/updates/deletes

## Uploads

- Image uploads for course thumbnails are handled by `multer` (temporary disk storage) and uploaded to Cloudinary. Multer validates file type and size (5 MB limit).

## Auth & Security Notes

- Clerk is used for user authentication and session management. The `clerkMiddleware()` is mounted globally in `server.js`.
- `protectEducator` middleware verifies the JWT via Clerk (`CLERK_SECRET_KEY`) and ensures educator-only routes are guarded.
- Webhook endpoints use raw request bodies and header verification (Stripe and Svix/Clerk). Do not add `express.json()` before webhook routes — they are intentionally mounted with `express.raw()`.

## Data Models (high level)

- `User` — Clerk `userId` as `_id`, name, email, imageUrl, and enrolledCourses (refs)
- `Course` — metadata, `courseContent` (chapters → lectures), `courseThumbnail`, `discount`, `isPublished`, `courseRatings`, `educator`, `enrolledStudents`
- `Purchase` — userId, courseId, amount, status (`pending`/`completed`/`failed`), Stripe `sessionId`
- `CourseProgress` — per-user per-course lectureCompleted array, and `completed` flag

## Local Testing Tips

- Use Stripe test keys and configure `STRIPE_WEBHOOK_SECRET` after creating a webhook endpoint (e.g., via Stripe CLI) that points to `http://localhost:5000/stripe`.
- Use a Clerk dev application for auth; update `CLERK_WEBHOOK_SECRET` and `CLERK_SECRET_KEY` accordingly.

## Run

```bash
npm install
npm run dev    # nodemon server.js
npm start      # node server.js
```

## Deployment notes

- Ensure env vars are set in the hosting environment (Vercel serverless functions, Render, Heroku, or a VM).
- For webhooks in production, use HTTPS endpoints and register webhook URLs with Stripe and Clerk (Svix). Use the production webhook secrets provided by those services.

## Next Actions (optional)

- Add `server/.env.example` and `client/.env.example` with non-sensitive variable names.
- Add a Postman collection or OpenAPI spec for these endpoints.
- Add CI checks to lint and run a minimal integration test for the checkout flow.
