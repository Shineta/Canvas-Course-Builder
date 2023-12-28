document.addEventListener("DOMContentLoaded", function () {
    const configForm = document.getElementById("configForm");
    const canvasDomainInput = document.getElementById("canvasDomain");
    const accessTokenInput = document.getElementById("accessToken");
    const courseIdInput = document.getElementById("courseId");
    const spreadsheetPathInput = document.getElementById("spreadsheetPath");
    const coursePrefixInput = document.getElementById("coursePrefix");
    const moduleItemsPathInput = document.getElementById("moduleItemsPath");
  
    // Simulate filling out the form fields
    canvasDomainInput.value = "https://hmh.instructure.com";
    accessTokenInput.value = "3299~uTWSEuauW9Gv8pMwRrME6rTos6QOVh9Vp5pLBHO0OeG5vpg0OALm7VOr070kZGHH";
    courseIdInput.value = "14706";
    spreadsheetPathInput.value = "/workspaces/Canvas-Course-Builder/courseBuild/IntoLiteratureG8U6CCSDContentsInput.xlsx";
    coursePrefixInput.value = "G8_Unit 6:";
    moduleItemsPathInput.value = "/workspaces/CanvasCourses2/module_items_updated2.xlsx";
  
    // Simulate form submission
    configForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
      const formData = {
        canvasDomain: canvasDomainInput.value,
        accessToken: accessTokenInput.value,
        courseId: courseIdInput.value,
        spreadsheetPath: spreadsheetPathInput.value,
        coursePrefix: coursePrefixInput.value,
        moduleItemsPath: moduleItemsPathInput.value,
      };
  
      // Display form data for testing purposes
      console.log("Form Data:", formData);
    });
  
    // Simulate clicking the "Build Course" button
    const buildCourseBtn = document.getElementById("buildCourseBtn");
    buildCourseBtn.addEventListener("click", function () {
      console.log("Build Course button clicked.");
  
      // You can simulate making an API request here
      // For example, you can use the fetch API to make a request to the server
    });
  });
  