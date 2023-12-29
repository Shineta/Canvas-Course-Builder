// const axios = require('axios');
// const readXlsxFile = require('read-excel-file/node');

// // Configuration
// const canvasDomain = 'https://hmh.instructure.com';
// const accessToken = '3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH'; // Replace with your actual access token
// const courseId = '14706'; //  target course ID
// const spreadsheetPath = '/workspaces/Canvas-Course-Builder/courseBuild/IntoLiteratureG8U6CCSDContentsInput.xlsx'; // Update with your actual file path
// const coursePrefix = 'G8_Unit 6:'; // dynamic course prefix


// // Read Spreadsheet and Create Order List
// async function getSpreadsheetOrder(filePath) {
//     const rows = await readXlsxFile(filePath);
//     const headers = rows[0];
//     return rows.slice(1).map((row, index) => {
//         let rowData = {};
//         headers.forEach((header, i) => {
//             rowData[headers[i]] = row[i];
//         });
//         return {
//             title: rowData['DISPLAY TITLE for course build'],
//             order: index + 1
//         };
//     });
// }

// // async function getRequiredItemsFromSpreadsheet(filePath) {
// //     const rows = await readXlsxFile(filePath);
// //     const headers = rows[0];
// //     const categoryIndex = headers.indexOf('Category');
// //     const audienceRoleIndex = headers.indexOf('Ed Audience/Role'); 

// //     return rows.slice(1)
// //         .filter(row => {
// //             const category = row[categoryIndex] || ''; // Default to an empty string if undefined
// //             const audienceRole = row[audienceRoleIndex] || ''; // Handle potential undefined values
// //             return (category.toLowerCase() === 'required' || category.toLowerCase() === 'header') && 
// //                    audienceRole.toLowerCase() !== 'teacher';
// //         })
// //         .map((row, index) => ({
// //             title: row[headers.indexOf('DISPLAY TITLE for course build')],
// //             category: row[categoryIndex] || '', // Include the category in the returned object
// //             order: index + 1
// //         }));
// // }



// // Fetch Current Order of Module Items from Canvas
// async function getCurrentCanvasOrder(courseId) {
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/modules?include[]=items&per_page=100`;
//     const response = await axios.get(url, {
//         headers: { 'Authorization': `Bearer ${accessToken}` }
//     });
//     return response.data.flatMap(module => module.items.map(item => {
//         return { title: item.title, position: item.position };
//     }));
// }

// // Compare Orders and Identify Discrepancies
// async function compareOrders(courseId, filePath) {
//     const spreadsheetOrder = await getSpreadsheetOrder(filePath);
//     const canvasOrder = await getCurrentCanvasOrder(courseId);
    
//     let discrepancies = [];
//     let table = [["Title", "Spreadsheet Order", "Canvas Order"]];

//     spreadsheetOrder.forEach(item => {
//         const canvasItem = canvasOrder.find(ci => ci.title === item.title);
//         table.push([item.title, item.order, canvasItem ? canvasItem.position : "Not Found"]);
//         if (!canvasItem || canvasItem.position !== item.order) {
//             discrepancies.push(item.title);
//         }
//     });

//     console.table(table);
//     return discrepancies;
// }

// // Function to List All Module Items
// async function listAllModuleItems(courseId, moduleId) {
//     try {
//         const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items`;
//         const response = await axios.get(url, {
//             headers: { 'Authorization': `Bearer ${accessToken}` },
//             params: { per_page: 100, include: ['items', 'items.content_details'] }
//         });

//         // Mapping each item to an object with title, id, and position
//         return response.data.map(item => ({
//             title: item.title,
//             id: item.id,
//             position: item.position
//         }));
//     } catch (error) {
//         console.error(`Error listing module items for course ID ${courseId} and module ID ${moduleId}:`, error);
//         return [];
//     }
// }



// async function getRequiredItemsFromSpreadsheet(filePath) {
//     const rows = await readXlsxFile(filePath);
//     const headers = rows[0];
//     const categoryIndex = headers.indexOf('Category');
//     const moduleNameIndex = headers.indexOf('NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE');

//     return rows.slice(1)
//         .filter(row => {
//             const category = row[categoryIndex];
//             return category && category.toLowerCase() === 'header';
//         })
//         .map((row) => ({
//             moduleName: row[moduleNameIndex],
//             title: row[headers.indexOf('DISPLAY TITLE for course build')]
//         }));
// }


