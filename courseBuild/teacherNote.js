// // Import necessary modules
// const axios = require('axios');
// const readXlsxFile = require('read-excel-file/node');

// // Configuration
// const canvasDomain = 'https://hmh.instructure.com';
// const accessToken = '3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH'; // Replace with your actual access token
// const courseId = '14706'; // Target course ID
// const spreadsheetPath = '/workspaces/Canvas-Course-Builder/courseBuild/IntoLiteratureG8U6CCSDContentsInput.xlsx'; // Update with your actual file path

// // Function to create or update a wiki page on Canvas
// async function createOrUpdateCanvasWikiPage(courseId, pageUrlOrId, title, body, accessToken) {
//   const url = `${canvasDomain}/api/v1/courses/${courseId}/pages/${pageUrlOrId}`;

//   try {
//     const response = await axios.put(
//       url,
//       {
//         wiki_page: {
//           title: title,
//           body: body,
//           editing_roles: 'teachers,students', // Specify the roles allowed to edit (adjust as needed)
//           notify_of_update: true, // Whether to notify participants of changes
//           published: false // Set to true or false based on your requirement
//         }
//       },
//       {
//         headers: {
//           'Authorization': `Bearer ${accessToken}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     console.log(`Updated or created wiki page: '${title}'`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error updating or creating wiki page: '${title}'`, error);
//   }
// }

// // Function to read spreadsheet and convert to array of objects
// async function readSpreadsheet(filePath) {
//   try {
//     const rows = await readXlsxFile(filePath);
//     const headers = rows[0];
//     return rows.slice(1).map(row => {
//       let rowData = {};
//       headers.forEach((header, index) => {
//         rowData[header] = row[index];
//       });
//       return rowData;
//     });
//   } catch (error) {
//     console.error('Error reading spreadsheet:', error);
//     throw error; // Rethrow the error to be handled by the caller
//   }
// }

// // ...

// // Function to retrieve the module ID by module name
// async function getModuleIdByModuleName(courseId, moduleName, accessToken) {
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/modules`;
  
//     try {
//       const response = await axios.get(url, {
//         headers: {
//           'Authorization': `Bearer ${accessToken}`
//         }
//       });
  
//       const modules = response.data;
  
//       // Find the module with the matching name
//       const module = modules.find(mod => mod.name === moduleName);
  
//       if (module) {
//         return module.id;
//       } else {
//         console.error(`Module with name '${moduleName}' not found.`);
//         return null;
//       }
//     } catch (error) {
//       console.error('Error retrieving modules:', error);
//       return null;
//     }
//   }
  
//   // Function to add a wiki page as a module item
//   async function addWikiPageToModule(courseId, moduleId, pageUrlOrId, accessToken) {
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items`;
  
//     try {
//       const response = await axios.post(
//         url,
//         {
//           module_item: {
//             title: '', // You can specify a title for the module item if needed
//             type: 'Page',
//             content_id: pageUrlOrId,
//             published: true // Set to true to publish the module item
//           }
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${accessToken}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
  
//       console.log(`Added wiki page with ID '${pageUrlOrId}' to module.`);
//       return response.data;
//     } catch (error) {
//       console.error(`Error adding wiki page with ID '${pageUrlOrId}' to module:`, error);
//     }
//   }
  
//   // Main function to create or update wiki pages, add them to modules, and process spreadsheet items
//   async function processSpreadsheetItems(filePath, courseId, accessToken) {
//     try {
//       // Read the spreadsheet and store the items in an array
//       const spreadsheetItems = await readSpreadsheet(filePath);
  
//       // Filter rows where "Ed Audience/Role" is "Teacher/student"
//       const teacherStudentItems = spreadsheetItems.filter(item =>
//         item['Ed Audience/Role'] && item['Ed Audience/Role'].toLowerCase() === 'teacher/student'
//       );
  
//       // Loop through the filtered items and create or update wiki pages
//       for (const item of teacherStudentItems) {
//         const pageUrlOrId = item['URL or ID']; // Replace with the correct field from your spreadsheet
//         const title = `TEACHER ACTION: Set up Online Assessment – '${item['DISPLAY TITLE for course build']}' [DO NOT PUBLISH THIS NOTE]`;
//         const bodyHtml = `<p><strong>TEACHER NOTE: </strong>You will need to set up this assessment manually for each class using the Ed Linking Tool. This assessment cannot be copied to cross-listed courses. Need help? Follow directions here at the <a href="https://s3.amazonaws.com/downloads.hmlt.hmco.com/CustomerExperience/CCSD/CCSD+HMH+Into+Reading+and+Into+Literature_Assessments.pdf">Add HMH Digital Assessment PDF</a> to learn how to create an assessment via Canvas.</p>`;
  
