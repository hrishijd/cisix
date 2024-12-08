var dotenv = require('dotenv');
var FormData = require('form-data');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var axios = require('axios');
const ExecutionCode = require('../models/executionCode');
dotenv.config();

let akaveId;
// Get the API_BASE_URL from the environment
const API_BASE_URL = process.env.API_BASE_URL;
// Set up storage configuration for multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var directory = path.join(__dirname, 'jscodes');
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
        }
        cb(null, directory);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage });

var aggregateInputs = function (req) {
    // Changed to return data instead of sending response
    return {
        jsCodeFile: req.file ?  req.file.filename : null,
        userEmail: req.body.useremail,
        startBlockNumber: req.body.startBlockNumber,
        blockSplit: req.body.blockSplit,
        chainIds: req.body.chainIds,
        event: req.body.event,
    };
};

const addtoDataSource = async (req) => {
    const uploadPath = path.join(__dirname, 'jscodes', req.file.filename);
    // Declare akaveId in the outer scope

    const uploadFile = async (bucketName, filePath) => {
        const absoluteFilePath = path.resolve(filePath);
        const form = new FormData();
        form.append('file', fs.createReadStream(absoluteFilePath));

        try {
            const response = await axios.post(`${API_BASE_URL}/buckets/${bucketName}/files`, form, {
                headers: form.getHeaders(),
            });
            console.log('File uploaded:', response.data);
            return response.data.RootCID; // Return the RootCID instead of assigning to akaveId
        } catch (error) {
            console.error('Error uploading file:', error.response ? error.response.data : error.message);
            throw new Error('File upload failed');
        }
    };

    console.log(uploadPath);
    try {
        // Assign the returned RootCID to akaveId
        akaveId =  "akaveId";
        await uploadFile('myBucket', uploadPath);

        // Create the execution record
        const executionRecord = await ExecutionCode.create({
            useremail: req.body.useremail || null,
            executionBlockNo: req.body.startBlockNumber,
            executionFileName: req.file.filename,
            executionAkaveID: akaveId,
            executionBlockState: 'PENDING',
            executionChainIds: Array.isArray(req.body.chainIds)
                ? req.body.chainIds[0]
                : parseInt(req.body.chainIds.split(',')[0]),
        });

        return {
            success: true,
            message: 'Code Updated Successfully',
            data: executionRecord,
        };
    } catch (error) {
        console.error(error);
        throw new Error('Error creating execution record');
    }
};


// Main handler function
module.exports = function (req, res) {
    const uploadFileMiddleware = upload.single('jsCodeFile');

    uploadFileMiddleware(req, res, async function (err) {
        try {
            if (err) {
                return res.status(400).send('Error uploading file');
            }

            const aggregatedData = aggregateInputs(req);
            const result = await addtoDataSource(req, aggregatedData);

            res.status(200).json({
                ...result,
                aggregatedData
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });
};