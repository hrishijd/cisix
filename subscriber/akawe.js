const { createClient } = require("redis");
const { downloadFile } = require("../controller/uploadCodeAkave");
var dotenv = require('dotenv');
dotenv.config();

// Get the API_BASE_URL from the environment
const REDIS_URL = process.env.REDIS_URL;

async function subscribeExecutionLogics(){
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
        await redisSubscriber.subscribe("execution_logic_channel", async (message) => {
            const { akaveId, blockNumbers } = JSON.parse(message);

            await downloadFile(process.env.BUCKETNAME, akaveId, `../handlers/${akaveId}/file.js`);
        });
    } catch (error) {
        console.error("Error subscribing to consensus_channel:", error);
    }
}
