# 🚀 DevSpace
> Next-generation collaborative development environment with GPU acceleration

![Hero Section](/images/DevSpace.jpeg)

Created by Tilak Patel & Shreyaan Pathak

[Tilak's Portfolio](https://www.tilakpatell.com) 

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Build Status](https://img.shields.io/badge/build-passing-success.svg)

DevSpace is a cutting-edge real-time collaborative coding platform that combines the power of cloud-accelerated execution with AI-assisted development. Built for developers, students, and HPC fans who need a safe & robust environment for creating GPU-accelerated workloads.

---

## ✨ Key Features

### 💻 Real-Time Collaboration
- **Multi-User Editing:** Seamless collaborative coding with cursor tracking
- **Live Presence:** Real-time user presence indicators and activity tracking
- **Version Control:** Integrated Git-like version management 
- **File Synchronization:** Instant multi-file updates across all connected clients

### ⚡ GPU Acceleration
- **NVIDIA Integration:** Direct GPU access through Jetson hardware
- **Docker Runtime:** Containerized execution environment for isolation and security
- **Multi-Language Support:** 
  - Python with CUDA acceleration
  - C++ with GPU optimization
  - Native CUDA development
  - OpenMP parallel processing

### 🤖 AI Assistance
- **Intelligent Suggestions:** Context-aware code completion
- **Error Detection:** Real-time syntax and logic verification
- **Performance Analysis:** GPU utilization insights and optimization tips
- **Code Review:** Automated code quality assessments

### 🛠️ Development Tools
- **Advanced Editor:** Feature-rich Monaco-based IDE
- **Integrated Terminal:** GPU-aware command line interface
- **File Management:** Intuitive project and file organization
- **Real-Time Metrics:** Performance monitoring and analytics

---
```
Directory structure:
└── tilakpatell-devspace/
    ├── README.md
    ├── get-docker.sh
    ├── backend/
    │   ├── Java/
    │   │   └── devspace-backend/
    │   │       ├── mvnw
    │   │       ├── mvnw.cmd
    │   │       ├── pom.xml
    │   │       ├── .gitattributes
    │   │       ├── .gitignore
    │   │       ├── src/
    │   │       │   ├── main/
    │   │       │   │   ├── java/
    │   │       │   │   │   └── org/
    │   │       │   │   │       └── tilakpatellshreyaan/
    │   │       │   │   │           └── devspacebackend/
    │   │       │   │   │               ├── DevspaceBackendApplication.java
    │   │       │   │   │               ├── config/
    │   │       │   │   │               │   ├── CorsConfig.java
    │   │       │   │   │               │   └── MongoConfig.java
    │   │       │   │   │               ├── controller/
    │   │       │   │   │               │   ├── CodeRepositoryController.java
    │   │       │   │   │               │   ├── FileController.java
    │   │       │   │   │               │   └── UserController.java
    │   │       │   │   │               ├── model/
    │   │       │   │   │               │   ├── Activity.java
    │   │       │   │   │               │   ├── CodeRepository.java
    │   │       │   │   │               │   ├── DevSpace.java
    │   │       │   │   │               │   ├── FileData.java
    │   │       │   │   │               │   ├── Project.java
    │   │       │   │   │               │   ├── Skill.java
    │   │       │   │   │               │   ├── Stat.java
    │   │       │   │   │               │   └── User.java
    │   │       │   │   │               └── repository/
    │   │       │   │   │                   ├── CodeRepositoryRepository.java
    │   │       │   │   │                   ├── FileDataRepository.java
    │   │       │   │   │                   └── UserRepository.java
    │   │       │   │   └── resources/
    │   │       │   │       └── application.properties
    │   │       │   └── test/
    │   │       │       └── java/
    │   │       │           └── org/
    │   │       │               └── tilakpatellshreyaan/
    │   │       │                   └── devspacebackend/
    │   │       │                       └── DevspaceBackendApplicationTests.java
    │   │       └── .mvn/
    │   │           └── wrapper/
    │   │               └── maven-wrapper.properties
    │   └── jetson/
    │       └── docker/
    │           ├── main.py
    │           ├── test_client.py
    │           └── test_client/
    │               ├── test.cpp
    │               ├── test.cu
    │               └── test.py
    └── react/
        ├── README.md
        ├── eslint.config.js
        ├── index.html
        ├── package-lock.json
        ├── package.json
        ├── postcss.config.js
        ├── tailwind.config.js
        ├── vite.config.js
        ├── .gitignore
        ├── public/
        └── src/
            ├── App.jsx
            ├── index.css
            ├── main.jsx
            ├── Account/
            │   ├── PricingCard.jsx
            │   ├── Profile.jsx
            │   ├── ProtectedRoute.jsx
            │   ├── Session.jsx
            │   ├── Signin.jsx
            │   ├── Signup.jsx
            │   ├── accountReducer.js
            │   └── client.js
            ├── Codespace/
            │   ├── AIAssistant.jsx
            │   ├── Collaborators.jsx
            │   ├── ErrorBoundary.jsx
            │   ├── FileExplorer.jsx
            │   ├── TerminalComponent.jsx
            │   ├── index.jsx
            │   └── CodeEditor/
            │       ├── index.jsx
            │       └── components/
            │           ├── EditorHeader.jsx
            │           └── LoadingIndicator.jsx
            ├── Home/
            │   ├── CircuitBackground.jsx
            │   ├── FakeTerminal.jsx
            │   ├── FeatureSection.jsx
            │   ├── FloatingIcons.jsx
            │   ├── GlitchText.jsx
            │   ├── GlowingOrb.jsx
            │   ├── GradientText.jsx
            │   ├── MatrixBackground.jsx
            │   ├── NeuralNetworkCanvas.jsx
            │   ├── ParallaxImage.jsx
            │   ├── Starfield.jsx
            │   ├── Terminal.jsx
            │   ├── ThemeContext.jsx
            │   ├── ThemeSwitcher.jsx
            │   └── index.jsx
            ├── Navbar/
            │   └── index.jsx
            ├── api/
            │   ├── config.js
            │   ├── files.js
            │   ├── repositories.js
            │   └── users.js
            ├── assets/
            └── redux/
                ├── fileSlice.js
                ├── repositorySlice.js
                ├── store.js
                └── userSlice.js
```
---

## 🚀 Getting Started

### Prerequisites
- Java Development Kit 21
- Node.js 18+ and npm
- MongoDB 6.0+
- Docker Engine
- NVIDIA GPU with CUDA support
- Minimum 8GB RAM, 16GB recommended

## 🔧 Technical Stack

### Backend Technologies
- **Spring Boot 3.4.2:** REST API and business logic
- **MongoDB:** Document database for flexible data storage
- **WebSocket:** Real-time communication protocol
- **Docker:** Containerization platform
- **Lombok:** Flexible Java library
- **CUDA:** GPU computation interface

### Frontend Framework
- **React 19:** UI component library
- **Redux Toolkit:** State management
- **Monaco Editor:** Code editing interface
- **TailwindCSS:** Utility-first styling
- **DaisyUI:** For custom themes
- **three.js:** Dynamic background
- **Monaco Editor:** Used to create Code Editor
- **Framer Motion:** Smooth animations

### Development Tools
- **Maven:** Java dependency management
- **Vite:** Frontend build tool
- **ESLint:** Code quality enforcement
- **Jest:** Testing framework

---
## 🌟 Advanced Features

### Collaborative Editing
- **Operational Transformation (OT) for conflict resolution**
- **Cursor presence synchronization**
- **File locking mechanism**

### GPU Execution
- **Multiple runtime environments**
- **Resource monitoring**
- **Performance profiling**
- **Error handling and recovery**

---

## 🔮 Future Roadmap

### Planned Features
- **Enhanced AI capabilities**
- **Additional language support**
- **Advanced debugging tools**