// // Function to retrieve spreadsheet items with module names
// async function getSpreadsheetItemsWithModuleNames(filePath) {
//     const rows = await readXlsxFile(filePath);
//     const headers = rows[0];
//     const titleIndex = headers.indexOf('DISPLAY TITLE for course build');
//     const moduleIndex = headers.indexOf('NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE');
//     const categoryIndex = headers.indexOf('Category');

//     return rows.slice(1)
//         .filter(row => row[categoryIndex].toLowerCase() === 'header')
//         .map(row => ({
//             title: row[titleIndex],
//             moduleName: row[moduleIndex]
//         }));
// }

// async function updateModuleItemsOrder(courseId, moduleId, moduleName, headerItems) {
//     const currentModuleItems = await listAllModuleItems(courseId, moduleId);
//     console.log(`Updating module: ${moduleName} (ID: ${moduleId})`);

//     for (const item of headerItems) {
//         if (item.moduleName === moduleName) {
//             let currentItem = currentModuleItems.find(ci => ci.title === item.title);

//             if (!currentItem) {
//                 console.log(`Creating header: '${item.title}' for module: '${moduleName}'`);
//                 await createModuleHeader(courseId, moduleId, item.title);
//             } else {
//                 console.log(`Header already exists: '${item.title}' in module: '${moduleName}'`);
//             }
//         }
//     }
//     console.log(`Finished processing module: ${moduleName} (ID: ${moduleId})`);
// }

// // async function compareAndCreateTable(courseId, moduleId, moduleName, spreadsheetItems) {
// //     const currentModuleItems = await listAllModuleItems(courseId, moduleId);
// //     console.log(`Creating comparison table for module: ${moduleName} (ID: ${moduleId})`);

// //     // Construct a map of position to title from the spreadsheet for the current module
// //     const spreadsheetTitleMap = new Map();
// //     spreadsheetItems.forEach(item => {
// //         if (item.moduleName === moduleName) {
// //             spreadsheetTitleMap.set(item.position, item.title);
// //         }
// //     });

// //     // Create an array for the table with headers
// //     let comparisonTable = [['Position', 'Current Title', 'Spreadsheet Title']];

// //     // Iterate through the current module items and add rows to the table
// //     currentModuleItems.forEach((item, index) => {
// //         const spreadsheetTitle = spreadsheetTitleMap.get(index + 1) || '---';
// //         comparisonTable.push([index + 1, item.title, spreadsheetTitle]);
// //     });

// //     // Display the comparison table
// //     console.log('Comparison Table:');
// //     console.table(comparisonTable);
// // }

// // compareAndCreateTable(courseId);


// async function updateModuleItemPosition(courseId, moduleId, itemId, newPosition) {
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items/${itemId}`;
//     const data = { 
//         module_item: { 
//             position: newPosition 
//         }
//     };

//     try {
//         await axios.put(url, data, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//         console.log(`Updated module item position: Item ID ${itemId} to position ${newPosition}`);
//     } catch (error) {
//         console.error(`Error updating module item position for item ID ${itemId}:`, error);
//     }
// }

// // Function to create a new header in a module
// async function createModuleHeader(courseId, moduleId, title) {
//     try {
//         const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items`;
//         const data = {
//             module_item: {
//                 title: title,
//                 type: 'SubHeader'
//             }
//         };
//         const response = await axios.post(url, data, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//         console.log(`Created module header: '${title}' in module ID ${moduleId}`);
//         return response.data.id;
//     } catch (error) {
//         console.error(`Error creating module header '${title}' in module ID ${moduleId}:`, error);
//     }
// }

// // async function updateModuleItemsOrder(courseId, moduleId) {
// //     const spreadsheetItems = await getRequiredItemsFromSpreadsheet(spreadsheetPath);
// //     const currentModuleItems = await listAllModuleItems(courseId, moduleId);

// //     // Find adjustments needed for headers
// //     let adjustments = findHeaderAdjustments(spreadsheetItems, currentModuleItems);

// //     // Execute necessary adjustments
// //     for (const adjustment of adjustments) {
// //         if (adjustment.type === 'add') {
// //             await addTextHeader(courseId, moduleId, adjustment.title, adjustment.position);
// //         } else if (adjustment.type === 'remove') {
// //             await removeTextHeader(courseId, moduleId, adjustment.itemId);
// //         } else if (adjustment.type === 'move') {
// //             await moveTextHeader(courseId, moduleId, adjustment.itemId, adjustment.newPosition);
// //         }
// //     }
// // }

