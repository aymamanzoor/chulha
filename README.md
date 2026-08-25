# Chulha — Full-Stack Cooking Community Platform 🍳

A complete full-stack food & recipe community platform built with **React (JSX)**, **Tailwind CSS**, **Vite**, **Node.js**, **Express.js**, **PostgreSQL**, and **Sequelize ORM**.

---

## 🏗️ Architecture

- **Frontend**: React 19 (JSX), Tailwind CSS v4, TanStack Router (Client Routing), Lucide Icons, Recharts.
- **Backend API**: Node.js, Express.js, JWT Authentication, Multer (Image uploads), CORS.
- **Database & ORM**: PostgreSQL with **Sequelize ORM** (Models, Relations, Migrations, and Auto-Seeder).

---

## 📦 Project Structure

```
chulha-react-tailwind/
├── .env                       # Environment variables (Database URL, JWT Secret, Port)
├── package.json               # Fullstack scripts & dependencies
├── vite.config.js             # Vite + Tailwind + Proxy setup
├── server/                    # 🚀 Express + Sequelize Backend
│   ├── config/
│   │   └── database.js        # Sequelize PostgreSQL connection
│   ├── models/                # 🗄️ Sequelize ORM Models
│   │   ├── User.js            # Users with bcrypt password hashing
│   │   ├── Cuisine.js         # World cuisines
│   │   ├── Recipe.js          # Recipes with ingredients/steps JSON
│   │   ├── Post.js            # Community feed posts
│   │   ├── Comment.js         # Threaded comments & replies
│   │   ├── Follow.js          # Follower relationships
│   │   ├── Like.js            # Likes on recipes/posts/comments
│   │   ├── SavedItem.js       # Bookmarks & collections
│   │   ├── Notification.js    # Activity alerts
│   │   ├── Report.js          # Moderation reports
│   │   ├── Setting.js         # Admin settings
│   │   └── index.js           # Model associations setup
│   ├── controllers/           # REST API Business Logic
│   │   ├── auth.controller.js
│   │   ├── recipes.controller.js
│   │   ├── posts.controller.js
│   │   ├── comments.controller.js
│   │   ├── cuisines.controller.js
│   │   ├── users.controller.js
│   │   ├── notifications.controller.js
│   │   └── admin.controller.js
│   ├── middleware/
│   │   ├── auth.js            # JWT verification & Admin guards
│   │   ├── upload.js          # Multer disk storage for photos
│   │   └── errorHandler.js    # Global error handler
│   ├── routes/                # API Endpoints
│   ├── seeders/
│   │   └── seed.js            # Automated DB Initializer & Seeder
│   ├── uploads/               # Stored uploaded images
│   └── index.js               # Express application entry
└── src/                       # 🎨 React JSX Frontend
    ├── components/            # Chulha & UI components
    ├── context/               # AuthContext
    ├── lib/                   # API client (src/lib/api.js) & Mock data
    ├── routes/                # TanStack file-based routes
    └── main.jsx               # React entry point
```

---

## ⚡ Quick Start Guide

### 1. Database Configuration (.env)

Open or edit the [`.env`](file:///c:/Users/MECHREVO/Downloads/chulha-react-tailwind%20%281%29/.env) file:

```env
PORT=5000
NODE_ENV=development

# PostgreSQL Connection (replace with your postgres username & password):
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/chulha_db

JWT_SECRET=chulha_jwt_super_secret_key_2026
```

> **Note**: Create the database `chulha_db` in your PostgreSQL (via pgAdmin, psql, or terminal: `CREATE DATABASE chulha_db;`).

### 2. Seed Database (Optional / Recommended)

To automatically create all tables and populate initial users, recipes, posts, comments, and cuisines:

```bash
npm run db:seed
```

### 3. Run Both Frontend & Backend Together

```bash
npm run dev:all
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📡 Available API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/register` | `POST` | Register a new user |
| `/api/auth/login` | `POST` | Login & receive JWT token |
| `/api/auth/me` | `GET` | Get authenticated user info |
| `/api/recipes` | `GET` | List recipes with filters (`?query=`, `?cuisine=`, `?difficulty=`, `?maxTime=`) |
| `/api/recipes/:slug` | `GET` | Get recipe detail by slug |
| `/api/recipes` | `POST` | Create a recipe (multipart/form-data) |
| `/api/recipes/:id/like` | `POST` | Toggle like on recipe |
| `/api/recipes/:id/save` | `POST` | Toggle bookmark on recipe |
| `/api/posts` | `GET` | Get community feed posts |
| `/api/posts` | `POST` | Create a new post |
| `/api/posts/:id/like` | `POST` | Like/unlike a post |
| `/api/comments` | `GET` | Get comments for recipe/post (nested replies) |
| `/api/comments` | `POST` | Add comment or reply |
| `/api/cuisines` | `GET` | List all cuisines |
| `/api/users/profile/:username` | `GET` | User profile with posts, recipes & bookmarks |
| `/api/users/:id/follow` | `POST` | Follow/unfollow user |
| `/api/notifications` | `GET` | User alerts feed |
| `/api/admin/stats` | `GET` | Analytics & growth metrics for admin |
| `/api/upload` | `POST` | Upload dish/recipe image |
