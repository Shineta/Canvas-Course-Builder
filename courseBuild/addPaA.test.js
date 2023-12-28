// const axios = require('axios');
// const readXlsxFile = require('read-excel-file/node');
// const canvasDomain = 'https://hmh.instructure.com';
// const accessToken = '3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH'; // Replace with your actual access token
// const courseId = '14706'; //  target course ID
// const spreadsheetPath = '/workspaces/Canvas-Course-Builder/courseBuild/IntoLiteratureG8U6CCSDContentsInput.xlsx'; // Update with your actual file path
// const coursePrefix = 'G8_Unit 6:'; // dynamic course prefix

// // Function to read the spreadsheet and convert it to JSON
// async function convertSpreadsheetToJson(filePath) {
//     try {
//         const rows = await readXlsxFile(filePath);
//         const headers = rows[0];
//         return rows.slice(1).map(row => {
//             let rowData = {};
//             row.forEach((value, index) => {
//                 rowData[headers[index]] = value;
//             });
//             return rowData;
//         });
//     } catch (error) {
//         console.error('Error reading spreadsheet:', error.message);
//         return [];
//     }
// }

// // Function to create a new page in the course with an iFrame in the body
// async function createCoursePage(courseId, pageTitle, pageContent, iFrameURL) {
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/pages`;
//     const iFrameHtml = `<iframe src="${iFrameURL}"></iframe>`; // Replace with your actual iFrame URL

//     const data = {
//         wiki_page: {
//             title: pageTitle,
//             body: iFrameHtml + pageContent // Adding the iFrame HTML to the page content
//         }
//     };

//     try {
//         const response = await axios.post(url, data, {
//             headers: { 'Authorization': `Bearer ${accessToken}` }
//         });
//         console.log('Page created:', response.data);
//         return response.data;
//     } catch (error) {
//         console.error('Error creating page:', error.response ? error.response.data : error.message);
//         return null;
//     }
// }


// // Function to create an assignment
// async function createAssignment(courseId, assignmentName, moduleName, iFrameURL, pointsPossible) {
//     const description = `<iframe src="${iFrameURL}"></iframe>`; // Using iFrame URL passed as a parameter
//     const groupId = await findAssignmentGroupIdByName(courseId, moduleName);
//     if (!groupId) {
//         console.log(`Assignment group named '${moduleName}' not found.`);
//         return null;
//     }
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/assignments`;
//     const data = {
//         assignment: {
//             name: assignmentName,
//             assignment_group_id: groupId,
//             description: description, // Adding the iFrame as the assignment description
//             points_possible: pointsPossible,   // Setting the points for the assignment from the argument
//             // Other assignment details can be added here
//         }
//     };

//     try {
//         const response = await axios.post(url, data, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//         console.log(`Assignment '${assignmentName}' created in module '${moduleName}' with ID ${groupId}`);
//         return response.data;
//     } catch (error) {
//         console.error('Error creating assignment:', error.response ? error.response.data : error.message);
//         return null;
//     }
// }


