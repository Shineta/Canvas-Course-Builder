const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const courseResetFolderPath = '/workspaces/Canvas-Course-Builder/courseReset'; // Replace with the actual path to your courseReset folder

fs.readdir(courseResetFolderPath, (err, files) => {
    if (err) {
        console.error('Error reading the courseReset folder:', err);
        return;
    }

    // Filter JS files and execute them
    files.filter(file => file.endsWith('.js')).forEach(file => {
        const filePath = path.join(courseResetFolderPath, file);
        
        exec(`node ${filePath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing ${file}: ${error}`);
                return;
            }
            console.log(`Output for ${file}: ${stdout}`);
            if (stderr) {
                console.error(`Error output for ${file}: ${stderr}`);
            }
        });
    });
});
