// const express = require('express');
// const multer = require('multer');
// const xlsx = require('xlsx');
// const canvas = require('canvas-api-wrapper');
// const { v4: uuidv4 } = require('uuid');

// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));



// // Set up multer for file uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now() + '.xlsx');
//     }
// });

// // const upload = multer({ storage: storage });
// // Set up multer for file uploads
// const upload = multer({ dest: 'uploads/' });

// // Initialize the upload middleware
// // const upload = multer({ storage: storage });



// // Define a route for the root path
// // Serve the HTML form at the root URL
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/ui.html');
// });

// app.post('/upload', upload.single('spreadsheet'), async (req, res) => {
//     try {
//         const sessionID = req.headers['x-session-id'];
//         const { courseNumber, canvasDomain, accessKey, coursePrefix, spreadsheetUrl } = req.body;

//         if (!courseNumber || !canvasDomain || !accessKey || !coursePrefix || (!req.file && !spreadsheetUrl)) {
//             throw new Error('All fields are required, along with a spreadsheet file or URL.');
//         }

//         let courseData;
//         if (req.file) {
//             const spreadsheetPath = req.file.path;
//             courseData = await processSpreadsheetFile(spreadsheetPath); // Implement this function
//         } else {
//             courseData = await processSpreadsheetUrl(spreadsheetUrl, accessKey); // Implement this function
//         }

//         // Implement course building logic here
//         // Example: const courseBuilt = await buildCourse({courseNumber, canvasDomain, courseData, ...});

//         sessionData[sessionID] = { /* course data */ };
//         res.status(200).send({ message: 'Course successfully built.' });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send({ error: error.message || 'An error occurred while processing the request.' });
//     }
// });


// // Set up Canvas API Wrapper
// canvas.subdomain = 'hmh'; // Replace with your Canvas subdomain
// canvas.apiToken = '3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH'; // Replace with your Canvas API token

// const course = canvas.getCourse(14706); // Replace 12345 with your course ID

// // async function getCourseData() {
// //     try {
// //         const course = canvas.getCourse(14706); // Replace with actual course ID
// //         await course.get();
// //         console.log(course);
// //     } catch (error) {
// //         console.error(error);
// //     }
// // }

// // Route for uploading file or handling URL-based submission
// app.post('/upload', upload.single('spreadsheet'), async (req, res) => {
//     try {
//         // Extract user inputs
//         const { courseNumber, canvasDomain, accessKey, coursePrefix, spreadsheetUrl } = req.body;

//         // Validate inputs
//         if (!courseNumber || !canvasDomain || !accessKey || !coursePrefix || (!req.file && !spreadsheetUrl)) {
//             throw new Error('All fields are required, along with a spreadsheet file or URL.');
//         }

//         // Process file upload or URL-based submission
//         let courseData;
//         if (req.file) {
//             // File upload scenario
//             const spreadsheetPath = req.file.path; // Path to the uploaded spreadsheet file
//             courseData = await processSpreadsheetFile(spreadsheetPath); // Implement this function
//         } else {
//             // URL-based submission scenario
//             courseData = await processSpreadsheetUrl(spreadsheetUrl, accessKey); // Implement this function
//         }

//         // Implement course building logic here
//         // Example: const courseBuilt = await buildCourse({courseNumber, canvasDomain, courseData, ...});

//         res.status(200).send({ message: 'Course successfully built.' });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send({ error: error.message || 'An error occurred while processing the request.' });
//     }
// });


// // Route for uploading the spreadsheet and building the course
// app.post('/upload', upload.single('spreadsheet'), async (req, res) => {
//     try {
//         // Extract and validate user inputs
//         const courseInfo = getCourseInfo(req); // Adjust as per your actual function
//         console.log('Course info retrieved and validated successfully.');

//         // Convert the uploaded spreadsheet into course objects
//         const spreadsheetPath = req.file.path; // Path to the uploaded spreadsheet file
//         const courseData = await setSpreadsheetData(spreadsheetPath); // Adjust as per your actual function
//         console.log('Spreadsheet data successfully set into course objects.');

//         // Create the course in Canvas
//         await buildCourse(courseInfo, courseData); // Adjust as per your actual function
//         console.log('Course successfully built in Canvas.');

//         res.status(200).send({ message: 'Course successfully built.' });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send({ error: 'An error occurred while processing the request.' });
//     }
// });


// // Additional routes and server logic can go here...

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


// module.exports = app; // Export the Express app

/////////////////////////////////////////////////////////////////////////////////////
//*********************************New Server************************************* */
/////////////////////////////////////////////////////////////////////////////////////


const express = require('express');

const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS to allow requests from your web application
app.use(cors());
app.use(express.json());

// Define a route for running scripts
app.post('/run-scripts', (req, res) => {
    try {
        const { scripts } = req.body;

        if (!Array.isArray(scripts) || scripts.length === 0) {
            throw new Error('Invalid or empty list of scripts.');
        }

        // Function to run a Node.js script synchronously
        function runScriptSynchronously(filePath) {
            const command = `node ${filePath}`;

            // Run the script and wait for it to finish
            const result = spawnSync(command, {
                stdio: 'inherit', // Use the same stdio as the parent process (e.g., show script output)
                shell: true, // Use shell for command execution
            });

            if (result.error) {
                console.error(`Error running ${filePath}: ${result.error.message}`);
                return false;
            }

            if (result.status !== 0) {
                console.error(`${filePath} exited with status code ${result.status}`);
                return false;
            }

            return true;
        }

        // Run the scripts sequentially
        const success = scripts.every((script) => runScriptSynchronously(script));

        if (success) {
            res.status(200).send('Scripts executed successfully.');
        } else {
            res.status(500).send('Error executing scripts.');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error executing scripts.');
    }
});

// Define a route for building the course
app.get('/build-course', async (req, res) => {
    try {
      const { default: execa } = await import('execa'); // Use dynamic import
  
      // Execute the buildCourse.js script
      const result = await execa('node', ['buildCourse.js']);
  
      console.log('buildCourse.js output:', result.stdout);
      res.status(200).send('Course built successfully.');
    } catch (error) {
      console.error('Error executing buildCourse.js:', error);
      res.status(500).send('Error building course.');
    }
  });
  
  // Define a route for serving the HTML page with the "Build Course" button
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });