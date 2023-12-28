// ///////////////////////////////////////////////////////////////////////////
// /////////*********************Working but not org pages***************** */
// //////////////////////////////////////////////////////////////////////////


// const axios = require('axios');
// const readXlsxFile = require('read-excel-file/node');

// // Canvas and Course Configuration
// const canvasDomain = 'https://hmh.instructure.com';
// const accessToken = '3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH';
// const courseId = '14706';
// const spreadsheetPath = '/workspaces/Canvas-Course-Builder/courseBuild/IntoLiteratureG8U6CCSDContentsInput.xlsx';

// // Function to read spreadsheet and extract items
// async function getItemsFromSpreadsheet(filePath) {
//     try {
//         const rows = await readXlsxFile(filePath);
//         const headers = rows[0];
//         return rows.slice(1).map((row, index) => {
//             let rowData = {};
//             headers.forEach((header, i) => {
//                 rowData[headers[i]] = row[i];
//             });
//             return {
//                 module: rowData['NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE'],
//                 title: rowData['DISPLAY TITLE for course build'],
//                 category: rowData['Category'],
//                 order: index + 1 // Assign a position based on row index
//             };
//         });
//     } catch (error) {
//         console.error('Error reading spreadsheet:', error);
//         return [];
//     }
// }

// // Helper function to group items by module
// function groupItemsByModule(items) {
//     const moduleGroups = {};
//     items.forEach(item => {
//         if (!moduleGroups[item.module]) {
//             moduleGroups[item.module] = {
//                 moduleName: item.module,
//                 items: []
//             };
//         }
//         moduleGroups[item.module].items.push(item);
//     });
//     return Object.values(moduleGroups);
// }

// // Function to find or create a module item
// async function findOrCreateModuleItem(courseId, moduleId, item) {
//     console.log(`Processing item: ${item.title} in module ID ${moduleId}`);

//     let moduleItems = await getModuleItems(courseId, moduleId);
//     let existingItem = moduleItems.find(moduleItem => moduleItem.title === item.title);
//     if (existingItem) {
//         console.log(`Found existing item: ${item.title}`);
//         return existingItem.id;
//     }

//     console.log(`Creating new item: ${item.title}`);
//     return await createModuleItem(courseId, moduleId, item.title, item.type);
// }

// // Function to create a new module item
// async function createModuleItem(courseId, moduleId, title, type) {
//     try {
//         const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items`;
//         const data = {
//             module_item: { title, type }
//         };
//         const response = await axios.post(url, data, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//         console.log(`Created module item: '${title}'`);
//         return response.data.id;
//     } catch (error) {
//         console.error(`Error creating module item:'${title}', error`);
//     }
// }

// // Main function to organize module items
// async function organizeModuleItems(courseId) {
//     console.log('Starting to organize module items...');

//     const items = await getItemsFromSpreadsheet(spreadsheetPath);
//     console.log(`Items extracted from spreadsheet: ${JSON.stringify(items, null, 2)}`);

//     const moduleGroups = groupItemsByModule(items);
//     console.log(`Module groups formed: ${JSON.stringify(moduleGroups, null, 2)}`);

//     for (const moduleGroup of moduleGroups) {
//         console.log(`Processing module: ${moduleGroup.moduleName}`);
//         const moduleId = await findModuleIdByName(courseId, moduleGroup.moduleName);

//         if (moduleId) {
//             console.log(`Module ID for '${moduleGroup.moduleName}': ${moduleId}`);
//             for (const item of moduleGroup.items) {
//                 console.log(`Creating/Finding item: ${item.title}`);
//                 const itemId = await findOrCreateModuleItem(courseId, moduleId, item);
//                 console.log(`Item ID for '${item.title}': ${itemId}`);
//             }
//             await reorderModuleItems(courseId, moduleId, moduleGroup.items);
//         } else {
//             console.log(`Module named '${moduleGroup.moduleName}' not found.`);
//         }
//     }

//     console.log('Finished organizing module items.');
// }

// // Function to reorder module items
// async function reorderModuleItems(courseId, moduleId, items) {
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/reorder`;
//     const data = {
//         order: items.map(item => item.id).filter(id => id != null),
//         positions: items.map((item, index) => index + 1)
//     };

//     try {
//         await axios.put(url, data, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//         console.log(`Reordered module items for module ID ${moduleId}`);
//     } catch (error) {
//         console.error(`Error reordering module items:`, error);
//     }
// }



// // Function to read spreadsheet and extract items
// async function getItemsFromSpreadsheet(filePath) {
//     try {
//         const rows = await readXlsxFile(filePath);
//         const headers = rows[0];
//         return rows.slice(1).map((row, index) => {
//             let rowData = {};
//             headers.forEach((header, i) => {
//                 rowData[headers[i]] = row[i];
//             });
//             return {
//                 module: rowData['NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE'],
//                 title: rowData['DISPLAY TITLE for course build'],
//                 category: rowData['Category'],
//                 order: index // Using the row index as the order
//             };
//         });
//     } catch (error) {
//         console.error('Error reading spreadsheet:', error);
//         return [];
//     }
// }

// // Function to find or create a module item
// async function findOrCreateModuleItem(courseId, moduleId, item) {
//     console.log(`Processing item: ${item.title} in module ID ${moduleId}`);

//     // Get all module items
//     let moduleItems = await getModuleItems(courseId, moduleId);

//     // Check if the item already exists
//     let existingItem = moduleItems.find(moduleItem => moduleItem.title === item.title);
//     if (existingItem) {
//         console.log(`Found existing item: ${item.title}`);
//         return existingItem.id;
//     }

//     // If item does not exist, create a new one
//     console.log(`Creating new item: ${item.title}`);
//     return await createModuleItem(courseId, moduleId, item.title, item.type);
// }

// // Function to create a new module item
// async function createModuleItem(courseId, moduleId, title, type) {
//     try {
//         const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items`;
//         const data = {
//             module_item: {
//                 title: title,
//                 type: type // This could be 'Assignment', 'Page', 'File', etc., based on your requirements
//             }
//         };
//         const response = await axios.post(url, data, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//         console.log(`Created module item: '${title}'`);
//         return response.data.id; // Returns the ID of the newly created module item
//     } catch (error) {
//         console.error(`Error creating module item: '${title}'`, error);
//     }
// }

// // Function to get all module items for a specific module
// async function getModuleItems(courseId, moduleId) {
//     try {
//         let url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items`;
//         const response = await axios.get(url, {
//             headers: { 'Authorization': `Bearer ${accessToken}` },
//             params: { per_page: 100 }
//         });
//         return response.data;
//     } catch (error) {
//         console.error(`Error fetching module items for module ID ${moduleId}:`, error);
//         return [];
//     }
// }

// // Function to find a module ID by name
// async function findModuleIdByName(courseId, moduleName) {
//     console.log(`Searching for module: '${moduleName}' in course ID ${courseId}...`);
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/modules`;
//     try {
//         const response = await axios.get(url, {
//             headers: { 'Authorization': `Bearer ${accessToken}` },
//             params: { per_page: 100 }
//         });
//         const modules = response.data;
//         const foundModule = modules.find(module => module.name === moduleName);
//         return foundModule ? foundModule.id : null;
//     } catch (error) {
//         console.error('Error finding module:', error);
//         return null;
//     }
// }


// // Function to update a module item's position
// async function updateModuleItem(courseId, moduleId, itemId, position) {
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items/${itemId}`;
//     const data = { module_item: { position } };

//     try {
//         await axios.put(url, data, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//         console.log(`Updated module item position: ${itemId} to position ${position}`);
//     } catch (error) {
//         console.error(`Error updating module item position for '${itemId}':`, error);
//     }
// }





// // Main function to organize headers
// // Main function to organize module items
// // Main function to organize module items
// async function organizeModuleItems(courseId) {
//     console.log('Starting to organize module items...');

//     const items = await getItemsFromSpreadsheet(spreadsheetPath);
//     console.log(`Items extracted from spreadsheet: ${JSON.stringify(items, null, 2)}`);

//     const moduleGroups = groupItemsByModule(items);
//     console.log(`Module groups formed: ${JSON.stringify(moduleGroups, null, 2)}`);

//     for (const moduleGroup of moduleGroups) {
//         console.log(`Processing module: ${moduleGroup.moduleName}`);
//         const moduleId = await findModuleIdByName(courseId, moduleGroup.moduleName);

//         if (moduleId) {
//             console.log(`Module ID for '${moduleGroup.moduleName}': ${moduleId}`);
//             for (const item of moduleGroup.items) {
//                 console.log(`Creating/Finding item: ${item.title}`);
//                 const itemId = await findOrCreateModuleItem(courseId, moduleId, item);
//                 console.log(`Item ID for '${item.title}': ${itemId}`);
//                 // Update the position of the module item
//                 if (itemId) {
//                     await updateModuleItem(courseId, moduleId, itemId, item.order);
//                 }
//             }
//         } else {
//             console.log(`Module named '${moduleGroup.moduleName}' not found.`);
//         }
//     }

