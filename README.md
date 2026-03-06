# 🚚 Delivery In-time — Real-time Logistics Dashboard

A full-stack logistics operations dashboard built on AWS. Track orders, fleet vehicles, drivers, and dispatches in real time — powered by a serverless backend with MySQL database.

🌐 **Live Demo:** [https://delivery-intime.ddns.net](https://delivery-intime.ddns.net)

---

## 📸 Overview

Delivery In-time is a real-time operations dashboard for logistics management. It provides live KPIs, fleet tracking, driver management, dispatch board, proof of delivery, billing, and an AI Ops Assistant — all connected to a real MySQL database via AWS Lambda and API Gateway.

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript, Chart.js |
| Hosting | Apache (httpd) on AWS EC2 (RHEL 9) |
| Database | MySQL 8.0 on EC2 |
| Backend | AWS Lambda (Node.js 24.x) |
| API | AWS API Gateway (REST API) |
| SSL | Let's Encrypt via Certbot |
| Domain | No-IP Free DDNS |

---

## ✨ Features

- 📊 **Real-time Dashboard** — KPI cards, live charts, active load map
- 📦 **Orders Management** — Create, View, Update Status, Delete
- 🚛 **Fleet Tracking** — Vehicle status, fuel levels, mileage
- 👤 **Driver Management** — Ratings, HOS compliance, route assignment
- 📋 **Dispatch Board** — Live load assignment and tracking
- ✅ **Proof of Delivery** — Digital signatures and photo confirmation
- 💰 **Billing & Invoices** — Revenue tracking and invoice management
- 🤖 **AI Ops Assistant** — Chat-based operations helper
- 🔍 **Global Search** — Search across all orders instantly

---

## 🏗️ Architecture

```
Browser
   │
   ▼
Apache on EC2 (index.html + styles.css + app.js)
   │
   ▼ fetch API calls
API Gateway (REST API)
   │
   ▼
AWS Lambda Functions (Node.js 24.x)
   │
   ▼
MySQL 8.0 on EC2 (port 3306)
```

---

## 🔌 API Endpoints

| Method | Route | Lambda Function | Action |
|---|---|---|---|
| GET | /orders | delivery-getOrders | Fetch all orders |
| POST | /orders | delivery-createOrder | Create new order |
| PUT | /orders/{id} | delivery-updateOrder | Update order status |
| DELETE | /orders/{id} | delivery-deleteOrder | Delete order |
| GET | /fleet | delivery-getFleet | Fetch all vehicles |
| GET | /drivers | delivery-getDrivers | Fetch all drivers |
| GET | /dispatch | delivery-getDispatches | Fetch dispatches |

---

## 🗄️ Database Schema

```sql
-- Orders
CREATE TABLE orders (
  id VARCHAR(50) PRIMARY KEY,
  route VARCHAR(200),
  driver VARCHAR(100),
  vehicle VARCHAR(50),
  status VARCHAR(50),
  eta VARCHAR(100),
  value VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fleet
CREATE TABLE fleet (
  id VARCHAR(50) PRIMARY KEY,
  type VARCHAR(100),
  driver VARCHAR(100),
  status VARCHAR(50),
  location VARCHAR(200),
  mileage INT,
  service VARCHAR(100),
  fuel INT
);

-- Drivers
CREATE TABLE drivers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100),
  initials VARCHAR(5),
  route VARCHAR(200),
  status VARCHAR(50),
  rating DECIMAL(3,1),
  loads INT
);

-- Dispatches
CREATE TABLE dispatches (
  id VARCHAR(50) PRIMARY KEY,
  route VARCHAR(200),
  driver VARCHAR(100),
  status VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🚀 Deploy on a New Instance

### 1. Launch EC2
- AMI: Red Hat Enterprise Linux 9
- Instance Type: t2.micro
- Security Group: Open ports 22, 80, 443, 3306

### 2. Install Apache & MySQL
```bash
# Apache
sudo dnf install httpd -y
sudo systemctl start httpd
sudo systemctl enable httpd

# MySQL
sudo dnf install -y https://dev.mysql.com/get/mysql80-community-release-el9-1.noarch.rpm
sudo dnf install -y mysql-community-server
sudo systemctl start mysqld
sudo systemctl enable mysqld
```

### 3. Clone & Deploy App
```bash
git clone https://github.com/HALFFY/delivery-intime.git
sudo cp delivery-intime/index.html delivery-intime/styles.css delivery-intime/app.js /var/www/html/
sudo chown apache:apache /var/www/html/*
sudo restorecon -Rv /var/www/html/
sudo systemctl restart httpd
```

### 4. Import Database
```bash
mysql -u root -p delivery_db < delivery-intime/delivery_db_backup.sql
```

### 5. Setup Lambda Functions
- Runtime: Node.js 24.x
- Layer: mysql2-layer (create from mysql2 npm package)
- Environment Variable: `DB_HOST` = your EC2 public IP
- Timeout: 10 seconds

### 6. Setup API Gateway
- Type: REST API (Regional)
- Create resources and methods as per the API table above
- Enable CORS on all resources
- Deploy to `prod` stage
- Update `API_BASE` in `app.js` with your new invoke URL

### 7. Enable HTTPS
```bash
sudo dnf install -y certbot python3-certbot-apache
sudo certbot --apache -d your-domain.ddns.net
```

---

## 📁 File Structure

```
delivery-intime/
├── index.html              # Main app UI
├── styles.css              # Styling
├── app.js                  # Frontend logic + API calls
└── delivery_db_backup.sql  # MySQL database backup
```

---

## 👤 Author

**GGPRanga**
- GitHub: [@HALFFY](https://github.com/HALFFY)
- Live App: [https://delivery-intime.ddns.net](https://delivery-intime.ddns.net)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