// async function compareAndAdjustHeaders(courseId, moduleId) {
//     const spreadsheetItems = await getRequiredItemsFromSpreadsheet(spreadsheetPath);
//     const currentModuleItems = await listAllModuleItems(courseId, moduleId);

//     // Compare and find differences
//     let adjustments = findHeaderAdjustments(spreadsheetItems, currentModuleItems);

//     // Execute necessary adjustments
//     for (const adjustment of adjustments) {
//         if (adjustment.type === 'add') {
//             await addTextHeader(courseId, moduleId, adjustment.title, adjustment.position);
//         } else if (adjustment.type === 'remove') {
//             await removeTextHeader(courseId, moduleId, adjustment.itemId);
//         } else if (adjustment.type === 'move') {
//             await moveTextHeader(courseId, moduleId, adjustment.itemId, adjustment.newPosition);
//         }
//     }
// }


// function findHeaderAdjustments(spreadsheetItems, currentModuleItems) {
//     let adjustments = [];

//     // Adding and moving headers based on spreadsheet
//     spreadsheetItems.forEach((item, index) => {
//         const currentItem = currentModuleItems.find(ci => ci.title === item.title);

//         if (!currentItem) {
//             // Add missing header
//             adjustments.push({ type: 'add', title: item.title, position: index + 1 });
//         } else if (currentItem.position !== index + 1) {
//             // Move existing header to correct position
//             adjustments.push({ type: 'move', itemId: currentItem.id, newPosition: index + 1 });
//         }
//     });

//     // Identifying extra headers to remove
//     currentModuleItems.forEach(item => {
//         // Check if the item exists in the spreadsheet
//         const itemInSpreadsheet = spreadsheetItems.some(si => si.title === item.title);

//         // If the item is not in the spreadsheet and is a header, mark it for removal
//         if (!itemInSpreadsheet && item.type === 'SubHeader') {
//             adjustments.push({ type: 'remove', itemId: item.id });
//         }
//     });

//     return adjustments;
// }


// async function addTextHeader(courseId, moduleId, title, position) {
//     if (!moduleId) {
//         console.error(`Error: moduleId is undefined. Cannot add text header '${title}'`);
//         return;
//     }

//     const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items`;
//     const data = {
//         module_item: {
//             title,
//             type: 'SubHeader',
//             position
//         }
//     };

//     try {
//         await axios.post(url, data, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//         console.log(`Added text header: '${title}' at position ${position} in moduleId ${moduleId}`);
//     } catch (error) {
//         console.error(`Error adding text header '${title}':`, error);
//     }
// }



// async function removeTextHeader(courseId, moduleId, itemId) {
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items/${itemId}`;

//     try {
//         await axios.delete(url, {
//             headers: { 'Authorization': `Bearer ${accessToken}` }
//         });
//         console.log(`Removed text header: Item ID ${itemId}`);
//     } catch (error) {
//         console.error(`Error removing text header with Item ID ${itemId}:`, error);
//     }
// }


// async function moveTextHeader(courseId, moduleId, itemId, newPosition) {
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items/${itemId}`;
//     const data = {
//         module_item: {
//             position: newPosition
//         }
//     };

//     try {
//         await axios.put(url, data, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//         console.log(`Moved text header: Item ID ${itemId} to position ${newPosition}`);
//     } catch (error) {
//         console.error(`Error moving text header with Item ID ${itemId}:`, error);
//     }
// }


// // Function to retrieve all modules for a course
// async function getAllModulesForCourse(courseId) {
//     try {
//         const url = `${canvasDomain}/api/v1/courses/${courseId}/modules`;
//         const response = await axios.get(url, {
//             headers: { 'Authorization': `Bearer ${accessToken}` },
//             params: { per_page: 100 }
//         });
//         return response.data.map(module => ({
//             id: module.id,
//             name: module.name
//         }));
//     } catch (error) {
//         console.error(`Error retrieving modules for course ID ${courseId}:`, error);
//         return [];
//     }
// }

// // async function preprocessSpreadsheetItems(filePath) {
// //     const rows = await readXlsxFile(filePath);
// //     const headers = rows[0];
// //     const titleIndex = headers.indexOf('DISPLAY TITLE for course build');
// //     const moduleIndex = headers.indexOf('NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE');
// //     const categoryIndex = headers.indexOf('Category');