//     console.log('Finished organizing module items.');
// }

// // Rest of your existing code...

// // Function to reorder module items based on the assigned positions
// async function reorderModuleItems(courseId, moduleId, itemsWithPosition) {
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/reorder`;
//     const data = {
//         order: itemsWithPosition.map(item => item.id),
//         positions: itemsWithPosition.map(item => item.position)
//     };

//     try {
//         await axios.post(url, data, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//         console.log(`Reordered module items for module
//         ID ${moduleId}`); } catch (error) { console.error(`Error reordering module items in module ID ${moduleId}:`, error);
//         }
//         }
        
//         // Start the main execution
//         (async () => {
//         await organizeModuleItems(courseId);
//         })();



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//*****************************************Alt Code********************************************************** */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// After reading the spreadsheet create a json object of each item title and its position. Then list all module items in the course and their positions. Then update the current module items with the new positions. 
// 
// To achieve the task you've outlined, you need to follow these steps:

// Read the spreadsheet to create a JSON object for each item, capturing the title and position.
// List all module items in the course along with their current positions.
// Update the positions of the current module items based on the new positions specified in the spreadsheet.
// Here's how you can modify the code to include these steps:

// Step 1: Create JSON Objects for Each Item from the Spreadsheet
// Modify getItemsFromSpreadsheet to create a JSON object of each item title and its position:

// 
// 
// async function getItemsFromSpreadsheet(filePath) {
//     // ...
//     return rows.slice(1).map((row, index) => {
//         let rowData = {};
//         headers.forEach((header, i) => {
//             rowData[headers[i]] = row[i];
//         });
//         return {
//             title: rowData['DISPLAY TITLE for course build'],
//             position: index + 1 // Assign a position based on row index
//         };
//     });
// }
// Step 2: List All Module Items and Their Current Positions
// Create a function to list all module items in the course:

// 
// 
// async function listAllModuleItems(courseId) {
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/modules?include[]=items&per_page=100`;
//     try {
//         const response = await axios.get(url, {
//             headers: { 'Authorization': `Bearer ${accessToken}` }
//         });
//         // Flatten module items and capture their current position
//         return response.data.flatMap(module => module.items.map(item => {
//             return { id: item.id, title: item.title, position: item.position };
//         }));
//     } catch (error) {
//         console.error(`Error listing module items for course ID ${courseId}:`, error);
//         return [];
//     }
// }
// Step 3: Update the Positions of Current Module Items
// Modify the organizeModuleItems function:

// 
// 
// async function organizeModuleItems(courseId) {
//     console.log('Starting to organize module items...');

//     // Step 1: Create a map from the spreadsheet data
//     const newItemPositions = await getItemsFromSpreadsheet(spreadsheetPath);
//     const positionMap = new Map(newItemPositions.map(item => [item.title, item.position]));

//     // Step 2: List all current module items
//     const currentItems = await listAllModuleItems(courseId);

//     // Step 3: Update positions
//     for (const currentItem of currentItems) {
//         const newPosition = positionMap.get(currentItem.title);
//         if (newPosition && newPosition !== currentItem.position) {
//             await updateModuleItem(courseId, currentItem.moduleId, currentItem.id, newPosition);
//         }
//     }

//     console.log('Finished updating module item positions.');
// }
// This revised approach will read the new positions from the spreadsheet, list all current module items in the course, and update their positions as needed. The updateModuleItem function (as previously defined) is used to update the position of each module item.



///////////////////////////////////////////////////////////////////////////////////////////////////////////
//********************************More ALT Code 12-27-23 Code does not correctly order****************** */
///////////////////////////////////////////////////////////////////////////////////////////////////////////



// const axios = require('axios');
// const readXlsxFile = require('read-excel-file/node');

// // Canvas and Course Configuration
// const canvasDomain = 'https://hmh.instructure.com';
// const accessToken = '3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH'; // Replace with your access token
// const courseId = '14706';
// const spreadsheetPath = '/workspaces/Canvas-Course-Builder/courseBuild/IntoLiteratureG8U6CCSDContentsInput.xlsx';

// // Function to read spreadsheet and extract items
// async function getItemsFromSpreadsheet(filePath) {
//     try {
//         const rows = await readXlsxFile(filePath);
//         const headers = rows[0];
//         return rows.slice(1).map((row, index) => ({
//             module: row[headers.indexOf('NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE')],
//             title: row[headers.indexOf('DISPLAY TITLE for course build')],
//             category: row[headers.indexOf('Category')],
//             order: index + 1 // Assign a position based on row index
//         }));
//     } catch (error) {
//         console.error('Error reading spreadsheet:', error);
//         throw error;
//     }
// }

// // Function to list all module items in a module
// async function listAllModuleItems(courseId, moduleId) {
//     try {
//         const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items`;
//         const response = await axios.get(url, {
//             headers: { 'Authorization': `Bearer ${accessToken}` },
//             params: { per_page: 100 }
//         });
//         return response.data;
//     } catch (error) {
//         console.error(`Error listing module items for module ID ${moduleId}:`, error);
//         throw error;
//     }
// }

