/***************************************************************************************
 *                                                                                     *
 * This Node.js script is designed to interact with the Canvas Learning Management     *
 * System (LMS) through its API, focusing on managing course modules. It features a    *
 * specific function to delete all modules in a given course. Key components of the    *
 * script include:                                                                     *
 *                                                                                     *
 * 1. Library Imports and Configurations:                                              *
 *    - axios: For making HTTP requests to the Canvas API.                             *
 *    - read-excel-file/node: Module for reading Excel files (unused in this snippet). *
 *    - fs: Node.js file system module (unused in this snippet).                       *
 *    - Canvas Configuration: Includes Canvas domain, API access token, course ID, and *
 *      paths for a spreadsheet and a JSON file, though the latter two are not used    *
 *      here.                                                                          *
 *                                                                                     *
 * 2. Function - deleteAllModules:                                                     *
 *    - Asynchronously deletes all modules in a specified Canvas course.               *
 *    - Retrieves all modules using a GET request, then iterates through and deletes   *
 *      each module.                                                                   *
 *    - Logs the deletion of each module and handles any errors, logging them to the   *
 *      console.                                                                       *
 *                                                                                     *
 * 3. Example Usage:                                                                   *
 *    - Demonstrates the usage of deleteAllModules function in an asynchronous         *
 *      self-executing function, applying it to the specified courseId.                *
 *                                                                                     *
 * This script is useful for Canvas course administrators for programmatically         *
 * managing course modules, especially for clearing all modules from a course for      *
 * reset or cleanup purposes.                                                          *
 *                                                                                     *
 ***************************************************************************************/


// Import the configuration file
const config = require('/workspaces/Canvas-Course-Builder/courseBuild/config.js');

// Access the shared variables
const axios = config.axios;
const readXlsxFile = config.readXlsxFile;
const canvasDomain = config.canvasDomain;
const accessToken = config.accessToken;
const courseId = config.courseId;
const spreadsheetPath = config.spreadsheetPath;
const coursePrefix = config.coursePrefix;
const moduleItemsPath = config.moduleItemsPath;


// const axios = require('axios');
// const readXlsxFile = require('read-excel-file/node');
const fs = require('fs');
// const canvasDomain = 'https://hmh.instructure.com';
// const accessToken = '3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH';
// const courseId = '14706';
// const spreadsheetPath = '/workspaces/CanvasCourses2/IntoLiteratureG8U6CCSDContentsInput.xlsx';
// const coursePrefix = 'G8_Unit 6:';
const jsonFilePath = '/workspaces/JSON2.json'; // path to save the JSON file

// Function to delete all modules in a course
async function deleteAllModules(courseId) {
    const url = `${canvasDomain}/api/v1/courses/${courseId}/modules`;
    try {
        // Get all modules
        const response = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
            params: { per_page: 100 } // Adjust per_page as needed
        });
        const modules = response.data;

        // Delete each module
        for (const module of modules) {
            const deleteUrl = `${url}/${module.id}`;
            await axios.delete(deleteUrl, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            console.log(`Module with ID ${module.id} has been deleted.`);
        }
    } catch (error) {
        console.error('Error deleting modules:', error);
    }
}

// Example usage
(async () => {
    await deleteAllModules(courseId);
})();
