# Recipe Share API

![Static Badge](https://img.shields.io/badge/codersdash-assignment-DD658B)

This project is built with Node.js, Express, and MongoDB. It provides a simple API for managing recipe data. The application supports user authentication through JSON Web Tokens (JWT), ensuring secure access to various functionalities based on user roles.

## Features

- **User Registration & Login**: Users can register for an account and log in to access their profile.

## Installation

1. Clone the repository
2. Navigate to the project directory: `cd recipe-share-api`
3. Install the required dependencies: `npm install`
4. Set up environment variables (e.g., Port, MongoDB connection string, JWT secret). Create a `.env` file with following contents.
```
MONGO_URI="<connection-string>"
PORT=<desired-port>
JWT_SECRET=<secret-key>
NODE_ENV=dev
```
5. Start the server: `npm run dev`

## Post-Installation

1. Register the first user through the API.
2. Perform database seeding to assign the ADMIN role to the first user:
   1. Access your MongoDB instance.
   2. Find the newly registered user document in the users collection.
   3. Update the user’s roles array by adding ADMIN.

## Running Tests

To run the tests for this project, use the following command:
```
npm test
```

## API Endpoints

- `GET /`: Returns welcome message
- `POST /auth/register`: Register a new user.

## Sample Requests

### Check system
```
curl http://localhost:3000/
curl http://localhost:3000/home
```

### Register user
```
curl http://localhost:3000/auth/register/ -H 'Content-Type: application/json' \
-d '{
    "firstName": "John",
    "lastName":"Doe",
    "gender":"MALE",
    "email": "john@example.com",
    "password": "Abcd@1234"
}'
```
