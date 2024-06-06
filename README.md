# Recipe Share API

<p align="center">
  <a href="https://codersdash.com/full-stack-web-development/">
    <img alt="CodersDash Full Stack Web Development" src="https://img.shields.io/badge/codersdash-assignment-DD658B">
  </a>
  <a href="https://github.com/lalankeba/recipe-share-api/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue" alt="Recipe Share API is released under the MIT license." >
  </a>
</p>

This project is built with Node.js, Express, and MongoDB. It provides a simple API for managing recipe data. The application supports user authentication through JSON Web Tokens (JWT), ensuring secure access to various functionalities based on user roles.

## Features

- **User Registration & Login**: Users can register for an account and log in to access their profile.
- **JWT Authentication**: Secure access to the API using JSON Web Tokens.

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
- `POST /auth/login`: All users login.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

For more information about the MIT License, you can visit the [MIT License page](https://opensource.org/licenses/MIT).


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

### Login user
```
curl http://localhost:3000/auth/login/ -H 'Content-Type: application/json' \
-d '{ 
    "email": "john@example.com", 
    "password": "Abcd@1234" 
}'
```
