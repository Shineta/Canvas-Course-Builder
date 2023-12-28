// config.js

module.exports = {
    axios: require('axios'),
    readXlsxFile: require('read-excel-file/node'),
    canvasDomain: 'https://hmh.instructure.com',
    accessToken: '3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH', // Replace with your actual access token
    courseId: '14706', // Replace with the target course ID
    spreadsheetPath: '/workspaces/Canvas-Course-Builder/courseBuild/IntoLiteratureG8U6CCSDContentsInput.xlsx', // Update with your actual file path
    coursePrefix: 'G8_Unit 6:', // Update this with the dynamic course prefix
    moduleItemsPath: '/workspaces/CanvasCourses2/module_items_updated2.xlsx' // Update with your actual file path
};
