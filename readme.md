# E-Commerce Backend DJANGO

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


## Login First: Navigate to http://127.0.0.1:8000/api-auth/login/ and enter the superuser credentials you created during installation.