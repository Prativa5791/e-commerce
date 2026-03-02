# Nepali Store — Full Stack E-Commerce

A full-stack e-commerce web application built with **Django REST Framework** (backend) and **React + Vite + Tailwind CSS** (frontend).

---

## Project Structure

```
ecommerce_web/
├── backend/          # Django project
│   ├── accounts/     # User registration & login
│   ├── products/     # Product catalog & API
│   ├── orders/       # Order management
│   └── reviews/      # Product reviews
├── frontend/         # React application (Vite)
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── lib/api.js  ← Axios API client
│       └── context/
└── env/              # Python virtual environment
```

---

## Backend Setup (Django)

### Prerequisites
- Python 3.10+
- pip

### Installation

```bash
# 1. Create & activate virtual environment
python3 -m venv env
source env/bin/activate        # Linux/macOS
env\Scripts\activate           # Windows

# 2. Install dependencies
pip install -r backend/requirements.txt

# 3. Run migrations
cd backend
python manage.py migrate

# 4. Seed product catalog (12 products)
python manage.py loaddata products/fixtures/products_seed.json

# 5. Create a superuser (optional — for /admin)
python manage.py createsuperuser

# 6. Start the development server
python manage.py runserver
```

Backend runs at **http://127.0.0.1:8000**

---

## Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/accounts/users/register/` | No | Register a new user |
| POST | `/api/accounts/users/login/` | No | Login & get token |
| GET | `/api/products/` | No | List products (filter: `?category=`, `?search=`, `?in_stock=`) |
| GET | `/api/products/:id/` | No | Single product detail |
| GET | `/api/orders/` | **Yes** | List current user's orders |
| POST | `/api/orders/` | **Yes** | Create a new order |

> Auth: add `Authorization: Token <token>` header for protected endpoints.

---

## Features

- 🛒 **Product catalog** — 12 seeded products across 5 categories
- 🔍 **Search & filter** — by category, name, in-stock status
- 🔐 **User auth** — token-based registration & login
- 📦 **Order history** — per-user order list
- 🛍️ **Shopping cart** — persisted in localStorage
- 🎨 **Dark UI** — glassmorphism design with Nepali Store branding

---

## Environment

- Django 4.x+ with DRF, Token Auth, CORS
- React 18 + Vite + Tailwind CSS + Framer Motion
- SQLite (development)