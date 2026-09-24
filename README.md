# Q-ROUTE 🚦⚛️
### Quantum-Inspired Intelligent Traffic Route Optimization System
> *"Smarter Routes. Less Traffic. Better Journeys."*  
> **Smart India Hackathon (SIH) Prototype**

---

## 🌟 Executive Summary

**Q-ROUTE** is a production-style, full-stack intelligent traffic navigation system designed to combat urban gridlock, reduce fuel consumption, and cut vehicular emissions. 

Unlike traditional navigation engines that compute single-objective shortest paths (which frequently direct everyone onto the same arterial corridor, causing secondary bottlenecks), **Q-Route introduces a Classical Quantum-Inspired Multi-Objective Optimization Engine**. It balances:
1. **Travel Time** (dynamic traffic-aware duration)
2. **Traffic Bottleneck Delay** (congestion penalty $+X$ min)
3. **Vehicle Energy / Fuel Consumption** (physics model with stop-and-go idle friction)
4. **Historical Road-Risk Exposure** (MoRTH published corridor blackspots)
5. **Physical Road Distance**

Designed with a modern, pastel **Canva/Figma-inspired smart-mobility dashboard**, the application is technically demonstrative and hackathon-ready.

---

## 🏛️ System Architecture

```
                                    +-----------------------------------+
                                    |    User Browser / Dashboard UI   |
                                    | (React + TypeScript + Tailwind)   |
                                    +-----------------+-----------------+
                                                      |
                                           REST API & Telemetry
                                                      |
                                                      v
                                    +-----------------------------------+
                                    |       Q-Route Backend Server      |
                                    |     (Node.js + Express Server)    |
                                    +--------+--------+--------+--------+
                                             |        |        |
                     +-----------------------+        |        +-----------------------+
                     |                                |                                |
                     v                                v                                v
+--------------------------+     +--------------------------+     +--------------------------+
|  Traffic & Map Provider  |     |  Quantum-Inspired Engine |     |     Storage Subsystem    |
| - Google Routes API      |     | - Qubit State Vectors    |     | - SQLite / Persistent DB |
| - OpenStreetMap / OSRM   |     | - Rotation Gate Updates  |     | - Search History Logs    |
| - Demo Indian Corridors  |     | - Multi-Objective Cost   |     | - User Rating & Feedback |
+--------------------------+     +--------------------------+     +--------------------------+
```

---

## ⚛️ Quantum-Inspired Optimization Engine

> **Important Disclosure:**  
> *"Quantum-inspired optimization concepts are implemented on a classical computer to explore multiple routing solutions."* It does not require physical quantum computers.

### Mathematical Formulation

1. **Q-Bit State Representation:**
   Each candidate route $i \in \{1, \dots, N\}$ is represented in a probabilistic Q-register:
   $$\vert \psi_i \rangle = \alpha_i \vert 0 \rangle + \beta_i \vert 1 \rangle, \quad \text{where } |\alpha_i|^2 + |\beta_i|^2 = 1$$
   - Probability of selecting state $\vert 1 \rangle$ is $P_i = |\beta_i|^2$.
   - Initialized in equal superposition ($\alpha_i = \beta_i = \frac{1}{\sqrt{2}}$).

2. **Quantum Rotation Gate Update:**
   During iterations, Q-bits rotate towards the best observed candidate state:
   $$\begin{bmatrix} \alpha_i^{(t+1)} \\ \beta_i^{(t+1)} \end{bmatrix} = \begin{bmatrix} \cos(\Delta\theta) & -\sin(\Delta\theta) \\ \sin(\Delta\theta) & \cos(\Delta\theta) \end{bmatrix} \begin{bmatrix} \alpha_i^{(t)} \\ \beta_i^{(t)} \end{bmatrix}$$
   Where $\Delta\theta$ dynamically scales with iteration cooling:
   $$\Delta\theta = \theta_0 \cdot \sin\left(\frac{\pi}{2} \cdot \left(1 - \frac{t}{T_{\max}}\right)\right)$$

3. **Multi-Objective Cost Function:**
   $$C(r) = w_1 \cdot \widetilde{T}_{\text{time}} + w_2 \cdot \widetilde{D}_{\text{traffic}} + w_3 \cdot \widetilde{F}_{\text{fuel}} + w_4 \cdot \widetilde{R}_{\text{risk}} + w_5 \cdot \widetilde{K}_{\text{distance}}$$
   - **Balanced Mode:** $w_1=0.35, w_2=0.25, w_3=0.20, w_4=0.10, w_5=0.10$
   - **Fastest Mode:** $w_1=0.55, w_2=0.25, w_3=0.10, w_4=0.05, w_5=0.05$
   - **Fuel Efficient:** $w_3=0.50, w_2=0.20, w_1=0.15, w_5=0.10, w_4=0.05$
   - **Low Traffic:** $w_2=0.50, w_1=0.25, w_3=0.15, w_4=0.05, w_5=0.05$

4. **Composite Q-Route Score:**
   $$\text{Q-Score} = 75 + \left(\frac{C_{\max} - C(r)}{C_{\max} - C_{\min}}\right) \times 23 \quad (0 - 100)$$

---

## 📊 Data Sources & Transparency

| Data Layer | Source Provider | Classification | Usage in Q-Route |
| :--- | :--- | :--- | :--- |
| **Road Network** | OpenStreetMap (OSM) & CartoDB | `REAL-TIME DATA` | Road network topology and vector tiles |
| **Traffic Telemetry** | Google Maps Routes API / OSRM | `REAL-TIME DATA` | Live transit speeds and bottleneck delays |
| **Historical Road Risk** | MoRTH / data.gov.in Statistics | `HISTORICAL DATA` | Blackspot risk index (NOT live accidents) |
| **Energy Consumption** | Empirical Vehicle Model | `ESTIMATED DATA` | Litres for fuel / kWh for EV + idle penalty |
| **Demo Corridors** | Indian Corridor Presets | `SIMULATED DATA` | Jaipur, Delhi, Bengaluru, Mumbai presets |

