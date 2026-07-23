# BAMP AI - Orthodontic Treatment success outcome Evaluation Portal

AI-Powered Web Application for Orthodontists to evaluate and predict the successful treatment outcome of **Bone Anchored Maxillary Protraction (BAMP)** in patients with **Class III Skeletal Malocclusion with Maxillary Hypoplasia**.

---

## Technical Architecture Overview

The system is structured as a full-stack Javascript application:
*   **Frontend**: React (Vite-powered Single Page Application), Tailwind CSS for a premium medical visual style, Framer Motion for transitions, Chart.js for data analytics, and HTML Canvas for coordinate mapping overlays.
*   **Backend**: Node.js, Express.js REST APIs, Multer for scan processing, and PDFKit for synthesis of verifiable clinical PDF records.
*   **Database**: Firebase Admin/Client SDK (Firestore and Cloud Storage) with a robust in-memory/local storage **Demo Mode** fallback.

---

## Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org) (v16+) installed.

### 2. Backend Installation & Startup
Open a terminal in the root and run:
```bash
cd web/backend
npm install
npm start
```
*The backend server will run on `http://localhost:5000`.*

### 3. Frontend Installation & Startup
Open another terminal in the root and run:
```bash
cd web/frontend
npm install
npm run dev
```
*The frontend development server will launch on `http://localhost:5173`.*

---

## Out-of-the-Box Demo Mode

> [!IMPORTANT]
> If Firebase credentials are not provided in the environment variables, the application will automatically enter **Demo/Local Mode**. All functionalities—including logins, registrations, landmark calibrations, AI evaluations, chart renders, and PDF compiling—will remain fully functional using local database fallbacks!

To test authentication immediately, use these default credentials:
*   **Doctor Email**: `dr.venkat@hospital.org`
*   **Default Password**: `password123`
*   **Demo OTP Code**: Automatically logged to the backend console (or displayed on the screen for convenience).

---

## Project Structure

```text
web/
├── backend/
│   ├── src/
│   │   ├── config/         # Firebase Admin SDK setups
│   │   ├── middleware/     # JWT Auth and central error handlers
│   │   ├── controllers/    # Express controllers (auth, patients, stats)
│   │   ├── routes/         # REST API routes
│   │   ├── services/       # DB abstraction layers
│   │   ├── ai/             # Preprocessing, landmark tracking, predictors
│   │   └── utils/          # PDF and QR generation utilities
│   ├── server.js           # Server entry point
│   └── .env                # Port, secret keys, Firebase environment variables
└── frontend/
    ├── src/
    │   ├── components/     # Canvas overlays, Sidebars, wrappers
    │   ├── context/        # Auth & theme contexts
    │   ├── firebase/       # Client Firebase connections
    │   ├── pages/          # 14 distinct functional clinical pages
    │   ├── services/       # Preconfigured Axios api callers
    │   ├── index.css       # Tailwind layers and custom glass panels styling
    │   └── App.jsx         # SPA Routes mapping
    └── package.json
```

---

## AI Image Processing Pipeline

The backend features a modular clinical workflow:
1.  **Image Ingestion**: Parse image file uploads.
2.  **Noise Filtering**: Clean bone contours.
3.  **Contrast Mapping**: CLAHE optimization isolating jaw structures.
4.  **Sutural Segmentation**: Isolate maxilla and mandible bounds.
5.  **Landmark Fitting**: Fit coordinates for Sella, Nasion, Point A, Point B, etc.
6.  **Cephalometric Analysis**: Trigonometric calculations of SNA, SNB, ANB, and FMA angles.
7.  **Success Outcome Modeling**: Score growth divergence patterns and patient chronological age.
8.  **Digital Certificate Compilation**: Output printable PDF reports with digital signatures and verification QR codes.
