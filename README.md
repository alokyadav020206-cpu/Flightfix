# FlightFix: Aircraft Maintenance Efficiency Platform

Full-Stack Aviation Maintenance, Fleet Planning, and Inventory Tracking System.

## Stack Overview
- **Backend**: Django 5, Django REST Framework, SimpleJWT (Token Auth), MySQL with PyMySQL fallback, drf-spectacular (Swagger/OpenAPI).
- **Frontend**: React 18, Vite, React Router v6, CSS Design System with dark/aviation aesthetic.
- **Database**: MySQL (`flightfix` database) with full support for a 50,000-row historical maintenance log dataset.

---

## Project Structure
```text
flightfix/
├── backend/                     # Django REST API
│   ├── flightfix/               # Project settings, URLs, Swagger config
│   ├── accounts/                # Role-based JWT authentication (Admin, Manager, Technician)
│   ├── aircraft/                # Aircraft fleet models & APIs
│   ├── technicians/             # Technician profiles & assignments
│   ├── inventory/               # Spare parts & low-stock alerts
│   ├── maintenance/             # Schedules, Work Orders, Tasks, and History
│   ├── dashboard/               # High-level fleet KPIs & stats
│   ├── legacy/                  # 50,000-row historical dataset (managed = False)
│   ├── requirements.txt         # Python dependencies
│   ├── schema.sql               # Database schema initialization
│   ├── .env.example             # Environment template
│   └── manage.py
├── frontend/                    # React + Vite Application
│   ├── src/
│   │   ├── components/          # Reusable UI components (Table, Modal, Card, StatusBadge, Sidebar)
│   │   ├── context/             # DataContext connected to Django REST API
│   │   ├── pages/               # Dashboard, Aircraft, Maintenance, WorkOrders, SpareParts, Technicians, LegacyDataset, Login
│   │   ├── api.js               # Authorized fetch client with JWT bearer tokens
│   │   └── auth.js              # Session & authentication management
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── start_flightfix.bat          # 1-Click launcher for Windows
└── README.md
```

---

## Quick Start (Windows)

### 1. One-Click Launch
Double-click `start_flightfix.bat` or run:
```powershell
.\start_flightfix.bat
```

### 2. Manual Setup

#### Backend Setup
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env          # Update DB_PASSWORD with your MySQL password
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

#### Frontend Setup
```powershell
cd frontend
npm install
npm run dev
```

---

## Default Demo Logins
| Username | Password | Role | Access |
|---|---|---|---|
| `admin` | `admin123` | **Admin** | Full system administration and user management |
| `manager` | `manager123` | **Manager** | Fleet planning, work orders, schedules, inventory |
| `tech1` | `tech123` | **Technician** | Task checklists, work order updates, part usage |

---

## API & Documentation Endpoints
- **Interactive Swagger UI**: [http://127.0.0.1:8000/api/docs/](http://127.0.0.1:8000/api/docs/)
- **ReDoc Documentation**: [http://127.0.0.1:8000/api/redoc/](http://127.0.0.1:8000/api/redoc/)
- **API Root**: [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/)
- **Historical Dataset (50k rows)**: [http://127.0.0.1:8000/api/legacy-maintenance/](http://127.0.0.1:8000/api/legacy-maintenance/)
- **Django Admin**: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)
- **Frontend App**: [http://localhost:5173/](http://localhost:5173/)
