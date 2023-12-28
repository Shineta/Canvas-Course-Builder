document.addEventListener("DOMContentLoaded", function() {
    const configForm = document.getElementById("configForm");

    configForm.addEventListener("submit", function(event) {
        event.preventDefault();

        // Extract form data
        const canvasDomain = document.getElementById("canvasDomain").value;
        const accessToken = document.getElementById("accessToken").value;
        const courseId = document.getElementById("courseId").value;
        const spreadsheetPath = document.getElementById("spreadsheetPath").value;
        const coursePrefix = document.getElementById("coursePrefix").value;
        const moduleItemsPath = document.getElementById("moduleItemsPath").value;

        // Send a POST request to the server with the form data
        fetch('http://localhost:3000/save-config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                canvasDomain,
                accessToken,
                courseId,
                spreadsheetPath,
                coursePrefix,
                moduleItemsPath,
            }),
        })
        .then((response) => {
            if (response.ok) {
                return response.text();
            }
            throw new Error('Failed to save configuration.');
        })
        .then((data) => {
            console.log(data); // Output the response from the server
        })
        .catch((error) => {
            console.error('Error:', error);
        });

        // Add an event listener for the "Build Course" button
        const buildCourseBtn = document.getElementById('buildCourseBtn');
        buildCourseBtn.addEventListener('click', function () {
            // Send a request to the server to trigger script execution
            fetch('http://localhost:3000/run-scripts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    scripts: [
                        'shellBuildFilePath',
                        'newScriptFilePath',
                        'updatePointsFilePath',
                        'teacherNoteFilePath',
                    ],
                }),
            })
            .then((response) => {
                if (response.ok) {
                    return response.text();
                }
                throw new Error('Failed to execute scripts.');
            })
            .then((data) => {
                console.log(data); // Output the response from the server
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        });
    });
});
