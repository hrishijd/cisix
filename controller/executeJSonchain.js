var dotenv = require('dotenv');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
const ExecutionCode = require('../models/executionCode');

dotenv.config();

// Get the API_BASE_URL from the environment
const BUCKET = "mybucket";

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
        jsCodeFile: req.file ? req.file.filename : null,
        userEmail: req.body.useremail,
        startBlockNumber: req.body.startBlockNumber,
        blockSplit: req.body.blockSplit,
        chainIds: req.body.chainIds,
        event: req.body.event,
    };
};

const addtoDataSource = async (req) => {
    var akaveId = uploadFile(BUCKET, 'jscodes/req.file');
    try {
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
            data: executionRecord
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Main handler function
module.exports = function (req, res) {
    const uploadFile = upload.single('jsCodeFile');

    uploadFile(req, res, async function (err) {
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