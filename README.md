# Northstar auth dashboard

A small full-stack starter with a Next.js frontend and a separate Express API backed by MongoDB.

## Requirements

- Node.js 18 or newer
- MongoDB running locally, or a MongoDB Atlas connection string

## Run locally

1. Copy `backend/.env.example` to `backend/.env`. Set `MONGODB_URI` and replace `JWT_SECRET` with a long random value.
2. Copy `frontend/.env.example` to `frontend/.env.local` if the API is not at `http://localhost:5000/api`.
3. In `backend`, run `npm install` and then `npm run dev`.
4. In `frontend`, run `npm install` and then `npm run dev`.
5. Open `http://localhost:3000`.

## API

- `POST /api/auth/register` — create an account (`name`, `email`, `password`)
- `POST /api/auth/login` — sign in (`email`, `password`)
- `GET /api/auth/me` — get the current account (Bearer token required)
- `GET /api/health` — service health check

## Run unit tests

- Backend API tests: `cd backend`, `npm install`, then `npm test`.
- Frontend auth page tests: `cd frontend`, `npm install`, then `npm test`.

The backend tests mock the user model and cover registration validation, duplicate accounts, login, and protected profile access. Frontend tests mock API responses and cover successful login, login errors, and registration.

Passwords are hashed with bcrypt before storage. The API issues signed JWTs, and the dashboard loads the current profile from the protected endpoint. Set `CLIENT_ORIGIN` to the deployed frontend origin when hosting the API elsewhere.
