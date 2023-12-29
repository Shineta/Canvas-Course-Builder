/////////////////////////////////////////////////////////////////////////////////////////////////////////
//***************************This Code Works, I just need to add a 3rd Column************************* */
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// const axios = require('axios');
// const XLSX = require('xlsx'); // Import the xlsx library
// const XlsxPopulate = require('xlsx-populate');
// const url = require('url');

// // Replace with your Canvas API endpoint
// const canvasBaseUrl = 'https://hmh.instructure.com';

// // Replace with your Canvas access token
// const accessToken = '3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH';

// const canvasDomain = 'https://hmh.instructure.com/';

// // Replace with your Canvas course ID
// const courseId = '14735';

// const moduleId = '43649';

// // Initialize an empty array to store module items
// const resources = [];


// // Function to create and populate an XLSX file
// function createAndPopulateXLSX(resources) {
//     const workbook = XLSX.utils.book_new();
//     const worksheet = XLSX.utils.json_to_sheet(resources);

//     XLSX.utils.book_append_sheet(workbook, worksheet, 'ModuleItems');
//     XLSX.writeFile(workbook, 'g6_module_items.xlsx');

//     console.log('XLSX file created and populated with module items.');
// }

// // Function to fetch module items
// async function fetchModuleItems(courseId) {
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/modules?include=items`;

//     try {
//         const response = await axios.get(url, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });

//         // Check if the response contains data
//         if (response.data) {
//             const modules = response.data;

//             // Iterate through modules and items to find resources
//             for (const module of modules) {
//                 // Check if 'items' property exists and is an array
//                 if (Array.isArray(module.items)) {
//                     for (const item of module.items) {
//                         if (item.type === 'ExternalUrl') {
//                             // Log the resource and URL capture
//                             console.log(`Captured resource: ${item.title}`);
//                             console.log(`URL: ${item.external_url}`);

//                             // Push the module item to the resources array
//                             resources.push({
//                                 title: item.title,
//                                 url: item.external_url
//                             });
//                         }
//                     }
//                 }
//             }

//             // You can now use the 'resources' array as needed, e.g., to write to an XLSX file.
//             createAndPopulateXLSX(resources);
//         } else {
//             console.log('No data found in the response.');
//         }
//     } catch (error) {
//         console.error('Error fetching module items:', error);
//     }
// }

// // Function to fetch module items with pagination
// async function getModuleItems(courseId, moduleId) {
//     const perPage = 100; // Adjust the number of items per page as needed
//     let page = 1;
//     let allModuleItems = [];

//     while (true) {
//         const url = `${canvasBaseUrl}/api/v1/courses/${courseId}/modules/${moduleId}/items?per_page=${perPage}&page=${page}`;

//         try {
//             const response = await axios.get(url, {
//                 headers: {
//                     'Authorization': `Bearer ${accessToken}`,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             const moduleItems = response.data;
//             if (moduleItems.length === 0) {
//                 // No more items, break the loop
//                 break;
//             }

//             allModuleItems = allModuleItems.concat(moduleItems);
//             page++;
//         } catch (error) {
//             console.error('Error fetching module items:', error);
//             throw error;
//         }
//     }

//     return allModuleItems;
// }


// // Example usage:



// async function captureModuleItems() {
//     try {
//         const moduleItems = await getModuleItems(courseId, moduleId);

//         for (const item of moduleItems) {
//             console.log('Captured resource:', item.title);
//             console.log('URL:', item.external_url);

//             // Push the module item to the resources array
//             resources.push({
//                 title: item.title,
//                 url: item.external_url
//             });
//         }

//         console.log('All module items captured.');

//         // Call the function to create and populate the XLSX file
//         createAndPopulateXLSX(resources);
//     } catch (error) {
//         console.error('Error capturing module items:', error);
//     }
// }

// // Call the fetchModuleItems function
// fetchModuleItems(courseId);

// // Call the captureModuleItems function
// captureModuleItems();



////////////////////////////////////////////////////////////////////////////////////////
//**************************Adding 3rd Column**************************************** */
////////////////////////////////////////////////////////////////////////////////////////


// const axios = require('axios');
// const XLSX = require('xlsx'); // Import the xlsx library
// const XlsxPopulate = require('xlsx-populate');
// const url = require('url');
// const utils = require('utils')

// // Replace with your Canvas API endpoint
// const canvasBaseUrl = 'https://hmh.instructure.com';

// // Replace with your Canvas access token
// const accessToken = '3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH';

// const canvasDomain = 'https://hmh.instructure.com/';

// // Replace with your Canvas course ID
// const courseId = '14735';

// const moduleId = '43649';

// // Initialize an empty array to store module items
// const resources = [];

// function decodeURLParams(link) {
//     if (!link) {
//         console.error('Invalid or undefined URL:', link);
//         return {};
//     }

//     try {
//         const searchParams = new URL(link).searchParams;
//         const params = {};
//         for (const [key, value] of searchParams) {
//             params[key] = value;
//         }
//         return params;
//     } catch (error) {
//         console.error('Error decoding URL:', error.message);
//         return {};
//     }
// }


// // Function to create and populate an XLSX file
// function createAndPopulateXLSX(resources) {
//     const workbook = XLSX.utils.book_new();

//     // Loop through the rows and add a new column for the URL address
//     for (let i = 0; i < resources.length; i++) {
//         const url = resources[i].url;
//         const decodedParams = decodeURLParams(url);
//         const address = decodedParams.custom_resource_url || ''; // Extract the URL address
//         resources[i].decodedParams = address; // Store the URL address directly in the last column
//     }

//     const worksheet = XLSX.utils.json_to_sheet(resources);

//     // Append the modified worksheet to the workbook
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'ModuleItems');

//     // Write the workbook to a file
//     XLSX.writeFile(workbook, 'g6_module_items.xlsx');

//     console.log('XLSX file created and populated with module items and URL addresses.');
// }


// // Function to fetch module items
// async function fetchModuleItems(courseId) {
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/modules?include=items`;

