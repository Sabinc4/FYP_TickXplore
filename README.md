# TickXplore

**TickXplore** is a transport booking platform (Final Year Project) that lets users book **bus tickets** and **vehicle reservations** across destinations in Nepal. It provides separate dashboards for **Users**, **Vendors**, and **Admins** to manage bookings, transport, and refunds.

The project is split into two parts:

| Folder       | Description                     | Tech Stack                                |
| ------------ | ------------------------------- | ----------------------------------------- |
| `Back_End`   | REST API server                 | Node.js, Express, MongoDB (Mongoose), JWT |
| `Front_End`  | Web application (all dashboards) | React + Vite + TypeScript, Tailwind CSS   |

---

## Prerequisites

- **Node.js** (v18 or later)
- **npm**
- **MongoDB** (local `mongod` or a cloud cluster such as MongoDB Atlas)

---

## Backend Setup (`Back_End/`)

```bash
cd Back_End
npm install
```

Create a `.env` file in `Back_End/`:

```env
# Server
PORT=3001

# Database (defaults to mongodb://localhost:27017/tickxplore)
MONGO_URI=mongodb://localhost:27017/tickxplore

# Auth secrets
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Khalti payment gateway (optional — used for payments)
KHALTI_SECRET_KEY=your_khalti_secret
KHALTI_RETURN_URL=http://localhost:5173/payment/callback
KHALTI_WEBSITE_URL=http://localhost:5173

# Email (OTP, password reset, notifications)
EMAIL_USER=your_email
EMAIL_PASS=your_email_password

# Chatbot
HUGGINGFACE_API_KEY=your_huggingface_key

# Frontend origin
CLIENT_URL=http://localhost:5173
```

Start the backend (auto-reloads via `nodemon`):

```bash
npm start
```

- Runs at **http://localhost:3001** · Health check: `GET /health`
- Images, logos, and uploads are served from `Back_End/uploads` (auto-created, git-ignored).

---

## Frontend Setup (`Front_End/`)

Open a second terminal:

```bash
cd Front_End
npm install
```

Create a `.env` file in `Front_End/`:

```env
# Backend API base URL
VITE_API_URL=http://localhost:3001

# Hugging Face chatbot key (optional — can be left blank)
VITE_HF_API_KEY=
```

Start the development server:

```bash
npm run dev
```

- Runs at **http://localhost:5173**.

---

## How to Use

1. Open **http://localhost:5173** and register a **User** account (or sign in).
2. On the homepage, select **Pickup Point**, **Dropping Point**, and **Date**, then click **Find Tickets** (all three are required).
3. Choose from **Available Buses** / **Available Vehicles**.
4. For buses, select seats on the seat-selection page; vehicles follow the reservation flow.
5. Pay with **Khalti** or **Cash on Visit**.
6. **Vendors** manage their buses/vehicles and bookings in `/VendorDashboard`.
7. **Admins** manage users, vendors, bookings, and refunds in `/Admin_Dashboard`.

---

## Project Structure

```
.
├── Back_End/
│   ├── config/          # App configuration (e.g. nodemailer)
│   ├── controllers/     # Request handlers per feature
│   ├── data/            # Static data (e.g. tourist-info.json)
│   ├── middleware/      # Auth & validation middleware
│   ├── models/          # Mongoose schemas (Bus, Vehicle, Booking, ...)
│   ├── routes/          # Express route definitions
│   ├── utils/           # Helpers (JWT, OTP, email, axios)
│   ├── uploads/         # Runtime-uploaded images (git-ignored)
│   └── index.js         # Server entry point
└── Front_End/
    ├── public/          # Static assets, favicons, logo
    └── src/
        ├── api/         # Typed API client + shared types
        ├── Component/   # Reusable UI components
        ├── Pages/       # Route pages (tickets, seat selection, dashboards, ...)
        ├── router/      # React Router configuration
        └── home/        # Homepage entry
```

---

## Scripts

### Backend (`Back_End/`)
| Command      | Description                  |
| ------------ | ---------------------------- |
| `npm start`  | Start the API with `nodemon` |

### Frontend (`Front_End/`)
| Command              | Description                 |
| -------------------- | --------------------------- |
| `npm run dev`        | Start the Vite dev server   |
| `npm run build`      | Production build            |
| `npm run preview`    | Preview the production build|
| `npm run typecheck`  | Run the TypeScript checker  |
| `npm run lint`       | Run ESLint                  |

---

## Troubleshooting

- **CORS errors** — keep the frontend on `http://localhost:5173` (the backend only allows this origin by default).
- **MongoDB connection error at startup** — confirm `mongod` is running, or check `MONGO_URI`.
- **Images not loading** — make sure `Back_End/uploads` exists and `VITE_API_URL` matches the backend port.
