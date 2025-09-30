# Real-time Chat App

A full-stack real-time chat application with user authentication, multiple chat rooms, and persistent message history. Built with React (Vite) for the frontend and NestJS for the backend, using PostgreSQL and Prisma for data storage.

## Features
- Real-time messaging with WebSockets
- Multiple chat rooms (public and group)
- User authentication (JWT)
- Persistent message history per room
- Dockerized for easy deployment

## Project Structure
- `frontend/` — React + Vite client
- `backend/` — NestJS server with Prisma ORM

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- Docker & Docker Compose (for easy setup)
- PostgreSQL (if not using Docker)

### 1. Clone the repository
```bash
git clone https://github.com/binia01/Real-time-chat-app.git
cd Real-time-chat-app
```

### 2. Environment Variables
- Copy and configure environment files for both frontend and backend as needed (e.g., `.env`).
- Backend requires a `DATABASE_URL` for PostgreSQL.

### 3. Start with Docker Compose (Recommended)
This will start both frontend and backend, along with a PostgreSQL database.
```bash
docker-compose up --build
```
- Frontend: http://localhost:8089
- Backend API: http://backend:3003 (or as configured)

### 4. Manual Local Development
#### Backend
```bash
cd backend
npm install
npx prisma migrate dev # Set up the database
npm run start:dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### 5. Build for Production
#### Backend
```bash
cd backend
npm run build
```
#### Frontend
```bash
cd frontend
npm run build
```

## Usage
- Register a new user or log in.
- Create or join chat rooms.
- Send and receive messages in real time.

