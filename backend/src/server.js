// This is basically The entry POint Of Our backend
// Step 1 Load The Environment Variables First 
require ('dotenv').config()
// Import Express -> It Basically turns our Node app Into an web Server
const express = require("express");
//Import The  CORS
const cors = require('cors')
// Import our Route Files

const customerRoutes = require('./routes/customerRoutes');
const itemRoutes = require('./routes/itemRoutes');
const billingRoutes = require('./routes/billingRoutes');
const storageRoutes = require('./routes/storageRoutes');

// Import the global error handler
const errorHandler = require('./middlewares/errorhandler');

// Import database initialization
const initializeDatabase = require('./config/dbInit');


//Epxress Application

const app = express()


// Middleware Setup

//basically This Code Runs between Request and Response
// Every Request Pass Through theses befoe reachin The Routes

app.use(cors())

// parse/read The Incoming JSON request Bodies 
app.use(express.json())



//Routes Setup 
// We Basically Attach The Routes Files With a Base URL Prefix 
// Any Request With The /api/custoemers goes to the CustomerRoutes ,
// api/items goes to the itemRoutes and so on

app.use('/api/customers' , customerRoutes);
app.use('/api/items' , itemRoutes);
app.use('/api/billing' , billingRoutes);
app.use('/api/storage', storageRoutes);

// Health Check Routes 

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'LogiEdge backend is up and running!',
        timestamp: new Date().toISOString()
    });
});

//Global Error Handler

app.use(errorHandler);


const PORT = process.env.PORT || 5000;

// Start server with database initialization
const startServer = async () => {
    try {
        // Initialize database (create tables if they don't exist)
        await initializeDatabase();
    } catch (error) {
        console.error('⚠️  Database initialization failed:');
        console.error(`   ${error.message}`);
        console.error('   Server will start anyway, but database may not be ready.');
        console.error('   Please verify MySQL credentials in .env file.');
    }
    
    // Start server regardless of database init result
    app.listen(PORT, () => {
        console.log(`\n✅ LogiEdge Backend is running on port ${PORT}`);
        console.log(`📍 Local: http://localhost:${PORT}`);
        console.log(`🏥 Health check: http://localhost:${PORT}/api/health\n`);
    });
};

startServer();

