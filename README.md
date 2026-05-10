# Expense Tracker Pro

A full-stack Personal Expense Tracker web application built using the MERN stack.

## Features

- User Authentication (JWT)
- Protected Routes
- Add/Edit/Delete Transactions
- Income & Expense Tracking
- Category Management
- Search & Filters
- Date Range Filtering
- Monthly Spending Analytics
- Category-wise Expense Charts
- Responsive Modern UI

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Recharts
- Framer Motion

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JWT

---

## Installation

### Backend

```bash
cd server

npm install

npm run dev
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Environment Variables

Create a `.env` file inside the server folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

---

## API Endpoints

### Auth

- POST `/api/auth/register`
- POST `/api/auth/login`

### Transactions

- GET `/api/transactions`
- POST `/api/transactions`
- PUT `/api/transactions/:id`
- DELETE `/api/transactions/:id`

### Categories

- GET `/api/categories`
- POST `/api/categories`

---

## Author

Avik Chakraborty