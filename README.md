# 🚀 Expense Tracker Backend API

A secure and scalable backend built using **Node.js, Express, and MongoDB** for managing user authentication and expense tracking.

---

## 📌 Features

* 🔐 User Authentication (Signup/Login with JWT)
* 🔑 Protected Routes using Middleware
* 💰 Expense Management (Add, Fetch, Delete)
* 📦 MongoDB Database Integration
* ⚡ RESTful API Design
* 🌐 CORS Enabled for Frontend Integration

---

## 🛠️ Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB + Mongoose**
* **JWT (JSON Web Tokens)**
* **bcrypt (Password Hashing)**

---

## 📂 Project Structure

```
├── Controllers/
│   ├── AuthController.js
│   ├── ExpenseController.js
│
├── Middlewares/
│   ├── Auth.js
│   ├── AuthValidation.js
│
├── Models/
│   ├── db.js
│   ├── User.js
│
├── Routes/
│   ├── AuthRouter.js
│   ├── ExpenseRouter.js
│   ├── ProductRouter.js
│
├── .env
├── server.js
```

---

## ⚙️ Environment Variables

Create a `.env` file in root:

```
PORT=8080
MONGO_CONN=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```
git clone https://github.com/your-username/expense-tracker-backend.git
cd expense-tracker-backend
```

### 2️⃣ Install dependencies

```
npm install
```

### 3️⃣ Run the server

```
npm start
```

Server runs on:

```
http://localhost:8080
```

---

## 📡 API Endpoints

### 🔐 Auth Routes

#### ➤ Signup

```
POST /auth/signup
```

**Body:**

```
{
  "name": "Himanshu",
  "email": "test@example.com",
  "password": "123456"
}
```

---

#### ➤ Login

```
POST /auth/login
```

**Response:**

```
{
  "jwtToken": "your_token_here"
}
```

---

### 💰 Expense Routes (Protected)

👉 Requires Header:

```
Authorization: Bearer <token>
```

---

#### ➤ Get All Expenses

```
GET /expenses
```

---

#### ➤ Add Expense

```
POST /expenses
```

**Body:**

```
{
  "text": "Food",
  "amount": 200
}
```

---

#### ➤ Delete Expense

```
DELETE /expenses/:expenseId
```

---

### 📦 Product Route (Protected Demo)

```
GET /products
```

Returns dummy data for testing authentication.

---

### 🩺 Health Check

```
GET /ping
GET /
```

---

## 🔐 Authentication Flow

1. User signs up
2. User logs in → receives JWT token
3. Token is sent in headers:

```
Authorization: Bearer <token>
```

4. Middleware verifies token and allows access

---

## ⚠️ Common Issues

### ❌ 401 Unauthorized

* Token missing or invalid

### ❌ 500 Internal Server Error

* Check MongoDB connection
* Check environment variables

### ❌ CORS Issues

* Ensure frontend URL is allowed in backend

---

## 🧪 Testing

You can test APIs using:

* Postman
* cURL

---

## 📈 Future Improvements

* 🧾 Expense Categories
* 📊 Analytics Dashboard
* 🧑‍🤝‍🧑 Multi-user sharing
* 🌍 Deployment with Docker + CI/CD
* 🔔 Notifications & Alerts

---

## 👨‍💻 Author

**Himanshu Bhandari**

---

## 📜 License

This project is licensed under the MIT License.
