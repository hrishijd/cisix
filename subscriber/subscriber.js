const { ethers } = require("ethers");
const { createClient } = require("redis");

const RPCs = {
    "1": "https://mainnet.infura.io/v3/8fff52e813f44e2cbbb4e9d0a5e34075",
    "8453": "https://base-mainnet.infura.io/v3/8fff52e813f44e2cbbb4e9d0a5e34075",
};

async function subscriber() {
    const lastBlocks = { "1": 21346912, "8453": 369415 };
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
    const handlers = { "1": ["sample_handler.js", "sample_handler.js"] };

    if (!handlers[chainId]) return;

    for (const fileIndex in handlers[chainId]) {
        const file = handlers[chainId][fileIndex];
        const { handle } = require(`../handlers/handler_${fileIndex}/${file}`);

        // Trigger the handle function
        const result = await handle(provider, chainId, blockNumber);

        // Publish the result to the consensus channel
        const message = JSON.stringify({ chainId: chainId.toString(), blockNumber: `${blockNumber}`, result });
        await redisPublisher.publish("consensus_channel", message);
    }
}

module.exports = { subscriber };