//         // Call the function to create or update a wiki page
//         const createdPage = await createOrUpdateCanvasWikiPage(courseId, pageUrlOrId, title, bodyHtml, accessToken);
  
//         // Check if the module name is provided in the spreadsheet
//         const moduleName = item['NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE'];
  
//         if (moduleName) {
//           // Get the module ID by module name
//           const moduleId = await getModuleIdByModuleName(courseId, moduleName, accessToken);
  
//           if (moduleId) {
//             // Add the wiki page as a module item
//             await addWikiPageToModule(courseId, moduleId, createdPage.url, accessToken);
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error processing spreadsheet items:', error);
//     }
//     // Add the wiki page as a module item
// await addWikiPageToModule(courseId, moduleId, createdPage.url, accessToken);
//   }
  
//   // Trigger the process
//   processSpreadsheetItems(spreadsheetPath, courseId, accessToken);
  

//   // Function to add a wiki page as a module item
// async function addWikiPageToModule(courseId, moduleId, pageUrlOrId, accessToken) {
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items`;
  
//     try {
//       const response = await axios.post(
//         url,
//         {
//           module_item: {
//             title: '', // You can specify a title for the module item if needed
//             type: 'Page',
//             content_id: pageUrlOrId,
//             position: 1, // Set the position within the module (1-based)
//             indent: 0, // Set the indent level (0-based)
//             page_url: pageUrlOrId // Set the page URL or ID
//           }
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${accessToken}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
  
//       console.log(`Added wiki page with ID '${pageUrlOrId}' as a module item.`);
//       return response.data;
//     } catch (error) {
//       console.error(`Error adding wiki page with ID '${pageUrlOrId}' as a module item:`, error);
//     }
//   }

// // Main function to iterate over spreadsheet items and create or update wiki pages
// async function createOrUpdateWikiPagesForItems(filePath, courseId, accessToken) {
//   try {
//     // Read the spreadsheet and store the items in an array
//     const spreadsheetItems = await readSpreadsheet(filePath);

//     // Loop through the items and create or update wiki pages
//     for (const item of spreadsheetItems) {
//         if (item['Ed Audience/Role'] && item['Ed Audience/Role'].toLowerCase() === 'teacher/student') {
//       const pageUrlOrId = item['URL or ID']; // Replace with the correct field from your spreadsheet
//       const title = `TEACHER ACTION: Set up Online Assessment – ${item['DISPLAY TITLE for course build']} [DO NOT PUBLISH THIS NOTE]`;
//       const bodyHtml = `<p><strong>TEACHER NOTE: </strong>You will need to set up this assessment manually for each class using the Ed Linking Tool. This assessment cannot be copied to cross-listed courses. Need help? Follow directions here at the <a href="https://s3.amazonaws.com/downloads.hmlt.hmco.com/CustomerExperience/CCSD/CCSD+HMH+Into+Reading+and+Into+Literature_Assessments.pdf">Add HMH Digital Assessment PDF</a> to learn how to create an assessment via Canvas.</p>`;

//       // Call the function to create or update a wiki page
//       await createOrUpdateCanvasWikiPage(courseId, pageUrlOrId, title, bodyHtml, accessToken);
//     }
// }
//   } catch (error) {
//     console.error('Error processing spreadsheet items:', error);
//   }
// }

// // Trigger the page creation or update process
// createOrUpdateWikiPagesForItems(spreadsheetPath, courseId, accessToken);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////***************Working Code************************************************************************************* */
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

// Now you can use these variables in your code



// // Import necessary modules
// const axios = require('axios');
// const readXlsxFile = require('read-excel-file/node');

// // Configuration
// const canvasDomain = 'https://hmh.instructure.com';
// const accessToken = '3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH'; // Replace with your actual access token
// const courseId = '14706'; // Target course ID
// const spreadsheetPath = '/workspaces/Canvas-Course-Builder/courseBuild/IntoLiteratureG8U6CCSDContentsInput.xlsx'; // Update with your actual file path

// Function to create or update a wiki page on Canvas
async function createOrUpdateCanvasWikiPage(courseId, pageUrlOrId, title, body, accessToken) {
  const url = `${canvasDomain}/api/v1/courses/${courseId}/pages/${pageUrlOrId}`;

  try {
    const response = await axios.put(
      url,
      {
        wiki_page: {
          title: title,
          body: body,
          editing_roles: 'teachers,students', // Specify the roles allowed to edit (adjust as needed)
          notify_of_update: true, // Whether to notify participants of changes
          published: false // Set to true or false based on your requirement
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`Updated or created wiki page: '${title}'`);
    return response.data;
  } catch (error) {
    console.error(`Error updating or creating wiki page: '${title}'`, error);
  }
}

// Function to read spreadsheet and convert to an array of objects
async function readSpreadsheet(filePath) {
  try {
    const rows = await readXlsxFile(filePath);
    const headers = rows[0];
    return rows.slice(1).map(row => {
      let rowData = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index];
      });
      return rowData;
    });
  } catch (error) {
    console.error('Error reading spreadsheet:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

// Function to retrieve the module ID by module name
async function getModuleIdByModuleName(courseId, moduleName, accessToken) {
  const url = `${canvasDomain}/api/v1/courses/${courseId}/modules`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const modules = response.data;

    // Find the module with the matching name
    const module = modules.find(mod => mod.name === moduleName);

    if (module) {
      return module.id;
    } else {
      console.error(`Module with name '${moduleName}' not found.`);
      return null;
    }
  } catch (error) {
    console.error('Error retrieving modules:', error);
    return null;
  }
}

// Function to add a wiki page as a module item
async function addWikiPageToModule(courseId, moduleId, pageUrlOrId, title, accessToken) {
  const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items`;

  try {
    const response = await axios.post(
      url,
      {
        module_item: {
          title: title, // Provide a title for the module item
          type: 'Page',
          content_id: pageUrlOrId,
          position: 1, // Set the position within the module (1-based)
          indent: 0, // Set the indent level (0-based)
          page_url: pageUrlOrId // Set the page URL or ID
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`Added wiki page with ID '${pageUrlOrId}' as a module item with title: '${title}'.`);
    return response.data;
  } catch (error) {
    console.error(`Error adding wiki page with ID '${pageUrlOrId}' as a module item:`, error);
  }
}

// Main function to create or update wiki pages, add them to modules, and process spreadsheet items
async function processSpreadsheetItems(filePath, courseId, accessToken) {
  try {
    // Read the spreadsheet and store the items in an array
    const spreadsheetItems = await readSpreadsheet(filePath);

    // Loop through the items and create or update wiki pages
    for (const item of spreadsheetItems) {
      if (item['Ed Audience/Role'] && item['Ed Audience/Role'].toLowerCase() === 'teacher/student') {
        const pageUrlOrId = item['URL or ID']; // Replace with the correct field from your spreadsheet
        const title = `TEACHER ACTION: Set up Online Assessment – ${item['DISPLAY TITLE for course build']} [DO NOT PUBLISH THIS NOTE]`;
        const bodyHtml = `<p><strong>TEACHER NOTE: </strong>You will need to set up this assessment manually for each class using the Ed Linking Tool. This assessment cannot be copied to cross-listed courses. Need help? Follow directions here at the <a href="https://s3.amazonaws.com/downloads.hmlt.hmco.com/CustomerExperience/CCSD/CCSD+HMH+Into+Reading+and+Into+Literature_Assessments.pdf">Add HMH Digital Assessment PDF</a> to learn how to create an assessment via Canvas.</p>`;

        // Call the function to create or update a wiki page
        const createdPage = await createOrUpdateCanvasWikiPage(courseId, pageUrlOrId, title, bodyHtml, accessToken);

        // Check if the module name is provided in the spreadsheet
        const moduleName = item['NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE'];

        if (moduleName) {
          // Get the module ID by module name
          const moduleId = await getModuleIdByModuleName(courseId, moduleName, accessToken);

          if (moduleId) {
            // Add the wiki page as a module item
            await addWikiPageToModule(courseId, moduleId, createdPage.url, title, accessToken);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error processing spreadsheet items:', error);
  }
}

// Trigger the page creation or update process
processSpreadsheetItems(spreadsheetPath, courseId, accessToken);
