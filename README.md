<div align="center">
  <h1>CHATGO 🤖</h1>
  <p>
    <strong>A real-time chatbot application.</strong>
  </p>
</div>

---

## 📝 Overview

Chatgo is a full-stack web application that provides a chatbot interface accessible only to authenticated users. The project is built with a Go backend that handles user authentication and serves the chat logic, and a modern JavaScript frontend for a responsive user experience.

## ✨ Features

- **User Authentication**: Secure sign-up and login system.
- **JWT-Based Security**: Uses JSON Web Tokens (JWT) for managing user sessions securely.
- **Real-time Chat**: An interactive chatbot interface for authenticated users.
- **RESTful API**: A well-structured backend API built with Go.


## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your system:
- `Go` (version 1.18 or higher recommended)
- `Node.js` (v18.20.5 or higher recommended) and `npm`

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/AKSHILMY/chatgo.git
    cd chatgo
    ```

2.  **Set up the Backend:**
    ```sh
    # Navigate to the backend directory
    cd backend

    # Install Go dependencies
    go mod tidy

    # Rename the file `.env.example` to `.env` and fill in the required environment variables
    
    # Run the backend server
    go run main.go
    ```
    The backend server will start, typically on a port like `:8080`.

3.  **Set up the Frontend:**
    ```sh
    # Navigate to the frontend directory from the root
    cd ../frontend

    # Install npm dependencies
    npm install

    # Run the frontend development server
    npm run dev
    ```
    The frontend application will open in your browser, usually at `http://localhost:3000`.
