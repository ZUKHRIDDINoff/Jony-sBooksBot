const fs = require('fs');
const path = require('path');

async function getAllFiles(openFile, files = []) {
    try {
        let filesArray = [];
        let filesArrayIndexes = [];

        for(let key in files) {
            filesArray.push(
                [{
                    text: files[key].file_name,
                    callback_data: `${openFile}<>${files[key].id}`
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