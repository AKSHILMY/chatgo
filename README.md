<div align="left">
  <p>
    <img src="https://img.shields.io/badge/Project%20Level-Basic-brightgreen" alt="Project Level: Basic">
    <img src="https://img.shields.io/badge/Version-0.0.1-blue" alt="Version: 0.0.1">
  </p>
</div>
<div align="center">
  <img width="250" height="530" alt="CHATGO Chat Interface" src="https://github.com/user-attachments/assets/666676b7-a647-4566-a095-8844a00ed0dd" />
  <h1>CHATGO 🤖</h1>
</div>

## 📝 Overview

Chatgo is a full-stack web application that provides a chatbot interface accessible only to authenticated users. The project is built with a Go backend that handles user authentication and serves the chat logic, and a modern React frontend for a responsive user experience.

## ✨ Features

- **User Authentication**: Secure login system
- **JWT-Based Security**: Uses JSON Web Tokens (JWT) for managing user sessions securely.
- **Real-time Chat**: An interactive chatbot interface for authenticated users.
- **RESTful API**: A backend API built with Go.


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
    go run .
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
    The frontend application will open in your browser, usually at `http://localhost:5173`.
