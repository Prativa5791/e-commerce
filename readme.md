# 🏪 Nepali Store — Full Stack E-Commerce Platform

A modern, full-stack e-commerce web application built with **Django REST Framework** (backend) and **React + Vite + Tailwind CSS** (frontend). Features role-based dashboards for **Admin**, **Seller**, and **Customer** users with real-time order tracking, product management, and analytics.

![Tech Stack](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

---

## ✨ Features

### 🛒 Shopping Experience
- **Product Catalog** — Browse 12+ products across 5 categories (Electronics, Fashion, Home, Sports, Accessories)
- **Search & Filter** — Filter by category, name, in-stock status
- **Shopping Cart** — Add/remove items, update quantities, persisted in localStorage
- **Cart Drawer** — Quick-access slide-in cart from the navbar
- **Buy Now** — Instant checkout for single items
- **Checkout** — Full checkout flow with shipping details and payment method selection (COD, eSewa, Khalti)

### 🔐 Authentication & Roles
- **Token-based Auth** — Secure registration & login with JWT tokens
- **Three User Roles:**
  - **Customer** — Browse, purchase, track orders
  - **Seller** — Manage products, view seller-specific orders
  - **Admin** — Full platform governance, user management, analytics

### 📊 Admin Dashboard (`/admin-dashboard`)
- View all registered users and their roles
- Toggle seller status for any user (promote/demote)
- View all orders across the platform
- Update order statuses
- Revenue analytics and order breakdowns
- Product overview

### 🏪 Seller Dashboard (`/seller-dashboard`)
- **Product Management** — Create, edit, and delete products
- Product form with name, category, price, description, image URL, badge, and stock status
- View seller-specific orders and update their statuses
- Sales analytics and order summaries

### 📦 Customer Order Tracking (`/orders`)
- Animated order timeline (Pending → Confirmed → Processing → Shipped → Out for Delivery → Delivered)
- Expandable order cards with detailed info
- Shipping details (name, address, phone)
- Payment status badges (Paid/Unpaid with method)
- Tracking number and estimated delivery display
- Timestamp milestones for each stage

### 🎨 UI/UX
- Dark glassmorphism design with Nepali Store branding
- Smooth page transitions with Framer Motion
- Fully responsive (mobile, tablet, desktop)
- Animated navbar with dropdown menus
- Loading skeletons and error states

---

## 📁 Project Structure

```
ecommerce_web/
├── backend/                  # Django REST Framework
│   ├── accounts/             # User auth, registration, role management
│   │   ├── models.py         # Custom user model with is_seller field
│   │   ├── views.py          # Login, register, toggle-seller, all-users
│   │   └── serializers.py
│   ├── products/             # Product catalog & CRUD API
│   │   ├── models.py         # Product model
│   │   ├── views.py          # ProductViewSet with filtering
│   │   └── fixtures/         # Seed data (12 products)
│   ├── orders/               # Order management & checkout
│   │   ├── models.py         # Order & OrderItem models with shipping fields
│   │   ├── views.py          # Checkout, status updates, analytics
│   │   └── urls.py
│   ├── reviews/              # Product reviews
│   └── ecommerce_backend/    # Django project config
│       ├── settings.py
│       └── urls.py
├── frontend/                 # React + Vite
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx        # Navigation with role-based links
│       │   ├── CartDrawer.jsx    # Slide-in cart panel
│       │   ├── ProductCard.jsx   # Product display card
│       │   └── Footer.jsx
│       ├── pages/
│       │   ├── Home.jsx          # Landing page
│       │   ├── Products.jsx      # Product listing with filters
│       │   ├── ProductDetail.jsx # Single product view
│       │   ├── Cart.jsx          # Full cart page
│       │   ├── Checkout.jsx      # Checkout with payment
│       │   ├── Orders.jsx        # Customer order tracking
│       │   ├── Auth.jsx          # Login/Register
│       │   ├── AdminDashboard.jsx    # Admin panel
│       │   └── SellerDashboard.jsx   # Seller panel
│       ├── context/
│       │   ├── AuthContext.jsx   # Auth state management
│       │   └── CartContext.jsx   # Cart state management
│       └── lib/
│           └── api.js            # Axios API client with interceptors
└── venv/                     # Python virtual environment
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### Backend Setup (Django)

```bash
# 1. Create & activate virtual environment
python3 -m venv venv
source venv/bin/activate        # Linux/macOS
venv\Scripts\activate           # Windows

# 2. Install dependencies
pip install -r backend/requirements.txt

# 3. Run migrations
cd backend
python manage.py migrate

# 4. Seed product catalog (12 products)
python manage.py loaddata products/fixtures/products_seed.json

# 5. Create a superuser (Admin access)
python manage.py createsuperuser

# 6. Start the development server
python manage.py runserver
```

Backend runs at **http://127.0.0.1:8000**

### Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## 🔐 Role-Based Access Guide

### How Roles Work

| Role | Flag | Access |
|------|------|--------|
| **Customer** | Default (no flags) | Browse, cart, checkout, order tracking |
| **Seller** | `is_seller = True` | Everything above + Seller Dashboard (product CRUD, seller orders) |
| **Admin** | `is_staff = True` | Everything above + Admin Panel (user management, all orders, analytics) |

### Accessing Dashboards

| Dashboard | URL | Who Can Access | How to Get Access |
|-----------|-----|---------------|-------------------|
| **Admin Panel** | `/admin-dashboard` | Admin users (`is_staff`) | Created via `createsuperuser` |
| **Seller Dashboard** | `/seller-dashboard` | Sellers (`is_seller`) or Admins | Admin promotes user via Admin Panel |
| **My Orders** | `/orders` | Any logged-in user | Register and place orders |
| **Django Admin** | `/admin/` | Superusers | Created via `createsuperuser` |

### How to Create Each User Type

1. **Customer:** Register at `/auth/register` — default role
2. **Seller:** 
   - Register as a customer first
   - An **Admin** logs into the Admin Panel → Users tab → clicks **"Make Seller"** on the user
3. **Admin:** Run `python manage.py createsuperuser` in the backend

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/accounts/users/register/` | No | Register a new user |
| POST | `/api/accounts/users/login/` | No | Login & get token |
| GET | `/api/accounts/users/me/` | **Yes** | Get current user details |
| GET | `/api/accounts/users/all-users/` | **Admin** | List all users with roles |
| PATCH | `/api/accounts/users/:id/toggle-seller/` | **Admin** | Toggle seller status |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products/` | No | List products (`?category=`, `?search=`, `?in_stock=`) |
| GET | `/api/products/:id/` | No | Single product detail |
| POST | `/api/products/` | **Seller** | Create a new product |
| PUT | `/api/products/:id/` | **Seller** | Update a product |
| DELETE | `/api/products/:id/` | **Seller** | Delete a product |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/orders/` | **Yes** | List current user's orders |
| POST | `/api/orders/checkout/` | **Yes** | Create order from cart items |
| GET | `/api/orders/all_orders/` | **Admin/Seller** | List all orders |
| PATCH | `/api/orders/:id/update_status/` | **Admin/Seller** | Update order status |
| GET | `/api/orders/analytics/` | **Admin/Seller** | Order analytics & revenue |

> **Auth:** Add `Authorization: Token <token>` header for protected endpoints.

---

## 💳 Payment Methods

| Method | Status |
|--------|--------|
| **Cash on Delivery (COD)** | ✅ Fully functional |
| **eSewa** | 🔄 Simulated (redirect placeholder) |
| **Khalti** | 🔄 Simulated (redirect placeholder) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Django 4.x, Django REST Framework, Token Authentication, CORS |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion |
| **State Management** | React Context API with useReducer |
| **HTTP Client** | Axios with interceptors |
| **Database** | SQLite (development) |
| **Icons** | Lucide React |
| **Currency** | Rs. (Nepali Rupees) |

---

## 📸 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero section, featured products, categories |
| Products | `/products` | Full product listing with filters |
| Product Detail | `/products/:id` | Single product view with "Add to Cart" / "Buy Now" |
| Cart | `/cart` | Shopping cart with quantity controls |
| Checkout | `/checkout` | Shipping form + payment selection |
| My Orders | `/orders` | Order history with animated timeline tracker |
| Login | `/auth/login` | User authentication |
| Register | `/auth/register` | New account creation |
| Admin Dashboard | `/admin-dashboard` | Platform governance (Admin only) |
| Seller Dashboard | `/seller-dashboard` | Product management (Seller/Admin) |

---

## 📄 License

This project is for educational/personal use.