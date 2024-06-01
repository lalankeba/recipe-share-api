# Recipe Share API

![Static Badge](https://img.shields.io/badge/codersdash-assignment-DD658B)

This project is built with Node.js, Express, and MongoDB. It provides a simple API for managing recipe data. The application supports user authentication through JSON Web Tokens (JWT), ensuring secure access to various functionalities based on user roles.

## Installation

1. Clone the repository
2. Navigate to the project directory: `cd recipe-share-api`
3. Install the required dependencies: `npm install`
4. Set up environment variables (e.g., Port, MongoDB connection string, JWT secret). Create a `.env` file with following contents.
```
MONGO_URI="<connection-string>"
PORT=<desired-port>
JWT_SECRET=<secret-key>
```
5. Start the server: `npm run dev`

## API Endpoints

- `GET /`: Returns welcome message

## Sample Requests

### Check system
```
curl http://localhost:3000/
curl http://localhost:3000/home
```