// // Function to update the position of a module item
// async function updateModuleItemPosition(courseId, moduleId, itemId, newPosition) {
//     try {
//         const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items/${itemId}`;
//         const data = new URLSearchParams({
//             'module_item[position]': newPosition
//         });

//         await axios.put(url, data, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             }
//         });
//         console.log(`Updated module item ID ${itemId} to position ${newPosition}`);
//     } catch (error) {
//         console.error(`Error updating module item position for item ID ${itemId}:`, error);
//         throw error;
//     }
// }

// // Main function to organize module items
// async function organizeModuleItems(courseId) {
//     console.log('Starting to organize module items...');

//     try {
//         // Step 1: Create a map from the spreadsheet data
//         const itemsFromSpreadsheet = await getItemsFromSpreadsheet(spreadsheetPath);
//         const positionMap = new Map(itemsFromSpreadsheet.map(item => [item.title, item.order]));

//         // Step 2: List all modules
//         const modules = await listAllModuleItems(courseId, courseId);

//         for (const module of modules) {
//             const moduleId = module.id;
//             const moduleItems = await listAllModuleItems(courseId, moduleId);

//             for (const moduleItem of moduleItems) {
//                 const newItemOrder = positionMap.get(moduleItem.title);

//                 if (newItemOrder && newItemOrder !== moduleItem.position) {
//                     await updateModuleItemPosition(courseId, moduleId, moduleItem.id, newItemOrder);
//                 }
//             }
//         }

//         console.log('Finished organizing module items.');
//     } catch (error) {
//         console.error('An error occurred during execution:', error);
//     }
// }

// // Function to get all modules for a course
// async function getAllModules(courseId) {
//     try {
//         const url = `${canvasDomain}/api/v1/courses/${courseId}/modules`;
//         const response = await axios.get(url, {
//             headers: { 'Authorization': `Bearer ${accessToken}` },
//             params: { per_page: 100 }
//         });
//         return response.data.map(module => module.id);
//     } catch (error) {
//         console.error(`Error getting modules for course ID ${courseId}:`, error);
//         throw error;
//     }
// }

// // Main function to organize module items
// async function organizeModuleItems(courseId) {
//     console.log('Starting to organize module items...');

//     try {
//         // Get all modules for the course
//         const moduleIds = await getAllModules(courseId);
//         const itemsFromSpreadsheet = await getItemsFromSpreadsheet(spreadsheetPath);
//         const positionMap = new Map(itemsFromSpreadsheet.map(item => [item.title, item.order]));

//         for (const moduleId of moduleIds) {
//             const moduleItems = await listAllModuleItems(courseId, moduleId);

//             for (const moduleItem of moduleItems) {
//                 const newItemOrder = positionMap.get(moduleItem.title);

//                 if (newItemOrder && newItemOrder !== moduleItem.position) {
//                     await updateModuleItemPosition(courseId, moduleId, moduleItem.id, newItemOrder);
//                 }
//             }
//         }

//         console.log('Finished organizing module items.');
//     } catch (error) {
//         console.error('An error occurred during execution:', error);
//     }
// }

// // Start the main execution
// (async () => {
//     await organizeModuleItems(courseId);
// })();



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//*********************************Working Code**************************************************************** */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

// // Canvas and Course Configuration
// const canvasDomain = 'https://hmh.instructure.com';
// const accessToken = '3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH';
// const courseId = '14706';
// const spreadsheetPath = '/workspaces/Canvas-Course-Builder/courseBuild/IntoLiteratureG8U6CCSDContentsInput.xlsx';

