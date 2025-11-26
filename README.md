# Roomify - AI Roommate Conflict Prediction System

![Roomify Banner](https://img.shields.io/badge/Roomify-AI%20Powered-blueviolet?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Demo%20Ready-success?style=for-the-badge)

> *Predict conflicts before they escalate. Create peaceful living spaces through AI-driven insights.*

## 🎯 Overview

**Roomify** is an intelligent hostel management system that predicts and prevents roommate conflicts through weekly sentiment analysis and AI-powered risk detection. By identifying tensions early, wardens can intervene proactively to maintain harmonious living environments.

### Key Features

- **📝 Weekly Vibe Checks** - Track student feedback with user attribution
- **🎯 Conflict Risk Scores** - AI-calculated harmony scores (0-100%)
- **📊 Admin Dashboard** - Real-time monitoring with heatmaps & trends
- **👤 User Management** - View and manage submissions by user
- **🗑️ Record Deletion** - Remove records when students leave
- **💡 Smart Tips** - Personalized peace suggestions
- **🔮 Predictive Analytics** - Pattern detection & trend analysis

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git (for cloning the repository)

### Installation

1. **Clone the Repository**
```bash
git clone https://github.com/ANJALIAGARWAL-7355/Roomify.git
cd Roomify
```

> **Note**: If you haven't pushed to GitHub yet, you can skip this step and use your local directory.

**Alternative - If already downloaded:**
```bash
cd path/to/Roomify
# Example: cd d:\Work\Projects\Roomify
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

### Running the Application

> **Note**: For Windows PowerShell users with execution policy restrictions, use the alternative commands shown below.

**Backend Server:**

Open a terminal and run:
```bash
cd backend
node server.js
```

You should see:
```
🚀 Roomify API running on http://localhost:3000
📊 Demo data loaded with 15 rooms
```

**Frontend Server:**

Open a second terminal and run:
```bash
cd frontend
npx vite
# Or if npx doesn't work on Windows:
.\node_modules\.bin\vite.cmd
```

You should see:
```
VITE ready in XXX ms
➜  Local: http://localhost:5173/
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/api/health

### Login Credentials

**Student Login:**
- Username: Any name (e.g., "john_doe")
- Room Number: Any room from 301-315

**Admin Login:**
- Username: "admin"
- Password: Any value

## 📖 User Guide

### For Students

1. Navigate to **Student Portal** and login
2. View your **Room Harmony Score** (color-coded: 🟢 Low • 🟡 Medium • 🔴 High Risk)
3. Fill the **Weekly Vibe Check** form
4. Receive **personalized peace tips** based on detected issues

> **Note**: Vibe check submissions are tracked with your username. Admins can view who submitted what.

### For Admins

1. Navigate to **Admin Dashboard** and login
2. Monitor all rooms via the **Risk Heatmap**
3. Review **high-risk alerts** for rooms needing intervention
4. Click on **"All Submissions"** tab to view all vibe checks with usernames
5. **Delete individual submissions** or **remove all records for a user** (e.g., when they leave)
6. Analyze **conflict trends** over time
7. Use **AI recommendations** to prevent escalations

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 with Vite
- React Router for navigation
- Recharts for data visualization
- Modern CSS with glassmorphism

**Backend:**
- Node.js + Express
- In-memory data store (easily upgradable to MongoDB)
- RESTful API architecture

**AI Services:**
- Sentiment analysis engine
- Conflict prediction algorithms
- Pattern detection & trend analysis

### Project Structure

```
Roomify/
├── frontend/
│   ├── src/
│   │   ├── pages/           # Home, Student, Admin dashboards
│   │   ├── components/      # Reusable UI components
│   │   ├── index.css        # Premium design system
│   │   └── App.jsx          # Main router
│   └── package.json
│
├── backend/
│   ├── services/            # AI & business logic
│   │   ├── sentiment.service.js    # Sentiment analysis
│   │   ├── prediction.service.js   # Risk calculation
│   │   └── tips.service.js         # Tips generation
│   ├── utils/
│   │   └── demo-data.js    # Sample data generator
│   ├── server.js           # Express API server
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Student Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/student/vibe-check` | Submit weekly survey |
| GET | `/api/student/harmony-score/:roomId` | Get room score |
| GET | `/api/student/tips/:roomId` | Get peace tips |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Get overview stats |
| GET | `/api/admin/rooms` | Get all rooms |
| GET | `/api/admin/alerts` | Get high-risk alerts |
| GET | `/api/admin/submissions` | Get all vibe checks with usernames |
| DELETE | `/api/admin/submissions/:id` | Delete a specific submission |
| DELETE | `/api/admin/users/:username` | Delete all records for a user |
| POST | `/api/admin/intervene` | Send intervention message |
| GET | `/api/admin/trends` | Get weekly trends |

## 🎨 Design Highlights

- **Glassmorphism UI** - Modern frosted-glass aesthetic
- **Dark Mode** - Premium dark theme with vibrant accents
- **Smooth Animations** - Micro-interactions for enhanced UX
- **Responsive Design** - Mobile-friendly layouts
- **Color-Coded Risk Levels** - Instant visual feedback

## 🧠 How the AI Works

### 1. Sentiment Analysis
- Analyzes vibe check responses
- Keyword matching for text comments
- Rating aggregation (peacefulness, noise, cleanliness, privacy)
- Outputs sentiment score (0-100)

### 2. Conflict Prediction
- Calculates risk score from sentiment trends
- Detects negative patterns (noise + cleanliness = higher risk)
- Identifies sudden satisfaction dips
- Tracks improvement/worsening trends

### 3. Smart Recommendations
- Context-aware tips based on detected issues
- Priority levels (high/medium/low)
- Admin-level hostel-wide insights

## 🛠️ Customization

### Adding Real Database (MongoDB)

1. Install mongoose: `npm install mongoose`
2. Create models in `backend/models/`
3. Update `server.js` to use database instead of in-memory storage

### Integrating Advanced ML Models

Replace rule-based prediction with HuggingFace models:

```javascript
import { pipeline } from '@huggingface/inference'

const sentiment = await pipeline('sentiment-analysis')
const result = await sentiment(text)
```

## 📊 Demo Data

The system comes pre-loaded with:
- 15 sample rooms with varying risk scores
- Realistic vibe check history
- 8 weeks of trend data
- Mix of low, medium, and high-risk scenarios

## 🎯 Future Enhancements

- [ ] Real-time notifications (WebSocket)
- [ ] Room compatibility matching algorithm
- [ ] Mobile app (React Native)
- [ ] Advanced NLP with transformer models
- [ ] Historical analytics dashboard
- [ ] Multi-language support

## 🏆 Hackathon Ready

This project is **demo-ready** for hackathons with:
- ✅ Working end-to-end functionality
- ✅ Stunning premium UI/UX
- ✅ AI-powered predictions
- ✅ Complete documentation
- ✅ Easy setup and deployment

## 📝 License

MIT License - Feel free to use for your hackathon or personal projects!

## 🤝 Contributing

Contributions welcome! Whether it's bug fixes, new features, or improvements to the AI algorithms.

---

**Built with ❤️ for creating peaceful hostel communities**

*Roomify - Because prevention is better than conflict resolution*
