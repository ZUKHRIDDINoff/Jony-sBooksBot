const fs = require('fs');
const path = require('path');

async function getAllFiles(openFile) {
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
}

module.exports = {
    getAllFiles
}