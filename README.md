# 🎓 LMS E-Learning Platform

A comprehensive, full-stack Learning Management System (LMS) built with modern web technologies. This platform empowers educators to create and manage courses while providing students with an engaging, interactive learning experience featuring video lectures, progress tracking, and seamless payment integration.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)
![Express](https://img.shields.io/badge/Express-4.19.2-000000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-9.1.3-47A248?logo=mongodb)
![Stripe](https://img.shields.io/badge/Stripe-20.1.2-635BFF?logo=stripe)
![Clerk](https://img.shields.io/badge/Clerk-5.59.3-6C47FF?logo=clerk)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.18-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Installation & Setup](#-installation--setup)
- [API Documentation](#-api-documentation)
- [Database Models](#-database-models)
- [Dependencies](#-dependencies)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

## 🌟 Overview

This LMS platform is a production-ready application that demonstrates modern full-stack development practices. It features role-based access control for students and educators, real-time payment processing, cloud-based media storage, and comprehensive course management. The system supports video-based learning with YouTube integration, progress tracking, and analytics dashboards.

### Key Highlights

- **Dual User Roles**: Separate interfaces for students and educators
- **Video Learning**: Integrated YouTube player with chapter navigation
- **Payment Integration**: Stripe-powered checkout with webhook handling
- **Cloud Storage**: Cloudinary for media uploads
- **Authentication**: Clerk-based user management with webhooks
- **Progress Tracking**: Detailed learning progress and completion metrics
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Analytics**: Educator dashboards with earnings and enrollment data

## ✨ Features

### 👨‍🎓 Student Features

- **Interactive Homepage**: Hero section with search and featured courses
- **Course Discovery**: Advanced search and filtering capabilities
- **Detailed Course Pages**: Comprehensive course information including:
  - Rich descriptions and metadata
  - Student ratings and reviews
  - Enrollment statistics
  - Curriculum preview with chapter structure
  - Free preview lectures
  - Dynamic pricing with discount calculations
- **Video Learning Player**: Full-featured course player with:
  - YouTube video integration
  - Chapter-based navigation
  - Lecture progress tracking
  - Completion marking
  - Course rating system
- **Enrollment Management**: Personal dashboard for:
  - Progress visualization with progress bars
  - Course filtering (All, Ongoing, Completed)
  - Search within enrolled courses
  - Quick resume functionality
- **Social Proof**: Testimonials and company partnerships
- **Responsive Experience**: Optimized for all device sizes

### 👨‍🏫 Educator Features

- **Analytics Dashboard**: Comprehensive metrics including:
  - Total student enrollments
  - Published courses count
  - Revenue tracking
  - Recent enrollment activity
- **Course Creation Suite**: Rich content creation tools:
  - Course metadata management (title, pricing, discounts)
  - Thumbnail upload functionality
  - Quill-powered rich text descriptions
  - Chapter and lecture organization
  - Video URL management with preview options
- **Course Portfolio**: Manage published content with:
  - Course listings with visual thumbnails
  - Earnings per course
  - Enrollment statistics
  - Publication tracking
- **Student Oversight**: View and manage enrolled students
- **Intuitive Navigation**: Sidebar-based educator interface

## 🛠 Tech Stack

### Frontend (React + Vite)

#### Core Technologies

- **React 19.2.0** - Modern component-based UI library
- **Vite 7.2.4** - Lightning-fast build tool and dev server
- **React Router DOM 7.12.0** - Declarative routing for React

#### UI & Styling

- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **Framer Motion 12.25.0** - Production-ready motion library
- **Lucide React 0.562.0** - Beautiful icon library

#### Authentication & Content

- **Clerk React 5.59.3** - Complete user management solution
- **Quill 2.0.3** - Powerful rich text editor
- **React YouTube 10.1.0** - YouTube player integration

#### Utilities

- **Axios 1.13.2** - HTTP client for API requests
- **Humanize Duration 3.33.2** - Duration formatting
- **React Simple Star Rating 5.1.7** - Rating component
- **React Simple Typewriter 5.0.1** - Typewriter animation
- **RC Progress 4.0.0** - Progress visualization
- **Uniqid 5.4.0** - Unique identifier generation
- **React Hot Toast 2.6.0** - Toast notifications
- **React Toastify 11.0.5** - Advanced notifications

#### Development Tools

- **ESLint 9.39.1** - Code quality enforcement
- **TypeScript Types** - Type safety for React ecosystem

### Backend (Express + MongoDB)

#### Core Technologies

- **Express 4.19.2** - Fast, unopinionated web framework
- **MongoDB 9.1.3** - NoSQL document database
- **Mongoose** - Elegant MongoDB object modeling

#### Authentication & Security

- **Clerk Express 1.7.62** - Server-side authentication
- **Svix 1.42.0** - Webhook verification

#### Payments & Media

- **Stripe 20.1.2** - Payment processing
- **Cloudinary 2.8.0** - Media management and optimization

#### Utilities

- **CORS 2.8.5** - Cross-origin resource sharing
- **Dotenv 17.2.3** - Environment variable management
- **Multer 2.0.2** - File upload handling
- **Nodemon 3.1.11** - Development auto-restart

## 📁 Project Structure

```
LMS-PROJECT/
├── client/                          # React Frontend Application
│   ├── public/
│   │   └── favicon.svg              # Application favicon
│   ├── src/
│   │   ├── assets/                  # Static assets and data
│   │   │   ├── *.svg                # Icon files
│   │   │   ├── *.png                # Image files
│   │   │   └── assets.js            # Asset exports and dummy data
│   │   ├── components/              # Reusable UI components
│   │   │   ├── educator/            # Educator-specific components
│   │   │   │   ├── Footer.jsx       # Educator footer
│   │   │   │   ├── Navbar.jsx       # Educator navigation
│   │   │   │   └── Sidebar.jsx      # Educator sidebar menu
│   │   │   └── student/             # Student-specific components
│   │   │       ├── CallToAction.jsx # CTA section
│   │   │       ├── Companies.jsx    # Company logos
│   │   │       ├── CourseCard.jsx   # Course preview card
│   │   │       ├── CourseSection.jsx # Course listing section
│   │   │       ├── Footer.jsx       # Student footer
│   │   │       ├── Hero.jsx         # Homepage hero section
│   │   │       ├── Loading.jsx      # Loading spinner
│   │   │       ├── Navbar.jsx       # Student navigation
│   │   │       ├── Rating.jsx       # Rating display
│   │   │       ├── SearchBar.jsx    # Search functionality
│   │   │       └── TestimonialsSection.jsx # Testimonials
│   │   ├── context/
│   │   │   └── AppContext.jsx       # Global state management
│   │   ├── pages/                   # Route-level page components
│   │   │   ├── educator/            # Educator pages
│   │   │   │   ├── AddCourse.jsx    # Course creation form
│   │   │   │   ├── Dashboard.jsx    # Educator analytics
│   │   │   │   ├── Educator.jsx     # Educator layout wrapper
│   │   │   │   ├── MyCourses.jsx    # Course management
│   │   │   │   └── StudentsEnrolled.jsx # Student management
│   │   │   └── student/             # Student pages
│   │   │       ├── CourseDetails.jsx # Course information
│   │   │       ├── CourseList.jsx   # Course browsing
│   │   │       ├── Home.jsx         # Landing page
│   │   │       ├── MyEnrollments.jsx # Enrollment dashboard
│   │   │       ├── PaymentCancel.jsx # Payment failure
│   │   │       ├── PaymentSuccess.jsx # Payment success
│   │   │       └── Player.jsx       # Video learning player
│   │   ├── App.jsx                  # Main app with routing
│   │   ├── main.jsx                 # Application entry point
│   │   └── index.css                # Global styles
│   ├── .env                         # Environment variables
│   ├── .gitignore                   # Git ignore rules
│   ├── eslint.config.js             # ESLint configuration
│   ├── index.html                   # HTML template
│   ├── package.json                 # Frontend dependencies
│   ├── vercel.json                  # Vercel deployment config
│   └── vite.config.js               # Vite configuration
├── server/                          # Express Backend API
│   ├── configs/                     # Configuration files
│   │   ├── cloudinary.js            # Cloudinary setup
│   │   │   ├── mongodb.js           # MongoDB connection
│   │   └── multer.js                # File upload config
│   ├── controllers/                 # Route controllers
│   │   ├── courseController.js      # Course management logic
│   │   ├── educatorController.js    # Educator operations
│   │   ├── userController.js        # User management
│   │   └── webhooks.js              # Webhook handlers
│   ├── middlewares/
│   │   └── authMiddleware.js        # Authentication middleware
│   ├── models/                      # Mongoose data models
│   │   ├── Course.js                # Course schema
│   │   ├── CourseProgress.js        # Progress tracking
│   │   ├── Purchase.js              # Purchase records
│   │   └── User.js                  # User schema
│   ├── routes/                      # API route definitions
│   │   ├── courseRoute.js           # Course endpoints
│   │   ├── educatorRoutes.js        # Educator endpoints
│   │   └── userRoutes.js            # User endpoints
│   ├── .env                         # Backend environment vars
│   ├── .gitignore                   # Backend git ignore
│   ├── package.json                 # Backend dependencies
│   ├── server.js                    # Main server file
│   └── vercel.json                  # Vercel deployment config
├── .git/                            # Git repository
├── README.md                        # This file
└── package.json                     # Root package.json (if any)
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local or cloud instance)
- **Clerk Account** (for authentication)
- **Stripe Account** (for payments)
- **Cloudinary Account** (for media storage)

### Quick Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd LMS-PROJECT
   ```

2. **Install dependencies**

   ```bash
   # Install frontend dependencies
   cd client && npm install

   # Install backend dependencies
   cd ../server && npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` files to `.env` in both `client/` and `server/`
   - Fill in your API keys and configuration

4. **Start the development servers**

   ```bash
   # Start backend (from server/)
   npm run dev

   # Start frontend (from client/ in new terminal)
   npm run dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## 🔐 Environment Variables

### Frontend (.env in client/)

```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:5000

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here

# Currency symbol (optional)
VITE_CURRENCY=$
```

### Backend (.env in server/)

```env
# Server Configuration
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/lms-project

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Stripe Payment Processing
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Cloudinary Media Storage
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_secret_key
```

## 📦 Installation & Setup

### Detailed Setup Instructions

1. **Database Setup**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGODB_URI` in server/.env

2. **Clerk Configuration**
   - Create account at [clerk.com](https://clerk.com)
   - Set up application and copy keys
   - Configure webhooks for user sync

3. **Stripe Setup**
   - Create account at [stripe.com](https://stripe.com)
   - Get API keys and webhook secret
   - Configure webhook endpoint: `http://localhost:5000/stripe`

4. **Cloudinary Setup**
   - Create account at [cloudinary.com](https://cloudinary.com)
   - Get cloud name and API credentials

5. **Development Workflow**

   ```bash
   # Backend development
   cd server && npm run dev

   # Frontend development
   cd client && npm run dev

   # Build for production
   cd client && npm run build
   ```

## 📡 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

All protected routes require Clerk JWT tokens.

### Key Endpoints

#### User Routes (`/api/user`)

- `GET /profile` - Get user profile
- `POST /webhook` - Clerk webhook handler

#### Course Routes (`/api/course`)

- `GET /list` - Get all courses
- `GET /:id` - Get course details
- `POST /purchase` - Purchase course
- `POST /verify-payment` - Verify payment

#### Educator Routes (`/api/educator`)

- `POST /add-course` - Create new course
- `GET /courses` - Get educator's courses
- `GET /dashboard` - Get dashboard stats
- `GET /students` - Get enrolled students

#### Webhooks

- `POST /clerk` - Clerk user events
- `POST /stripe` - Stripe payment events

## 🗄 Database Models

### User Model

```javascript
{
  _id: ObjectId,
  clerkId: String, // Clerk user ID
  name: String,
  email: String,
  imageUrl: String,
  role: String, // 'student' or 'educator'
  createdAt: Date,
  updatedAt: Date
}
```

### Course Model

```javascript
{
  courseTitle: String,
  courseDescription: String,
  courseThumbnail: String,
  coursePrice: Number,
  discount: Number,
  isPublished: Boolean,
  courseContent: [ChapterSchema],
  courseRatings: [{ userId: String, rating: Number }],
  educator: String, // User reference
  enrolledStudents: [String], // User IDs
  createdAt: Date,
  updatedAt: Date
}
```

### Purchase Model

```javascript
{
  courseId: String,
  userId: String,
  amount: Number,
  status: String, // 'pending', 'completed', 'failed'
  createdAt: Date
}
```

### CourseProgress Model

```javascript
{
  userId: String,
  courseId: String,
  completedLectures: [String], // Lecture IDs
  createdAt: Date,
  updatedAt: Date
}
```

## 📋 Dependencies

### Frontend Dependencies (client/package.json)

#### Production

- **React Ecosystem**: react, react-dom, react-router-dom
- **Styling**: tailwindcss, framer-motion, lucide-react
- **Authentication**: @clerk/clerk-react
- **Content**: quill, react-youtube
- **Utilities**: axios, humanize-duration, react-simple-star-rating, rc-progress, uniqid
- **Notifications**: react-hot-toast, react-toastify

#### Development

- **Build Tools**: @vitejs/plugin-react, vite
- **Linting**: eslint, @eslint/js
- **Types**: @types/react, @types/react-dom

### Backend Dependencies (server/package.json)

#### Production

- **Web Framework**: express
- **Database**: mongoose
- **Authentication**: @clerk/express, svix
- **Payments**: stripe
- **Media**: cloudinary
- **Utilities**: cors, dotenv, multer

#### Development

- **Development**: nodemon

## 🚀 Deployment

### Frontend Deployment (Vercel)

```bash
cd client
npm run build
# Deploy dist/ folder to Vercel
```

### Backend Deployment (Vercel/Railway)

```bash
cd server
# Configure environment variables
# Deploy to preferred platform
```

### Production Considerations

- Set `NODE_ENV=production`
- Configure production database
- Set up proper CORS origins
- Enable HTTPS
- Configure webhook endpoints

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Guidelines

- Follow ESLint rules
- Write meaningful commit messages
- Test thoroughly before submitting
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Riyanshu Sharma**

- GitHub: [https://github.com/Riyanshu-256](https://github.com/Riyanshu-256)
- LinkedIn: [Your LinkedIn Profile]
- Portfolio: [Your Portfolio Website]

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI Framework
- [Vite](https://vitejs.dev/) - Build Tool
- [Express](https://expressjs.com/) - Web Framework
- [MongoDB](https://mongodb.com/) - Database
- [Stripe](https://stripe.com/) - Payment Processing
- [Clerk](https://clerk.com/) - Authentication
- [Cloudinary](https://cloudinary.com/) - Media Storage
- [Tailwind CSS](https://tailwindcss.com/) - Styling Framework

---

**Built with ❤️ using React, Express, and MongoDB**

⭐ If you found this project helpful, please give it a star! ⭐
