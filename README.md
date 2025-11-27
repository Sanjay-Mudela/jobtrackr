# 🚀 JobTrackr – MERN Job Application & Tracking System

JobTrackr is a **production-ready MERN stack application** that helps users manage and track their job applications, follow-up dates, interview progress, and application history — all in one place.

It features **JWT authentication, Job CRUD with analytics, search and filter system, pagination, detailed job modal, responsive dashboard, and polished UI/UX using Tailwind CSS.**

> 🧠 Built as a real-world SaaS-style project following **industry best practices, clean code structure, and professional git workflow.**

---

## 🌍 Live Demo

| Service                  | Link                                                                               |
| ------------------------ | ---------------------------------------------------------------------------------- |
| **Frontend (Vercel)**    | [https://jobtrackr-rho.vercel.app](https://jobtrackr-rho.vercel.app)               |
| **Backend API (Render)** | [https://jobtrackr-api-b1in.onrender.com](https://jobtrackr-api-b1in.onrender.com) |

---

## 📸 Screenshots (Add Later)

* Dashboard view
* Add/Edit job form
* Analytics charts
* Job modal with details
* Login/Register screen

---

## 📌 Features

### 🔐 Authentication

* Register & login using JWT
* Secure password hashing (bcryptjs)
* Protected API routes & React route protection
* Automatic logout on token expiry
* Session expiration alerts using toast

### 📝 Job Management (CRUD)

| Feature                               | Status |
| ------------------------------------- | ------ |
| Add job                               | ✔      |
| Edit job                              | ✔      |
| Delete job (with confirmation dialog) | ✔      |
| View job details (modal)              | ✔      |
| Track job follow-up date              | ✔      |
| Attach notes, source, location        | ✔      |

### 🔎 Search & Filtering

* Keyword search (company & position)
* Status filter
* **Follow-up quick filter**
* **Sorting (latest/oldest)**

### 📊 Analytics Dashboard

| Chart                  | Status |
| ---------------------- | ------ |
| Applications by status | ✔      |
| Applications over time | ✔      |
| Applications by source | ✔      |

### 🎨 UI / UX

* Modern responsive interface using Tailwind CSS
* Interactive dashboard cards
* Soft transitions & hover effects
* Custom reusable UI components (Button, Input, Select, Card)
* Toast notifications
* Dark theme

### 📄 Extra Features

* **Client-side pagination**
* **Job details modal with follow-up/date/status display**
* **Axios interceptor for token management**

---

## 🛠 Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | React (Vite), Tailwind CSS          |
| State Mgmt | React Context API                   |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB (Mongoose)                  |
| Auth       | JWT, bcryptjs                       |
| Charts     | Recharts                            |
| Deployment | Vercel (Frontend), Render (Backend) |

---

## 🔌 System Architecture

```txt
React (Frontend) → Axios → Express.js API → MongoDB
        |                |
        → JWT Token ← Auth Middleware
```

---

## 📁 Folder Structure

```
jobtrackr/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── context/
    │   ├── pages/
    │   ├── components/
    │   ├── App.jsx
    │   └── main.jsx
```

---

## ⚙️ Local Setup

### 🔹 Clone Repository

```bash
git clone https://github.com/Sanjay-Mudela/jobtrackr.git
cd jobtrackr
```

### 🔹 Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
```

Run:

```bash
npm run dev
```

### 🔹 Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

---

## 🔁 API Endpoints

| Method | Endpoint             | Description        |
| ------ | -------------------- | ------------------ |
| POST   | `/api/auth/register` | User registration  |
| POST   | `/api/auth/login`    | User login         |
| GET    | `/api/jobs`          | Get all jobs       |
| POST   | `/api/jobs`          | Add job            |
| PUT    | `/api/jobs/:id`      | Edit job           |
| DELETE | `/api/jobs/:id`      | Delete job         |
| GET    | `/api/jobs/stats`    | Get activity stats |

---

## 📚 What I Learned

* Full-stack development using MERN
* JWT authentication & refresh handling
* Axios interceptor and protected routes
* Real-time filtering, sorting, pagination in UI
* Chart integration using Recharts
* Deployment & environment configuration
* Advanced UI/UX with React + Tailwind
* Writing professional commit messages
* Debugging and solving production issues

---

## 🚀 Future Enhancements

* **Job Activity History (in progress)**
* Resume/CV file uploads
* Email notifications/reminders
* OAuth login (Google/GitHub)
* Refresh token auth system
* Custom job stages timeline

---

## 👨‍💻 Author

**Sanjay Singh Mudela**
🎓 MCA Graduate | 💻 MERN Developer

🔗 LinkedIn: [https://www.linkedin.com/in/sanjay-mudela](https://www.linkedin.com/in/sanjay-mudela)
🐙 GitHub: [https://github.com/Sanjay-Mudela](https://github.com/Sanjay-Mudela)

---

## ⭐ Support

If you like this project, feel free to **star ⭐ the repository**.

---

> 💡 *Created to track applications during my developer job hunt — built with attention to detail, professional coding standards, and scalability in mind.*
> *"Track every job like a pro!"*

---

