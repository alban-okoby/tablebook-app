# Book Recommendation App

A community platform for discovering and sharing book recommendations.

---

## Tech Stack

| Layer      | Technology         |
|------------|--------------------|
| Runtime    | Node.js v18+       |
| Framework  | Express.js, React (Frontend)         |
| Database   | MongoDB + Mongoose |
| Auth       | JWT (jsonwebtoken) |
| Security   | Helmet, bcryptjs, express-rate-limit |

---

## Project Structure

```
book-recommendation-app/
├── config/
│   ├── database.js         # MongoDB connection setup
│   └── seeder.js           # Sample data seeder
├── middleware/
│   └── auth.js             # JWT auth middleware
├── models/
│   ├── User.js             # User schema
│   ├── Book.js             # Book + Review schemas
│   └── Recommendation.js   # Recommendation schema
├── routes/                 # API route handlers (next step)
├── public/                 # Frontend assets (next step)
├── .env.example            # Environment variable template
├── server.js               # Express app entry point
└── package.json
```

---

## Setup Instructions

### 1. Prerequisites
- Node.js v18 or higher
- MongoDB (local or Atlas)

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 4. Seed the Database (optional)
```bash
node config/seeder.js
# To clear: node config/seeder.js --clear
```

### 5. Start the Server
```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000/api`

---

## Database Schemas

### User
- Authentication (email, password — bcrypt hashed)
- Profile (username, bio, avatar, favorite genres)
- Social graph (following/followers)
- Reading lists (books read, wishlist)

### Book
- Full metadata (title, authors, ISBN, description, genres, publisher)
- Embedded reviews with ratings
- Aggregated rating statistics (average, count, distribution)
- Full-text search indexes on title, authors, description, tags

### Recommendation
- Book reference + sender + optional recipient
- Message, reason tags, visibility (public/followers/private)
- Likes and comments

---

## Some API Endpoints

| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| POST   | /api/auth/register          | Register new user        |
| POST   | /api/auth/login             | Login & get JWT          |
| GET    | /api/books                  | Search/list books        |
| POST   | /api/books                  | Add a new book           |
| GET    | /api/books/:id              | Get book details         |
| POST   | /api/books/:id/reviews      | Add a review             |
| GET    | /api/recommendations/feed   | Get personalized feed    |
| POST   | /api/recommendations        | Create recommendation    |
| GET    | /api/users/:username        | View user profile        |
| POST   | /api/users/:id/follow       | Follow a user            |
