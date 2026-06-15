# Za-Cart 🛒

A modern full-stack e-commerce application built with React, TypeScript, Redux Toolkit, and Supabase.

## Overview

Za-Cart is an online shopping platform that allows users to browse products, explore categories, manage their cart and wishlist, authenticate securely, and place orders through a clean and responsive user interface.

The project follows modern React development practices including code splitting, state management with Redux Toolkit, form validation, protected routes, and cloud-based backend services.

## Features

Authentication
User Registration
User Login
Secure Authentication using Supabase
Protected Routes
Persistent User Session
Shopping Experience
Product Catalog
Category Browsing
Product Details Page
Shopping Cart
Wishlist
Checkout Flow
User Dashboard
Orders History
User Profile
Account Management
Performance
Code Splitting
Lazy Loading
Optimized State Management
Responsive Design

### User Experience

- Lazy loading and code splitting
- Loading skeletons and animations
- Error handling pages
- Toast notifications
- Modern responsive UI with Bootstrap

---

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- React Router
- React Bootstrap
- CSS Modules

### State Management

- Redux Toolkit
- React Redux
- Redux Persist

### Forms & Validation

- React Hook Form
- Zod
- Hook Form Resolvers

### Backend & Database

- Supabase

### Additional Libraries

- Axios
- Lottie React
- React Hot Toast

---

## Project Structure

```text
src/
│
├── components/
│   ├── auth/
│   ├── common/
│   ├── ecommerce/
│   └── feedback/
│
├── layouts/
│
├── pages/
│   ├── Home
│   ├── Categories
│   ├── Products
│   ├── Product Details
│   ├── Cart
│   ├── Wishlist
│   ├── Checkout
│   ├── Orders
│   ├── Profile
│   ├── Login
│   └── Register
│
├── services/
│   └── supabase.ts
│
├── store/
│
└── scripts/
```

---

## Application Flow

Authentication Flow
Register/Login
│
▼
Supabase Auth
│
▼
Redux Store
│
▼
Protected Routes
Cart Flow
Product
│
▼
Add To Cart
│
▼
Redux State
│
▼
Supabase Sync
│
▼
Checkout

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ziaaddd/Za-cart.git
cd Za-cart
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the development server

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```

---

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
npm run seed     # Seed database
```

---

## Architecture Highlights

- Feature-based folder organization
- Redux Toolkit for scalable state management
- Route protection for authenticated pages
- Reusable UI components
- Service layer for Supabase integration
- Lazy-loaded pages for performance optimization

---

## Future Improvements

- Payment gateway integration
- Product search and filtering
- Admin dashboard
- Product reviews and ratings
- Order tracking
- Multi-language support

---

## Author

Developed by Ziad Shaban
Computer Science Graduate | Frontend Developer | Future Full-Stack Developer

Feel free to connect and provide feedback.
