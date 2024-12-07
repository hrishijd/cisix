var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');
var path = require('path');
var dotenv = require('dotenv');
dotenv.config();

// Get the API_BASE_URL from the environment
const API_BASE_URL = process.env.API_BASE_URL;

// Function to create a bucket
const createBucket = async (bucketName) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/buckets`, { bucketName });
    console.log('Bucket created:', response.data);
  } catch (error) {
    console.error('Error creating bucket:', error.response ? error.response.data : error.message);
  }
};


// Function to download a file
async function downloadFile(bucketName, fileName, outputDir) {
    try {
      const response = await axios.get(`${API_BASE_URL}/buckets/${bucketName}/files/${fileName}/download`, {
        responseType: 'blob',
      });
      console.log(`File downloaded: ${fileName}`);
      fs.writeFileSync(path.join(__dirname, outputDir, fileName), response.data);
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
    }
}

// Usage examples
// Create a bucket named "myBucket"
// createBucket('myBucket');

// Upload a JavaScript file to the "myBucket"
// uploadFile('myBucket', 'README.md'); // Relative path example

// Download a file to a specific directory
// downloadFile('myBucket', 'example.js', 'controller/jscodes'); 

module.exports = { uploadFile, downloadFile };
