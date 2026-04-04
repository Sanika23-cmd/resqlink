ResQLink – AI-Powered Urban Disaster Intelligence & Response System
🧠 Problem Statement

Urban areas frequently face disasters such as floods, fires, earthquakes, and infrastructure failures. Existing systems often suffer from:

⏳ Delayed reporting and response
❌ Lack of real-time coordination
⚠️ Spread of misinformation
📉 No centralized monitoring system

This leads to inefficient disaster management and increased damage.

🎯 Objective

To build a real-time, AI-powered disaster response platform that enables:

Instant incident reporting
Smart severity analysis
Live monitoring through dashboards
Faster and more informed decision-making
💡 Our Solution

ResQLink is a full-stack disaster response platform that integrates:

📍 Real-time incident reporting
🤖 AI-based disaster triage (severity + fake detection)
🗺️ Live map visualization
⚡ Instant updates using WebSockets

It bridges the gap between citizens and emergency responders.

🏗️ System Architecture
Frontend (React)
        ↓
Backend (Node.js + Express)
        ↓
Database (PostgreSQL via Prisma)
        ↓
AI Layer (Google Gemini API)
        ↓
Realtime Updates (Socket.IO)
🎨 UI/UX Design
Dark tactical / military-inspired interface
Fonts:
Bebas Neue (headings)
Space Mono (data display)
Features:
Scanline effects
Grid layouts
Noise overlays
Color-coded severity indicators
⚙️ Tech Stack
🔹 Frontend
React.js
Tailwind CSS
Custom UI components
🔹 Backend
Node.js
Express.js
REST API architecture
🔹 Database
PostgreSQL
Prisma ORM
🔹 Realtime Communication
Socket.IO
🔹 AI Integration
Google Gemini API
Used for:
Severity prediction
Action recommendation
Fake report detection
🖥️ Features
🔹 User Side
📍 Geo-tagged incident reporting
📝 Description-based input
🤖 AI-generated response
🔹 Dashboard
📡 Live incident feed
🗺️ Interactive map visualization
🎯 Severity-based filtering
🔍 Incident inspection
🔹 Admin Panel
🛠️ Incident management
🔄 Status updates (open / in-progress / resolved)
📢 Alert broadcasting
📜 Alert logs
🔹 Core Functionalities
Real-time frontend-backend communication
Database-driven architecture
Scalable modular design
🚀 Key Highlights
⚡ Real-time updates using Socket.IO
🤖 AI-powered disaster analysis
🌍 Live map with dynamic incident plotting
🔐 Secure authentication system
☁️ Cloud-deployed backend (Render)
📊 Expected Impact
Faster emergency response
Improved disaster awareness
Reduced misinformation
Better coordination between users and authorities
👥 Team Members
Sanika Paranjape
Aditi Pawar
🚧 Project Status
✅ Frontend Completed
✅ Backend Integrated
✅ Database Connected
✅ Real-time System Working
🔄 AI Enhancements Ongoing
⚡ Getting Started
🔹 1. Clone the repository
git clone https://github.com/Sanika23-cmd/resqlink.git
cd resqlink
🔹 2. Install dependencies
Backend:
cd backend
npm install
Frontend:
cd ../frontend
npm install
🔹 3. Setup Environment Variables
Backend .env
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_api_key
Frontend .env
REACT_APP_API_URL=https://your-backend-url/api
REACT_APP_SOCKET_URL=https://your-backend-url
🔹 4. Run the project
Start Backend:
cd backend
npm start
Start Frontend:
cd frontend
npm start
🌐 Deployment
Backend: Render
Frontend: (Local / Vercel recommended)
🎯 Future Enhancements
🌍 Real map integration (Google Maps / Leaflet)
📊 Predictive disaster analytics
📱 Mobile app version
📡 Offline support system
🔔 Advanced notification system
💬 Final Note

“ResQLink leverages real-time technology and AI to transform disaster response into a faster, smarter, and more coordinated system.