// //     const itemsByModuleName = new Map();

// //     rows.slice(1)
// //         .forEach(row => {
// //             const category = row[categoryIndex];
// //             if (category && category.toLowerCase() === 'header') {
// //                 const moduleName = row[moduleIndex];
// //                 const items = itemsByModuleName.get(moduleName) || [];
// //                 items.push({
// //                     title: row[titleIndex],
// //                     moduleName: moduleName
// //                 });
// //                 itemsByModuleName.set(moduleName, items);
// //             }
// //         });

// //     return itemsByModuleName;
// // }


// // Fetch Current Order of Module Items from Canvas
// async function getCurrentCanvasOrder(courseId) {
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/modules?include[]=items&per_page=100`;
//     const response = await axios.get(url, {
//         headers: { 'Authorization': `Bearer ${accessToken}` }
//     });
//     return response.data.flatMap(module => module.items.map(item => ({
//         title: item.title, position: item.position
//     })));
// }

// // Function to retrieve all modules for a course
// async function getAllModulesForCourse(courseId) {
//     try {
//         const url = `${canvasDomain}/api/v1/courses/${courseId}/modules`;
//         const response = await axios.get(url, {
//             headers: { 'Authorization': `Bearer ${accessToken}` },
//             params: { per_page: 100 }
//         });
//         return response.data.map(module => ({
//             id: module.id,
//             name: module.name
//         }));
//     } catch (error) {
//         console.error(`Error retrieving modules for course ID ${courseId}:`, error);
//         return [];
//     }
// }

// // Function to preprocess spreadsheet items into a Map keyed by module name
// async function preprocessSpreadsheetItems(filePath) {
//     const rows = await readXlsxFile(filePath);
//     const headers = rows[0];
//     const titleIndex = headers.indexOf('DISPLAY TITLE for course build');
//     const moduleIndex = headers.indexOf('NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE');
//     const categoryIndex = headers.indexOf('Category');

//     const itemsByModuleName = new Map();

//     rows.slice(1).forEach(row => {
//         const category = row[categoryIndex];
//         if (category && category.toLowerCase() === 'header') {
//             const moduleName = row[moduleIndex];
//             const items = itemsByModuleName.get(moduleName) || [];
//             items.push({ title: row[titleIndex] });
//             itemsByModuleName.set(moduleName, items);
//         }
//     });

//     return itemsByModuleName;
// }

// // Function to Create and Display Comparison Table
// async function createComparisonTable(courseId, moduleName, moduleId, spreadsheetItems) {
//     const currentModuleItems = await listAllModuleItems(courseId, moduleId);
//     const spreadsheetTitles = spreadsheetItems.get(moduleName) || [];
    
//     let comparisonTable = [['Position', 'Canvas Title', 'Spreadsheet Title']];
//     currentModuleItems.forEach(item => {
//         const spreadsheetTitle = spreadsheetTitles.find(si => si.title === item.title) ? item.title : '---';
//         comparisonTable.push([item.position, item.title, spreadsheetTitle]);
//     });

//     console.log(`Comparison Table for Module: ${moduleName}`);
//     console.table(comparisonTable);
// }

// // Function to get required and header items from the spreadsheet
// async function getRequiredAndHeaderItems(filePath) {
//     try {
//         const rows = await readXlsxFile(filePath);
//         const headers = rows[0];
//         const categoryIndex = headers.indexOf('Category');
//         const audienceRoleIndex = headers.indexOf('Ed Audience/Role');
//         const displayTitleIndex = headers.indexOf('DISPLAY TITLE for course build');
//         const moduleNameIndex = headers.indexOf('NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE');

//         if (categoryIndex === -1 || audienceRoleIndex === -1 || displayTitleIndex === -1 || moduleNameIndex === -1) {
//             throw new Error('One or more required headers are not found in the spreadsheet.');
//         }

//         // Filter rows to include those where the 'Category' column has 'header' or 'required'
//         // and the 'Ed Audience/Role' column has 'teacher/student' or 'student'
//         const filteredRows = rows.slice(1).filter(row => {
//             const categoryValue = (row[categoryIndex] || '').toLowerCase();
//             const audienceRoleValue = (row[audienceRoleIndex] || '').toLowerCase();
//             return (categoryValue === 'header' || categoryValue === 'required') &&
//                    (audienceRoleValue === 'teacher/student' || audienceRoleValue === 'student');
//         });

//         // Map the filtered rows to objects containing the module name and title
//         return filteredRows.map(row => ({
//             moduleName: row[moduleNameIndex],
//             title: row[displayTitleIndex]
//         }));

//     } catch (error) {
//         console.error(`Error reading spreadsheet at path ${filePath}:`, error);
//         return []; // Return an empty array in case of an error
//     }
// }





// // // Function to Create and Display Comparison Table
// // async function createComparisonTable(courseId, moduleName, moduleId, requiredItems) {
// //     const currentModuleItems = await listAllModuleItems(courseId, moduleId);

// //     // Construct a comparison table with headers
// //     let comparisonTable = [['Canvas Title', 'Spreadsheet Title']];

// //     // Iterate through the current module items
// //     currentModuleItems.forEach(item => {
// //         // Find a match in requiredItems array
// //         const match = requiredItems.find(requiredItem => 
// //             requiredItem.title === item.title && requiredItem.moduleName === moduleName);
// //         // Add to the comparison table, use '---' if no match found
// //         comparisonTable.push([item.title, match ? match.title : '---']);
// //     });

// //     // Add items from the spreadsheet that are not present in the Canvas module
// //     requiredItems.forEach(requiredItem => {
// //         if (requiredItem.moduleName === moduleName && !currentModuleItems.some(item => item.title === requiredItem.title)) {
// //             comparisonTable.push(['---', requiredItem.title]);
// //         }
// //     });

// //     // Display the comparison table
// //     console.log(`Comparison Table for Module: ${moduleName} (ID: ${moduleId})`);
// //     console.table(comparisonTable);
// // }







// // Main Execution Function
// (async () => {
//     const courseId = '14706';
//     const modules = await getAllModulesForCourse(courseId);
//     const requiredItems = await getRequiredAndHeaderItems(spreadsheetPath);

//     if (modules.length === 0) {
//         console.error('No modules found for the specified course.');
//         return;
//     }

//     for (const module of modules) {
//         if (module.name && module.id) {
//             console.log(`Processing module: ${module.name} (ID: ${module.id})`);
//             await createComparisonTable(courseId, module.name, module.id, requiredItems);
//         } else {
//             console.log('Skipping an undefined module.');
//         }
//     }
   
// })();


////////////////////////////////////////////////////////////////////////////////////////////////
//*********************************Working Code********************************************** */
////////////////////////////////////////////////////////////////////////////////////////////////

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

// // Configuration
// const canvasDomain = 'https://hmh.instructure.com';
// const accessToken = '3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH';
// const courseId = '14706';
// const spreadsheetPath = '/workspaces/Canvas-Course-Builder/courseBuild/IntoLiteratureG8U6CCSDContentsInput.xlsx';




// Read Spreadsheet and Create Order List
async function getSpreadsheetOrder(filePath) {
    const rows = await readXlsxFile(filePath);
    const headers = rows[0];
    return rows.slice(1).map((row, index) => {
        let rowData = {};
        headers.forEach((header, i) => {
            rowData[headers[i]] = row[i];
        });
        return {
            title: rowData['DISPLAY TITLE for course build'],
            order: index + 1
        };
    });
}


// Function to process spreadsheet data and add items to modules
async function processSpreadsheetAndAddItems(courseId, filePath) {
    try {
        const jsonData = await convertSpreadsheetToJson(filePath);

        for (const item of jsonData) {
            const moduleName = item['NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE']; // Change to the actual column name in your spreadsheet
            const itemTitle = item['DISPLAY TITLE for course build'];
            const itemType = item.Category === 'Header' ? 'SubHeader' : 'Assignment';

            if (moduleName) {
                const moduleId = await findModuleIdByName(courseId, moduleName);

                if (moduleId) {
                    await addItemToModule(courseId, moduleId, itemTitle, itemType);
                } else {
                    console.log(`Module named '${moduleName}' not found.`);
                }
            } else {
                console.log('Module name is missing for an item.');
            }
        }

        // Rest of your code...
    } catch (error) {
        console.error('Error processing spreadsheet and adding items:', error);
    }
}

// New functions for comparing and adjusting headers
async function compareAndAdjustHeaders(courseId) {
    const spreadsheetItems = await getRequiredItemsFromSpreadsheet(spreadsheetPath);
    const currentModuleItems = await listAllModuleItems(courseId);

    let adjustments = findHeaderAdjustments(spreadsheetItems, currentModuleItems);

    for (const adjustment of adjustments) {
        if (adjustment.type === 'add') {
            await addTextHeader(courseId, adjustment.moduleId, adjustment.title, adjustment.position);
        } else if (adjustment.type === 'remove') {
            await removeTextHeader(courseId, adjustment.moduleId, adjustment.itemId);
        } else if (adjustment.type === 'move') {
            await moveTextHeader(courseId, adjustment.moduleId, adjustment.itemId, adjustment.newPosition);
        }
    }
}

function findHeaderAdjustments(spreadsheetItems, currentModuleItems) {
    let adjustments = [];

    // Add or move headers as needed
    spreadsheetItems.forEach((spreadsheetItem, index) => {
        const currentItem = currentModuleItems.find(ci => ci.title === spreadsheetItem.title);
        if (!currentItem) {
            adjustments.push({ type: 'add', title: spreadsheetItem.title, position: index + 1, moduleId: spreadsheetItem.moduleId });
        } else if (currentItem.position !== index + 1) {
            adjustments.push({ type: 'move', itemId: currentItem.id, newPosition: index + 1, moduleId: currentItem.moduleId });
        }
    });

    // Remove extra headers
    currentModuleItems.forEach(item => {
        if (!spreadsheetItems.some(si => si.title === item.title)) {
            adjustments.push({ type: 'remove', itemId: item.id, moduleId: item.moduleId });
        }
    });

    return adjustments;
}

async function addTextHeader(courseId, moduleId, title, position) {
    const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items`;
    const data = {
        module_item: {
            title,
            type: 'SubHeader',
            position
        }
    };

    try {
        await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(`Added text header: '${title}' at position ${position} in module ID ${moduleId}`);
    } catch (error) {
        console.error(`Error adding text header '${title}' in module ID ${moduleId}:`, error);
    }
}

