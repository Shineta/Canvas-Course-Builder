const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Add the path module
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (including your HTML)
app.use(express.static(path.join(__dirname, 'public')));

// Route for serving the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for handling form submissions
app.post('/update-env', (req, res) => {
    const { canvasDomain, accessToken, courseId, spreadsheetPath, coursePrefix } = req.body;

    // Set environment variables
    process.env.CANVAS_DOMAIN = canvasDomain;
    process.env.ACCESS_TOKEN = accessToken;
    process.env.COURSE_ID = courseId;
    process.env.SPREADSHEET_PATH = spreadsheetPath;
    process.env.COURSE_PREFIX = coursePrefix;

    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000; // Use the provided PORT environment variable or 3000 as the default
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
