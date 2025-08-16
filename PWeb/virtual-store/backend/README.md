# Virtual Store Backend

This is the backend part of the Virtual Store project, built using Node.js and Express. The backend handles authentication, database interactions, and serves as an API for the frontend application.

## Project Structure

- **src/**: Contains the source code for the backend application.
  - **app.js**: Entry point of the application. Initializes the Express app and sets up middleware.
  - **controllers/**: Contains controllers for handling requests.
    - **authController.js**: Manages authentication logic, including OAuth2 flow with Discord.
  - **routes/**: Contains route definitions for the application.
    - **authRoutes.js**: Sets up authentication routes for login and callback from Discord.
  - **config/**: Contains configuration files.
    - **oauthConfig.js**: Configuration constants for OAuth2 setup.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the backend directory:
   ```
   cd virtual-store/backend
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the backend server, run:
```
npm start
```

Make sure to set up your environment variables for the OAuth2 configuration, including the client ID, client secret, and redirect URI.

## Dependencies

- express: Web framework for Node.js
- mysql: MySQL client for Node.js
- passport: Middleware for authentication
- passport-discord: Passport strategy for authenticating with Discord

## License

This project is licensed under the MIT License. See the LICENSE file for more details.