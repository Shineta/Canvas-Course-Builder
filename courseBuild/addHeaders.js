// // Import the configuration file
// const config = require('/workspaces/Canvas-Course-Builder/courseBuild/config.js');
// const { table } = require('table'); // Import the 'table' library
// const Table = require('cli-table');

// // Access the shared variables
// const axios = config.axios;
// const readXlsxFile = config.readXlsxFile;
// const canvasDomain = config.canvasDomain;
// const accessToken = config.accessToken;
// const courseId = config.courseId;
// const spreadsheetPath = config.spreadsheetPath;
// const coursePrefix = config.coursePrefix;
// const moduleItemsPath = config.moduleItemsPath;




// const axios = require('axios');
// const readXlsxFile = require('read-excel-file/node');
// const canvasDomain = 'https://hmh.instructure.com';
// const accessToken = '3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH'; // Replace with your actual access token
// const courseId = '14706'; // Replace with the target course ID
// const spreadsheetPath = '/workspaces/Canvas-Course-Builder/courseBuild/IntoLiteratureG8U6CCSDContentsInput.xlsx'; // Update with your actual file path
// const coursePrefix = 'G8_Unit 6:'; // Update this with the dynamic course prefix



// // Function to read the spreadsheet and convert it to JSON
// async function convertSpreadsheetToJson(filePath) {
//     try {
//         const rows = await readXlsxFile(filePath);
//         const headers = rows[0];
//         const jsonData = rows.slice(1).map(row => {
//             let rowData = {};
//             row.forEach((value, index) => {
//                 rowData[headers[index]] = value;
//             });
//             return rowData;
//         });
//         return jsonData;
//     } catch (error) {
//         console.error('Error reading spreadsheet:', error);
//         return [];
//     }
// }

// // Function to find the module ID by name
// async function findModuleIdByName(courseId, moduleName) {
//     let url = `${canvasDomain}/api/v1/courses/${courseId}/modules`;

//     try {
//         const response = await axios.get(url, {
//             headers: { 'Authorization': `Bearer ${accessToken}` },
//             params: { per_page: 100 } // Adjust this value as needed
//         });

//         const modules = response.data;
//         const foundModule = modules.find(module => module.name === moduleName);
//         if (foundModule) return foundModule.id;

//         console.log(`Module named '${moduleName}' not found.`);
//         return null;
//     } catch (error) {
//         console.error('Error finding module by name:', error);
//         return null;
//     }
// }

// // Function to add an item to a module
// async function addItemToModule(courseId, moduleId, itemTitle, itemType) {
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items`;
//     const data = {
//         module_item: {
//             title: itemTitle,
//             type: itemType // 'Assignment' or 'SubHeader'
//             // Add other necessary fields for assignments
//         }
//     };

//     try {
//         await axios.post(url, data, {
//             headers: { 'Authorization': `Bearer ${accessToken}` }
//         });
//         console.log(`${itemType} '${itemTitle}' added to module ID ${moduleId}`);
//     } catch (error) {
//         console.error(`Error adding ${itemType} to module:`, error);
//     }
// }

// // Function to process spreadsheet data and add items to modules
// async function processSpreadsheetAndAddItems(courseId, filePath) {
//     try {
//         const jsonData = await convertSpreadsheetToJson(filePath);

//         // Process jsonData to create module items
//         for (const item of jsonData) {
//             const moduleName = item['NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE'];
//             const moduleId = await findModuleIdByName(courseId, moduleName);

//             if (moduleId) {
//                 const itemTitle = item['DISPLAY TITLE for course build'];
//                 const itemType = item.Category === 'Header' ? 'SubHeader' : 'Assignment';

//                 await addItemToModule(courseId, moduleId, itemTitle, itemType);
//             } else {
//                 console.log(`Module named '${moduleName}' not found.`);
//             }
//         }

//         // Rest of your code...
//     } catch (error) {
//         console.error('Error processing spreadsheet and adding items:', error);
//     }
// }

// // Function to reorder items in a module based on the spreadsheet order
// async function reorderItemsInModule(courseId, moduleId, orderedItems) {
//     try {
//         const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/reorder`;

//         const data = {
//             order: orderedItems.map(item => item.id),
//         };

//         await axios.post(url, data, {
//             headers: { 'Authorization': `Bearer ${accessToken}` },
//         });

//         console.log(`Reordered items in module ID ${moduleId} according to the spreadsheet order.`);
//     } catch (error) {
//         console.error(`Error reordering items in module ID ${moduleId}:`, error);
//     }
// }