// Function to read spreadsheet and extract items
async function getItemsFromSpreadsheet(filePath) {
    try {
        const rows = await readXlsxFile(filePath);
        const headers = rows[0];
        return rows.slice(1).map((row, index) => {
            let rowData = {};
            headers.forEach((header, i) => {
                rowData[headers[i]] = row[i];
            });
            return {
                module: rowData['NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE'],
                title: rowData['DISPLAY TITLE for course build'],
                category: rowData['Category'],
                order: index + 1 // Assign a position based on row index
            };
        });
    } catch (error) {
        console.error('Error reading spreadsheet:', error);
        return [];
    }
}

// Helper function to group items by module
function groupItemsByModule(items) {
    const moduleGroups = {};
    items.forEach(item => {
        if (!moduleGroups[item.module]) {
            moduleGroups[item.module] = {
                moduleName: item.module,
                items: []
            };
        }
        moduleGroups[item.module].items.push(item);
    });
    return Object.values(moduleGroups);
}

// Function to find or create a module item
async function findOrCreateModuleItem(courseId, moduleId, item) {
    // Construct the title using "DISPLAY TITLE for course build"
    const title = `TEACHER ACTION: Set up Online Assessment – ${item.title} [DO NOT PUBLISH THIS NOTE]`;

    console.log(`Processing item: ${title} in module ID ${moduleId}`);

    let moduleItems = await getModuleItems(courseId, moduleId);
    let existingItem = moduleItems.find(moduleItem => moduleItem.title === title);
    if (existingItem) {
        console.log(`Found existing item: ${title}`);
        return existingItem.id;
    }

    console.log(`Creating new item: ${title}`);
    return await createModuleItem(courseId, moduleId, title, item.type);
}

// Function to create a new module item
async function createModuleItem(courseId, moduleId, title, type) {
    try {
        const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items`;
        const data = {
            module_item: { title, type }
        };
        const response = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(`Created module item: '${title}'`);
        return response.data.id;
    } catch (error) {
        console.error(`Error creating module item:'${title}', error`);
    }
}

// Function to get all module items for a specific module
async function getModuleItems(courseId, moduleId) {
    try {
        let url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items`;
        const response = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
            params: { per_page: 100 }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching module items for module ID ${moduleId}:`, error);
        return [];
    }
}

// Function to find a module ID by name
async function findModuleIdByName(courseId, moduleName) {
    console.log(`Searching for module: '${moduleName}' in course ID ${courseId}...`);
    const url = `${canvasDomain}/api/v1/courses/${courseId}/modules`;
    try {
        const response = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
            params: { per_page: 100 }
        });
        const modules = response.data;
        const foundModule = modules.find(module => module.name === moduleName);
        return foundModule ? foundModule.id : null;
    } catch (error) {
        console.error('Error finding module:', error);
        return null;
    }
}

// Function to update a module item's position
async function updateModuleItem(courseId, moduleId, itemId, position) {
    const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items/${itemId}`;
    const data = { module_item: { position } };

    try {
        await axios.put(url, data, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(`Updated module item position: ${itemId} to position ${position}`);
    } catch (error) {
        console.error(`Error updating module item position for '${itemId}':`, error);
    }
}

// Main function to organize module items
async function organizeModuleItems(courseId) {
    console.log('Starting to organize module items...');

    const items = await getItemsFromSpreadsheet(spreadsheetPath);
    console.log(`Items extracted from spreadsheet: ${JSON.stringify(items, null, 2)}`);

    const moduleGroups = groupItemsByModule(items);
    console.log(`Module groups formed: ${JSON.stringify(moduleGroups, null, 2)}`);

    for (const moduleGroup of moduleGroups) {
        console.log(`Processing module: ${moduleGroup.moduleName}`);
        const moduleId = await findModuleIdByName(courseId, moduleGroup.moduleName);

        if (moduleId) {
            console.log(`Module ID for '${moduleGroup.moduleName}': ${moduleId}`);
            for (const item of moduleGroup.items) {
                console.log(`Creating/Finding item: ${item.title}`);
                const itemId = await findOrCreateModuleItem(courseId, moduleId, item);
                console.log(`Item ID for '${item.title}': ${itemId}`);
                if (itemId) {
                    await updateModuleItem(courseId, moduleId, itemId, item.order);
                }
            }
        } else {
            console.log(`Module named '${moduleGroup.moduleName}' not found.`);
        }
    }

    console.log('Finished organizing module items.');
}

// Start the main execution
(async () => {
    await organizeModuleItems(courseId);
})();
