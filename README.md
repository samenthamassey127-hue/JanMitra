# JanMitra (जनमित्र)

> **“Understand. Discover. Apply.”**
> 
> *A personalized government benefits and services navigator that turns a citizen's real-life situation into a clear, evidence-backed action plan.*

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-teal.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🏛️ Core Product Philosophy

> **“Citizens should not need to understand the structure of government in order to access government services.”**

Traditional government portals force citizens to already know the exact scheme name, administrative department, circular gazette, and form code before applying. 

**JanMitra** fundamentally reverses this model:
- Instead of asking: *"Which government scheme are you looking for?"*
- JanMitra asks: **“What are you trying to do?”**

```
MY SITUATION
     ↓
WHAT CAN I GET?
     ↓
WHY MAY I QUALIFY?
     ↓
WHAT AM I MISSING?
     ↓
WHAT DOCUMENTS DO I NEED?
     ↓
HOW DO I GET THEM?
     ↓
WHAT DO I DO NEXT?
     ↓
TRACK MY JOURNEY
```

---

## 🚀 Key Features Implemented

### 1. 🔍 Life-Situation & Conversational Discovery
- Natural language query box that extracts structured citizen attributes into interactive, editable profile chips (`20 years ×`, `Lucknow, UP ×`, `B.Tech Student ×`, `₹2.5L income ×`, `OBC ×`).
- **Progressive Questioning**: Asks 1-2 targeted micro-questions at a time rather than overwhelming users with long bureaucratic forms.
- **10 Visual Life Situation Cards**: Education, Financial Support, Senior Citizens, Healthcare, Housing, Employment, Certificates & Documents, Agriculture, Business, and *"I'm Not Sure"*.
- **"I'm Not Sure" Guided Flow**: 3-step diagnostic wizard for citizens who don't know scheme or service names.

### 2. 📊 Deterministic Eligibility & "What Am I Missing?" Engine
- Rule evaluation engine verifying Age, State, Income thresholds, Social Category, Land records, and Course levels.
- **Cautious language guardrails**: Displays *"You may be eligible based on the information provided"* — never falsely guarantees official government sanction.
- **"What Am I Missing?"**: Highlights completed vs missing requirements with direct actionable bridges connecting missing documents straight into the **Government Service Navigator**.

### 3. 🗺️ Government Service Navigator & 6-Step Procedures
- Comprehensive administrative guides for Uttar Pradesh public services (*Income Certificate / Aay Praman Patra*, *Domicile Certificate*, *Caste Certificate*, *Ration Card*, *Disability Certificate*, *Bhulekh Khatauni*, etc.).
- 6-step interactive procedure timeline: Checks eligibility → Prepares documents → Navigates official portal → Submits application & nominal fee → Tehsil/Lekhpal field verification → Digital certificate download.

### 4. 📜 Evidence-First Provenance ("Why is JanMitra saying this?")
- Every scheme and service contains an expandable provenance panel citing:
  - Official Government Department / Ministry
  - Government Order / Gazette notification reference number
  - Publication date & JanMitra audit verification date
  - Direct external link to the authentic government portal
  - Verbatim excerpt from official operating guidelines.

### 5. 🗄️ Document Intelligence & Vault ("My Documents")
- Citizen Document Locker managing Aadhaar, PAN, Marksheets, Ration Cards, Khatauni, etc., with status indicators (`✓ Available`, `⚠ Expired`, `○ Missing`).
- **Simulated Ingestion & Scan**: Test uploads trigger simulated OCR and preliminary format checks (*never claims legal validation*).
- **Document-to-Service Matcher**: Audit locker readiness against any scheme or service with a single click.

### 6. 🌲 Government Service Dependency Graph
- Interactive visual tree demonstrating prerequisite chains (e.g. *UP Post-Matric Scholarship requires Income Certificate which requires Lekhpal field inquiry*).
- Identifies bottlenecks and provides direct *"Resolve"* buttons to unblock applications.

### 7. 🎯 Active Journey Tracker & Application Dashboard
- 8-stage lifecycle tracker (*Preparation → Ready to Apply → Submitted → Under Verification → Action Required → Approved / Completed*).
- Next recommended action banner, personal notes recorder, and official Application Reference Number logger.
- Confetti celebration upon milestone completion.

### 8. 💡 "Explain This" AI Legalese Simplifier
- Paste or select dense bureaucratic notices (e.g. UP scholarship self-declaration clauses, Lekhpal revenue rules, PM-JAY pre-authorizations, senior citizen life certificates).
- Translates into:
  1. *In Simple Language* (Hindi / English)
  2. *What You Need to Do* (Numbered action items)
  3. *Common Traps to Avoid* (Audit rejection warnings)
  4. *Official Source Citation*

### 9. 🌐 Multilingual UX (English & हिंदी)
- Live language toggle between **English** and **हिंदी (Hindi)** across all headers, cards, buttons, checklists, and advice.
- Voice search simulation with audio soundwave animation.

### 10. 🔒 Privacy Center & Citizen Data Sovereignty
- 100% Client-Side Privacy: All personal data is saved in local browser storage; zero third-party tracking or cloud replication.
- One-click **Export My Data (JSON)** backup.
- One-click **Reset / Wipe All Stored Data**.

---

## 🧪 4 Showcase Scenarios (1-Click Demo)

The application includes a ribbon at the top of the header to test the 4 core product scenarios:

| Scenario | Persona & Query | Demonstrates |
| :--- | :--- | :--- |
| **Scenario A: Student** | 20-yr B.Tech student in Lucknow, ₹2.5L income | Profile extraction → UP Post-Matric Scholarship → Missing/Expired Income Certificate → Service Navigator bridge |
| **Scenario B: Senior Citizen** | 66-yr retired father in rural Varanasi | Low income & healthcare need → UP Vridhavastha Pension & Ayushman Bharat PM-JAY match |
| **Scenario C: Certificate** | Citizen needing an Income Certificate | Direct public service workflow, Lekhpal inquiry, documents checklist, fee & timeline |
| **Scenario D: Confusing Language** | User uploads confusing government circular | "Explain This" tool translating legalese into 4 clear human steps |

---

## 🛠️ Quickstart & Local Development

### Prerequisites
- Node.js (v18 or higher recommended; developed on Node v24)
- npm (v9 or higher)

### Setup & Launch
```bash
# Clone the repository
git clone https://github.com/samenthamassey127-hue/JanMitra.git

# Navigate into the project folder
cd JanMitra

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open your browser at `http://localhost:5173` to explore JanMitra.

### Build for Production
```bash
npm run build
npm run preview
```

---

## 🛡️ Trust & Safety Guardrails

- **Independent Platform**: JanMitra is an independent civic discovery platform and is not affiliated with the Government of India or the Government of Uttar Pradesh.
- **No False Promises**: The system consistently uses cautious phrasing (*"You may be eligible based on provided info"* and *"Preliminary document check"*).
- **Statutory Authority**: Decisions regarding document legality, quota verification, and sanctioning of grants rest solely with official government authorities.

---

## 📄 License
MIT License. Created for Indian citizens to make public benefits accessible, understandable, and actionable.
