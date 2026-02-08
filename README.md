# StudySync - Smart Study Planner 📚

StudySync is a comprehensive study planning application designed to help students organize their academic life, track progress, and build better study habits.

![StudySync Dashboard](client/src/assets/app-logo.png)

## 🚀 Key Features

*   **Subject Management**: Organize courses, topics, and set target study hours.
*   **Smart Study Timer**: Built-in Pomodoro timer and stopwatch to track focused study sessions.
*   **Visual Analytics**: insightful charts and heatmaps to visualize study habits and consistency.
*   **Weekly Calendar**: Drag-and-drop style calendar to plan study sessions and track due dates.
*   **Persistent Sessions**: Stay logged in for up to 30 minutes of inactivity for quick access.

## 🛠️ Tech Stack

*   **Frontend**: React, Vite, Tailwind CSS, Framer Motion
*   **Backend**: Node.js, Express.js
*   **Database**: PostgreSQL (Sequelize ORM)
*   **Authentication**: JWT (JSON Web Tokens)

## 📦 Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Navadeep-bommarapu/StudySync.git
    cd StudySync
    ```

2.  **Install Dependencies**
    ```bash
    # Install server dependencies
    cd server
    npm install

    # Install client dependencies
    cd ../client
    npm install
    ```

3.  **Environment Setup**
    *   Create a `.env` file in `server/` with:
        ```env
        PORT=5000
        DB_HOST=your_db_host
        DB_USER=your_db_user
        DB_PASSWORD=your_db_password
        DB_NAME=your_db_name
        JWT_SECRET=your_jwt_secret
        ```
    *   Create a `.env` file in `client/` with:
        ```env
        VITE_API_URL=http://localhost:5000/api
        ```

4.  **Run Locally**
    ```bash
    # Start Backend
    cd server
    npm start

    # Start Frontend
    cd client
    npm run dev
    ```

## 🚀 Deployment

This project is optimized for deployment on **Render** (Backend), **Neon** (Database), and **Vercel** (Frontend).
See [Deployment Guide](deployment_guide.md) for detailed instructions.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

