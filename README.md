# 💰 Expense Manager (MERN Stack)

A full-stack **Expense Management Web App** built using **MongoDB, Express, React, Node.js (MERN)** with authentication, protected routes, and real-time expense tracking.

---

## 🚀 Live Demo

* 🌐 Frontend: (Add your Vercel link)
* 🔗 Backend API: (Add your Render link)

---

## 📌 Features

### 🔐 Authentication

* User Signup & Login
* JWT-based authentication
* Persistent login using `localStorage`

### 💰 Expense Management

* Add expenses
* View all expenses
* Delete expenses

### 🔒 Security

* Protected routes using middleware
* Token-based API access

### 🎯 User Experience

* Toast notifications (success/error)
* Auto redirect after login
* Session persistence after refresh

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* React Toastify

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* bcrypt

---

## 📂 Project Structure

```id="s7k2dl"
EXPENSEMANAGER/
│
├── backend/
│   ├── Controllers/
│   ├── Models/
│   ├── Routes/
│   ├── Middlewares/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── ExpenseTable.js
│   │   │   ├── ExpenseForm.js
│   │   │   ├── ExpenseDetails.js
│   │   │
│   │   ├── RefrshHandler.js
│   │   ├── App.js
│   │   ├── index.js
│   │
│   └── package.json
```

---

## ⚙️ Environment Variables

### Backend (`.env`)

```id="3bcz9z"
PORT=8080
MONGO_CONN=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Frontend (`.env`)

```id="1t7v5q"
REACT_APP_API_URL=http://localhost:8080
```

---

## 🚀 Getting Started

### 1️⃣ Clone Repository

```id="d8lq7c"
git clone https://github.com/your-username/expense-manager.git
cd expense-manager
```

---

### 2️⃣ Setup Backend

```id="6bkl4x"
cd backend
npm install
npm start
```

Backend runs on:

```id="m9g4hp"
http://localhost:8080
```

---

### 3️⃣ Setup Frontend

```id="4r2z2m"
cd frontend
npm install
npm start
```

Frontend runs on:

```id="3v5d0r"
http://localhost:3000
```

---

## 🔐 Authentication Flow

1. User signs up
2. User logs in → receives JWT token
3. Token stored in:

```id="9wq0kq"
localStorage
```

4. Token sent in API requests:

```id="0y9p7s"
Authorization: Bearer <token>
```

---

## 🔄 Refresh Handling (Important)

Your app uses a custom component:

```id="u4o3zp"
RefrshHandler.js
```

### ✅ What it does:

* Checks if token exists
* Keeps user logged in after refresh
* Redirects to `/home` automatically

---

## 🔒 Protected Routes

```id="t6o3d1"
const PrivateRoute = ({ element }) => {
  return isAuthenticated ? element : <Navigate to="/login" />
}
```

Only authenticated users can access:

* `/home`

---

## 📡 API Endpoints

### 🔐 Auth

* `POST /auth/signup`
* `POST /auth/login`

### 💰 Expenses (Protected)

* `GET /expenses`
* `POST /expenses`
* `DELETE /expenses/:id`

---

## 🔔 Notifications

Using **react-toastify**:

```id="g2n9cf"
toast.success("Success");
toast.error("Error");
```

---

## ⚠️ Common Issues & Fixes

### ❌ CORS Error

👉 Fix in backend:

```id="n5k2xb"
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
```

---

### ❌ Token Not Working

* Check header format:

```id="3o4l2p"
Authorization: Bearer <token>
```

---

### ❌ Redirect Issues

👉 Fix in `RefrshHandler`:

```id="5p9z1x"
navigate('/home', { replace: true });
```

---

### ❌ Deployment Issues (VERY COMMON)

If frontend is on Vercel and backend on Render:

👉 Use:

```id="v3h2c8"
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

---

## 📈 Future Improvements

* 📊 Charts (Analytics Dashboard)
* 🏷️ Expense Categories
* 🔍 Filters & Sorting
* 🌙 Dark Mode
* 📱 Mobile Responsive Design

---

## 👨‍💻 Author

**Himanshu Bhandari**

---

## ⭐ Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📜 License

MIT License
