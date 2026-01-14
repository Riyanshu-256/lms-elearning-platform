# 🎓 LMS E-Learning Platform

A modern, full-featured Learning Management System (LMS) built with React and Vite. This platform provides a comprehensive e-learning experience for both students and educators, featuring course management, video playback, progress tracking, and more.

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
LMS-PROJECT/
│
├── client/                 # Frontend Application
│   ├── public/            # Static assets
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/        # Images, icons, and static data
│   │   │   ├── *.svg      # Icon assets
│   │   │   ├── *.png      # Image assets
│   │   │   └── assets.js  # Asset exports and dummy data
│   │   ├── components/    # Reusable components
│   │   │   ├── educator/  # Educator-specific components
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   └── student/   # Student-specific components
│   │   │       ├── CallToAction.jsx
│   │   │       ├── Companies.jsx
│   │   │       ├── CourseCard.jsx
│   │   │       ├── CourseSection.jsx
│   │   │       ├── Footer.jsx
│   │   │       ├── Hero.jsx
│   │   │       ├── Loading.jsx
│   │   │       ├── Navbar.jsx
│   │   │       ├── Rating.jsx
│   │   │       ├── SearchBar.jsx
│   │   │       └── TestimonialsSection.jsx
│   │   ├── context/       # React Context API
│   │   │   └── AppContext.jsx  # Global state management
│   │   ├── pages/         # Page components
│   │   │   ├── educator/  # Educator pages
│   │   │   │   ├── AddCourse.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Educator.jsx
│   │   │   │   ├── MyCourses.jsx
│   │   │   │   └── StudentsEnrolled.jsx
│   │   │   └── student/   # Student pages
│   │   │       ├── CourseDetails.jsx
│   │   │       ├── CourseList.jsx
│   │   │       ├── Home.jsx
│   │   │       ├── MyEnrollments.jsx
│   │   │       └── Player.jsx
│   │   ├── App.jsx        # Main app component with routing
│   │   ├── main.jsx      # Application entry point
│   │   └── index.css     # Global styles
│   ├── .eslintrc.js      # ESLint configuration
│   ├── index.html        # HTML template
│   ├── package.json      # Dependencies and scripts
│   ├── vite.config.js    # Vite configuration
│   └── README.md         # Frontend-specific README
│
└── README.md             # This file (Project Overview)
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
   cd LMS-PROJECT
   ```

2. **Navigate to client directory and install dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `client/` directory:
   ```bash
   cd client
   touch .env
   ```
   
   Add the following to `.env`:
   ```env
   # Clerk Authentication
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   
   # Currency Symbol (optional, defaults to $)
   VITE_CURRENCY=$
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 🔐 Environment Variables

Create a `.env` file in the `client/` directory with the following variables:

```env
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

Navigate to the `client/` directory to run these commands:

### Development
```bash
cd client
npm run dev
```
Starts the development server with hot module replacement (HMR) at `http://localhost:5173`

### Build
```bash
cd client
npm run build
```
Creates an optimized production build in the `dist` directory

### Preview
```bash
cd client
npm run preview
```
Preview the production build locally before deploying

### Lint
```bash
cd client
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
- **Smooth Animations**: Framer Motion for engaging user interactions
- **Loading States**: Proper loading indicators for better UX
- **Error Handling**: Graceful error states and fallbacks

### Authentication & Security

- **Clerk Integration**: Secure authentication with Clerk
- **Protected Routes**: Route protection for educator dashboard
- **User Session Management**: Automatic session handling

## 🗺 Pages & Routes

### Student Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Home` | Landing page with hero, courses, testimonials |
| `/course-list` | `CourseList` | Browse all available courses |
| `/course-list/:input` | `CourseList` | Search results page |
| `/course-details/:id` | `CourseDetails` | Detailed course information |
| `/my-enrollments` | `MyEnrollments` | Student's enrolled courses |
| `/player/:courseId` | `Player` | Video player for course content |
| `/loading/:path` | `Loading` | Loading state component |

### Educator Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/educator` | `Educator` (Layout) | Main educator layout with sidebar |
| `/educator` | `Dashboard` | Analytics and overview |
| `/educator/add-course` | `AddCourse` | Course creation interface |
| `/educator/my-courses` | `MyCourses` | Manage published courses |
| `/educator/students-enrolled` | `StudentsEnrolled` | View enrolled students |

## 🧩 Components Overview

### Student Components

