# LMS Backend

Production-grade backend for a Learning Management System (Node.js, Express, MongoDB) with authentication/authorization, course lifecycle, media uploads (Multer + Cloudinary), purchases/enrollments, progress tracking, and payment webhooks.

## Scope
- Authentication with JWT + hashed passwords.
- Role-based access: student / educator / admin.
- Course CRUD with media.
- Purchase + enrollment flow.
- Progress tracking.
- Payment webhooks.

## Architecture
- Request path: Route → Middleware → Controller → Model (Mongoose) → MongoDB → Response.
- Layered design isolates transport, policy, business logic, and persistence for safer change and scaling.

## Folder Structure
```
server/
├── configs/
│   ├── cloudinary.js      # Cloudinary SDK init; central media config.
│   ├── mongodb.js         # Mongoose connection lifecycle and options.
│   └── multer.js          # Upload strategy, limits, and type filters.
├── controllers/
│   ├── courseController.js   # Course CRUD, ownership, publish rules, media attach.
│   ├── educatorController.js # Educator flows: catalog, earnings, publishing controls.
│   ├── userController.js     # Auth, profiles, roles, enrollment retrieval.
│   └── webhooks.js           # Payment webhook ingest/verify; idempotent updates.
├── middlewares/
│   └── authMiddleware.js     # JWT verify, role checks, user context injection.
├── models/
│   ├── Course.js             # Course schema: metadata, pricing, media refs, ownership.
│   ├── CourseProgress.js     # Per-user progress; incremental updates.
│   ├── Purchase.js           # Orders/enrollments linking users, courses, payment state.
│   └── User.js               # Users with roles, credentials, security fields.
├── routes/
│   ├── courseRoute.js        # Course domain routes with per-op middleware.
│   ├── educatorRoutes.js     # Educator-only endpoints, RBAC-scoped.
│   └── userRoutes.js         # Auth/public user routes: register/login/profile.
├── node_modules/             # Installed deps (not committed).
├── .env                      # Environment config (never commit secrets).
```

## API & Routing
- RESTful, domain-based routers; public vs protected split.
- Versioning-ready: mount under `/api/v1` to evolve without breaking clients.

## Auth & Security
- JWT: login → signed token → `Authorization: Bearer <token>`; middleware verifies signature/expiry and sets user context.
- Passwords hashed (e.g., bcrypt); never stored/logged in plaintext.
- Protected routes enforce role checks via middleware, not in controllers.
- Secrets from `.env`; no hardcoding.
- Upload safety: Multer size/type limits; Cloudinary handles storage/delivery.

## Environment Variables
```
PORT=5000
MONGO_URI=your_db_uri
JWT_SECRET=your_secret
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```
Isolate per environment; keep out of VCS; rotate safely across dev/stage/prod.

## Run
```bash
npm install
npm run dev   # development
npm start     # production
```

## Production Notes
- Thin routes, controller-separated logic, centralized config.
- Validation-first APIs; secure defaults (HTTPS/CORS/timeouts).
- Observability-ready: structured logs, request IDs (add before go-live).

## Future Enhancements
- Deeper RBAC/ABAC.
- Rate limiting and bot protection.
- Structured logging, metrics/tracing, alerting.
- Redis caching for catalog and token blacklisting.
- CI/CD with tests, lint, security scans.
- Queue/microservice readiness for media and billing.

## Credits
Learning inspiration: Akshay Saini – Namaste Node.js (reference only; not ownership).