async function removeTextHeader(courseId, moduleId, itemId) {
    const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items/${itemId}`;
    try {
        await axios.delete(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        console.log(`Removed text header: Item ID ${itemId} in module ID ${moduleId}`);
    } catch (error) {
        console.error(`Error removing text header with Item ID ${itemId} in module ID ${moduleId}:`, error);
    }
}

async function moveTextHeader(courseId, moduleId, itemId, newPosition) {
    const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items/${itemId}`;
    const data = {
        module_item: {
            position: newPosition
        }
    };

    try {
        await axios.put(url, data, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(`Moved text header: Item ID ${itemId} to position ${newPosition} in module ID ${moduleId}`);
    } catch (error) {
        console.error(`Error moving text header with Item ID ${itemId} in module ID ${moduleId}:`, error);
    }
}


// Function to retrieve all modules for a course
async function getAllModulesForCourse(courseId) {
    try {
        const url = `${canvasDomain}/api/v1/courses/${courseId}/modules`;
        const response = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
            params: { per_page: 100 }
        });
        return response.data.map(module => ({
            id: module.id,
            name: module.name
        }));
    } catch(error) {
        console.error(`Error retrieving modules for course ID ${courseId}:`, error);
        return [];
    }
}

// Function to get required and header items from the spreadsheet
async function getRequiredAndHeaderItems(filePath) {
    try {
        const rows = await readXlsxFile(filePath);
        const headers = rows[0];
        const categoryIndex = headers.indexOf('Category');
        const audienceRoleIndex = headers.indexOf('Ed Audience/Role');
        const displayTitleIndex = headers.indexOf('DISPLAY TITLE for course build');
        const moduleNameIndex = headers.indexOf('NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE');

        if (categoryIndex === -1 || audienceRoleIndex === -1 || displayTitleIndex === -1 || moduleNameIndex === -1) {
            throw new Error('One or more required headers are not found in the spreadsheet.');
        }

        return rows.slice(1).filter(row => {
            const category = (row[categoryIndex] || '').toLowerCase();
            const audienceRole = (row[audienceRoleIndex] || '').toLowerCase();
            return (category === 'required' || category === 'header') &&
                   (audienceRole === 'student' || audienceRole === 'teacher/student');
        }).map(row => ({
            moduleName: row[moduleNameIndex],
            title: row[displayTitleIndex]
        }));
    } catch (error) {
        console.error(`Error reading spreadsheet at path ${filePath}:`, error);
        return [];
    }
}

