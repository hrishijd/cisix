const { ethers } = require("ethers");
const { createClient } = require("redis");
const fs = require('fs');
const { dirname } = require("path");
var dotenv = require('dotenv');
dotenv.config();

// Get the API_BASE_URL from the environment
const MAINNET_INFURA = process.env.MAINNET_INFURA;
const BASE_MAINNT = process.env.BASE_MAINNT;
const REDIS_URL = process.env.REDIS_URL;

console.log("MAINNET_INFURA:", MAINNET_INFURA);
console.log("BASE_MAINNT:", BASE_MAINNT);
console.log("REDIS_URL:", REDIS_URL);


const RPCs = {
    "1": MAINNET_INFURA,
    "8453": BASE_MAINNT,
};

async function subscriber() {
    const lastBlocks = { "1": 0, "8453": 0 };
    const redisPublisher = createClient(
        {
            url: REDIS_URL,
        }
    );
    await redisPublisher.connect();

    while (true) {
        for (let chainId in RPCs) {
            const provider = new ethers.JsonRpcProvider(RPCs[chainId]);
            const block = await provider.getBlock("finalized");

            if (block.number > lastBlocks[chainId]) {
                await triggerHandlers(redisPublisher, provider, chainId, block.number);
                lastBlocks[chainId] = block.number;
            }
        }
    }
}

async function triggerHandlers(redisPublisher, provider, chainId, blockNumber) {  
    let files = [];

    try {
        files = fs.readdirSync(`handlers/dir_${chainId}`);
    } catch {
    }

    for (const file of files) {
        const { handle } = require(`../handlers/dir_${chainId}/${file}`);
        // Trigger the handle function
        const nameDetails = file.split('-');
        const address  = nameDetails[0];
        const fileNum = nameDetails[1].split('.')[1];
        const result = await handle(provider, chainId, blockNumber);
        // Publish the result to the consensus channel

        const message = JSON.stringify({ chainId: chainId.toString(), blockNumber: `${blockNumber}`, result, address, fileNum });
        await redisPublisher.publish("consensus_channel", message);
    }
}

module.exports = { subscriber };
