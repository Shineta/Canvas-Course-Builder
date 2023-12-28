document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('course-builder-form').addEventListener('submit', handleFormSubmission);
});

async function handleFormSubmission(event) {
    event.preventDefault();

    // Get values from form elements
    const courseNumber = document.getElementById('course-number').value.trim();
    const canvasDomain = document.getElementById('canvas-domain').value.trim();
    const accessKey = document.getElementById('access-key').value.trim();
    const coursePrefix = document.getElementById('course-prefix').value.trim();
    const spreadsheetFile = document.getElementById('spreadsheet-file').files[0];
    const spreadsheetUrl = document.getElementById('spreadsheet-url').value.trim();

    // Validate input
    if (!courseNumber || !canvasDomain || !accessKey || !coursePrefix || (!spreadsheetFile && !spreadsheetUrl)) {
        alert('Please fill in all fields and provide either a spreadsheet file or URL.');
        return;
    }

    try {
        if (spreadsheetFile) {
            // Use FormData for file upload
            const formData = new FormData();
            formData.append('spreadsheet', spreadsheetFile);
            formData.append('courseNumber', courseNumber);
            formData.append('canvasDomain', canvasDomain);
            formData.append('accessKey', accessKey);
            formData.append('coursePrefix', coursePrefix);

            const response = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Course built successfully with file upload.');
        } else {
            // JSON payload for URL-based submission
            const response = await axios.post('/upload', {
                courseNumber,
                canvasDomain,
                accessKey,
                coursePrefix,
                spreadsheetUrl
            });
            alert('Course built successfully with URL.');
        }
    } catch (error) {
        console.error('Error during course building:', error);
        alert('Failed to build course. Please check console for details.');
    }
}
