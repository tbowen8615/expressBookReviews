const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// Middleware to parse JSON payloads
app.use(express.json());

// Configure session
app.use(
    "/customer",
    session({
        secret: "fingerprint_customer", // Secret for signing the session ID
        resave: true,
        saveUninitialized: true,
    })
);

// Middleware for session-based authentication
app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if the session contains a token
    if (!req.session || !req.session.token) {
        return res.status(401).json({ message: "Access denied. Token missing." });
    }

    // Verify the token using jsonwebtoken
    jwt.verify(req.session.token, "fingerprint_customer", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token." });
        }

        // Attach decoded user info to the request
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    });
});

// Set up routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
