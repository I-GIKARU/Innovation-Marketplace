# Innovation Marketplace

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.1-black?logo=next.js)](https://nextjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1.x-blue?logo=flask)](https://flask.palletsprojects.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.0.0-orange?logo=firebase)](https://firebase.google.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?logo=postgresql)](https://postgresql.org/)
[![Google Cloud](https://img.shields.io/badge/Google_Cloud-Ready-blue?logo=google-cloud)](https://cloud.google.com/)
[![AI Powered](https://img.shields.io/badge/AI-Powered-green?logo=google)](https://ai.google.dev/)

> A modern full-stack marketplace platform connecting innovative student projects with potential clients and collaborators. Features AI-powered project insights, comprehensive e-commerce, and advanced analytics.

## 🚀 Overview

Innovation Marketplace is a comprehensive web application designed to bridge the gap between student innovators and industry clients. The platform enables:

- **Students** to showcase their innovative projects and connect with potential collaborators
- **Clients** to discover cutting-edge projects and express interest in partnerships
- **Administrators** to manage the ecosystem and maintain quality standards
- **E-commerce functionality** for project-related merchandise and services

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js 15    │◄──►│   Flask API     │◄──►│   Firebase      │
│   Frontend      │    │   Backend       │    │   Auth/Storage  │
│   (Port 3000)   │    │   (Port 5000)   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Tailwind CSS    │    │  PostgreSQL     │    │   Cloudinary    │
│ Framer Motion   │    │  Google Cloud   │    │ Media Storage   │
│ React Context   │    │  SQL / Neon     │    │ + File Upload   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Custom Hooks    │    │  AI Integration │    │ Google Cloud    │
│ Component Lib   │    │  Google Gemini  │    │ Run Deployment  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## ✨ Key Features

### 🎯 Core Functionality
- **Multi-role authentication** with Firebase + JWT
- **Project showcase** with media upload and categorization
- **Interest matching** between students and clients
- **Review and rating system** for projects
- **E-commerce store** with cart and checkout functionality
- **Admin dashboard** for content and user management
- **AI-powered project Q&A** with Google Gemini
- **Smart CV analysis** and matching
- **Real-time analytics** and insights

### 🔧 Technical Features
- **Server-Side Rendering (SSR)** with Next.js App Router
- **RESTful API** with Flask-RESTful
- **AI Integration** with Google Generative AI
- **Cloud SQL** with PostgreSQL
- **Real-time data** with optimized caching
- **Responsive design** with Tailwind CSS
- **Smooth animations** with Framer Motion
- **Multi-cloud storage** (Firebase + Cloudinary)
- **Database migrations** with Alembic
- **Container deployment** with Google Cloud Run
- **Middleware protection** for routes

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: Next.js 15.4.1 with App Router
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4.1.11
- **Animations**: Framer Motion 12.23.6
- **Icons**: Heroicons & React Icons
- **Charts**: Recharts 2.15.4
- **Authentication**: Firebase 12.0.0

### Backend (Server)
- **Framework**: Flask 3.1.1
- **API**: Flask-RESTful 0.3.10
- **Database**: SQLAlchemy 2.0.29 + SQLite
- **Authentication**: Flask-JWT-Extended 4.7.1 + Firebase Admin
- **Migrations**: Flask-Migrate 4.1.0 + Alembic
- **Storage**: Cloudinary + Firebase Storage
- **WSGI Server**: Gunicorn 23.0.0

### DevOps & Deployment
- **Containerization**: Docker
- **Environment**: Python 3.11+ & Node.js 18+
- **Package Management**: npm & pip
- **Version Control**: Git

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.11+ and pip
- **Firebase** project with Authentication enabled
- **Cloudinary** account for media storage

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/innovation-marketplace.git
cd innovation-marketplace
```

### 2. Backend Setup
```bash
cd server
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize database
flask db upgrade

# Start the server
python app.py
```

### 3. Frontend Setup
```bash
cd ../client
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your configuration

# Start the development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api/docs

## 📁 Project Structure

### Frontend Structure
```
client/
├── src/app/                    # Next.js App Router
│   ├── layout.js              # Root layout
│   ├── page.js                # Homepage
│   ├── dashboard/             # Role-based dashboards
│   ├── e_commerce/            # Shopping features
│   └── projects/              # Project showcase
├── components/                # UI components
│   ├── admin/                 # Admin components
│   ├── student/               # Student components
│   ├── client/                # Client components
│   └── common/                # Shared components
├── hooks/                     # Custom React hooks
├── contexts/                  # React Context providers
└── lib/                       # Utilities & config
```

### Backend Structure
```
server/
├── app.py                     # Flask application
├── config.py                  # Configuration
├── models/                    # Database models
├── resources/                 # API endpoints
│   ├── auth/                  # Authentication
│   ├── projects.py            # Project management
│   ├── merch.py              # E-commerce
│   └── admin.py              # Admin functions
├── utils/                     # Utilities
├── migrations/                # Database migrations
└── tests/                     # API tests
```

## 🎯 User Roles

### 👨‍🎓 Students
- Upload and manage innovative projects
- Add project media, descriptions, and team members
- Track project analytics and engagement
- Respond to client interests
- View project reviews and feedback

### 🏢 Clients
- Browse approved projects by category
- Express interest in specific projects
- Purchase project-related merchandise
- Leave reviews and ratings
- Manage order history

### 👨‍💼 Administrators
- Review and approve/reject student projects
- Manage user accounts and roles
- Oversee e-commerce operations
- Monitor platform analytics
- Handle content moderation

## 🔐 Authentication & Security

- **Firebase Authentication** for user management
- **JWT tokens** for stateless sessions
- **Role-based access control (RBAC)**
- **Input validation** on all endpoints
- **CORS protection** for API security
- **SQL injection prevention** via ORM

## 📊 API Documentation

The API follows RESTful conventions with comprehensive endpoint documentation available at `/api/docs` when running the server.

### Key Endpoints
- `POST /api/auth/login` - User authentication
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/merchandise` - List products
- `POST /api/orders` - Place order

For complete API documentation, see [API_DOCUMENTATION.md](./server/API_DOCUMENTATION.md)

## 📚 Comprehensive Documentation

### 🖥️ Backend Documentation
- **[Server Overview](./server/docs/README.md)** - Complete backend architecture
- **[Database Models](./server/docs/models/README.md)** - Data structure and relationships
- **[API Resources](./server/docs/resources/)** - Endpoint documentation
  - [Authentication Resources](./server/docs/resources/auth.md)
  - [Project Resources](./server/docs/resources/projects.md)
  - [Admin Resources](./server/docs/resources/admin.md)
  - [AI Resources](./server/docs/resources/ai.md)
- **[Configuration Guide](./server/docs/config.md)** - Environment setup and configuration
- **[App Analysis](./server/docs/app-analysis.md)** - Detailed app.py breakdown
- **[Deployment Guide](./server/docs/deployment/README.md)** - Production deployment

### 🌐 Frontend Documentation
- **[Client Overview](./client/docs/README.md)** - Complete frontend architecture
- **[Components Guide](./client/docs/components/README.md)** - UI components documentation
- **[Hooks Documentation](./client/docs/hooks/README.md)** - Custom React hooks
- **[Context Providers](./client/docs/contexts/)** - Global state management
- **[Pages Structure](./client/docs/pages/)** - Next.js App Router pages
- **[Styling Guide](./client/docs/styles/)** - Tailwind CSS patterns
- **[Development Guides](./client/docs/guides/)** - Best practices and conventions

### 🔧 Development Resources
- **[Google Cloud SQL Setup](./server/docs/deployment/database.md)** - Cloud SQL configuration
- **[Firebase Configuration](./server/docs/deployment/environment.md)** - Firebase setup guide
- **[AI Integration](./server/docs/utils/ai.md)** - Google Generative AI setup
- **[Troubleshooting](./server/docs/guides/troubleshooting.md)** - Common issues and solutions

## 🐳 Docker Deployment

### Build and Run with Docker
```bash
# Build and run backend
cd server
docker build -t innovation-marketplace-server .
docker run -p 5000:8080 innovation-marketplace-server

# Build and run frontend
cd ../client
docker build -t innovation-marketplace-client .
docker run -p 3000:3000 innovation-marketplace-client
```

### Docker Compose (Recommended)
```bash
docker-compose up --build
```

## 🧪 Testing

### Run Backend Tests
```bash
cd server
python -m pytest tests/
```

### Run Frontend Tests
```bash
cd client
npm test
```

## 📝 Environment Variables

### Backend (.env)
```env
SECRET_KEY=your_secret_key
DATABASE_URL=sqlite:///moringa_marketplace.db
JWT_SECRET_KEY=jwt_secret_key
FIREBASE_SERVICE_ACCOUNT_KEY=path/to/firebase-key.json
FIREBASE_PROJECT_ID=your_project_id
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Firebase** for authentication and storage services
- **Cloudinary** for media management
- **Tailwind CSS** for styling framework
- **Next.js** and **Flask** communities for excellent documentation

## 📞 Support

For support, email support@innovationmarketplace.com or join our [Discord community](https://discord.gg/innovation-marketplace).

---

**Built with ❤️ by the Innovation Marketplace Team**

# 🧠 Moringa Innovation Marketplace

A web-based platform that empowers Moringa School students to showcase, monetize, and scale their final capstone projects. It also allows external users to discover talent, purchase innovative solutions, and buy Moringa-branded merchandise.

---

## 🚀 Features

### 👩‍💻 Student Functionality
- Upload projects with title, description, tech stack, GitHub, live demo, and media
- Tag projects with categories (e.g., HealthTech, FinTech)
- Student profile page with skills and social links
- Mark projects as "for sale" and set a price

### 🌍 Public Visitors
- Explore and filter projects by category or tech
- View full project detail and team members
- Contact or hire student teams
- Leave project reviews and endorsements

### 🛒 E-Commerce
- View merchandise catalog (hoodies, mugs, stickers)
- Add products to cart and checkout
- Pay via M-Pesa or Stripe

### 🛠️ Admin Panel
- Approve/reject student project submissions
- Manage product inventory
- View engagement stats for each project
- Log admin actions

---

## 🧱 Tech Stack

| Layer       | Tech Used                                |
|-------------|-------------------------------------------|
| Frontend    | React.js / Next.js                        |
| Backend     | Flask REST API       |
| Database    | PostgreSQL                                |
| Auth        | JWT (API) + NextAuth
| Media       | Cloudinary for uploads                    |
| Payments    | M-Pesa Daraja API / Stripe                |
| Deployment  | Google Cloud Platform    |

---

## 🗂️ Project Structure

---

## Team Members  

| Name                | Role                    | Contact / Profile                                        |  
|---------------------|-------------------------|---------------------------------------------------------|  
| **Derick Sheldrick**| Frontend Developer      | [GitHub](https://github.com/dericksheldrick)          |  
| **Monica Wanjiru**  | Frontend Developer      | [Github](https://github.com/monicah-monic)               |  
| **Fredrick Okoth**  | Frontend Developer      | [GitHub](https://github.com/jakendu)                     |  
| **Enock Tangus**    | Backend Developer       | [GitHub](https://github.com/Tan-dev202)                |  
| **Elizabeth Njuguna**| Backend Developer     | [GitHub](https://github.com/Elizabeth-NN)                |  
| **Isaac Gikaru**     | DevOps / Deployment     | [GitHub](https://github.com/I-GIKARU)                  |  

---  


