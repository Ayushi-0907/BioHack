# CareTrail ActionLoop 🩺💊

> A health-tech document management, AI extraction verification, and smart medicine reminder system.

CareTrail ActionLoop is an intuitive, responsive React application designed to bridge the gap between complex medical documentation (prescriptions, lab reports, discharge summaries) and daily medication adherence. 

By combining simulated AI document parsing, side-by-side evidence verification, human-in-the-loop conflict resolution, and contextual care reminders, CareTrail ActionLoop ensures patient safety and clarity.

---

## ✨ Features

- 🌓 **Theme Support**: Seamless toggle between Light Theme and Dark Theme using a calming, medical-friendly palette (slate blues, soft sage greens, warm off-whites).
- 📱 **Adaptive Navigation**: Fully responsive design featuring a collapsible Desktop Sidebar, a Top Navbar, and a Mobile Bottom Navigation bar.
- 📋 **Onboarding & Medical Intake**: User profile setup tracking chronic conditions (e.g., Diabetes, Hypertension) and allergies, which dynamically triggers smart lab test reminders.
- 📊 **Interactive Dashboard**: High-level daily overview showing medication adherence metrics, today's schedule, contextual care alerts, and recent uploads.
- 📄 **Document Upload & AI Parser Simulation**: Drag-and-drop document uploader with simulated OCR extraction progress and structured JSON schema output.
- 🔍 **Review & Evidence Timeline**: Dual-pane side-by-side verification view mapping extracted dosage instructions directly to raw source snippets for full transparency.
- ⚠️ **Human-in-the-Loop Conflict Flagging**: Dedicated warning module that flags ambiguous text (e.g., "take as directed") or conflicting instructions across documents, requiring explicit user resolution before schedule activation.
- ⏰ **Smart Reminder Engine**: Interactive schedule manager allowing users to mark medicines as **Taken**, **Skipped**, or **Snoozed**, backed by a full compliance audit log.

---

## 🛠️ Tech Stack

- **Frontend**: React (JSX)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tooling**: Vite / Create React App compatible

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v16.0 or higher recommended).

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/ayushi-0907/caretrail-actionloop.git](https://github.com/ayushi-0907/caretrail-actionloop.git)
   cd caretrail-actionloop