// // Function to create a comparison table for a module
// async function createComparisonTableForModule(moduleName, moduleId, spreadsheetData) {
//     try {
//         const canvasItems = await listAllModuleItems(courseId, moduleId);

//         // Extract titles from canvasItems
//         const canvasOrder = canvasItems.map(item => item.title);

//         // Create a new table instance
//         const table = new Table({
//             head: ['Spreadsheet Order', 'Canvas Order'],
//             colWidths: [30, 30]
//         });

//         // Add rows to the table
//         spreadsheetData.forEach((spreadsheetItem, index) => {
//             table.push([`${index + 1}. ${spreadsheetItem.title}`, `${index + 1}. ${canvasOrder[index]}`]);
//         });

//         // Log the table to the console
//         console.log(`Comparison Table for Module: ${moduleName}`);
//         console.log(table.toString());
//     } catch (error) {
//         console.error(`Error creating comparison table for module ${moduleName}:`, error);
//     }
// }


// async function listAllModuleItems(courseId, moduleId, searchTerm = '') {
//     const apiUrl = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items`;
    
//     try {
//         const response = await axios.get(apiUrl, {
//             headers: { 'Authorization': `Bearer ${accessToken}` },
//             params: {
//                 include: 'content_details',
//                 search_term: searchTerm
//                 // You can add more parameters as needed
//             }
//         });
        
//         return response.data; // Return the list of ModuleItem objects
//     } catch (error) {
//         console.error(`Error listing module items for course ID ${courseId} and module ID ${moduleId}:`, error);
//         return [];
//     }
// }



// // Main Execution Function
// (async () => {
//     const jsonData = await convertSpreadsheetToJson(spreadsheetPath);

//     // Create a structured representation of modules and items
//     const modules = {};
//     for (const item of jsonData) {
//         const moduleName = item['NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE'];
//         if (!modules[moduleName]) {
//             modules[moduleName] = [];
//         }
//         modules[moduleName].push({
//             title: item['DISPLAY TITLE for course build'],
//             type: item.Category === 'Header' ? 'SubHeader' : 'Assignment'
//             // Add other necessary fields for assignments
//         });
//     }

//     await processSpreadsheetAndAddItems(courseId, spreadsheetPath);

//     // Iterate through modules and create comparison tables for each
//     for (const moduleName in modules) {
//         if (modules.hasOwnProperty(moduleName)) {
//             const moduleId = await findModuleIdByName(courseId, moduleName);
//             if (moduleId) {
//                 await createComparisonTableForModule(moduleName, moduleId, modules[moduleName]);
//             } else {
//                 console.log(`Module named '${moduleName}' not found.`);
//             }
//         }
//     }

//     // Reorder items in each module based on spreadsheet order
//     for (const moduleName in modules) {
//         if (modules.hasOwnProperty(moduleName)) {
//             const moduleId = await findModuleIdByName(courseId, moduleName);

//             if (moduleId) {
//                 const canvasItems = await listAllModuleItems(courseId, moduleId);
//                 const orderedItems = // Logic to determine the correct order from jsonData

//                 // Reorder items in the module
//                 await reorderItemsInModule(courseId, moduleId, orderedItems);
//             } else {
//                 console.log(`Module named '${moduleName}' not found.`);
//             }
//         }
//     }

//      // Iterate through each module for reordering and displaying comparison tables
//      for (const moduleName in modules) {
//         if (modules.hasOwnProperty(moduleName)) {
//             const moduleId = await findModuleIdByName(courseId, moduleName);

//             if (moduleId) {
//                 const orderedItems = // Logic to determine the correct order from jsonData

//                 // Reorder items in the module
//                 await reorderItemsInModule(courseId, moduleId, orderedItems);

//                 // Fetch the updated list of module items
//                 const updatedCanvasItems = await listAllModuleItems(courseId, moduleId);

//                 // Display the comparison table after reordering
//                 await createComparisonTableForModule(moduleName, moduleId, orderedItems, updatedCanvasItems);
//             } else {
//                 console.log(`Module named '${moduleName}' not found.`);
//             }
//         }
//     }

//     // Additional processing if needed
// })();



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//*****************************New Code*************************************************************************************************** */
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Import necessary modules and configuration
const config = require('/workspaces/Canvas-Course-Builder/courseBuild/config.js');
const Table = require('cli-table');
const axios = config.axios;
const readXlsxFile = config.readXlsxFile;
const canvasDomain = config.canvasDomain;
const accessToken = config.accessToken;
const courseId = config.courseId;
const spreadsheetPath = config.spreadsheetPath;
const coursePrefix = config.coursePrefix;
const moduleItemsPath = config.moduleItemsPath;

