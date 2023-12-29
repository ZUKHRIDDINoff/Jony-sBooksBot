const fs = require('fs');
const path = require('path');

async function getAllFiles(openFile) {
    try {
        let filesArray = [];
        let filesArrayIndexes = [];

        const files = fs.readdirSync(path.join(__dirname, '..', 'files'));
        for(let key in files) {
            filesArray.push(
                [{
                    text: files[key],
                    callback_data: `${openFile}<>${key}`
                }]
            )
            filesArrayIndexes.push(files[key]);
        }
        
        return [filesArray, filesArrayIndexes];
    } catch (error) {
        console.log('Error while getAllFiles: ' + error.message);
    }
}

module.exports = {
    getAllFiles
}