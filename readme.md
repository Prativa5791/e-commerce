# E-Commerce Backend API

Robust e-commerce REST API built with **Django** + **Django REST Framework**

## Features
- User registration & profiles  
- Product catalog + categories  
- Order management & history  
- Product reviews & ratings  
- Browsable API + session authentication

## Quick Start

```bash
# 1. Clone & enter project
git clone https://github.com/Prativa5791/e-commerce.git
cd e-commerce

# 2. Virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Migrations & superuser
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

# 5. Run
python manage.py runserver


## 🚦 Navigation & Authentication

This project uses **Session Authentication** for the browsable API. To perform restricted actions (such as adding products or managing orders), please follow these steps:

1. **Login First**: 
   Navigate to [http://127.0.0.1:8000/api-auth/login/](http://127.0.0.1:8000/api-auth/login/) and enter the **superuser** credentials you created during installation.

2. **Access Endpoints**:
   Once logged in, you can navigate through the following API modules directly in your browser:

| Endpoint | Description |
| :--- | :--- |
| `/admin/` | Django Admin Dashboard (Database Management) |
| `/api/` | Main API Router Root |
| `/api/accounts/` | User Registration & Profile Management |
| `/api/products/` | Product Catalog and Inventory |
| `/api/orders/` | Order Placement and Processing |
| `/api/reviews/` | Customer Ratings and Feedback |

---