// // Function to find an assignment group ID by name
// async function findAssignmentGroupIdByName(courseId, groupName) {
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/assignment_groups`;
//     try {
//         const response = await axios.get(url, {
//             headers: { 'Authorization': `Bearer ${accessToken}` },
//             params: { per_page: 100 }
//         });
//         const groups = response.data;
//         const foundGroup = groups.find(group => group.name === groupName);
//         return foundGroup ? foundGroup.id : null;
//     } catch (error) {
//         console.error('Error finding assignment group:', error.response ? error.response.data : error.message);
//         return null;
//     }
// }

// async function findAssignmentIdByName(courseId, assignmentName) {
//     let url = `${canvasDomain}/api/v1/courses/${courseId}/assignments`;

//     try {
//         while (url) {
//             const response = await axios.get(url, {
//                 headers: { 'Authorization': `Bearer ${accessToken}` },
//                 params: { per_page: 100 }
//             });

//             const assignments = response.data;
//             const foundAssignment = assignments.find(assignment => assignment.name === assignmentName);
//             if (foundAssignment) return foundAssignment.id;

//             // Check for the 'next' link in the headers
//             url = null; // Reset URL to null initially
//             const linkHeader = response.headers['link'];
//             if (linkHeader) {
//                 const links = linkHeader.split(',');
//                 const nextLink = links.find(link => link.includes('rel="next"'));
//                 if (nextLink) {
//                     const match = nextLink.match(/<(.*?)>/);
//                     url = match ? match[1] : null;
//                 }
//             }
//         }
//     } catch (error) {
//         console.error('Error finding assignment:', error);
//     }
//     return null;
// }

// // Function to add assignments to their respective groups
// async function addAssignmentsToGroups(courseId, assignmentsData) {
//     for (const assignmentData of assignmentsData) {
//         const groupId = await findAssignmentGroupIdByName(courseId, assignmentData.assignmentGroup);
//         if (groupId) {
//             assignmentData.assignment_group_id = groupId; // Set the group ID for the assignment
//             await createAssignment(courseId, assignmentData);
//         } else {
//             console.log(`Assignment group '${assignmentData.assignmentGroup}' not found.`);
//         }
//     }
// }

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //*********************Add All Assignments as module items***************************************************** */
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// //   // Function to iterate over JSON data and add module items for each student assignment
// //   async function addAllAssignmentsAsModuleItems(courseId, jsonData) {
// //     for (const item of jsonData) {
// //       if (item['Ed Audience/Role'] === 'Student') {
// //         const moduleName = item['NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE'];
// //         const assignmentName = item['DISPLAY TITLE for course build'];
// //         const moduleId = await findModuleIdByName(courseId, moduleName);
// //         if (moduleId) {
// //           await addAssignmentModuleItem(courseId, moduleId, assignmentName);
// //         } else {
// //           console.log(`Module named '${moduleName}' not found.`);
// //         }
// //       }
// //     }
// //   }


// ///////////////////////////12-25-23//////////////////////////////////////////////////////

// // Function to iterate over JSON data and add module items for each page/assignment
// async function addAllItemsAsModuleItems(courseId, jsonData) {
//     // Sort jsonData by order using Array sort method before iterating
//     jsonData.sort((a, b) => {
//         return a.order - b.order;
//     });

//     for (const item of jsonData) {
//         if (item['Ed Audience/Role'] === 'Student') {
//             const moduleName = item['NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE'];
//             const title = item['DISPLAY TITLE for course build'];
//             const moduleId = await findModuleIdByName(courseId, moduleName);

//             if (moduleId) {
//                 if (item.category && item.category.toLowerCase() === 'required') {
//                     if (item.points === 0 || item.points === null) {
//                         // Create a page and add it to the module
//                         const pageUrl = title.toLowerCase().replace(/\s+/g, '-'); // Convert title to URL format
//                         await createCoursePage(courseId, title, item.iFrameDescription);
//                         await addPageToModule(courseId, moduleId, pageUrl);
//                     } else {
//                         // Create an assignment and add it to the module
//                         await createAssignment(courseId, title, moduleName, item.iFrameDescription, item.points);
//                         await addAssignmentModuleItem(courseId, moduleId, title);
//                     }
//                 }
//             } else {
//                 console.log(`Module named '${moduleName}' not found.`);
//             }
//         }
//     }
// }


//   async function findModuleIdByName(courseId, moduleName) {
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/modules`;
    
//     try {
//         const response = await axios.get(url, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json'
//             },
//             params: {
//                 per_page: 100 // Adjust this number based on your expected number of modules
//             }
//         });

//         const modules = response.data;
//         const foundModule = modules.find(module => module.name === moduleName);
//         return foundModule ? foundModule.id : null;
//     } catch (error) {
//         console.error('Error finding module:', error.response ? error.response.data : error.message);
//         return null;
//     }
// }


// //   // Function to iterate over JSON data and add module items for each page/assignment
// // async function addAllItemsAsModuleItems(courseId, jsonData) {
// //     for (const item of jsonData) {
// //         if (item['Ed Audience/Role'] === 'Student') {
// //             const moduleName = item['NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE'];
// //             const title = item['DISPLAY TITLE for course build'];
// //             const moduleId = await findModuleIdByName(courseId, moduleName);

