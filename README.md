# Social Media MERN App

This is a full-stack social media application built with the MERN stack (MongoDB, Express, React, Node.js). It features user authentication, profile management, following/unfollowing users, posting, and image uploads.

---

## Features
- User registration and login (JWT authentication)
- Profile editing and profile picture upload
- Follow/unfollow users
- Create, view, and delete posts with image upload
- Responsive frontend built with React and Vite
- RESTful API backend with Express and MongoDB

---

## Requirements
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

---

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd social-media
```

### 2. Setup the Backend
```bash
cd backend
npm install
```

- Create a `.env` file in the `backend` folder with the following variables:
  ```env
  PORT=3900
  MONGO_URI=mongodb://localhost:27017/my_social_network
  JWT_SECRET=your_jwt_secret
  ```
- Start MongoDB locally or use your Atlas connection string.



### 3. Setup the Frontend
```bash
cd ../frontend
npm install
```

#### Start the MongoDB, Backend, and Frontend
- Open the `starter.bat` file to start both the backend and frontend servers.

- The frontend will run on [http://localhost:5173](http://localhost:5173) by default.
- The backend will run on [http://localhost:3900](http://localhost:3900) by default.

---

## Usage
- Register a new user or log in with existing credentials.
- Edit your profile and upload a profile picture.
- Create posts and upload images.
- Follow and unfollow other users.

---

## Folder Structure
```
social-media/
  backend/    # Express API and MongoDB models
  frontend/   # React app (Vite)
```

---

## Notes
- Make sure MongoDB is running before starting the backend.
- Uploaded images are stored in `backend/uploads/`.
- You can change ports and database settings in the `.env` file.

---

## License
This project is for educational purposes.
