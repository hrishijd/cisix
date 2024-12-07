var dotenv = require('dotenv');
var multer = require('multer');
var path = require('path');
var fs = require('fs');

dotenv.config();

// Set up storage configuration for multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ensure the jscodes folder exists
        var directory = path.join(__dirname, 'jscodes');
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory); // Create folder if not exists
        }
        cb(null, directory); // Save files to jscodes folder
    },
    filename: function (req, file, cb) {
        // Use the original file name, or create a unique name if needed
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage });

var bucketName = process.env.AKAVE_BUCKET;

var aggregateInputs = function (req, res) {
    try {
        // Aggregating input details from the request body
        var aggregatedData = {
            jsCodeFile: req.file ? req.file.filename : null, // File name after upload
            userEmail: req.body.useremail,
            startBlockNumber: req.body.startBlockNumber,
            blockSplit: req.body.blockSplit,
            chainIds: req.body.chainIds,
            event: req.body.event,
        };

        // Send the response with aggregated data
        res.status(200).send(aggregatedData);
    } catch (error) {
        console.error(error);
        return res.status(500).send('An error occurred while processing the request');
    }
};

// Use multer to handle file upload before the aggregateInputs function
var uploadFile = upload.single('jsCodeFile'); // 'jsCodeFile' is the field name for the file in the form

// Exporting the function that includes file upload handling
module.exports = function (req, res) {
    uploadFile(req, res, function (err) {
        if (err) {
            return res.status(400).send('Error uploading file');
        }
        aggregateInputs(req, res);
    });
};