// //             if (moduleId) {
// //                 if (item.category && item.category.toLowerCase() === 'required') {
// //                     if (item.points === 0 || item.points === null) {
// //                         // Create a page and add it to the module
// //                         const pageUrl = title.toLowerCase().replace(/\s+/g, '-'); // Convert title to URL format
// //                         await createCoursePage(courseId, title, item.iFrameDescription);
// //                         await addPageToModule(courseId, moduleId, pageUrl);
// //                     } else {
// //                         // Create an assignment and add it to the module
// //                         await createAssignment(courseId, title, moduleName, item.iFrameDescription, item.points);
// //                         await addAssignmentModuleItem(courseId, moduleId, title);
// //                     }
// //                 }
// //             } else {
// //                 console.log(`Module named '${moduleName}' not found.`);
// //             }
// //         }
// //     }
// // }

// // Function to add a page as a module item
// async function addPageToModule(courseId, moduleId, pageUrl) {
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items`;
//     const data = {
//         module_item: {
//             title: pageUrl, // The title of the page
//             type: 'Page', // The type of item to be added
//             content_id: pageUrl, // The ID of the content to link to
//             new_tab: false // Whether the link should open in a new tab
//         }
//     };

//     try {
//         const response = await axios.post(url, data, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//         console.log(`Page '${pageUrl}' added to module with ID ${moduleId}`);
//         return response.data;
//     } catch (error) {
//         console.error('Error adding page to module:', error.response ? error.response.data : error.message);
//         return null;
//     }
// }

// // Function to add an assignment as a module





// // Function to retrieve all items within a given module from Canvas
// async function getCourseModuleItems(courseId, moduleId) {
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items`;

//     try {
//         const response = await axios.get(url, {
//             headers: { 'Authorization': `Bearer ${accessToken}` },
//             params: { per_page: 100 }
//         });

//         return response.data;
//     } catch (error) {
//         console.error('Error retrieving module items:', error.response ? error.response.data : error.message);
//         return null;
//     }
// }

// // Function to compare the order of items in the course to the order in the spreadsheet
// function compareModuleItemsOrder(courseItems, spreadsheetItems) {
//     // Assumption: Spreadsheet items are already filtered and ordered as they should appear in the course
//     for (let i = 0; i < spreadsheetItems.length; i++) {
//         if (courseItems[i] && courseItems[i].title !== spreadsheetItems[i]['DISPLAY TITLE for course build']) {
//             return false;
//         }
//     }

//     return true;
// }


// // Main execution logic
// (async () => {
//     try {
//         const jsonData = await convertSpreadsheetToJson(spreadsheetPath);

//         // Filter jsonData based on specific criteria
// // Filter jsonData based on specific criteria and include the category
// const filteredData = jsonData.filter(row => row['Ed Audience/Role'] === 'Student').map(row => {
//     return {
//         module: row['NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE'],
//         assignmentTitle: row['DISPLAY TITLE for course build'],
//         points: row['Points'], // Assuming there's a 'Points' column
//         category: row['Category'], // Include the category column
//         iFrameDescription: `<iframe src="your-iframe-url-here"></iframe>` // Replace with your actual iFrame URL
//     };
// });

// // Iterate over filteredData and create pages or assignments based on conditions
// for (let item of filteredData) {
//     // Check if the item has 'required' category
//     if (item.category && item.category.toLowerCase() === 'required') {
//         // Check if points are 0 or null, then create a page
//         if (item.points === 0 || item.points === null) {
//             await createCoursePage(courseId, item.assignmentTitle, item.iFrameDescription);
//         } else {
//             // Otherwise, create an assignment
//             await createAssignment(courseId, item.assignmentTitle, item.module, item.iFrameDescription, item.points);
//         }
//     }
// }





// // await addAllAssignmentsAsModuleItems(courseId, jsonData);
// await addAllItemsAsModuleItems(courseId, jsonData);


//         console.log('All items have been processed successfully.');
//     } catch (error) {
//         console.error('An error occurred during the main execution:', error.message);
//     }
// })();


///////////////////////////////////////////////////////////////////////////////////////////
//******************************New Test 12-22-23****************************************//
///////////////////////////////////////////////////////////////////////////////////////////

// const axios = require('axios');
// const readXlsxFile = require('read-excel-file/node');

