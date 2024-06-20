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
- **User Self-Management**: Any user can view and update their own profile information.
- **Admin Privileges**:
  - View all users. Supports pagination.
  - Change user roles.
- **Password Policies**: Enforced password complexity requirements.
- **Token Expiration**: Implemented token expiration for enhanced security.

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

### Registration and Login
- `POST /auth/register`: Register a new user.
- `POST /auth/login`: All users login.

### Manage Users
- `GET /users`: View all users. (Needs Admin permissions)
- `GET /users/user`: View logged in user.
- `GET /users/user/:id`: View any user by id. (Needs Admin permissions)
- `PUT /users/user`: Update logged in user.
- `PUT /users/user/:id`: Update any user. (Needs Admin permissions)

### Categories
- `GET /categories`: View all categories.
- `GET /categories/:id`: View category by id.
- `POST /categories`: Create a new category. (Needs Admin permissions)
- `PUT /categories/:id`: Update a category. (Needs Admin permissions)

### Recipes
- `POST /recipes`: Create a new recipe.

### Comments
- `POST /comments`: Create a new comment.



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
curl http://localhost:3000/auth/register -H 'Content-Type: application/json' \
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
curl http://localhost:3000/auth/login -H 'Content-Type: application/json' \
-d '{ 
    "email": "john@example.com", 
    "password": "Abcd@1234" 
}'
```

### View list of users
```
curl http://localhost:3000/users -H 'Authorization: Bearer <token>'
```
For more information, specify page and size parameters.
```
curl http://localhost:3000/users?page=2&size=10 -H 'Authorization: Bearer <token>' | jq .
```

### View logged in user
```
curl http://localhost:3000/users/user -H 'Authorization: Bearer <token>'
```

### View any user
```
curl http://localhost:3000/users/user/:id -H 'Authorization: Bearer <token>'
```

### Update logged in user
```
curl -X PUT http://localhost:3000/users/user -H 'Content-Type: application/json' \
-H 'Authorization: Bearer <token>' \
-d '{ 
    "firstName": "Mark", 
    "lastName":"Jerom", 
    "gender":"MALE", 
    "__v":0 
}'
```

### Update any user
```
curl -X PUT http://localhost:3000/users/user/:id -H 'Content-Type: application/json' \
-H 'Authorization: Bearer <token>' \
-d '{ 
    "firstName": "Kevin", 
    "lastName":"Rozen", 
    "gender":"MALE", 
    "roles":["ADMIN", "USER"], 
    "__v":0 
}'
```

### Add category
```
curl -X POST http://localhost:3000/categories -H 'Content-Type: application/json' \
-H 'Authorization: Bearer <token>' \
-d '{ 
    "description": "Dessert" 
}'
```

### Get categories
```
curl http://localhost:3000/categories -H 'Authorization: Bearer <token>'
```

### Get category by id
```
curl http://localhost:3000/categories/:id -H 'Authorization: Bearer <token>'
```

### Update category by id
```
curl -X PUT http://localhost:3000/categories/666bff108727486793964aa3 \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <token>' \
-d '{ 
    "description":"Drink", 
    "__v":0 
}'
```