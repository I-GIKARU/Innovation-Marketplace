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

The **Innovation Marketplace** connects innovative student projects with potential clients and collaborators, powered by a modern full-stack architecture. Here's a summary of the structure:

#### Architecture

- **Frontend:** Built with Next.js, Tailwind CSS, and Framer Motion for dynamic user interfaces.
- **Backend:** Built with Flask, utilizing SQLAlchemy and Cloud services for authentication, storage, and data handling.
- **Storage & Authentication:** Utilizes Firebase for authentication and Cloudinary for media storage.
- **Database:** PostgreSQL used with both SQLite and Cloud options.
- **Deployment:** Docker-based deployment utilizing Google Cloud Platform.

The platform enables:

- **Students** to showcase their innovative projects and connect with potential collaborators.
- **Clients** to discover cutting-edge projects and express interest in partnerships.
- **Administrators** to manage the ecosystem and maintain quality standards.
- **E-commerce functionality** for project-related merchandise and services.

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

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: Next.js 15.4.1 with App Router
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4.1.11
- **Animations**: Framer Motion 12.23.6
- **Icons**: Heroicons & React Icons
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
- **Environment**: Python 3.11 & Vercel
- **Package Management**: npm & pip
- **Version Control**: Git

## 🚀 Quick Start

#### Prerequisites
- Install Node.js (18+) and Python (3.11+).
- Set up Firebase and Cloudinary accounts.

### 1. Clone the Repository
```bash
   git clone https://github.com/I-GIKARU/Innovation-Marketplace
   cd innovation-marketplace
```

2. **Backend Setup**
```bash
   cd server
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   flask db upgrade
   python app.py
```

3. **Frontend Setup**
```bash
   cd ../client
   npm install
   npm run dev
```

4. **Access the Application**
- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:5000`

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


### Key Endpoints
- `POST /api/auth/login` - User authentication
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/merchandise` - List products
- `POST /api/orders` - Place order


### Build and Run with Docker
```bash
# Build and run backend
cd server
docker build -t innovation-marketplace-server .
docker run -p 5000:8080 innovation-marketplace-server

```

### Docker Compose 
```bash
docker-compose up --build
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


## 🙏 Acknowledgments

- **Firebase** for authentication and storage services
- **Cloudinary** for media management
- **Tailwind CSS** for styling framework
- **Next.js** and **Flask** communities for excellent documentation

## 🔧 Troubleshooting

### Common Issues

#### Frontend Issues
- **Build failures:** Ensure all environment variables are set in `.env.local`
- **API connection errors:** Verify the backend server is running on port 5000
- **Firebase authentication issues:** Check Firebase configuration in `lib/firebase.js`

#### Backend Issues
- **Database connection errors:** 
  - For SQLite: Ensure the database file has proper permissions
  - For PostgreSQL: Verify connection string and database exists
- **Firebase Admin SDK errors:** Check service account key path and permissions
- **Cloudinary upload failures:** Verify API credentials and folder permissions

#### Development Environment
- **Port conflicts:** Use `lsof -i :3000` or `lsof -i :5000` to check for conflicts
- **Package installation issues:** Clear `node_modules` and `package-lock.json`, then reinstall
- **Python virtual environment:** Ensure you're in the activated virtual environment

### Performance Optimization

- **Frontend:** Implement image optimization and lazy loading


## 📈 Analytics & Monitoring

- **User Analytics:** Track user engagement and project views
- **Performance Monitoring:** Monitor API response times and error rates

## 🚀 Future Enhancements

- **Real-time Chat:** Enable direct communication between students and clients
- **Video Calls:** Integrate video conferencing for project discussions
- **Advanced Search:** Implement Elasticsearch for better project discovery
- **Mobile App:** Native mobile applications for iOS and Android
- **Notifications:** Push notifications for project updates and messages

## 📞 Support

For support, email support@innovationmarketplace.com

## 👥 Team Members  

| Name                | Role                    | Contact / Profile                                        |  
|---------------------|-------------------------|---------------------------------------------------------|  
| **Derick Sheldrick**| Frontend Developer      | [GitHub](https://github.com/dericksheldrick)          |  
| **Monica Wanjiru**  | Frontend Developer      | [Github](https://github.com/monicah-monic)               |  
| **Fredrick Okoth**  | Frontend Developer      | [GitHub](https://github.com/jakendu)                     |  
| **Enock Tangus**    | Backend Developer       | [GitHub](https://github.com/Tan-dev202)                |  
| **Elizabeth Njuguna**| Backend Developer     | [GitHub](https://github.com/Elizabeth-NN)                |  
| **Isaac Gikaru**     | DevOps / Deployment     | [GitHub](https://github.com/I-GIKARU)                  |  

---

**Built with ❤️ by the Innovation Marketplace Team**