// const canvasDomain = 'https://your.canvas.domain.com'; // Replace with your Canvas domain
// const accessToken = 'your-access-token'; // Replace with your actual access token
// const courseId = 'your-course-id'; // Replace with your course ID
// const spreadsheetPath = '/workspaces/Canvas-Course-Builder/courseBuild/IntoLiteratureG8U6CCSDContentsInput.xlsx'; // Update with your actual file path

// // Function to read the spreadsheet and convert it to JSON
// async function convertSpreadsheetToJson(filePath) {
//     try {
//         const rows = await readXlsxFile(filePath);
//         const headers = rows[0];
//         return rows.slice(1).map(row => {
//             let rowData = {};
//             row.forEach((value, index) => {
//                 rowData[headers[index]] = value;
//             });
//             return rowData;
//         });
//     } catch (error) {
//         console.error('Error reading spreadsheet:', error.message);
//         return [];
//     }
// }

// // Function to create a new page in the course
// async function createCoursePage(courseId, pageTitle, pageContent) {
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/pages`;
//     const data = { wiki_page: { title: pageTitle, body: pageContent } };
//     try {
//         const response = await axios.post(url, data, { headers: { 'Authorization': `Bearer ${accessToken}` } });
//         return response.data.url;
//     } catch (error) {
//         console.error('Error creating page:', error.message);
//         return null;
//     }
// }

// // Function to create an assignment
// async function createAssignment(courseId, assignmentName, assignmentGroupId, pointsPossible) {
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/assignments`;
//     const data = { assignment: { name: assignmentName, assignment_group_id: assignmentGroupId, points_possible: pointsPossible } };
//     try {
//         const response = await axios.post(url, data, { headers: { 'Authorization': `Bearer ${accessToken}` } });
//         return response.data.id;
//     } catch (error) {
//         console.error('Error creating assignment:', error.message);
//         return null;
//     }
// }

// // Function to find an assignment group ID by name with pagination handling
// async function findAssignmentGroupIdByName(courseId, groupName) {
//     let url = `${canvasDomain}/api/v1/courses/${courseId}/assignment_groups`;
//     try {
//         while (url) {
//             const response = await axios.get(url, { headers: { 'Authorization': `Bearer ${accessToken}` }, params: { per_page: 100 } });
//             const groups = response.data;
//             const foundGroup = groups.find(group => group.name === groupName);
//             if (foundGroup) return foundGroup.id;

//             url = getNextUrl(response.headers.link);
//         }
//     } catch (error) {
//         console.error('Error finding assignment group:', error.message);
//         return null;
//     }
//     return null;
// }

// // Function to parse the 'Link' header for pagination
// function getNextUrl(linkHeader) {
//     if (!linkHeader) return null;
//     const links = linkHeader.split(',');
//     const nextLink = links.find(link => link.includes('rel="next"'));
//     if (nextLink) {
//         const match = nextLink.match(/<(.*?)>/);
//         return match ? match[1] : null;
//     }
//     return null;
// }

