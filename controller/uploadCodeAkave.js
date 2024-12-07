var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');
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

// Function to upload a JavaScript file to a bucket
const uploadFile = async (bucketName, filePath) => {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  try {
    const response = await axios.post(`${API_BASE_URL}/buckets/${bucketName}/files`, form, {
      headers: form.getHeaders(),
    });
    console.log('File uploaded:', response.data);
  } catch (error) {
    console.error('Error uploading file:', error.response ? error.response.data : error.message);
  }
};

async function downloadFile(bucketName, fileName, outputDir) {
    try {
      const response = await axios.get(`${API_BASE_URL}/buckets/${bucketName}/files/${fileName}/download`, {
        responseType: 'blob',
      });
      console.log(`File downloaded: ${fileName}`);
      fs.writeFileSync(`./${outputDir}/${fileName}`, response.data);
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
    }
  }

// Usage examples
// Create a bucket named "myBucket"
// createBucket('myBucket');

// Upload a JavaScript file to the "myBucket"
// uploadFile('myBucket', '/home/kyler/work/Personal/cisix/controller/example.js');

// Upload a JavaScript file to the "myBucket"
// downloadFile('myBucket', 'example.js', 'controller/jscodes');

module.exports = {uploadFile, downloadFile}