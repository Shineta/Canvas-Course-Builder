/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//The provided code is a Node.js script designed for interacting with the Canvas Learning Management System (LMS)                     //
//via its API, specifically to manage assignment groups within a given course. It consists of several key components and functions:    //
// ****Dependencies and Configuration: The script uses the axios library for making HTTP requests. It is configured with the Canvas    //
//     LMS domain (canvasDomain), an access token (accessToken), and a specific course ID (courseId) for which the operations are      //
//     to be performed.                                                                                                                //
// ****Function to Retrieve Assignment Groups: The getAssignmentGroups function is an asynchronous function that fetches all           //
//     assignment groups from a specified course in Canvas. It makes a GET request to the Canvas API and returns the list of           //
//     assignment groups. Error handling is included to log any issues encountered during the request.                                 //
// ****Function to Delete an Assignment Group: The deleteAssignmentGroup function is also asynchronous and is responsible              //
//     for deleting a specific assignment group within the course. It takes the course ID and the assignment group ID as               //
//     parameters, making a DELETE request to the Canvas API. It logs the action of deletion or any errors encountered.                //
// ****Main Function to Delete All Assignment Groups: The deleteAllAssignmentGroups function is the main executor of the script.       //
//     It first retrieves a list of all assignment groups in the specified course using the getAssignmentGroups function. Then,        //
//     it iterates over each group, deleting them one by one using the deleteAssignmentGroup function.                                 //
// ****Execution of the Main Function: Finally, the script calls deleteAllAssignmentGroups with the specified courseId, triggering     //
//     the process to delete all assignment groups in that course.                                                                     //
// This script is particularly useful for Canvas administrators or instructors who need to programmatically manage course content,     //
// especially in scenarios requiring bulk deletion or modification of assignment groups. The script exemplifies the use of asynchronous// 
// JavaScript functions and API interactions to automate and streamline tasks in an educational technology context.                    //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
// const canvasDomain = 'https://hmh.instructure.com';
// const accessToken = '3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH';
// const courseId = '14706';

// This function retrieves all assignment groups from a specific course in Canvas.
// It makes a GET request to the Canvas API and returns the list of assignment groups.
async function getAssignmentGroups(courseId) {
    const url = `${canvasDomain}/api/v1/courses/${courseId}/assignment_groups`;
    try {
        const response = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting assignment groups:', error);
        return [];
    }
}

// This function deletes a specific assignment group in a course using the Canvas API.
// It takes the course ID and the assignment group ID as parameters and makes a DELETE request.
async function deleteAssignmentGroup(courseId, groupId) {
    const url = `${canvasDomain}/api/v1/courses/${courseId}/assignment_groups/${groupId}`;
    try {
        await axios.delete(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        console.log(`Deleted assignment group with ID: ${groupId}`);
    } catch (error) {
        console.error(`Error deleting assignment group with ID ${groupId}:`, error);
    }
}

// Main function to delete all assignment groups in a given course.
// It first retrieves all assignment groups using getAssignmentGroups and then
// iterates over them, deleting each one using deleteAssignmentGroup.
async function deleteAllAssignmentGroups(courseId) {
    const groups = await getAssignmentGroups(courseId);
    for (const group of groups) {
        await deleteAssignmentGroup(courseId, group.id);
    }
}

// Executes the main function to delete all assignment groups in the specified course.
deleteAllAssignmentGroups(courseId);
