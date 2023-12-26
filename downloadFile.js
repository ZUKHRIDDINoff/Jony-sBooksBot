const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downnloadFl(fileLink, fileName) {
    try {
        // Inside the document event handler
        const response = await axios.get(fileLink, { responseType: 'stream' });
        const filePath = path.join(__dirname) + `/files/${fileName}`;  // Set the desired directory and filename
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

module.exports = {
    downnloadFl
}