// Function to read the spreadsheet and convert it to JSON
async function convertSpreadsheetToJson(filePath) {
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
        console.error('Error reading spreadsheet:', error);
        return [];
    }
}

// Function to find the module ID by name
async function findModuleIdByName(courseId, moduleName) {
    let url = `${canvasDomain}/api/v1/courses/${courseId}/modules`;

    try {
        const response = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
            params: { per_page: 100 }
        });

        const modules = response.data;
        const foundModule = modules.find(module => module.name === moduleName);
        if (foundModule) return foundModule.id;

        console.log(`Module named '${moduleName}' not found.`);
        return null;
    } catch (error) {
        console.error('Error finding module by name:', error);
        return null;
    }
}

// Function to add an item to a module
async function addItemToModule(courseId, moduleId, itemTitle, itemType) {
    const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items`;
    const data = {
        module_item: {
            title: itemTitle,
            type: itemType
        }
    };

    try {
        await axios.post(url, data, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        console.log(`${itemType} '${itemTitle}' added to module ID ${moduleId}`);
    } catch (error) {
        console.error(`Error adding ${itemType} to module:`, error);
    }
}

// Function to list all module items with pagination
async function listAllModuleItems(courseId, moduleId) {
    const items = [];
    let apiUrl = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items?per_page=100`;

    while (apiUrl) {
        try {
            const response = await axios.get(apiUrl, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
                params: {
                    include: ['content_details']
                }
            });

            items.push(...response.data);

            // Get next page URL from response headers, if any
            apiUrl = getNextPageUrl(response.headers.link);
        } catch (error) {
            console.error(`Error listing module items for course ID ${courseId} and module ID ${moduleId}:`, error);
            break;
        }
    }

    return items;
}

// Helper function to extract the URL for the next page from the 'Link' header
function getNextPageUrl(linkHeader) {
    if (!linkHeader) {
        return null;
    }

    const links = linkHeader.split(',');
    const nextLink = links.find(link => link.includes('rel="next"'));
    if (!nextLink) {
        return null;
    }

    const urlMatch = nextLink.match(/<([^>]+)>/);
    return urlMatch ? urlMatch[1] : null;
}

// Function to create a comparison table for a module
async function createComparisonTableForModule(moduleName, moduleId, spreadsheetData, canvasItems) {
    // Extract titles from canvasItems
    const canvasOrder = canvasItems.map(item => item.title);

    // Create a new table instance
    const table = new Table({
        head: ['Spreadsheet Order', 'Canvas Order'],
        colWidths: [30, 30]
    });

    // Add rows to the table
    spreadsheetData.forEach((spreadsheetItem, index) => {
        const canvasItem = canvasOrder[index] || '---';
        table.push([`${index + 1}. ${spreadsheetItem.title}`, `${index + 1}. ${canvasItem}`]);
    });

    // Log the table to the console
    console.log(`Comparison Table for Module: ${moduleName}`);
    console.log(table.toString());
}