//     try {
//         const response = await axios.get(url, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });

//         // Check if the response contains data
//         if (response.data) {
//             const modules = response.data;

//             // Iterate through modules and items to find resources
//             for (const module of modules) {
//                 // Check if 'items' property exists and is an array
//                 if (Array.isArray(module.items)) {
//                     for (const item of module.items) {
//                         if (item.type === 'ExternalUrl') {
//                             // Log the resource and URL capture
//                             console.log(`Captured resource: ${item.title}`);
//                             console.log(`URL: ${item.external_url}`);

//                             // Push the module item to the resources array
//                             resources.push({
//                                 title: item.title,
//                                 url: item.external_url
//                             });
//                         }
//                     }
//                 }
//             }

//             // You can now use the 'resources' array as needed, e.g., to write to an XLSX file.
//             createAndPopulateXLSX(resources);
//         } else {
//             console.log('No data found in the response.');
//         }
//     } catch (error) {
//         console.error('Error fetching module items:', error);
//     }
// }

// // Function to fetch module items with pagination
// async function getModuleItems(courseId, moduleId) {
//     const perPage = 100; // Adjust the number of items per page as needed
//     let page = 1;
//     let allModuleItems = [];

//     while (true) {
//         const url = `${canvasBaseUrl}/api/v1/courses/${courseId}/modules/${moduleId}/items?per_page=${perPage}&page=${page}`;

//         try {
//             const response = await axios.get(url, {
//                 headers: {
//                     'Authorization': `Bearer ${accessToken}`,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             const moduleItems = response.data;
//             if (moduleItems.length === 0) {
//                 // No more items, break the loop
//                 break;
//             }

//             allModuleItems = allModuleItems.concat(moduleItems);
//             page++;
//         } catch (error) {
//             console.error('Error fetching module items:', error);
//             throw error;
//         }
//     }

//     return allModuleItems;
// }


// // Example usage:



// async function captureModuleItems() {
//     try {
//         const moduleItems = await getModuleItems(courseId, moduleId);

//         for (const item of moduleItems) {
//             console.log('Captured resource:', item.title);
//             console.log('URL:', item.external_url);

//             // Push the module item to the resources array
//             resources.push({
//                 title: item.title,
//                 url: item.external_url
//             });
//         }

//         console.log('All module items captured.');

//         // Call the function to create and populate the XLSX file
//         createAndPopulateXLSX(resources);
//     } catch (error) {
//         console.error('Error capturing module items:', error);
//     }
// }

// // Call the fetchModuleItems function
// fetchModuleItems(courseId);

// // Call the captureModuleItems function
// captureModuleItems();

////////////////////////////////////////////////////////////////////////////////////
//***************************Splitting column 1 for easier look up*****************/
//***Moved this code to Resource Creator file for seporation of concerns **********/
////////////////////////////////////////////////////////////////////////////////////

// const axios = require('axios');
// const XLSX = require('xlsx'); // Import the xlsx library
// const XlsxPopulate = require('xlsx-populate');
// const url = require('url');
// const utils = require('utils')

