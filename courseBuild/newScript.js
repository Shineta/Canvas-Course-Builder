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
// const spreadsheetPath = '/workspaces/CanvasCourses2/newIntoLiteratureG8U6CCSDContentsInput2.xlsx'; // Update with your actual file path
// const coursePrefix = 'G8_Unit 6:'; // Update this with the dynamic course prefix

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

// Use the function to convert and then filter and log the required data
convertSpreadsheetToJson(spreadsheetPath).then(jsonData => {
    const studentAssignments = jsonData.filter(row => row['Ed Audience/Role'] === 'Student')
        .map(row => {
            return {
                module: row['NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE'],
                assignmentTitle: row['DISPLAY TITLE for course build']
            };
        });
    console.log(studentAssignments);
});
// // Function to read and process data from a spreadsheet
// async function readSpreadsheetData(filePath) {
//     try {
//         const rows = await readXlsxFile(filePath);
//         // Map and filter the rows as needed. The following is an example based on your provided structure:
//         return rows.map(row => ({
//             edAudienceRole: row[26], // Assuming Column AA
//             associatedModule: row[27], // Assuming Column AB
//             assignmentTitle: row[30] // Assuming Column AE
//         })).filter(row => row.edAudienceRole === 'Student' && row.associatedModule && row.assignmentTitle);
//     } catch (error) {
//         console.error('Error reading spreadsheet:', error);
//         return [];
//     }
// }



// Function to read the spreadsheet and convert it to JSON
async function convertSpreadsheetToJson(filePath) {
    try {
        const rows = await readXlsxFile(filePath);
        // Assuming the first row contains the headers
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



// Use the function
convertSpreadsheetToJson(spreadsheetPath).then(jsonData => {
    console.log(JSON.stringify(jsonData, null, 2));
});


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

async function readUniqueModulesFromSpreadsheet(filePath, columnIndex = 27) {
    try {
        const rows = await readXlsxFile(filePath);
        const allItems = rows.map(row => row[columnIndex]).filter(Boolean); // Filter out empty or null values
        const uniqueItems = [...new Set(allItems)]; // Remove duplicates
        return uniqueItems;
    } catch (error) {
        console.error('Error reading spreadsheet:', error);
        return [];
    }
}




async function createModule(courseId, moduleName) {
    const url = `${canvasDomain}/api/v1/courses/${courseId}/modules`;
    const data = {
        module: {
            name: moduleName
            // Add other module attributes as needed
        }
    };


    try {
        const response = await axios.post(url, data, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        return response.data; // Returns the created module object
    } catch (error) {
        console.error('Error creating module:', error);
    }
}


async function findModuleIdByName(courseId, moduleName) {
    const url = `${canvasDomain}/api/v1/courses/${courseId}/modules`;


    try {
        const response = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
            params: {
                per_page: 100 // Adjust depending on the number of modules
            }
        });


        const modules = response.data;
        const foundModule = modules.find(module => module.name === moduleName);
        return foundModule ? foundModule.id : null;
    } catch (error) {
        console.error('Error finding module:', error);
        return null;
    }
}


async function deleteModule(courseId, moduleId) {
    if (!moduleId) {
        console.log('Module ID not provided.');
        return;
    }


    const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}`;


    try {
        await axios.delete(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        console.log(`Module with ID ${moduleId} has been deleted.`);
    } catch (error) {
        console.error('Error deleting module:', error);
    }
}


async function automateModuleCreation() {
    let moduleNames = await readUniqueModulesFromSpreadsheet(spreadsheetPath);


    // Filter out and prepend 'Teacher Resources' modules
    const teacherResourcesModules = moduleNames.filter(name => name.includes("Teacher Resources")).map(name => name + " (DO NOT PUBLISH)");
    const otherModules = moduleNames.filter(name => !name.includes("Teacher Resources"));


    // Add the custom course overview module
    const customOverviewModule = `${coursePrefix} Course Overview (DO NOT PUBLISH)`;
    moduleNames = [customOverviewModule, ...teacherResourcesModules, ...otherModules];


    for (const moduleName of moduleNames) {
        const newModule = await createModule(courseId, moduleName);
        console.log(`Created module: ${moduleName}`);
    }
}


async function findAndDeleteModule(courseId, moduleNameToDelete) {
    const moduleId = await findModuleIdByName(courseId, moduleNameToDelete);
    if (moduleId) {
        await deleteModule(courseId, moduleId);
    } else {
        console.log(`Module named "${moduleNameToDelete}" not found.`);
    }
}

// Function to add a module item
async function addModuleItem(courseId, moduleId, title, type = 'Assignment') {
    const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items`;
    const data = {
      module_item: {
        title: title,
        type: type,
        // Additional fields like 'content_id' can be added here if needed
      }
    };
  
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(`Module item '${title}' added to module ID ${moduleId}`);
      return response.data;
    } catch (error) {
      console.error('Error adding module item:', error);
    }
  }
  