// // Function to add an item to a module
// async function addModuleItem(courseId, moduleId, itemType, itemId) {
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items`;
//     const data = { module_item: { type: itemType, content_id: itemId } };
//     try {
//         await axios.post(url, data, { headers: { 'Authorization': `Bearer ${accessToken}` } });
//     } catch (error) {
//         console.error(`Error adding ${itemType} to module:`, error.message);
//     }
// }

// // Main Execution Logic
// (async () => {
//     try {
//         const jsonData = await convertSpreadsheetToJson(spreadsheetPath);
//         let creationOrder = [];

//         for (const item of jsonData) {
//             const moduleId = await findModuleIdByName(courseId, item.moduleName);
//             if (!moduleId) {
//                 console.error(`Module named '${item.moduleName}' not found.`);
//                 continue;
//             }

//             let contentId;
//             if (item.type === 'Page') {
//                 contentId = await createCoursePage(courseId, item.title, item.content);
//                 await addModuleItem(courseId, moduleId, 'Page', contentId);
//             } else if (item.type === 'Assignment') {
//                 const groupId = await findAssignmentGroupIdByName(courseId, item.assignmentGroupName);
//                 contentId = await createAssignment(courseId, item.title, groupId, item.points);
//                 await addModuleItem(courseId, moduleId, 'Assignment', contentId);
//             }
//             creationOrder.push({ id: contentId, title: item.title });
//         }

//         // Verify the order of module items
//         for (const module of jsonData) {
//             await verifyModuleItemsOrder(courseId, module.moduleId, creationOrder);
//         }

//         console.log('All items have been processed successfully.');
//     } catch (error) {
//         console.error('An error occurred during the main execution:', error.message);
//     }
// })();

// module.exports = app; // Export the app for testing

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const axios = require('axios');
const readXlsxFile = require('read-excel-file/node');
const canvasDomain = 'https://hmh.instructure.com';
const accessToken = '3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH'; // Replace with your actual access token
const courseId = '14706'; // target course ID
const spreadsheetPath = '/workspaces/Canvas-Course-Builder/courseBuild/IntoLiteratureG8U6CCSDContentsInput.xlsx'; // Update with your actual file path

// Function to read the spreadsheet and convert it to JSON
async function convertSpreadsheetToJson(filePath) {
    try {
        const rows = await readXlsxFile(filePath);
        const headers = rows[0];
        return rows.slice(1).map(row => {
            let rowData = {};
            row.forEach((value, index) => {
                rowData[headers[index]] = value;
            });
            return rowData;
        });
    } catch (error) {
        console.error('Error reading spreadsheet:', error.message);
        return [];
    }
}

// Function to create a new page in the course with an iFrame in the body
async function createCoursePage(courseId, pageTitle, pageContent, iFrameURL) {
    const url = `${canvasDomain}/api/v1/courses/${courseId}/pages`;
    const iFrameHtml = `<iframe src="${iFrameURL}"></iframe>`;
    const data = {
        wiki_page: {
            title: pageTitle,
            body: iFrameHtml + pageContent
        }
    };

    try {
        const response = await axios.post(url, data, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        console.log('Page created:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating page:', error.response ? error.response.data : error.message);
        return null;
    }
}

// Function to create an assignment
async function createAssignment(courseId, assignmentName, moduleName, iFrameURL, pointsPossible) {
    const description = `<iframe src="${iFrameURL}"></iframe>`;
    const groupId = await findAssignmentGroupIdByName(courseId, moduleName);
    if (!groupId) {
        console.log(`Assignment group named '${moduleName}' not found.`);
        return null;
    }
    const url = `${canvasDomain}/api/v1/courses/${courseId}/assignments`;
    const data = {
        assignment: {
            name: assignmentName,
            assignment_group_id: groupId,
            description: description,
            points_possible: pointsPossible
        }
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(`Assignment '${assignmentName}' created in module '${moduleName}' with ID ${groupId}`);
        return response.data;
    } catch (error) {
        console.error('Error creating assignment:', error.response ? error.response.data : error.message);
        return null;
    }
}

// Function to find an assignment group ID by name
async function findAssignmentGroupIdByName(courseId, groupName) {
    const url = `${canvasDomain}/api/v1/courses/${courseId}/assignment_groups`;
    try {
        const response = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
            params: { per_page: 100 }
        });
        const groups = response.data;
        const foundGroup = groups.find(group => group.name === groupName);
        return foundGroup ? foundGroup.id : null;
    } catch (error) {
        console.error('Error finding assignment group:', error.response ? error.response.data : error.message);
        return null;
    }
}

async function findAssignmentIdByName(courseId, assignmentName) {
    let url = `${canvasDomain}/api/v1/courses/${courseId}/assignments`;

    try {
        while (url) {
            const response = await axios.get(url, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
                params: { per_page: 100 }
            });

            const assignments = response.data;
            const foundAssignment = assignments.find(assignment => assignment.name === assignmentName);
            if (foundAssignment) return foundAssignment.id;

            url = null; // Reset URL to null initially
            const linkHeader = response.headers['link'];
            if (linkHeader) {
                const links = linkHeader.split(',');
                const nextLink = links.find(link => link.includes('rel="next"'));
                if (nextLink) {
                    const match = nextLink.match(/<(.*?)>/);
                    url = match ? match[1] : null;
                }
            }
        }
    } catch (error) {
        console.error('Error finding assignment:', error);
    }
    return null;
}

// Function to add assignments to their respective groups
async function addAssignmentsToGroups(courseId, assignmentsData) {
    for (const assignmentData of assignmentsData) {
        const groupId = await findAssignmentGroupIdByName(courseId, assignmentData.assignmentGroup);
        if (groupId) {
            assignmentData.assignment_group_id = groupId; // Set the group ID for the assignment
            await createAssignment(courseId, assignmentData);
        } else {
            console.log(`Assignment group '${assignmentData.assignmentGroup}' not found.`);
        }
    }
}

// Function to iterate over JSON data and add module items for each page/assignment
async function addAllItemsAsModuleItems(courseId, jsonData) {
    // Sort jsonData by order using Array sort method before iterating
    jsonData.sort((a, b) => {
        return a.order - b.order;
    });

    for (const item of jsonData) {
        if (item['Ed Audience/Role'] === 'Student') {
            const moduleName = item['NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE'];
            const title = item['DISPLAY TITLE for course build'];
            const moduleId = await findModuleIdByName(courseId, moduleName);

            if (moduleId) {
                if (item.category && item.category.toLowerCase() === 'required') {
                    if (item.points === 0 || item.points === null) {
                        const pageUrl = title.toLowerCase().replace(/\s+/g, '-');
                        await createCoursePage(courseId, title, item.iFrameDescription);
                        await addPageToModule(courseId, moduleId, pageUrl);
                    } else {
                        await createAssignment(courseId, title, moduleName, item.iFrameDescription, item.points);
                        await addAssignmentModuleItem(courseId, moduleId, title);
                    }
                }
            } else {
                console.log(`Module named '${moduleName}' not found.`);
            }
        }
    }
}

async function findModuleIdByName(courseId, moduleName) {
    const url = `${canvasDomain}/api/v1/courses/${courseId}/modules`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                ' 'Content-Type': 'application/json'
            },
            params: {
                per_page: 100 // Adjust this number based on your expected number of modules
            }
        });

        const modules = response.data;
        const foundModule = modules.find(module => module.name === moduleName);
        return foundModule ? foundModule.id : null;
    } catch (error) {
        console.error('Error finding module:', error.response ? error.response.data : error.message);
        return null;
    }
}

// Function to add an assignment as a module item
async function addAssignmentModuleItem(courseId, moduleId, assignmentName) {
    const assignmentId = await findAssignmentIdByName(courseId, assignmentName);
    if (!assignmentId) {
        console.log(`Assignment named '${assignmentName}' not found.`);
        return;
    }

    const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items`;
    const data = {
        module_item: {
            title: assignmentName,
            type: 'Assignment',
            content_id: assignmentId,
            new_tab: false
        }
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(`Assignment '${assignmentName}' added to module with ID ${moduleId}`);
    } catch (error) {
        console.error('Error adding assignment to module:', error.response ? error.response.data : error.message);
    }
}