async function createComparisonTable(courseId, moduleName, moduleId, requiredItems) {
    const currentModuleItems = await listAllModuleItems(courseId, moduleId);
    const requiredTitles = requiredItems
        .filter(item => item.moduleName === moduleName)
        .map(item => item.title);

    let comparisonTable = [['Spreadsheet Title', 'Canvas Title']];

    let spreadsheetIndex = 0;

    // Check if Canvas items are in order based on the spreadsheet
    currentModuleItems.forEach(item => {
        if (spreadsheetIndex < requiredTitles.length && item.title === requiredTitles[spreadsheetIndex]) {
            comparisonTable.push([requiredTitles[spreadsheetIndex], item.title]);
            spreadsheetIndex++;
        } else {
            comparisonTable.push(['---', item.title]);
        }
    });

    // Add missing spreadsheet items that are not on Canvas
    while (spreadsheetIndex < requiredTitles.length) {
        comparisonTable.push([requiredTitles[spreadsheetIndex], '---']);
        spreadsheetIndex++;
    }

    console.log(`Comparison Table for Module: ${moduleName} (ID: ${moduleId})`);
    console.table(comparisonTable);
}




// Define the listAllModuleItems function
async function listAllModuleItems(courseId, moduleId) {
    try {
        // Define the Canvas API endpoint URL to list module items
        const apiUrl = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items`;

        // Make a GET request to list module items
        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                per_page: 100, // Number of items per page
                include: ['items', 'items.content_details'], // Include content details for each item
            },
        });

        // Map the response data to an array of module items with title, id, and position
        const moduleItems = response.data.map((item) => ({
            title: item.title,
            id: item.id,
            position: item.position,
        }));

        return moduleItems;
    } catch (error) {
        console.error(`Error listing module items for course ID ${courseId} and module ID ${moduleId}:`, error);
        return [];
    }
}




async function getRequiredItemsFromSpreadsheet(filePath) {
    try {
        const rows = await readXlsxFile(filePath);
        const requiredItems = [];

        for (let i = 1; i < rows.length; i++) {
            const moduleInfo = rows[i][0]; // Assuming module name is in the first column
            const title = rows[i][1]; // Assuming title is in the second column

            // Check if both moduleInfo and title are defined
            if (moduleInfo && title) {
                // Split the moduleInfo into moduleName and moduleId (if needed)
                const [moduleName, moduleId] = moduleInfo.split(':').map(item => item.trim());

                requiredItems.push({
                    moduleName,
                    moduleId, // You can remove this if moduleId is not applicable
                    title
                });
            }
        }

        return requiredItems;
    } catch (error) {
        console.error(`Error reading spreadsheet at path ${filePath}:`, error);
        return [];
    }
}

// Function to retrieve all modules for a course
async function getAllModulesForCourse(courseId) {
    try {
        const url = `${canvasDomain}/api/v1/courses/${courseId}/modules`;
        const response = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
            params: { per_page: 100 }
        });
        return response.data.map(module => ({
            id: module.id,
            name: module.name
        }));
    } catch(error) {
        console.error(`Error retrieving modules for course ID ${courseId}:`, error);
        return [];
    }
}


// Main Execution Function
(async () => {
    const modules = await getAllModulesForCourse(courseId);
    const requiredItems = await getRequiredAndHeaderItems(spreadsheetPath);
    
    if (modules.length === 0) {
        console.error('No modules found for the specified course.');
        return;
    }
    
    for (const module of modules) {
        if (module.name && module.id) {
            console.log(`Processing module: ${module.name} (ID: ${module.id})`);
            
            // Define moduleId here
            const moduleId = module.id;
            
 
            // await listAllModuleItems(courseId, moduleId);
            await listAllModuleItems(courseId, moduleId);
            // Additional processing if needed
        } else {
            console.log('Skipping an undefined module.');
        }
    }

    if (modules.length === 0) {
        console.error('No modules found for the specified course.');
        return;
    }

    for (const module of modules) {
        if (module.name && module.id) {
            console.log(`Processing module: ${module.name} (ID: ${module.id})`);
            await createComparisonTable(courseId, module.name, module.id, requiredItems);
            // Additional processing if needed
        } else {
            console.log('Skipping an undefined module.');
        }
    }

   
    await compareAndAdjustHeaders(courseId);
    await createComparisonTable(courseId, moduleName, moduleId, requiredItems);

    // Optionally, re-run comparison table function to verify the changes
})();
