// config.js

// module.exports = {
//     axios: require('axios'),
//     readXlsxFile: require('read-excel-file/node'),
//     canvasDomain: 'https://hmh.instructure.com',
//     accessToken: '3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH', // Replace with your actual access token
//     courseId: '14735', // Replace with the target course ID
//     spreadsheetPath: '/workspaces/Canvas-Course-Builder/courseBuild/g6IntoLiteratureG6U5CCSDContentsInput.xlsx', // Update with your actual file path
//     coursePrefix: 'G8_Unit 6:', // Update this with the dynamic course prefix
//     moduleItemsPath: '/workspaces/Canvas-Course-Builder/courseBuild/module_items_updated2.xlsx' // Update with your actual file path
// };

// config.js

module.exports = {
    axios: require('axios'),
    XLSX: require('xlsx'),
    XlsxPopulate: require('xlsx-populate'),
    readXlsxFile: require('read-excel-file/node'),
    fs: require('fs'),
    url: require('url'),
    utils: require('utils'),
    // Replace with your Canvas API endpoint
    canvasBaseUrl: 'https://hmh.instructure.com',
    // Replace with your Canvas access token
    accessToken: '3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH',
    canvasDomain: 'https://hmh.instructure.com/',
    spreadsheetPath: '/workspaces/Canvas-Course-Builder/courseBuild/g6IntoLiteratureG6U5CCSDContentsInput.xlsx', 
    moduleItemsPath: '/workspaces/Canvas-Course-Builder/courseBuild/g6_module_items_updated.xlsx',
    // Replace with your Canvas course ID
    courseId: '14735',
   
};

