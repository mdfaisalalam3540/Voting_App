
# Voting_App
The Voting App Backend is a server-side application built with Node.js, Express, and MongoDB.
It provides APIs for user authentication, poll creation, voting, and poll subscriptions.

This backend powers a simple yet extensible voting system where users can:

* Register & login securely
* Create polls with multiple voting options
* Vote in polls (one vote per user per poll)
* Subscribe to polls to get notified when they close

It is designed with scalability and future enhancements in mind. Planned features include:

* Admin functionality for managing polls & users
* Analytics dashboards for tracking participation and insights

# Features (Detailed)

# User Authentication
* Users can register, login, and logout.
* Authentication is handled via JWT tokens stored in cookies.
* Passwords are encrypted with bcrypt before saving in MongoDB.
* Middleware ensures only authenticated users can access restricted routes (like creating polls, voting, or subscribing).

# Poll Management
* Authenticated users can create new polls.
* Polls include:
    * Title & description
    * Multiple options (e.g., Messi, Ronaldo, Mbappe)
    * Expiry date (poll automatically becomes inactive after expiration)
* Polls are linked to their creator (user ID).

# Voting
* Authenticated users can vote on active polls.
* Each user is allowed one vote per poll.
* Voting instantly updates the poll results in the database.
* Duplicate votes are prevented by checking existing votes.

# Subscription
* Users can subscribe to polls to receive notifications (future implementation).
* Subscriptions are stored in the database (poll ID + user ID).
* When a poll closes, the system can use this to notify subscribed users via email.

# Security
* Passwords: stored securely with bcrypt hashing.
* Tokens: signed with a secret key (JWT).
* Protected Routes: routes like poll creation, voting, and subscription require valid authentication.
* CORS Support: allows cross-origin requests only from whitelisted origins.

# Tech Stack
* Backend Framework: Express.js (for APIs & routing)
* Runtime Environment: Node.js
* Database: MongoDB with Mongoose ODM
* Authentication: JWT (JSON Web Tokens)
* Tools:
    * bcrypt → Hashing passwords
    * dotenv → Manage environment variables
    * cors → Handle cross-origin requests
    * cookie-parser → Parse cookies for JWT
    * nodemon → Development server auto-restart

# Package,json file (looks like this)
{
  "name": "voting-app",
  "version": "1.0.0",
  "description": "",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"
  },
  "keywords": [
    "Backend",
    "Javascript",
    "Voting App"
  ],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "bcrypt": "^6.0.0",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^17.2.1",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.17.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.10",
    "prettier": "^3.6.2"
  }
}


# Installation & Setup
Follow these steps to ru the project locally:

1. Clone the repository (bash)
* git clone https://github.com/mdfaisalalam3540/Voting_App.git
* cd voting-app-backend

2. Package.json file creation (bash)
* npm init -y

3. Install dependencies (bash)
* npm install

4. Setup environment variables (.env)
    * PORT=3005
    * MONGODB_URI=your_mongodb_connection_string
    * JWT_SECRET=your_jwt_secret
    * CORS_ORIGIN=*
    * ACCESS_TOKEN_SECRET=usaggdsbcucbyfeysx3654vxag467wdanralw7brynlw7aby6l
    * REFRESH_TOKEN_SECRET=usaggdsbcucbyfeysx3654vxag467wdanralw7brynlw7aby6l
    * ACCESS_TOKEN_EXPIRY=1d
    * REFRESH_TOKEN_EXPIRY=7d 
* PORT → Port where the server runs (default: 3005)
* MONGODB_URI → Your MongoDB Atlas/Local connection string
* JWT_SECRET → Secret key for signing JWT tokens
* CORS_ORIGIN → Frontend URL allowed to access APIs (use * for all origins)
* ACCESS_TOKEN_SECRET → Secret for Access Token
* REFRESH_TOKEN_SECRET → Secret for Refresh Token
* ACCESS_TOKEN_EXPIRY → Expiry duration for Access Token (e.g., 1d)
* REFRESH_TOKEN_EXPIRY → Expiry duration for Refresh Token (e.g., 7d)

5. Start the development server (bash)
* npm run dev

# API Endpoints (Detailed)

1. User Routes (method: POST)

* Register
http://localhost:3005/api/v1/users/register
{
  "name": "Jason",
  "email": "jason@gmail.com",
  "password": "jason1234",
  "epicNumber": "EPIC987654"
}

* Login
http://localhost:3005/api/v1/users/login
{
  "email": "jason@gmail.com",
  "password": "jason1234"
}