async function reorderCanvasItems(courseId, moduleId, newOrder) {
    const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/reorder`;
    const data = { order: newOrder };

    try {
        await axios.post(url, data, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
    } catch (error) {
        console.error(`Error reordering items in module ID ${moduleId}:`, error);
        if (error.response) {
            // Log detailed error information
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
            console.error('Request Data:', data);
        }
    }
}

// Function to update a module item's position
async function updateModuleItemPosition(courseId, moduleId, itemId, position) {
    const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items/${itemId}`;
    const data = {
        'module_item[position]': position
    };

    try {
        await axios.put(url, data, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        console.log(`Updated position of item ID ${itemId} to position ${position}`);
    } catch (error) {
        console.error(`Error updating position of item ID ${itemId}:`, error);
    }
}


// Function to create and display a comparison table
async function displayUpdatedComparisonTable(moduleName, moduleId, spreadsheetData) {
    try {
        const updatedCanvasItems = await listAllModuleItems(courseId, moduleId);
        const canvasOrder = updatedCanvasItems.map(item => item.title);

        const table = new Table({
            head: ['Spreadsheet Order', 'Updated Canvas Order'],
            colWidths: [30, 30]
        });

        spreadsheetData.forEach((item, index) => {
            const canvasItem = canvasOrder[index] || '---';
            table.push([`${index + 1}. ${item.title}`, `${index + 1}. ${canvasItem}`]);
        });

        console.log(`Updated Comparison Table for Module: ${moduleName}`);
        console.log(table.toString());
    } catch (error) {
        console.error(`Error displaying updated comparison table for module ${moduleName}:`, error);
    }
}



// Main Execution Function
(async () => {
    const jsonData = await convertSpreadsheetToJson(spreadsheetPath);

    // Create a structured representation of modules and items
    const modules = {};
    for (const item of jsonData) {
        const moduleName = item['NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE'];
        if (!modules[moduleName]) {
            modules[moduleName] = [];
        }
        modules[moduleName].push({
            title: item['DISPLAY TITLE for course build'],
            type: item.Category === 'Header' ? 'SubHeader' : 'Assignment'
        });
    }

    // Display initial comparison tables
    for (const moduleName in modules) {
        if (modules.hasOwnProperty(moduleName)) {
            const moduleId = await findModuleIdByName(courseId, moduleName);
            if (moduleId) {
                const canvasItems = await listAllModuleItems(courseId, moduleId);
                await createComparisonTableForModule(moduleName, moduleId, modules[moduleName], canvasItems);
            } else {
                console.log(`Module named '${moduleName}' not found.`);
            }
        }
    }

    // Add headers based on the Spreadsheet Order
    for (const moduleName in modules) {
        if (modules.hasOwnProperty(moduleName)) {
            const moduleId = await findModuleIdByName(courseId, moduleName);
            if (moduleId) {
                for (const item of modules[moduleName]) {
                    if (item.type === 'SubHeader') {
                        await addItemToModule(courseId, moduleId, item.title, item.type);
                    }
                }
            } else {
                console.log(`Module named '${moduleName}' not found.`);
            }
        }
    }

    // Display new comparison tables after adding headers
    for (const moduleName in modules) {
        if (modules.hasOwnProperty(moduleName)) {
            const moduleId = await findModuleIdByName(courseId, moduleName);
            if (moduleId) {
                const updatedCanvasItems = await listAllModuleItems(courseId, moduleId);
                await createComparisonTableForModule(moduleName, moduleId, modules[moduleName], updatedCanvasItems);
            } else {
                console.log(`Module named '${moduleName}' not found.`);
            }
        }
    }

 for (const item of jsonData) {
     const moduleName = item['NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE'];
     if (!modules[moduleName]) {
         modules[moduleName] = [];
     }
     modules[moduleName].push({
         title: item['DISPLAY TITLE for course build'],
         type: item.Category === 'Header' ? 'SubHeader' : 'Assignment'
     });
 }

 for (const moduleName in modules) {
    if (modules.hasOwnProperty(moduleName)) {
        const moduleId = await findModuleIdByName(courseId, moduleName);
        if (moduleId) {
            const canvasItems = await listAllModuleItems(courseId, moduleId);
            const titleToIdMap = canvasItems.reduce((map, item) => {
                map[item.title] = item.id;
                return map;
            }, {});

            // Update positions based on the spreadsheet
            for (let i = 0; i < modules[moduleName].length; i++) {
                const itemTitle = modules[moduleName][i].title;
                const itemId = titleToIdMap[itemTitle];
                if (itemId) {
                    await updateModuleItemPosition(courseId, moduleId, itemId, i + 1); // 1-based position
                }
            }

            // Display the updated comparison table
            // ...
        } else {
            console.log(`Module named '${moduleName}' not found.`);
        }
    }
}

for (const moduleName in modules) {
    if (modules.hasOwnProperty(moduleName)) {
        const moduleId = await findModuleIdByName(courseId, moduleName);
        if (moduleId) {
            const canvasItems = await listAllModuleItems(courseId, moduleId);
            const titleToIdMap = canvasItems.reduce((map, item) => {
                map[item.title] = item.id;
                return map;
            }, {});

            // Update positions based on the spreadsheet
            for (let i = 0; i < modules[moduleName].length; i++) {
                const itemTitle = modules[moduleName][i].title;
                const itemId = titleToIdMap[itemTitle];
                if (itemId) {
                    await updateModuleItemPosition(courseId, moduleId, itemId, i + 1); // 1-based position
                }
            }

            // Display the updated comparison table
            await displayUpdatedComparisonTable(moduleName, moduleId, modules[moduleName]);
        } else {
            console.log(`Module named '${moduleName}' not found.`);
        }
    }
}

    

    // Additional processing if needed
})();
