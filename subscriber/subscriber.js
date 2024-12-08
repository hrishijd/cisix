const { ethers } = require("ethers");
const { createClient } = require("redis");
const fs = require('fs');
const { dirname } = require("path");

const RPCs = {
    "1": "https://mainnet.infura.io/v3/8fff52e813f44e2cbbb4e9d0a5e34075",
    "8453": "https://base-mainnet.infura.io/v3/8fff52e813f44e2cbbb4e9d0a5e34075",
};

async function subscriber() {
    const lastBlocks = { "1": 0, "8453": 0 };
    const redisPublisher = createClient(
        {
            url: "redis://default:ygFQThkMOOAACsEYyyinCtrIvSZuLiqy@junction.proxy.rlwy.net:55946",
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
        const fileNum = nameDetails[1].split('.')[0];
        
        const result = await handle(provider, chainId, blockNumber);

        // Publish the result to the consensus channel

        const message = JSON.stringify({ chainId: chainId.toString(), blockNumber: `${blockNumber}`, result, address, fileNum });
        await redisPublisher.publish("consensus_channel", message);
    }
}

module.exports = { subscriber };
