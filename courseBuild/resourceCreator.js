/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////****************The following code creates a spreadsheet that contains assignment titles and URLs *************************/
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Import the config.js file at the top of your JavaScript files
const config = require('./config');

// Access the shared variables like this:
const axios = config.axios;
const XLSX = config.XLSX;
const fs = config.fs;
const XlsxPopulate = config.XlsxPopulate;
const canvasBaseUrl = config.canvasBaseUrl;
const canvasDomain = config.canvasDomain;
const accessToken = config.accessToken;
const courseId = config.courseId;
const spreadsheetPath = config.spreadsheetPath;
const coursePrefix = config.coursePrefix;
const moduleItemsPath = config.moduleItemsPath;

// Load the "module_items.xlsx" spreadsheet
const moduleItemsWorkbook = XLSX.readFile('/workspaces/Canvas-Course-Builder/courseBuild/g6_module_items.xlsx');
const moduleItemsSheet = moduleItemsWorkbook.Sheets[moduleItemsWorkbook.SheetNames[0]];

// Extract module items data
const moduleItemsData = XLSX.utils.sheet_to_json(moduleItemsSheet, { header: 1 });

// Create new headers for the split columns
moduleItemsData[0].splice(1, 0, 'Title Before Hyphen', 'Title After Hyphen');

// Iterate through the module items and split column A
for (let i = 1; i < moduleItemsData.length; i++) {
  const title = moduleItemsData[i][0]; // Assuming the title is in the 1st position (index 0) of column A
  if (title) {
    const titleParts = title.split('-');
    if (titleParts.length >= 2) {
      // Separate the title into two parts
      const firstPart = titleParts[0].trim();
      const secondPart = titleParts.slice(1).join('-').trim();
      
      // Update the module item with two new columns
      moduleItemsData[i].splice(1, 0, firstPart, secondPart);
    } else {
      // If there is no "-", keep the title as is in both columns
      moduleItemsData[i].splice(1, 0, title, '');
    }
  } else {
    // If there is no title, add empty values in both columns
    moduleItemsData[i].splice(1, 0, '', '');
  }
}

// Create a new worksheet with the updated data
const updatedModuleItemsSheet = XLSX.utils.aoa_to_sheet(moduleItemsData);

// Create a new workbook with the updated module items
const updatedModuleItemsWorkbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(updatedModuleItemsWorkbook, updatedModuleItemsSheet, 'ModuleItems');

// Save the updated workbook to a new Excel file
const outputFilePath = '/workspaces/Canvas-Course-Builder/courseBuild/g6_module_items_updated.xlsx';
XLSX.writeFile(updatedModuleItemsWorkbook, outputFilePath);

console.log('Module items updated with separate columns and saved to module_items_updated.xlsx.');
