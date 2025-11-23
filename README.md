# 🚀 JobTrackr – MERN Job Application & Interview Tracker

JobTrackr is a production-ready **MERN full-stack application** that helps users track their job applications, interview stages, offers, and rejections — all in one place.

It features **JWT authentication, job CRUD operations, analytics dashboard, and a responsive UI built with Tailwind CSS**.

---

## 🌐 Live Demo

| App | Link |
|-----|------|
| **Frontend (Vercel)** | https://jobtrackr-rho.vercel.app |
| **Backend API (Render)** | https://jobtrackr-api-b1in.onrender.com |

---

## 📸 Screenshots (Coming Soon)

> Add images of UI here (Dashboard, Add Job form, Login screen)  
I can take screenshots & upload here later.

---

## 📌 Features

### 🔒 Authentication & Security
- Register & Login
- JWT-based authentication
- Hashed passwords (bcrypt)
- Protected routes (middleware)
- Per-user job data

### 📝 Job Management (CRUD)
- Add, update, delete job applications
- Store company, position, status, source, location, notes
- Clean dashboard display

### 📊 Analytics Dashboard
| Status | Tracked |
|--------|----------|
| Total | ✓ |
| Applied | ✓ |
| Online Test | ✓ |
| Interview | ✓ |
| Offer | ✓ |
| Rejected | ✓ |

### 🎨 UI/UX Highlights
- Dark mode
- Tailwind CSS styling
- Responsive & mobile-ready
- Smooth navigation

---

## 🛠 Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React, Vite, Tailwind CSS |
| Routing | React Router |
| State Mgmt | React Context API |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT, bcryptjs |
| Deployment | Vercel (Frontend), Render (Backend) |

---

## 🧠 System Architecture

```text
React (Frontend) → Axios → Express (API) → MongoDB Atlas
                           ↓
                     JWT Authentication
````

---

## 📁 Project Structure

```
jobtrackr/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── .env (ignored)

└── frontend/
    ├── src/
    │   ├── api/
    │   ├── context/
    │   ├── pages/
    │   ├── components/
    │   ├── App.jsx
    │   └── main.jsx
    └── .env.local (ignored)
```

---

## ⚙️ Local Setup

### 1️⃣ Clone repo

```bash
git clone https://github.com/Sanjay-Mudela/jobtrackr.git
cd jobtrackr
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```env
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
```

Run server:

```bash
npm run dev
```

### 3️⃣ Frontend Setup

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

## 🔄 API Endpoints

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | Login             |
| POST   | `/api/jobs`          | Add job           |
| GET    | `/api/jobs`          | Get all jobs      |
| GET    | `/api/jobs/:id`      | Get job by ID     |
| PUT    | `/api/jobs/:id`      | Update job        |
| DELETE | `/api/jobs/:id`      | Delete job        |
| GET    | `/api/jobs/stats`    | Get stats         |

---

## 🧠 What I Learned

✔ MERN stack development from scratch
✔ JWT authentication & protected routing
✔ MongoDB aggregation pipelines
✔ React Context & Axios interceptor
✔ Deployment using Render & Vercel
✔ Clean Git/GitHub commit workflow

---

## 🚀 Future Improvements

* Job filtering & search
* Reminder notifications
* Analytics charts (Chart.js / Recharts)
* File upload (resume/CV)
* Login with Google/GitHub (OAuth)

---

## 👨‍💻 Author

**Sanjay Singh Mudela**
🎓 MCA Graduate | MERN Developer

🔗 LinkedIn: [https://www.linkedin.com/in/sanjay-mudela](https://www.linkedin.com/in/sanjay-mudela)
🐙 GitHub: [https://github.com/Sanjay-Mudela](https://github.com/Sanjay-Mudela)

---

## ⭐ Support

```bash
If you like this project, please ⭐ the repo!
```

---

> 💡 *Built to simplify job hunting — and help me get hired faster.*



