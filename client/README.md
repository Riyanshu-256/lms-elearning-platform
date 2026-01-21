# 🎓 LMS E-Learning Platform - Frontend

A modern, full-featured Learning Management System (LMS) frontend built with React and Vite. This platform provides a comprehensive e-learning experience for both students and educators, featuring course management, video playback, progress tracking, and more.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.18-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Key Features Breakdown](#-key-features-breakdown)
- [Pages & Routes](#-pages--routes)
- [Components Overview](#-components-overview)
- [State Management](#-state-management)
- [Building for Production](#-building-for-production)
- [Contributing](#-contributing)

## ✨ Features

### 👨‍🎓 Student Features

- **Homepage with Hero Section**: Engaging landing page with search functionality
- **Course Discovery**: Browse and search through available courses
- **Course Details**: Comprehensive course information with:
  - Course description and metadata
  - Ratings and reviews
  - Student enrollment count
  - Course curriculum preview
  - Free preview lectures
  - Pricing with discount calculations
- **Course Player**: Interactive video learning experience with:
  - YouTube video integration
  - Chapter-based course structure
  - Lecture navigation
  - Progress tracking
  - Mark lectures as complete
  - Course rating system
- **My Enrollments**: Track enrolled courses with:
  - Progress visualization
  - Filter by status (All, Ongoing, Completed)
  - Search functionality
  - Quick resume/access to courses
- **Testimonials & Social Proof**: Student testimonials and company logos
- **Responsive Design**: Fully responsive across all devices

### 👨‍🏫 Educator Features

- **Educator Dashboard**: Comprehensive analytics dashboard showing:
  - Total enrollments
  - Total courses published
  - Total earnings
  - Latest enrollments table
- **Course Creation**: Rich course creation interface with:
  - Course title and pricing
  - Discount management
  - Thumbnail upload
  - Rich text description editor (Quill)
  - Chapter-based structure
  - Lecture management:
    - Lecture title and duration
    - Video URL (YouTube)
    - Free preview option
- **My Courses**: Manage published courses with:
  - Course listing with thumbnails
  - Earnings per course
  - Student enrollment count
  - Publication dates
- **Students Enrolled**: View and manage enrolled students
- **Sidebar Navigation**: Easy navigation between educator features

## 🛠 Tech Stack

### Core Technologies

- **React 19.2.0** - Modern UI library
- **Vite 7.2.4** - Next-generation frontend tooling
- **React Router DOM 7.12.0** - Client-side routing

### UI & Styling

- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **Framer Motion 12.25.0** - Animation library
- **Lucide React 0.562.0** - Icon library

### Authentication

- **Clerk React 5.59.3** - Complete authentication solution

### Rich Content

- **Quill 2.0.3** - Rich text editor for course descriptions
- **React YouTube 10.1.0** - YouTube video player integration

### Utilities

- **Humanize Duration 3.33.2** - Human-readable duration formatting
- **React Simple Star Rating 5.1.7** - Star rating component
- **React Simple Typewriter 5.0.1** - Typewriter effect
- **RC Progress 4.0.0** - Progress bars
- **Uniqid 5.4.0** - Unique ID generation

### Development Tools

- **ESLint 9.39.1** - Code linting
- **TypeScript Types** - Type definitions for React

## 📁 Project Structure

```
client/
├── public/                 # Static assets
│   └── favicon.svg
├── src/
│   ├── assets/            # Images, icons, and static data
│   │   ├── *.svg          # Icon assets
│   │   ├── *.png          # Image assets
│   │   └── assets.js      # Asset exports and dummy data
│   ├── components/        # Reusable components
│   │   ├── educator/      # Educator-specific components
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   └── student/       # Student-specific components
│   │       ├── CallToAction.jsx
│   │       ├── Companies.jsx
│   │       ├── CourseCard.jsx
│   │       ├── CourseSection.jsx
│   │       ├── Footer.jsx
│   │       ├── Hero.jsx
│   │       ├── Loading.jsx
│   │       ├── Navbar.jsx
│   │       ├── Rating.jsx
│   │       ├── SearchBar.jsx
│   │       └── TestimonialsSection.jsx
│   ├── context/           # React Context API
│   │   └── AppContext.jsx # Global state management
│   ├── pages/             # Page components
│   │   ├── educator/      # Educator pages
│   │   │   ├── AddCourse.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Educator.jsx
│   │   │   ├── MyCourses.jsx
│   │   │   └── StudentsEnrolled.jsx
│   │   └── student/       # Student pages
│   │       ├── CourseDetails.jsx
│   │       ├── CourseList.jsx
│   │       ├── Home.jsx
│   │       ├── MyEnrollments.jsx
│   │       └── Player.jsx
│   ├── App.jsx            # Main app component with routing
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── .eslintrc.js           # ESLint configuration
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** package manager
- **Clerk Account** (for authentication)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your configuration (see [Environment Variables](#-environment-variables))

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Backend API base URL
VITE_BACKEND_URL=http://localhost:5000

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

# Currency Symbol (optional, defaults to $)
VITE_CURRENCY=$
```

### Getting Clerk Keys

1. Sign up at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy the Publishable Key from the dashboard
4. Add it to your `.env` file

## 📜 Available Scripts

### Development

```bash
npm run dev
```

Starts the development server with hot module replacement (HMR) at `http://localhost:5173`

### Build

```bash
npm run build
```

Creates an optimized production build in the `dist` directory

### Preview

```bash
npm run preview
```

Preview the production build locally before deploying

### Lint

```bash
npm run lint
```

Run ESLint to check for code quality issues

## 🎯 Key Features Breakdown

### Course Management System

#### For Students:

- **Search & Filter**: Advanced search functionality to find courses
- **Course Preview**: View course details, curriculum, and free preview lectures
- **Enrollment Tracking**: Monitor progress with visual progress bars
- **Video Learning**: Integrated YouTube player for seamless learning
- **Progress Management**: Mark lectures as complete and track overall progress

#### For Educators:

- **Rich Course Editor**: Create courses with Quill rich text editor
- **Chapter Organization**: Organize content into chapters and lectures
- **Media Management**: Upload course thumbnails
- **Analytics Dashboard**: Track enrollments, earnings, and student engagement
- **Student Management**: View enrolled students per course

### User Interface

- **Modern Design**: Clean, professional UI with Tailwind CSS
- **Responsive Layout**: Mobile-first design that works on all screen sizes

# Client — Frontend (React + Vite)

This folder contains the single-page application for LMS-PROJECT, built with React (Vite), Tailwind CSS, and Clerk for authentication.

## Quick Summary

- Tech: React 19+, Vite, Tailwind CSS
- Auth: Clerk
- Video: react-youtube for embedded lectures
- State: React Context (`src/context/AppContext.jsx`)

## Install & Run

```bash
# from repo root
cd client
npm install
npm run dev
```

Default dev URL: http://localhost:5173

## Environment Variables

Create a `.env` in `client/` with:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_CURRENCY=$
```

Vite prefixes required env vars with `VITE_` to expose them to the client.

## Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — production build (output `dist/`)
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint

## Folder Map

- `src/` — application source
  - `components/` — reusable UI components (`student/`, `educator/`)
  - `pages/` — route-level pages (`Home`, `CourseList`, `CourseDetails`, `Player`, `Educator/*`)
  - `context/AppContext.jsx` — global state + helper utilities (currency, course utilities, API helpers)
  - `main.jsx`, `App.jsx` — app bootstrap and routing

## Important Components & Pages

- `Player.jsx` — course player, integrates YouTube player and chapter/lecture navigation
- `CourseDetails.jsx` — course metadata, curriculum, ratings, enroll button
- `AddCourse.jsx` (educator) — create course UI, uploads thumbnail to server
- `Dashboard.jsx` — educator analytics (earnings, enrollments)

## Integration Points

- Calls backend at `/api/*` for courses, purchases, user/profile, and educator endpoints.
- Uses Clerk for authentication; ensure `VITE_CLERK_PUBLISHABLE_KEY` is set and server Clerk webhook & secret are configured.

## Notes for Resume / Demo

- Start the server and client, create a test educator account, add a course, and create a Stripe test checkout to showcase end-to-end flow.

Consider adding a lightweight `env.example` file and a short demo script to step through the primary flows for recruiters.
