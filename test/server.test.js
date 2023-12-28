// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const fs = require('fs');
// const path = require('path');
// // If the module exports a default object
// const canvas = require('canvas-api-wrapper').default;
// // Or if it's a named export
// // const { Canvas } = require('canvas-api-wrapper');
// // Assuming your server is exported from your main server file
// const server = require('./server.js'); // Update with the actual path
// const canvasInstance = new canvas('https://hmh.instructure.com', '3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH');


// const should = chai.should();

// chai.use(chaiHttp);

// describe('File Upload', () => {
//     it('should upload an XLSX file', (done) => {
//         chai.request(server)
//             .post('/upload')
//             .attach('file', fs.readFileSync(path.join(__dirname, '/workspaces/Canvas-Course-Builder/test/IntoLiteratureG8U6CCSDContentsInput.xlsx')), '/workspaces/Canvas-Course-Builder/test/IntoLiteratureG8U6CCSDContentsInput.xlsx') // Replace 'test.xlsx' with the path to your test file
//             .end((err, res) => {
//                 should.not.exist(err);
//                 res.should.have.status(200);
//                 res.body.should.be.a('string');
//                 res.body.should.equal('File processed successfully');
//                 done();
//             });
//     });

//     // Add more tests as needed...
// });

// // Additional test cases can be written here to test other routes and functionalities



const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const path = require('path');
const canvas = require('canvas-api-wrapper'); // Import canvas-api-wrapper
const server = require('/workspaces/Canvas-Course-Builder/courseBuild/server.js'); // Import your server

// Configure canvas-api-wrapper
canvas.subdomain = 'hmh'; // Replace with your actual subdomain
canvas.apiToken = '3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH'; // Replace with your actual API token

const should = chai.should();
chai.use(chaiHttp);

// describe('File Upload', () => {
//     it('should upload an XLSX file', (done) => {
//         chai.request(server)
//             .post('/upload')
//             .attach('file', fs.readFileSync(path.join(__dirname, '/workspaces/Canvas-Course-Builder/test/IntoLiteratureG8U6CCSDContentsInput.xlsx')), '/workspaces/Canvas-Course-Builder/test/IntoLiteratureG8U6CCSDContentsInput.xlsx')
//             .end((err, res) => {
//                 should.not.exist(err);
//                 res.should.have.status(200);
//                 res.body.should.be.a('string');
//                 res.body.should.equal('File processed successfully');
//                 done();
//             });
//     });

//     it('should reject non-xlsx file upload', (done) => {
//         chai.request(server)
//             .post('/upload')
//             .attach('file', fs.readFileSync(path.join(__dirname, 'test.txt')), 'test.txt')
//             .end((err, res) => {
//                 res.should.have.status(400);
//                 done();
//             });
//     });

//     // Test for Missing File in Request
//     it('should return an error for missing file', (done) => {
//         chai.request(server)
//             .post('/upload')
//             .end((err, res) => {
//                 res.should.have.status(400);
//                 done();
//             });
//     });

//     // Test for File Upload with Invalid API Token
//     it('should handle invalid Canvas API token', (done) => {
//         // Mock the Canvas API call with an invalid token for this test
//         // Code to mock the API call goes here
//         // ...
//         chai.request(server)
//             .post('/upload')
//             .attach('file', fs.readFileSync(path.join(__dirname, 'test.xlsx')), 'test.xlsx')
//             .end((err, res) => {
//                 res.should.have.status(500);
//                 done();
//             });
//     });

//     // Test for Non-Existent Course ID in Canvas API
//     it('should handle non-existent course ID', (done) => {
//         // Mock the Canvas API call with a non-existent course ID for this test
//         // Code to mock the API call goes here
//         // ...
//         chai.request(server)
//             .post('/upload')
//             .attach('file', fs.readFileSync(path.join(__dirname, 'test.xlsx')), 'test.xlsx')
//             .end((err, res) => {
//                 res.should.have.status(500);
//                 done();
//             });
//     });

//     // Test for API Throttling or Rate Limiting
//     it('should handle API rate limiting', (done) => {
//         // Mock the Canvas API call to simulate rate limiting for this test
//         // Code to mock the API call goes here
//         // ...
//         chai.request(server)
//             .post('/upload')
//             .attach('file', fs.readFileSync(path.join(__dirname, 'test.xlsx')), 'test.xlsx')
//             .end((err, res) => {
//                 res.should.have.status(429); // Assuming 429 is used for rate limiting
//                 done();
//             });
//     });
// });


describe('Module Addition to Canvas Course', () => {
    // Test to check if all modules are added to a specific course
    it('should add all modules from the spreadsheet to the course', async () => {
        // Reading the spreadsheet
        const workbook = xlsx.readFile(path.join(__dirname, 'modules.xlsx')); // Update with your spreadsheet path
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const modulesFromSpreadsheet = xlsx.utils.sheet_to_json(worksheet).map(row => row.ModuleName); // Assuming the module name is in 'ModuleName' column

        // Mocking Canvas API calls
        const mock = sinon.mock(canvas);
        const course = canvas.getCourse(14706); // Replace with your course ID
        mock.expects("getCourse").withArgs(14706).returns(course);
        // Add more mocks as necessary for the methods used to add modules to the course

        // Perform the action to add modules (You need to implement this part based on your application logic)
        // await addModulesToCourse(14706, modulesFromSpreadsheet);

        // Retrieve updated course data (mock or real call)
        const updatedCourse = await course.get();
        const modulesInCanvas = updatedCourse.modules.map(module => module.name);

        // Assert that all modules from spreadsheet are in Canvas course
        modulesFromSpreadsheet.forEach(moduleName => {
            modulesInCanvas.should.include(moduleName);
        });

        // Verify mocks (if used)
        mock.verify();
    });
});