// // Replace with your Canvas API endpoint
// const canvasBaseUrl = 'https://hmh.instructure.com';

// // Replace with your Canvas access token
// const accessToken = '3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH';

// const canvasDomain = 'https://hmh.instructure.com/';

// // Replace with your Canvas course ID
// const courseId = '14735';

// Import the config.js file at the top of your JavaScript files
const config = require('./config');

// Access the shared variables like this:
const axios = config.axios;
const XLSX = config.XLSX;
const XlsxPopulate = config.XlsxPopulate;
const canvasBaseUrl = config.canvasBaseUrl;
const canvasDomain = config.canvasDomain;
const accessToken = config.accessToken;
const courseId = config.courseId;
const spreadsheetPath = config.spreadsheetPath;
const coursePrefix = config.coursePrefix;
const moduleItemsPath = config.moduleItemsPath;

const moduleId = '43649';

// Initialize an empty array to store module items
const resources = [];

function decodeURLParams(link) {
    if (!link) {
        console.error('Invalid or undefined URL:', link);
        return {};
    }

    try {
        const searchParams = new URL(link).searchParams;
        const params = {};
        for (const [key, value] of searchParams) {
            params[key] = value;
        }
        return params;
    } catch (error) {
        console.error('Error decoding URL:', error.message);
        return {};
    }
}


// Function to create and populate an XLSX file
function createAndPopulateXLSX(resources) {
    const workbook = XLSX.utils.book_new();

    // Loop through the rows and add a new column for the URL address
    for (let i = 0; i < resources.length; i++) {
        const url = resources[i].url;
        const decodedParams = decodeURLParams(url);
        const address = decodedParams.custom_resource_url || ''; // Extract the URL address
        resources[i].decodedParams = address; // Store the URL address directly in the last column
    }

    const worksheet = XLSX.utils.json_to_sheet(resources);

    // Append the modified worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ModuleItems');

    // Write the workbook to a file
    XLSX.writeFile(workbook, 'g6_module_items.xlsx');

    console.log('XLSX file created and populated with module items and URL addresses.');
}


// Function to fetch module items
async function fetchModuleItems(courseId) {
    const url = `${canvasDomain}/api/v1/courses/${courseId}/modules?include=items`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        // Check if the response contains data
        if (response.data) {
            const modules = response.data;

            // Iterate through modules and items to find resources
            for (const module of modules) {
                // Check if 'items' property exists and is an array
                if (Array.isArray(module.items)) {
                    for (const item of module.items) {
                        if (item.type === 'ExternalUrl') {
                            // Log the resource and URL capture
                            console.log(`Captured resource: ${item.title}`);
                            console.log(`URL: ${item.external_url}`);

                            // Push the module item to the resources array
                            resources.push({
                                title: item.title,
                                url: item.external_url
                            });
                        }
                    }
                }
            }

            // You can now use the 'resources' array as needed, e.g., to write to an XLSX file.
            createAndPopulateXLSX(resources);
        } else {
            console.log('No data found in the response.');
        }
    } catch (error) {
        console.error('Error fetching module items:', error);
    }
}

// Function to fetch module items with pagination
async function getModuleItems(courseId, moduleId) {
    const perPage = 100; // Adjust the number of items per page as needed
    let page = 1;
    let allModuleItems = [];

    while (true) {
        const url = `${canvasBaseUrl}/api/v1/courses/${courseId}/modules/${moduleId}/items?per_page=${perPage}&page=${page}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const moduleItems = response.data;
            if (moduleItems.length === 0) {
                // No more items, break the loop
                break;
            }

            allModuleItems = allModuleItems.concat(moduleItems);
            page++;
        } catch (error) {
            console.error('Error fetching module items:', error);
            throw error;
        }
    }

    return allModuleItems;
}


// Example usage:



async function captureModuleItems() {
    try {
        const moduleItems = await getModuleItems(courseId, moduleId);

        for (const item of moduleItems) {
            console.log('Captured resource:', item.title);
            console.log('URL:', item.external_url);

            // Push the module item to the resources array
            resources.push({
                title: item.title,
                url: item.external_url
            });
        }

        console.log('All module items captured.');

        // Call the function to create and populate the XLSX file
        createAndPopulateXLSX(resources);
    } catch (error) {
        console.error('Error capturing module items:', error);
    }
}

// Call the fetchModuleItems function
fetchModuleItems(courseId);

// Call the captureModuleItems function
captureModuleItems();


