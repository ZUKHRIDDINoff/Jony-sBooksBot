const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downnloadFl(fileLink, fileName) {
    try {
        // Inside the document event handler
        const response = await axios.get(fileLink, { responseType: 'stream' });
        const filePath = path.join(__dirname, '..') + `/files/${fileName}`;  // Set the desired directory and filename
        const fileStream = fs.createWriteStream(filePath);

        response.data.pipe(fileStream);

        // You might want to handle the 'end' event to perform any additional actions
        fileStream.on('end', () => {
            console.log('File succesfully downloaded');
        });

        return 1;
    } catch (error) {
        console.log('Problem while downloading file' + error.message);
        return 0;
    }
}


async function readMyFile() {
    try {
        const filePath = path.join(__dirname, '..', 'files', 'file.json');
        let obj = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return obj
    } catch (error) {
        console.log('Error while readMyFile function: ' + error.message);
    }
}

// readMyFile()

async function writeMyFile(fileId = null, fileName) {
    try {
        const filePath = path.join(__dirname, '..', 'files', 'file.json');
        let obj = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const value = {
            id: obj.length,
            file_name: fileName,
            file_id: fileId
        }
        if(fileId != null) obj.push(value)
        
        const result = await fs.writeFileSync(filePath, JSON.stringify(obj))
        return !result
    } catch (error) {
        console.log('Error while writeMyFile function: ' + error.message);
    }
    
}

module.exports = {
    downnloadFl,
    readMyFile,
    writeMyFile
}