# FlightFix Backend (Django + MySQL)

REST API for **FlightFix: Aircraft Maintenance Efficiency**.
Stack: Django 5, Django REST Framework, JWT login (SimpleJWT), MySQL, CORS for the Vite frontend.

## Folder structure
```
flightfix_backend/
├── manage.py
├── requirements.txt
├── schema.sql              # CREATE DATABASE flightfix
├── .env.example            # copy to .env
├── flightfix/              # settings (MySQL config), urls, wsgi/asgi
├── accounts/               # login (JWT + role), /me, user management, role groups, seed command
├── aircraft/               # Aircraft model + API
├── technicians/            # Technician model + API
├── inventory/              # SparePart model + API (+ low-stock)
├── maintenance/            # Schedules, WorkOrders, Tasks, Parts used, History
├── dashboard/              # /api/dashboard/ summary numbers
└── legacy/                 # inspectdb target for your maintenance_dataset table
```

## Setup (Windows, VS Code terminal)
```powershell
cd flightfix_backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env          # then edit DB_PASSWORD etc.
```
If `mysqlclient` fails to install on Windows, run `pip install PyMySQL` and add these two lines
at the top of `flightfix/__init__.py`:
```python
import pymysql
pymysql.install_as_MySQLdb()
```

### 1. Create the database
Run `schema.sql` in MySQL Workbench (or: `mysql -u root -p < schema.sql`).

### 2. Create tables + demo data
```powershell
python manage.py makemigrations accounts aircraft technicians inventory maintenance
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```
API is now at http://127.0.0.1:8000/api/ and Django admin at http://127.0.0.1:8000/admin/

Demo logins: `admin/admin123`, `manager/manager123`, `tech1/tech123` (change these!).

### 3. Connect your existing `maintenance_dataset` table (50,000 rows)
Make sure it is in the same `flightfix` database, then:
```powershell
python manage.py inspectdb maintenance_dataset > legacy/models.py
python manage.py makemigrations legacy
python manage.py migrate --fake legacy
```
Open `legacy/models.py`: the model must have `managed = False` (inspectdb adds it).
`--fake` stops Django from trying to re-create the table.
Tell me its 12 column names and I can add a serializer + API endpoint for it.

## Endpoints (all under /api/)
| Method | URL | Who |
|---|---|---|
| POST | `auth/login/` → `{access, refresh, user{role}}` | anyone |
| POST | `auth/refresh/` | anyone |
| GET | `auth/me/` | logged in |
| CRUD | `users/` | Admin |
| CRUD | `aircraft/`, `technicians/`, `spare-parts/`, `maintenance-schedules/`, `work-order-parts/` | read: all, write: Admin/Manager |
| GET | `spare-parts/low_stock/` | all |
| CRUD | `work-orders/` | read: all, write: Admin/Manager |
| POST | `work-orders/{id}/start/`, `work-orders/{id}/complete/` | Admin/Manager, or assigned Technician |
| CRUD | `tasks/` | Admin/Manager; assigned Technician can PATCH `is_done` |
| GET | `maintenance-history/` | all (auto-created on completion) |
| GET | `dashboard/` | all |

Send the token as header `Authorization: Bearer <access>`.
All list endpoints support `?search=`, `?ordering=` and field filters (e.g. `?status=OPEN`).

## Business rules built in
- Completing a work order creates a maintenance-history row, updates the aircraft's last maintenance date, sets it back to ACTIVE and marks its schedule DONE.
- Starting a work order sets the aircraft to IN_MAINTENANCE.
- Adding a part to a work order deducts stock (and is blocked if stock is too low); deleting it restores stock.

## Connecting the React frontend
```js
const res = await fetch("http://127.0.0.1:8000/api/auth/login/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password }),
});
const { access, user } = await res.json();   // user.role: Admin | Manager | Technician
```
CORS already allows http://localhost:5173.