- **Hero**: Landing page hero section with search
- **SearchBar**: Course search functionality
- **CourseCard**: Reusable course card component
- **CourseSection**: Featured courses display
- **Companies**: Company logos section
- **TestimonialsSection**: Student testimonials
- **CallToAction**: CTA section
- **Rating**: Star rating component
- **Loading**: Loading spinner component
- **Navbar**: Student navigation bar
- **Footer**: Footer with links and social media

### Educator Components

- **Navbar**: Educator top navigation
- **Sidebar**: Side navigation menu
- **Footer**: Educator footer

### Shared Features

- **Responsive Design**: All components are mobile-responsive
- **Accessibility**: Semantic HTML and ARIA labels
- **Performance**: Optimized with React best practices

## 🔄 State Management

The application uses **React Context API** for global state management:

### AppContext Features:
- **Course Management**: Fetch and manage all courses
- **Enrollment Tracking**: Track user enrolled courses
- **Utility Functions**:
  - `calculateRating()`: Calculate average course rating
  - `calculateChapterTime()`: Calculate chapter duration
  - `calculateCourseDuration()`: Calculate total course duration
  - `calculateNoOfCourses()`: Count total lectures
- **Navigation**: Programmatic navigation helper
- **Currency**: Global currency symbol configuration

### Context Usage:
```jsx
import { useContext } from 'react';
import { AppContext } from './context/AppContext';

const MyComponent = () => {
  const { allCourses, calculateRating, currency } = useContext(AppContext);
  // Use context values
};
```

## 🏗 Building for Production

### Build Process

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Optimize build**
   ```bash
   npm run build
   ```

3. **Test production build**
   ```bash
   npm run preview
   ```

4. **Deploy**
   The `dist` folder contains optimized, production-ready files that can be deployed to:
   - **Vercel**: Connect your GitHub repo
   - **Netlify**: Drag and drop the `dist` folder
   - **AWS S3**: Upload `dist` contents
   - **Any static hosting**: Serve the `dist` folder

### Build Output

The build process:
- ✅ Minifies JavaScript and CSS
- ✅ Optimizes images
- ✅ Tree-shakes unused code
- ✅ Generates source maps for debugging
- ✅ Creates optimized chunks for code splitting

## 🎨 Customization

### Styling
- Modify `client/src/index.css` for global styles
- Use Tailwind utility classes throughout components
- Customize Tailwind config (if needed) in `tailwind.config.js`

### Theme Colors
The application uses Tailwind's default color palette. To customize:
1. Create a `tailwind.config.js` file in the `client/` directory
2. Extend the theme with your brand colors
3. Update components to use custom color classes

### Adding New Features
1. Create components in appropriate directories (`student/` or `educator/`)
2. Add routes in `App.jsx`
3. Update navigation components if needed
4. Add state management in `AppContext.jsx` if required

## 🧪 Testing

While the project doesn't include test files yet, you can add:
- **Vitest** for unit testing
- **React Testing Library** for component testing
- **Playwright** or **Cypress** for E2E testing

## 📦 Dependencies Overview

### Production Dependencies
- React ecosystem for UI
- Clerk for authentication
- React Router for navigation
- Tailwind CSS for styling
- Quill for rich text editing
- YouTube integration for video playback
- Animation and UI enhancement libraries

### Development Dependencies
- Vite for build tooling
- ESLint for code quality
- TypeScript types for better DX

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill process on port 5173
npx kill-port 5173
# Or use a different port
npm run dev -- --port 3000
```

**Module not found errors**
```bash
# Clear cache and reinstall
cd client
rm -rf node_modules package-lock.json
npm install
```

**Clerk authentication not working**
- Verify `VITE_CLERK_PUBLISHABLE_KEY` is set correctly in `client/.env`
- Check Clerk dashboard for correct key
- Ensure key starts with `pk_`

**Build errors**
- Check Node.js version (v18+)
- Clear `.vite` cache folder in `client/` directory
- Verify all environment variables are set

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Follow ESLint rules
- Use meaningful component and variable names
- Add comments for complex logic
- Keep components small and focused

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Riyanshu Sharma**

- GitHub: [https://github.com/Riyanshu-256](https://github.com/Riyanshu-256)

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Clerk](https://clerk.com/) - Authentication
- [Quill](https://quilljs.com/) - Rich text editor
- All other open-source contributors

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

## ⭐ Support

If you like this project, don't forget to **star** the repo ⭐

---

**Built with ❤️ using React and Vite**

Happy Coding 🚀
