const app = require("./app");
const { storeBlob } = require("./controller/walrusUtility");
const { subscriber } = require("./subscriber/subscriber");
const { createClient } = require("redis");
var dotenv = require('dotenv');
dotenv.config();

// Get the API_BASE_URL from the environment
const REDIS_URL = process.env.REDIS_URL;

async function startValidator() {
    // Redis Subscriber Configuration
    const redisSubscriber = createClient({
        url: REDIS_URL,
    });

    // Handle Redis connection errors
    redisSubscriber.on("error", (err) => {
        console.error("Redis Subscriber Error:", err);
    });

    try {
        await redisSubscriber.connect();
        console.log("Connected to Redis successfully.");
    } catch (error) {
        console.error("Failed to connect to Redis:", error);
        process.exit(1); // Exit if Redis connection fails
    }

    const votes = {}; // To track votes for each block

    // Subscribe to the consensus channel
    try {
        await redisSubscriber.subscribe("consensus_channel", async (message) => {
            const { chainId, blockNumber, result, address, fileNum } = JSON.parse(message);
            const key = `${chainId}-${blockNumber}`;

            if (!votes[key]) {
                votes[key] = { yes: 0, no: 0, total: 0 };
            }

            // Count votes
            if (result) {
                votes[key].yes++;
            } else {
                votes[key].no++;
            }
            votes[key].total++;

            // Check for consensus (greater than 55%)
            const requiredConsensus = Math.ceil(votes[key].total * 0.55);
            if (votes[key].yes >= requiredConsensus) {
                console.log(`Consensus achieved for chain ${chainId}, block ${blockNumber}. Operation performed.`);
                await performOperation(chainId, blockNumber, result, address, fileNum);
                delete votes[key]; // Clear votes for this block
            } else if (votes[key].no >= requiredConsensus) {
                console.log(`Consensus not achieved for chain ${chainId}, block ${blockNumber}. No operation performed.`);
                delete votes[key]; // Clear votes for this block
            }
        });

        console.log("Validator is listening for messages...");
    } catch (error) {
        console.error("Error subscribing to consensus_channel:", error);
    }
}

async function performOperation(chainId, blockNumber, result, address, fileNum) {

    if(process.env.LEADER){
        // Define the operation to be performed upon consensus
        console.log(`Performing operation on chain ${chainId}, block ${blockNumber}`);
        const blob_id = await storeBlob({chainId, blockNumber, result, address, fileNum});
        console.log('Blob', blob_id);
    }
}

// Wrap in an async IIFE
(async (app) => {
    try {
        await startValidator();
        await subscriber();
    } catch (error) {
        console.error("Error in subscriber:", error);
    }
})(app);
