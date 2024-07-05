    const express = require('express');
    const session = require('express-session');
    const dotenv = require('dotenv');
    const cors = require('cors');
    const dbConnection = require('./config/dbConnection');
    const authRouter = require('./routers/authRouter');
    const adminRouter = require('./routers/adminRouter');
    const companyRouter = require('./routers/companyRouter');
    const userRouter = require('./routers/userRouter');
    const Cron = require('./services/croneServices');
    const { join } = require('path');
    const { Server } = require('socket.io');
    const { createServer } = require('http');
    const ChatMessage = require('./models/chatmsgSchema'); // Mongoose model for chat messages

    // Load environment variables from .env file
    dotenv.config();

    const app = express();
    const port = process.env.PORT || 3000;

    // Middleware to parse JSON and URL-encoded data
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Create HTTP server and initialize Socket.IO
    const server = createServer(app);
    const io = new Server(server);

    // Configure CORS options
    const corsOptions = {
        origin: 'http://localhost:5173',
        credentials: true
    };

    // Enable CORS with the specified options
    app.use(cors(corsOptions));

    // Serve static files from the 'public' directory
    app.use(express.static('public'));

    // Session middleware configuration
    app.use(session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // Set to true if using HTTPS
    }));

    // Route handlers
    app.use('/', authRouter); // Authentication routes
    app.use('/admin', adminRouter); // Admin routes
    app.use('/company', companyRouter); // Company routes
    app.use('/', userRouter); // User routes

    // Initialize cron services
    Cron.init();


    // Global error handler
    app.use((err, req, res, next) => {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });

    // Connect to the database and start the server
    dbConnection().then(() => {
        server.listen(port, () => { // Use server.listen instead of app.listen
            console.log(`Server running on port ${port}`);
        });
    }).catch(err => {
        console.error('Failed to connect to the database', err);
    });
