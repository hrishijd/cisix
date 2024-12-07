var dotenv = require('dotenv');
dotenv.config();

var bucketName = process.env.AKAVE_BUCKET;

var aggregateInputs = function (req, res) {
    try {
        // Aggregating input details from the request body
        var aggregatedData = {
            jsCodeFile: req.body.jsCodeFile,
            startBlockNumber: req.body.startBlockNumber,
            blockSplit: req.body.blockSplit,
            chainIds: req.body.chainIds,
            event: req.body.event,
        };

        // Example: Saving the aggregated data to a database or processing it further
        SomeDatabaseModel.create(aggregatedData)
            .then(function (result) {
                if (result) {
                    return res.status(200).send('Inputs aggregated successfully');
                } else {
                    return res.status(409).send('Failed to aggregate inputs');
                }
            })
            .catch(function (error) {
                console.error(error);
                return res.status(500).send('An error occurred while processing the request');
            });
    } catch (error) {
        console.error(error);
        return res.status(500).send('An error occurred while processing the request');
    }
};

module.exports = aggregateInputs;