(async () => {
        try {
            const jsonData = await convertSpreadsheetToJson(spreadsheetPath);
            let creationOrder = [];
    
            for (const item of jsonData) {
                const moduleId = await findModuleIdByName(courseId, item.moduleName);
                if (!moduleId) {
                    console.error(`Module named '${item.moduleName}' not found.`);
                    continue;
                }
    
                let contentId;
                if (item.type === 'Page') {
                    contentId = await createCoursePage(courseId, item.title, item.content);
                    await addModuleItem(courseId, moduleId, 'Page', contentId);
                } else if (item.type === 'Assignment') {
                    const groupId = await findAssignmentGroupIdByName(courseId, item.assignmentGroupName);
                    contentId = await createAssignment(courseId, item.title, groupId, item.points);
                    await addModuleItem(courseId, moduleId, 'Assignment', contentId);
                }
                creationOrder.push({ id: contentId, title: item.title });
            }
    
            // Verify the order of module items
            for (const module of jsonData) {
                await verifyModuleItemsOrder(courseId, module.moduleId, creationOrder);
            }
    
            console.log('All items have been processed successfully.');
        } catch (error) {
            console.error('An error occurred during the main execution:', error.message);
        }

        try {
            const jsonData = await convertSpreadsheetToJson(spreadsheetPath);
            await addAllItemsAsModuleItems(courseId, jsonData);
            console.log('All items have been processed successfully.');
        } catch (error) {
            console.error('An error occurred during the main execution:', error.message);
        }
    })();
    


