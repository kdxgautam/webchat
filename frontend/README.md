# MERN Chat App

This is a MERN (MongoDB, Express, React, Node.js, TypeScript (backend)) chat application.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm (Node Package Manager)
- MongoDB

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/kdxgautam/webchat.git
    cd webchat
    ```

2. Install dependencies for both backend and frontend:

    ```sh
    cd backend
    npm install
    cd ../frontend
    npm install
    ```

### Running the Application

#### Backend

1. Create a `.env` file in the `backend` directory and add your environment variables:

    ```env
    MONGO_DB_URI=
    PORT=
    JWT_SECRET=
    NODE_ENV="development"
    ```

2. Start the backend server:

    ```sh
    cd backend
    npm run start
    ```

#### Frontend

1. Start the frontend development server:

    ```sh
    cd frontend
    npm run dev
    ```

### Project Structure
