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

// // Configuration and authentication details
// const canvasDomain = 'https://hmh.instructure.com';
// const accessToken = '3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH';
// const courseId = '14706';
// const spreadsheetPath = '/workspaces/Canvas-Course-Builder/courseBuild/IntoLiteratureG8U6CCSDContentsInput.xlsx';

// Function to update assignment points
async function updateAssignmentPoints(courseId) {
    console.log('Starting to update assignment points...');

    // Get assignment points and names from the spreadsheet
    const assignmentData = await getAssignmentDataFromSpreadsheet(spreadsheetPath);

    // Fetch all assignments from the course
    const allAssignments = await fetchAllAssignments(courseId);

    // Iterate through each assignment from the spreadsheet
    for (const assignment of assignmentData) {
        console.log(`Processing assignment: ${assignment.name}`);

        // Find matching assignment in Canvas
        const canvasAssignment = allAssignments.find(a => a.name === assignment.name);
        if (canvasAssignment) {
            console.log(`Updating assignment ID ${canvasAssignment.id} with points: ${assignment.points}`);
            await updateAssignment(courseId, canvasAssignment.id, assignment.points);
        } else {
            console.log(`Assignment '${assignment.name}' not found in Canvas.`);
        }
    }

    console.log('Completed updating assignment points.');
}

// Function to get assignment data from the spreadsheet
async function getAssignmentDataFromSpreadsheet(filePath) {
    console.log(`Reading spreadsheet data from ${filePath}...`);
    try {
        const rows = await readXlsxFile(filePath);
        const headers = rows[0];
        return rows.slice(1).map(row => {
            const rowData = {};
            headers.forEach((header, index) => {
                rowData[header] = row[index];
            });
            return {
                name: rowData['DISPLAY TITLE for course build'],
                points: parseFloat(rowData['Points'])
            };
        }).filter(a => a.points != null && a.name != null);
    } catch (error) {
        console.error('Error reading spreadsheet:', error);
        return [];
    }
}

// Function to fetch all assignments from a course
async function fetchAllAssignments(courseId) {
    let url = `${canvasDomain}/api/v1/courses/${courseId}/assignments`;
    let assignments = [];

    try {
        while (url) {
            const response = await axios.get(url, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
                params: { per_page: 100 }
            });
            assignments = assignments.concat(response.data);
            url = getNextLink(response.headers.link);
        }
    } catch (error) {
        console.error('Error fetching all assignments:', error);
    }

    return assignments;
}

// Utility function to parse the 'next' link from the API response headers
function getNextLink(linkHeader) {
    if (!linkHeader) return null;
    const links = linkHeader.split(',');
    const nextLink = links.find(link => link.includes('rel="next"'));
    return nextLink ? new URL(nextLink.match(/<(.+?)>/)[1]).href : null;
}

// Function to update an assignment with new points
async function updateAssignment(courseId, assignmentId, points) {
    console.log(`Updating assignment ID ${assignmentId} in course ID ${courseId} with new points: ${points}`);
    const url = `${canvasDomain}/api/v1/courses/${courseId}/assignments/${assignmentId}`;
    const data = { assignment: { points_possible: points } };

    try {
        await axios.put(url, data, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(`Successfully updated assignment ID ${assignmentId}`);
    } catch (error) {
        console.error(`Error updating assignment ID ${assignmentId}:`, error);
    }
}

// Start the main execution
(async () => {
    await updateAssignmentPoints(courseId);
})();
