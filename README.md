# 🚗 DriveEase — Car Rental Platform for India

A **production-ready, full-stack MERN** car rental platform built for the Indian market. Features a beautiful user panel for browsing and booking cars, and a comprehensive admin dashboard for fleet management — all with **Razorpay payments**, **Cloudinary image uploads**, **JWT authentication**, and **Indian city/car localization**.

![Tech Stack](https://img.shields.io/badge/React-18-blue?logo=react) ![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)

---

## ✨ Features

### User Panel
- 🏠 Stunning homepage with city & category browsing
- 🔍 Advanced car search with filters (city, category, fuel, price, transmission)
- 📅 Real-time availability checking with date pickers
- 💳 Razorpay payment integration (INR, test mode ready)
- 📋 Booking history with status tracking
- 👤 User profile management
- 📱 Fully responsive (mobile-first design)

### Admin Panel
- 📊 Dashboard with revenue analytics, monthly charts, booking breakdown
- 🚙 Full car CRUD (add, edit, delete) with Cloudinary image upload
- 📑 Booking management (confirm, complete, cancel)
- 👥 User management (view, block/unblock)
- 🔎 Search & filter across all tables

### Security & Performance
- 🔐 JWT access + refresh token authentication
- 🛡️ Helmet, CORS, rate limiting
- ✅ Server-side validation (express-validator)
- 🔑 Role-based access control (User / Admin)
- 🍪 HttpOnly cookies for refresh tokens
- ⚡ MongoDB compound indexes for fast queries

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Redux Toolkit, React Router v6 |
| **Styling** | Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | JWT (access + refresh tokens), bcryptjs |
| **Payments** | Razorpay |
| **Images** | Cloudinary + multer |
| **Email** | Nodemailer (Gmail SMTP) |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
car/
├── backend/
│   ├── config/          # DB & Cloudinary config
│   ├── controllers/     # Auth, Car, Booking, Payment, Admin
│   ├── middleware/       # Auth, validation, error handler, upload
│   ├── models/          # User, Car, Booking (Mongoose)
│   ├── routes/          # All API routes
│   ├── seed/            # Database seeder (25+ Indian cars)
│   ├── services/        # Email service with HTML templates
│   ├── utils/           # JWT helpers, formatters
│   └── server.js        # Express server entry
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/         # Axios instance with interceptors
    │   ├── components/  # Common + User components
    │   ├── layouts/     # UserLayout, AdminLayout
    │   ├── pages/
    │   │   ├── user/    # Home, Cars, CarDetail, Bookings, etc.
    │   │   └── admin/   # Dashboard, ManageCars, ManageBookings, etc.
    │   ├── store/       # Redux store + slices
    │   └── utils/       # Frontend helpers
    └── vercel.json      # SPA rewrite config
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **MongoDB Atlas** account (free tier works)
- **Cloudinary** account (free tier works)
- **Razorpay** account (test mode)

### 1. Clone & Install

```bash
# Backend
cd backend
cp .env.example .env
npm install

# Frontend
cd ../frontend
cp .env.example .env
npm install
```

### 2. Configure Environment Variables

**Backend `.env`:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/driveease?retryWrites=true&w=majority

JWT_ACCESS_SECRET=your_access_token_secret_here_min_32_chars
JWT_REFRESH_SECRET=your_refresh_token_secret_here_min_32_chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password

CLIENT_URL=http://localhost:5173

# Seed Script (optional)
ADMIN_EMAIL=admin@driveease.in
ADMIN_PASSWORD=Admin@123456
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

### 3. Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- **Admin**: admin@driveease.in / `Admin@123456`
- **Demo User**: rahul@example.com / `User@123456`
- **25+ Cars** across 9 Indian cities (Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Pune, Kolkata, Jaipur, Ahmedabad)

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/update-profile` | Update profile |

### Cars
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cars` | List cars (with filters) |
| GET | `/api/cars/:id` | Car details |
| POST | `/api/cars/:id/check-availability` | Check availability |

### Bookings (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/my-bookings` | User's bookings |
| GET | `/api/bookings/:id` | Booking details |
| PUT | `/api/bookings/:id/cancel` | Cancel booking |

### Payments (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create-order` | Create Razorpay order |
| POST | `/api/payments/verify` | Verify payment |
| GET | `/api/payments/key` | Get Razorpay key |

### Admin (Admin Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET | `/api/admin/cars` | All cars |
| POST | `/api/admin/cars` | Add car |
| PUT | `/api/admin/cars/:id` | Update car |
| DELETE | `/api/admin/cars/:id` | Delete car |
| GET | `/api/admin/bookings` | All bookings |
| PUT | `/api/admin/bookings/:id/status` | Update booking status |
| GET | `/api/admin/users` | All users |
| PUT | `/api/admin/users/:id/toggle-block` | Block/unblock user |

---

## 🌐 Deployment

### Frontend → Vercel
1. Push your code to GitHub
2. Import the **frontend** folder in [Vercel](https://vercel.com)
3. Set environment variables (`VITE_API_URL`, `VITE_RAZORPAY_KEY_ID`)
4. Deploy — `vercel.json` handles SPA routing

### Backend → Render
1. Import the **backend** folder in [Render](https://render.com)
2. Build command: `npm install`
3. Start command: `npm start`
4. Set all environment variables from `.env`
5. Update `CLIENT_URL` to your Vercel frontend URL

---

## 🎓 Resume Description

> **DriveEase — Full-Stack Car Rental Platform** (MERN Stack)
>
> Built a production-ready car rental platform for the Indian market using React 18, Node.js, Express, MongoDB, Redux Toolkit, and Tailwind CSS. Implemented JWT authentication with refresh token rotation, Razorpay payment gateway integration (INR), Cloudinary image management, and Nodemailer email notifications. Features include a responsive user panel with advanced search filters, real-time availability checking, and a comprehensive admin dashboard with revenue analytics, fleet management (CRUD), and user administration. Secured with Helmet, CORS, rate limiting, and role-based access control. Deployed on Vercel (frontend) and Render (backend) with MongoDB Atlas.

---

## 📝 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@driveease.in | Admin@123456 |
| **User** | rahul@example.com | User@123456 |

---

## 📜 License

MIT — free for personal and commercial use.