---

## 🚀 Quick Start Guide (Local Setup)

### Prerequisites
- Node.js (v20+ or v22+)
- Windows, macOS, or Linux

### 1. Environment Configuration
Copy the template configuration file:
```bash
cp .env.example .env
```
Open `.env` in any text editor:
```env
PORT=5000

# Optional: Add Google Routes API Key for enterprise live Google routing
# Leave blank to run seamlessly in high-fidelity "Demo Traffic Mode"
GOOGLE_ROUTES_API_KEY=
GOOGLE_MAPS_API_KEY=

DATABASE_URL=file:./data/qroute_db.json
TRAFFIC_POLL_INTERVAL_MS=10000
NODE_ENV=development
```

### 2. Run Backend & Full-Stack Server
```bash
cd backend
npm install
npm start
```
The server will start at:
👉 **`http://localhost:5000`**

It automatically serves the built frontend **and** the REST API on port 5000!

### 3. (Optional) Run Frontend Dev Server with HMR
```bash
cd frontend
npm install
npm run dev
```
Open:
👉 **`http://localhost:3000`**

---

## 🎯 3-5 Minute Hackathon Demonstration Script

1. **Open Dashboard (`http://localhost:5000`)**:
   Show the clean Canva-inspired UI:
   - Green pill: Origin
   - Navy pin: Destination
   - Navy line: Recommended Q-Route
   - Grey dashed line: Alternative routes
   - Red line: Traffic bottlenecks
   - Car dot: Simulated vehicle flow

2. **Select an Indian Corridor**:
   Click any preset chip:
   - **Jaipur → Ajmer** (NH-48 vs Bagru-Naraina Bypass)
   - **Delhi → Gurgaon** (NH-48 vs MG Road / Vasant Kunj)
   - **Bengaluru → Electronic City** (Silk Board surface vs Elevated Tollway)
   - **Mumbai Bandra → Nariman Point** (Cadell Road vs Bandra-Worli Sea Link)

3. **Select Vehicle Profile**:
   Choose **EV** (kWh) or **Petrol Car** (Litres) to show dynamic consumption estimation.

4. **Click "FIND OPTIMAL ROUTE"**:
   Observe the 5-step animated progress:
   - *Step 1: Fetching live traffic...*
   - *Step 2: Generating candidate routes...*
   - *Step 3: Calculating route costs...*
   - *Step 4: Running Q-Route optimization...*
   - *Step 5: Selecting optimal route...*

5. **Examine the 10-Second Executive Summary**:
   Show the judge:
   - Traffic ETA vs Normal ETA (with $+X$ min traffic delay)
   - Fuel / Energy consumption
   - Composite Q-Score (e.g. 94 / 100)
   - **"WHY THIS ROUTE?"** explanation card

6. **Demonstrate Dynamic Re-Routing (Requirement 14)**:
   - Click **"Simulate Traffic Bottleneck (+20 min)"** on the top demo bar.
   - Watch the alert trigger:  
     `⚠ Traffic conditions changed: Your current route may no longer be optimal.`
   - Click **"RECALCULATE ROUTE"**.
   - Watch the optimizer automatically detour traffic onto the bypass corridor in real-time!

7. **Explore Analytics & Methodology Tabs**:
   - **Live Traffic:** 10-second polling telemetry and incident stream.
   - **Analytics:** Recharts before/after comparison and QEA entropy decay curve.
   - **Methodology:** 8-stage pipeline from Road Graph to Quantum Search.
   - **Route History:** SQLite search logs.

---

## 🛠️ REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System health status & subsystem check |
| `GET` | `/api/places/states` | All 28 Indian States & 8 UTs with city counts |
| `GET` | `/api/places/cities?state=...` | All cities present in a specific Indian state |
| `GET` | `/api/places/cities/all` | 500+ Indian cities grouped by respective states |
| `GET` | `/api/places/search?q=...&state=...` | Fast fuzzy search + Live OSM Nominatim geocoding |
| `GET` | `/api/places/popular` | Major interstate demonstration highway corridors |
| `POST` | `/api/places/geocode` | Resolve arbitrary place name into [lat, lng] |
| `POST` | `/api/routes/optimize` | Run Quantum-Inspired multi-objective optimization |
| `POST` | `/api/routes/calculate` | Fetch raw candidate routes across India |
| `GET` | `/api/traffic` | Live traffic condition telemetry & incident feed |
| `POST` | `/api/traffic/simulate-change`| Trigger traffic surge for rerouting demonstration |
| `GET` | `/api/history` | Historical searches logged in SQLite |
| `GET` | `/api/analytics` | Comparative KPIs & QEA convergence logs |
| `POST` | `/api/feedback` | User route ratings & suggestions |

---

## 🔒 Security & Privacy
- **API Keys:** Never bundled into client JavaScript. Managed exclusively on the server through `.env`.
- **CORS:** Configured for local hackathon development.
- **Privacy:** No personal PII stored; queries use anonymized coordinate vectors.

---

## 🏆 Smart India Hackathon Submission Details
- **Project Name:** Q-ROUTE
- **Project Title:** Quantum-Inspired Intelligent Traffic Route Optimization System
- **Theme:** Smart Mobility / Transportation & Logistics
