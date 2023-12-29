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
// const canvasDomain = 'https://hmh.instructure.com';
// const accessToken = '3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH'; // Replace with your actual access token
// const courseId = '14706'; // Replace with the target course ID
// const spreadsheetPath = '/workspaces/CanvasCourses2/IntoLiteratureG8U6CCSDContentsInput.xlsx'; // Update with your actual file path
// const coursePrefix = 'G8_Unit 6:'; // Update this with the dynamic course prefix
// const moduleItemsPath = '/workspaces/CanvasCourses2/module_items_updated2.xlsx'; // Update with your actual file path



async function fetchAllAssignments(courseId) {
    let url = `${canvasDomain}/api/v1/courses/${courseId}/assignments`;
    let allAssignments = [];

    try {
        while (url) {
            const response = await axios.get(url, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
                params: { per_page: 100 }
            });
            allAssignments = allAssignments.concat(response.data);

            url = " "; // Reset URL
            const linkHeader = response.headers.link;
            if (linkHeader) {
                const nextLink = linkHeader.split(',').find(link => link.includes('rel="next"'));
                if (nextLink) {
                    const match = nextLink.match(/<(.*?)>/);
                    url = match ? match[1] : null;
                }
            }
        }
    } catch (error) {
        console.error('Error fetching all assignments:', error);
    }
    return allAssignments;
}



// Function to find the iFrame address based on a partial match of the assignment title
function findIFrameAddress(moduleItemsData, assignmentTitle) {
    const moduleItem = moduleItemsData.find(item => assignmentTitle.includes(item['Title After Hyphen']));
    if (moduleItem && moduleItem['decodedParams']) {
        return moduleItem['decodedParams'];
    }
    return null;
}

// Function to read a specific column from a spreadsheet
async function readColumnFromSpreadsheet(filePath, columnName) {
    try {
        const rows = await readXlsxFile(filePath);
        const headerRow = rows[0];
        const columnIndex = headerRow.findIndex(header => header === columnName);
        if (columnIndex === -1) {
            console.error(`Column '${columnName}' not found in the spreadsheet.`);
            return [];
        }
        return rows.slice(1).map(row => row[columnIndex]);
    } catch (error) {
        console.error('Error reading spreadsheet:', error);
        return [];
    }
}

// Function to get assignments in the course
async function getAssignmentsInCourse(courseId) {
    const url = `${canvasDomain}/api/v1/courses/${courseId}/assignments`;

    try {
        const response = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching assignments:', error);
        return [];
    }
}

// Function to find the iFrame address based on a partial match of assignment title
async function findIFrameAddressByPartialMatch(moduleItems, partialTitle) {
    const matchingItem = moduleItems.find(item => item.title.includes(partialTitle));
    return matchingItem ? matchingItem.url : null;
}

// Main function to log assignment titles and iFrame addresses
async function logAssignmentTitlesAndIFrameAddresses() {
    const assignmentColumn = 'Display Title on Ed'; // Adjust to your column name
    const moduleItemsColumn = 'Title After Hyphen'; // Adjust to your column name

    // Read assignment titles from the first spreadsheet
    const assignmentTitles = await readColumnFromSpreadsheet(spreadsheetPath, assignmentColumn);

    // Read module items from the second spreadsheet
    const moduleItems = await readColumnFromSpreadsheet(moduleItemsPath, moduleItemsColumn);

    if (assignmentTitles.length === 0 || moduleItems.length === 0) {
        console.error('No data found in one of the spreadsheets.');
        return;
    }

    // Get assignments in the course
    const assignments = await getAssignmentsInCourse(courseId);

    // Iterate through assignments and find iFrame addresses
    for (const assignment of assignments) {
        if (assignment.submission_types.includes('online_upload')) {
            // Check if the assignment role is 'Student'
            if (assignment.education_level === 'student') {
                const assignmentTitle = assignment.title;

                // Find the iFrame address based on a partial match of the assignment title
                const iFrameAddress = await findIFrameAddressByPartialMatch(moduleItems, assignmentTitle);

                // Log assignment title and iFrame address
                console.log(`Assignment Title: ${assignmentTitle}`);
                console.log(`IFrame Address: ${iFrameAddress || 'Not found'}`);
            }
        }
    }
}

logAssignmentTitlesAndIFrameAddresses().catch(error => {
    console.error("An error occurred:", error);
});






// async function updateAssignmentDescription(courseId, assignmentId, newDescription) {
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/assignments/${assignmentId}`;

//     try {
//         await axios.put(url, {
//             assignment: {
//                 description: newDescription
//             }
//         }, {
//             headers: { 'Authorization': `Bearer ${accessToken}` }
//         });
//         console.log(`Updated assignment ID ${assignmentId} with new description.`);
//     } catch (error) {
//         console.error(`Error updating assignment ID ${assignmentId}:`, error);
//     }
// }

async function updateAssignmentDescription(courseId, assignmentId, assignmentDescription, iFrameUrl) {
    // Handle null or undefined assignment description
    const description = assignmentDescription ? assignmentDescription : '';

    // Construct the new description with the iFrame
    const newDescription = `${description}\n\n<iframe src="${iFrameUrl}" width="100%" height="600px" frameborder="0" allowfullscreen="true"></iframe>`;

    const url = `${canvasDomain}/api/v1/courses/${courseId}/assignments/${assignmentId}`;

    try {
        await axios.put(url, {
            assignment: {
                description: newDescription
            }
        }, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        console.log(`Updated assignment ID ${assignmentId} with new description.`);
    } catch (error) {
        console.error(`Error updating assignment ID ${assignmentId}:`, error);
    }
}

// Function to read the "module_items.xlsx" spreadsheet and extract iFrame addresses
async function readModuleItemsSpreadsheet(filePath) {
    try {
        const rows = await readXlsxFile(filePath);
        const headers = rows[0];
        const jsonData = rows.slice(1).map(row => {
            let rowData = {};
            row.forEach((value, index) => {
                rowData[headers[index]] = value;
            });
            return rowData;
        });
        return jsonData;
    } catch (error) {
        console.error('Error reading module_items spreadsheet:', error);
        return [];
    }
}


(async () => {
    // Read module items data from the spreadsheet to get iFrame URLs
    const moduleItemsData = await readModuleItemsSpreadsheet(moduleItemsPath);

    // Fetch all assignments
    const assignments = await fetchAllAssignments(courseId);

   

    // Iterate over each assignment
    for (const assignment of assignments) {
        // Find the iFrame URL for the assignment
        const iFrameUrl = findIFrameAddress(moduleItemsData, assignment.name);

        // Check if the iFrame URL is found
        if (iFrameUrl) {
            // Update the assignment description with the iFrame
            const newDescription = `${assignment.description}\n\n<iframe src="${iFrameUrl}" width="100%" height="600px" frameborder="0" allowfullscreen="true"></iframe>`;
            await updateAssignmentDescription(courseId, assignment.id, newDescription);
        } else {
            console.log(`iFrame URL not found for assignment: ${assignment.name}`);
        }
    }

    for (const assignment of assignments) {
        const iFrameUrl = findIFrameAddress(moduleItemsData, assignment.name);

        if (iFrameUrl) {
            await updateAssignmentDescription(courseId, assignment.id, assignment.description, iFrameUrl);
        } else {
            console.log(`iFrame URL not found for assignment: ${assignment.name}`);
        }
    }
})();