//   // Function to add module items based on the spreadsheet data
//   async function addModuleItemsFromSpreadsheet(courseId, jsonData) {
//     for (const item of jsonData) {
//       if (item['Ed Audience/Role'] === 'Student') {
//         const moduleName = item['NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE'];
//         const moduleItemId = item['DISPLAY TITLE for course build'];
//         const moduleId = await findModuleIdByName(courseId, moduleName);
  
//         if (moduleId) {
//           await addModuleItem(courseId, moduleId, moduleItemId);
//         } else {
//           console.log(`Module '${moduleName}' not found.`);
//         }
//       }
//     }
//   }



// Function to create an assignment group
async function createAssignmentGroup(courseId, groupName) {
    const url = `${canvasDomain}/api/v1/courses/${courseId}/assignment_groups`;
    const data = { name: groupName };
    try {
        const response = await axios.post(url, data, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        console.log(`Created assignment group: ${groupName}`);
        return response.data;
    } catch (error) {
        console.error(`Error creating assignment group: ${groupName}`, error);
    }
}

// // Function to create an assignment
// async function createAssignment(courseId, assignmentData) {
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/assignments`;
//     const data = {
//         assignment: {
//             name: assignmentData.assignmentName,
//             points_possible: assignmentData.points,
//             due_at: assignmentData.dueDate,
//             // Add other assignment fields as needed
//         }
//     };

//     try {
//         const response = await axios.post(url, data, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//         console.log('Assignment created:', response.data);
//         return response.data;
//     } catch (error) {
//         console.error('Error creating assignment:', error);
//     }
// }

// // Function to create an assignment
// async function createAssignment(courseId, assignmentData) {
//     const url = `${canvasDomain}/api/v1/courses/${courseId}/assignments`;
//     const data = {
//         assignment: {
//             name: assignmentData.assignmentName,
//             id: assignmentData.id,
//             points_possible: assignmentData.points,
//             due_at: assignmentData.dueDate,

//             // Add other assignment fields as needed
//         }
//     };

//     try {
//         const response = await axios.post(url, data, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });

//         // Assuming the assignment ID is in response.data.id
//         const createdAssignment = {
//             ...response.data, // Spread operator to copy all properties from response.data
//             id: response.data.id // Explicitly adding the ID for clarity
//         };

//         console.log('Assignment created:', createdAssignment);
//         return createdAssignment;
//     } catch (error) {
//         console.error('Error creating assignment:', error);
//     }
// }



// // Function to automate module and assignment group creation
// async function automateModuleAndAssignmentGroupCreation() {
//     let moduleNames = await readUniqueModulesFromSpreadsheet(spreadsheetPath);
//     // ... existing module processing ...




//     for (const moduleName of moduleNames) {
//         if (!moduleName.includes("Teacher Resources") && !moduleName.includes("Course Overview")) {
//             await createAssignmentGroup(courseId, moduleName);
//         }
//     }
// }

// Function to find an assignment group ID by name
async function findAssignmentGroupIdByName(courseId, groupName) {
    const url = `${canvasDomain}/api/v1/courses/${courseId}/assignment_groups`;
    try {
        const response = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
            params: {
                per_page: 100
            }
        });
        const groups = response.data;
        const foundGroup = groups.find(group => group.name === groupName);
        return foundGroup ? foundGroup.id : null;
    } catch (error) {
        console.error('Error finding assignment group:', error);
        return null;
    }
}

// Function to create an assignment
async function createAssignment(courseId, assignmentName, moduleName, assignmentData) {
    const groupId = await findAssignmentGroupIdByName(courseId, moduleName);
    if (!groupId) {
        console.log(`Assignment group named '${moduleName}' not found.`);
        return;
    }
    const url = `${canvasDomain}/api/v1/courses/${courseId}/assignments`;
    const data = {
        assignment: {
            name: assignmentName,
            // points_possible: assignmentData.points,
            assignment_group_id: groupId,
            // Other assignment details can be added here
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
        console.error('Error creating assignment:', error);
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

            // Check for the 'next' link in the headers
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

  
// Function to add a module item that is an assignment
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
        content_id: assignmentId
      }
    };
  
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(`Module item for assignment '${assignmentName}' added to module ID ${moduleId}`);
      return response.data;
    } catch (error) {
      console.error(`Error adding module item for assignment '${assignmentName}':`, error.response.data);
    }
  }
  
  // Function to iterate over JSON data and add module items for each student assignment
  async function addAllAssignmentsAsModuleItems(courseId, jsonData) {
    for (const item of jsonData) {
      if (item['Ed Audience/Role'] === 'Student') {
        const moduleName = item['NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE'];
        const assignmentName = item['DISPLAY TITLE for course build'];
        const moduleId = await findModuleIdByName(courseId, moduleName);
        if (moduleId) {
          await addAssignmentModuleItem(courseId, moduleId, assignmentName);
        } else {
          console.log(`Module named '${moduleName}' not found.`);
        }
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  //********************************Adding Course Overview Page**************************************/
  ////////////////////////////////////////////////////////////////////////////////////////////////////

  // Function to create a new page in the course
async function createCoursePage(courseId, pageTitle, pageContent) {
    const url = `${canvasDomain}/api/v1/courses/${courseId}/pages`;
    const data = {
        wiki_page: {
            title: pageTitle,
            body: pageContent
        }
    };

    try {
        const response = await axios.post(url, data, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        console.log('Page created:', response.data);
        return response.data; // Returns the created page object
    } catch (error) {
        console.error('Error creating page:', error);
    }
}

// Function to add a page to a module
async function addPageToModule(courseId, moduleId, pageUrl, pageTitle ) {
    const url = `${canvasDomain}/api/v1/courses/${courseId}/modules/${moduleId}/items`;
    const data = {
        module_item: {
            title: pageTitle,
            type: 'Page',
            page_url: pageUrl
        }
    };

    try {
        const response = await axios.post(url, data, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        console.log(`Page '${pageUrl}' added to module ID ${moduleId}`);
        return response.data;
    } catch (error) {
        console.error('Error adding page to module:', error);
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^Adding Course Overview Page^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^/
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  



// Main Execution
(async () => {
    // Step 1: Create Modules
    await automateModuleCreation();


    // Step 2: Create Assignment Groups
    const moduleNames = await readUniqueModulesFromSpreadsheet(spreadsheetPath);
    for (const moduleName of moduleNames) {
        if (!moduleName.includes("Teacher Resources") && !moduleName.includes("Course Overview")) {
            await createAssignmentGroup(courseId, moduleName);
        }
    }


    // // Step 3: Add Module Items
    // const spreadsheetData = await readSpreadsheetData(spreadsheetPath);
    // await addAssignmentsToModules(courseId, spreadsheetData);


//  // Step 4: Create Assignments based on the DISPLAY TITLE for course build
//  const jsonData = await convertSpreadsheetToJson(spreadsheetPath); // Ensure this function is defined and works correctly
//  const studentAssignments = jsonData.filter(row => row['Ed Audience/Role'] === 'Student')
//      .map(row => {
//          return {
//              module: row['NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE'],
//              assignmentTitle: row['DISPLAY TITLE for course build']
//          };
//      });
//  for (let assignment of studentAssignments) {
//      await createAssignment(courseId, assignment.assignmentTitle, assignment.module);
//  }

//Step 4: Create Assignments based on the DISPLAY TITLE for course build
const jsonData = await convertSpreadsheetToJson(spreadsheetPath);
const studentAssignments = jsonData.filter(row => row['Ed Audience/Role'] === 'Student')
    .map(row => {
        return {
            module: row['NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE'],
            assignmentTitle: row['DISPLAY TITLE for course build'],
            category: row['Category'] // Adding the 'Category' column
        };
    });


for (let assignment of studentAssignments) {
    if (assignment.category && assignment.category.toLowerCase() === 'required') {
        await createAssignment(courseId, assignment.assignmentTitle, assignment.module);
    }
}



await addAllAssignmentsAsModuleItems(courseId, jsonData);

 const pageTitle = "Important Unit Design and Support Information".replace(/-/g, ' ');
    const pageContent = `<h2><strong>Working with course resource links</strong></h2>
    <p><span>All links in this course have been tested and validated in Canvas. Be aware that for links to launch properly:</span></p>
    <ol>
        <li><span> Assignments or Teacher Resource items must be </span><span style="color: #ba372a;">PUBLISHED</span><span>.</span><span> Courses have been designed with all links intentionally Unpublished, leaving the choice to you as to when you want them to appear.</span></li>
        <li><span> Links will only launch for users who have </span><span><span style="color: #ba372a;">ROSTERED roles</span> </span><span>in both Canvas and HMH Ed as either </span><span style="color: #ba372a;">Teacher or Student</span><span>.</span></li>
        <li><span> Writable links will only function properly after you have done the </span><span style="color: #ba372a;">initial setup to Writable via HMH Ed.</span><span> For more information, see Writable Support below.</span></li>
        <li><span> Under certain circumstances, Canvas does not copy all referenced information when you only copy a single Module instead of the entire course. Use your </span><span style="color: #ba372a;">Canvas Link Validator</span><span> to confirm that what you have copied is working in your course.</span></li>
    </ol>
    <p><span>If you have problems with links not related to the notes above, please refer to the Support section below.</span></p>
    <p>&nbsp;</p>
    <h2><strong>Course Design</strong></h2>
    <ol>
        <li><span>Module 1 contains the Course Overview for this Unit.</span></li>
        <li aria-level="1"><span>Module 2 contains all Teacher Resources available for this Unit.</span></li>
        <li aria-level="1"><span>The remaining Modules are all divided by text selection titles and subsections that match the instructional flow on HMH Ed and your print materials. The final module includes the Unit Tasks. These modules are all set to Unpublished.</span></li>
        <li aria-level="1"><span>The final module includes the Unit Tasks.</span></li>
        <li aria-level="1"><span>All modules are set to Unpublished.</span></li>
        <li aria-level="1"><span>Into Literature assessments have been created as assignments with app links embedded in the text field of the assignment. This allows students to respond to assessments within Canvas.</span></li>
        <li aria-level="1"><span>Selection assessments are all set to a point value of 10, Unit Tasks are all set to a point value of 100. Teachers can customize these point values, including setting selection assessments to 100 points if they are used summatively.</span></li>
        <li aria-level="1"><span style="color: var(--ic-brand-font-color-dark); font-family: inherit; font-size: 1rem;"><span style="color: #ba372a;">Practice tests, selection tests, and unit tests must be</span> <a href="https://s3.amazonaws.com/downloads.hmlt.hmco.com/CustomerExperience/CCSD/CCSD+HMH+Into+Reading_Creating+Assignments.pdf">created for each class</a>. Use of Digital Assessments allows student scores to be available for your courses in both the HMH Ed and the Canvas platform. We have inserted placeholders in the recommended location within the Modules to prompt you to complete the setup. A link to directions is in the Note text, should you need help with the process.</span></li>
    </ol>
    <p>&nbsp;</p>
    <h2><strong>Support</strong></h2>
    <ul>
        <li><span>If you need help with working with HMH Ed and Into Literature components of this course, go to </span><a href="https://support.hmhco.com/s/article/ccsd"><span>https://support.hmhco.com/s/article/ccsd</span></a><span> for more information.</span></li>
        <li>For help with Writable components of this course, go to <a href="https://intercom.help/writable/en/articles/8302047-clark-county-canvas-set-up">https://intercom.help/writable/en/articles/8302047-clark-county-canvas-set-up</a> for information about initial set up and linking assignments between the platforms.</li>
    </ul>`; //Page content
    const moduleName = "G8_Unit 6: Course Overview (DO NOT PUBLISH)";

    // Step 1: Create a new page
    const newPage = await createCoursePage(courseId, pageTitle, pageContent);

    if (newPage) {
        // Step 2: Find the module ID for "Course Overview"
        const moduleId = await findModuleIdByName(courseId, moduleName);
        if (moduleId) {
            // Step 3: Add the page to the "Course Overview" module
            await addPageToModule(courseId, moduleId, newPage.url);
        } else {
            console.log(`Module named '${moduleName}' not found.`);
        }
    }


    // Optional: Delete a specific module and assignment group
    await findAndDeleteModule(courseId, "NAME OF CANVAS ASSIGNMENT GROUP & ASSOCIATED MODULE");
})();


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//***************************************************New Test 12-20-23 7:41 AM****************************************************** */
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


