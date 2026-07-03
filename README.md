# Stargazer Social Galaxy

A full-stack social media application that allows users to share videos, post tweets, comment, like, subscribe to channels, and create playlists. This repository is structured as a monorepo, containing both the frontend and the backend of the application.

## 🚀 Tech Stack

### Frontend
- **Framework:** React with Vite (SWC) and TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui (based on Radix UI)
- **Routing:** React Router DOM
- **State Management & Data Fetching:** React Query (@tanstack/react-query), Axios
- **Forms & Validation:** React Hook Form, Zod
- **Icons & Charts:** Lucide React, Recharts

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose (with mongoose-aggregate-paginate-v2 for pagination)
- **Authentication:** JWT (JSON Web Tokens) and bcrypt for password hashing
- **File Uploads:** Multer and Cloudinary
- **Environment & Security:** dotenv, cors, cookie-parser

## 📁 Repository Structure

```
stargazer-social-galaxy/
├── frontend/             # React (Vite) frontend application
│   ├── public/           # Static assets
│   ├── src/              # Frontend source code
│   │   ├── components/   # Reusable UI components (shadcn/ui, etc.)
│   │   └── ...           # Pages, hooks, utilities, context, etc.
│   ├── package.json
│   ├── tailwind.config.ts
│   └── vite.config.ts
│
├── backend/              # Node.js + Express backend application
│   ├── src/              # Backend source code
│   │   ├── controllers/  # Route controllers (business logic)
│   │   ├── db/           # Database connection setup
│   │   ├── middlewares/  # Express middlewares (auth, multer, etc.)
│   │   ├── models/       # Mongoose schema definitions
│   │   ├── routes/       # API routes
│   │   ├── utils/        # Utility functions (async handler, API error/response)
│   │   ├── app.js        # Express app configuration
│   │   ├── constants.js  # Project constants
│   │   └── index.js      # Server entry point
│   ├── package.json
│   └── render.yaml       # Render deployment configuration
└── README.md             # This file
```

## 🗄️ Database Schema

Below is the Entity-Relationship diagram illustrating the MongoDB schema definitions used in the backend:

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        String username "Unique, Indexed"
        String email "Unique"
        String fullName "Indexed"
        String avatar "Cloudinary URL"
        String coverImage "Cloudinary URL"
        Array watchHistory "Ref: VIDEO"
        String password
        String refreshToken
        Date createdAt
        Date updatedAt
    }
    
    VIDEO {
        ObjectId _id PK
        String videoFile "Cloudinary URL"
        String thumbnail "Cloudinary URL"
        String title
        String description
        Number duration
        Number views "Default: 0"
        Boolean isPublished "Default: true"
        ObjectId owner FK "Ref: USER"
        Date createdAt
        Date updatedAt
    }
    
    TWEET {
        ObjectId _id PK
        String content
        ObjectId owner FK "Ref: USER"
        Date createdAt
        Date updatedAt
    }
    
    SUBSCRIPTION {
        ObjectId _id PK
        ObjectId subscriber FK "Ref: USER"
        ObjectId channel FK "Ref: USER"
        Date createdAt
        Date updatedAt
    }
    
    LIKE {
        ObjectId _id PK
        ObjectId video FK "Ref: VIDEO (Nullable)"
        ObjectId comment FK "Ref: COMMENT (Nullable)"
        ObjectId tweet FK "Ref: TWEET (Nullable)"
        ObjectId likeBy FK "Ref: USER"
        Date createdAt
        Date updatedAt
    }
    
    COMMENT {
        ObjectId _id PK
        String content
        ObjectId video FK "Ref: VIDEO"
        ObjectId owner FK "Ref: USER"
        Date createdAt
        Date updatedAt
    }
    
    PLAYLIST {
        ObjectId _id PK
        String name
        String description
        Array videos "Ref: VIDEO"
        ObjectId owner FK "Ref: USER"
        Date createdAt
        Date updatedAt
    }

    USER ||--o{ VIDEO : "owns"
    USER ||--o{ TWEET : "posts"
    USER ||--o{ COMMENT : "writes"
    USER ||--o{ LIKE : "likes"
    USER ||--o{ PLAYLIST : "creates"
    
    USER ||--o{ SUBSCRIPTION : "subscribes (as subscriber)"
    USER ||--o{ SUBSCRIPTION : "is subscribed to (as channel)"
    
    VIDEO ||--o{ COMMENT : "has"
    VIDEO ||--o{ LIKE : "receives"
    
    COMMENT ||--o{ LIKE : "receives"
    
    TWEET ||--o{ LIKE : "receives"
    
    PLAYLIST }o--o{ VIDEO : "contains"
```
