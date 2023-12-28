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
// const spreadsheetPath = '/workspaces/CanvasCourses2/IntoLiteratureG8U6CCSDContentsInput.xlsx'; // Update with your actual file path
// const coursePrefix = 'G8_Unit 6:'; // Update this with the dynamic course prefix



// Function to fetch all pages
async function fetchAllPages(courseId) {
  let pages = [];
  let url = `${canvasDomain}/api/v1/courses/${courseId}/pages`;

  try {
    while (url) {
      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
        params: { per_page: 100 }
      });
      pages = pages.concat(response.data);
      
      // Check for the 'next' link in the headers
      const linkHeader = response.headers['link'];
      const nextLink = linkHeader?.split(',').find(link => link.includes('rel="next"'));
      url = nextLink ? new URL(/<(.*)>/.exec(nextLink)[1]).toString() : null;
    }
    return pages;
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}

// Function to delete a page
async function deletePage(courseId, url) {
  try {
    await axios.delete(`${canvasDomain}/api/v1/courses/${courseId}/pages/${url}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    console.log(`Deleted page: ${url}`);
  } catch (error) {
    console.error(`Error deleting page: ${url}`, error);
  }
}

// Main function to delete all pages
async function deleteAllPages(courseId) {
  const pages = await fetchAllPages(courseId);

  for (const page of pages) {
    await deletePage(courseId, page.url);
  }

  console.log('All pages have been deleted.');
}

// Execute the main function
deleteAllPages(courseId).catch(console.error);
