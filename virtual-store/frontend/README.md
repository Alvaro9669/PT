# Frontend Virtual Store Documentation

## Overview
This is the frontend part of the Virtual Store project, built using React. The application features a user-friendly interface with a horizontal navigation menu, a dropdown menu for additional options, and a Discord login button for user authentication.

## Project Structure
The frontend project is organized as follows:

```
frontend
├── public
│   └── index.html          # Main HTML file for the React app
├── src
│   ├── components          # Contains all React components
│   │   ├── DropdownMenu.jsx  # Dropdown menu component
│   │   ├── HorizontalMenu.jsx # Main navigation menu component
│   │   ├── HomeButton.jsx     # Home button component
│   │   └── DiscordLoginButton.jsx # Discord login button component
│   ├── App.jsx              # Main application component
│   ├── index.js             # Entry point of the React application
│   └── styles
│       └── App.css         # Styles for the application
└── package.json             # NPM configuration for the frontend
```

## Features
- **Horizontal Menu**: A navigation bar that includes links to different sections of the application.
- **Dropdown Menu**: A component that provides additional navigation options.
- **Discord Login**: A button that allows users to log in using their Discord account via OAuth2.
- **Home Button**: A button that navigates users back to the home page.

## Getting Started
To run the frontend application, follow these steps:

1. Navigate to the `frontend` directory.
2. Install the dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

The application will be available at `http://localhost:3000`.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.