// Test functions using Jest testing framework

// // Mocking axios for test cases
// jest.mock('axios');

// // Test for convertSpreadsheetToJson function
// test('test convertSpreadsheetToJson function', async () => {
//     const readXlsxFile = require('read-excel-file/node');
//     jest.mock('read-excel-file/node');
//     const filePath = 'some/file/path';
//     const sampleData = [
//         ['header1', 'header2'],
//         ['value1', 'value2'],
//         ['value3', 'value4']
//     ];
//     readXlsxFile.mockResolvedValue(sampleData);
//     const result = await convertSpreadsheetToJson(filePath);
//     expect(result).toEqual([
//         { header1: 'value1', header2: 'value2' },
//         { header1: 'value3', header2: 'value4' }
//     ]);
// });

// // Test for createCoursePage function
// test('test createCoursePage function', async () => {
//     axios.post.mockResolvedValue({ data: 'some response data' });
//     const result = await createCoursePage('14706', 'Page Title', 'Page Content', 'https://someurl.com');
//     expect(result).toBe('some response data');
//     expect(axios.post).toBeCalledWith(
//         'https://hmh.instructure.com/api/v1/courses/14706/pages',
//         {
//             wiki_page: {
//                 title: 'Page Title',
//                 body: '<iframe src="https://someurl.com"></iframe>Page Content'
//             }
//         },
//         { headers: { 'Authorization': 'Bearer 3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH' } }
//     );
// });

// // Test for createAssignment function
// test('test createAssignment function', async () => {
//     axios.post.mockResolvedValue({ data: { id: '12345' } });
//     const result = await createAssignment('14706', 'Assignment Title', 'Module Name', 'https://iframeurl.com', 10);
//     expect(result).toEqual({ id: '12345' });
//     expect(axios.post).toBeCalledWith(
//         'https://hmh.instructure.com/api/v1/courses/14706/assignments',
//         {
//             assignment: {
//                 name: 'Assignment Title',
//                 assignment_group_id: 'Module Name', // Assuming this is the group ID
//                 description: '<iframe src="https://iframeurl.com"></iframe>',
//                 points_possible: 10
//             }
//         },
//         { headers: { 'Authorization': 'Bearer 3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH', 'Content-Type': 'application/json' } }
//     );
// });

// // Test for findAssignmentGroupIdByName function
// test('test findAssignmentGroupIdByName function', async () => {
//     axios.get.mockResolvedValue({ data: [{ id: '12345', name: 'Module Name' }] });
//     const result = await findAssignmentGroupIdByName('14706', 'Module Name');
//     expect(result).toBe('12345');
//     expect(axios.get).toBeCalledWith(
//         'https://hmh.instructure.com/api/v1/courses/14706/assignment_groups',
//         {
//             headers: { 'Authorization': 'Bearer 3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH' },
//             params: { per_page: 100 }
//         }
//     );
// });

// // Test for findAssignmentIdByName function
// test('test findAssignmentIdByName function', async () => {
//     axios.get.mockResolvedValue({ data: [{ id: '12345', name: 'Assignment Title' }] });
//     const result = await findAssignmentIdByName('14706', 'Assignment Title');
//     expect(result).toBe('12345');
//     expect(axios.get).toBeCalledWith(
//         'https://hmh.instructure.com/api/v1/courses/14706/assignments',
//         {
//             headers: { 'Authorization': 'Bearer 3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH' },
//             params: { per_page: 100 }
//         }
//     );
// });

// // ... [additional tests can be added here]

// // Main execution logic
// (async () => {
//     try {
//         const jsonData = await convertSpreadsheetToJson(spreadsheetPath);
//         await addAllItemsAsModuleItems(courseId, jsonData);
//         console.log('All items have been processed successfully.');
//     } catch (error) {
//         console.error('An error occurred during the main execution:', error.message);
//     }
// })();


// //  module.exports = app; // Export the app for testing

