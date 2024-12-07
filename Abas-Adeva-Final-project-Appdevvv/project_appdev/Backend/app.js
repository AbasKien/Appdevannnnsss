// app.js
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MySQLStore = require('express-mysql-session')(session);
const cors = require("cors");
const router = require("./route/router.js");
const path = require("path");
const app = express();

// Set up view engine
app.set("view engine", "ejs");

// Database configuration for session store
const options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'appDev_project_ecommerce'
};

const sessionStore = new MySQLStore(options);

// Middleware configuration
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Set up session middleware
app.use(
  session({
    key: 'session_cookie_name',
    secret: "your-secret-key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: 'lax'
    },
  })
);

// Use the router for all defined routes
app.use("/", router);

// Start server
const PORT = 5555;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/login`);
});
