import dotenv from 'dotenv';
dotenv.config();
var bucketName = process.env.AKAVE_BUCKET;

const aggregateInputs = async (req, res) => {
    try {
        // Aggregating input details from the request body
        const aggregatedData = {
          jsCodeFile: req.body.jsCodeFile,
          startBlockNumber: req.body.startBlockNumber,
          blockSplit: req.body.blockSplit,
          chainIds: req.body.chainIds,
          event: req.body.event,
        };
    
        // Example: Saving the aggregated data to a database or processing it further
        const result = await SomeDatabaseModel.create(aggregatedData);
    
        if (result) {
          return res.status(200).send('Inputs aggregated successfully');
        }
        return res.status(409).send('Failed to aggregate inputs');
      } catch (error) {
        console.error(error);
        return res.status(500).send('An error occurred while processing the request');
      }
  };
  export default aggregateInputs;