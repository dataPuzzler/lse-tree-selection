const fs = require('fs').promises;
const path = require('path');

const filesToCopy = [
    { 
        source: path.join(__dirname, 'src', 'public', "js", "render-region-selection.js"), 
        destination: path.join(__dirname, 'test-dist', 'js', 'render-region-selection.js') 
    },
    { 
        source: path.join(__dirname, 'src', 'public', 'styles', 'style.css'), 
        destination: path.join(__dirname, 'test-dist', 'styles', "style.css") 
    },
    { 
        source: path.join(__dirname, 'src', 'index.html'), 
        destination: path.join(__dirname, 'test-dist', 'index.html') 
    }
];

async function copyFiles(files) {
    for (const file of files) {
        const { source, destination } = file;
        
        const destinationDir = path.dirname(destination);
        await fs.mkdir(destinationDir, { recursive: true });

        try {
            await fs.copyFile(source, destination);
            console.log(`File copied from ${source} to ${destination} successfully`);
        } catch (err) {
            console.error(`Error copying file from ${source} to ${destination}:`, err);
        }
    }
}

copyFiles(filesToCopy);
