// Import the necessary modules
const { exec } = require('child_process');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define the file paths
const shellBuildFilePath = '/workspaces/Canvas-Course-Builder/courseBuild/shellBuild.js';
const newScriptFilePath = '/workspaces/Canvas-Course-Builder/courseBuild/newScript.js';
const updatePointsFilePath = '/workspaces/Canvas-Course-Builder/courseBuild/updatePoints.js';
const teacherNoteFilePath = '/workspaces/Canvas-Course-Builder/courseBuild/teacherNote.js';
const orgHeadersFilePath = '/workspaces/Canvas-Course-Builder/courseBuild/orgHeaders.js';
const addHeadersFilePath = '/workspaces/Canvas-Course-Builder/courseBuild/addHeaders.js';
const orderTestFilePath = '/workspaces/Canvas-Course-Builder/courseBuild/QA/orderTest.js'
const addiFrames2FilePath = '/workspaces/Canvas-Course-Builder/courseBuild/addiFrames2.js';
const resourceCollectorFilePath = '/workspaces/Canvas-Course-Builder/courseBuild/resourceCollector.js';
const resourceCreatorFilePath = '/workspaces/Canvas-Course-Builder/courseBuild/resourceCreator.js';




// Function to run a Node.js script synchronously
function runScriptSynchronously(filePath) {
    const command = `node ${filePath}`;
    
    // Run the script and wait for it to finish
    const result = spawnSync(command, {
      stdio: 'inherit', // Use the same stdio as the parent process (e.g., show script output)
      shell: true, // Use shell for command execution
    });
  
    if (result.error) {
      console.error(`Error running ${filePath}: ${result.error.message}`);
      process.exit(1);
    }
  
    if (result.status !== 0) {
      console.error(`${filePath} exited with status code ${result.status}`);
      process.exit(1);
    }
  }
  
  // Run the scripts sequentially
  // runScriptSynchronously(shellBuildFilePath);
  runScriptSynchronously(newScriptFilePath);
  runScriptSynchronously(addiFrames2FilePath);
  runScriptSynchronously(updatePointsFilePath);
  runScriptSynchronously(teacherNoteFilePath);
  runScriptSynchronously(addHeadersFilePath);
  runScriptSynchronously(orgHeadersFilePath);
  // runScriptSynchronously(orderTestFilePath);
  runScriptSynchronously(orgHeadersFilePath);
  // runScriptSynchronously(orderTestFilePath);
  
