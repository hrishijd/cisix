const { ethers } = require("ethers"); 

const RPCs = {
    "1": "https://mainnet.infura.io/v3/8fff52e813f44e2cbbb4e9d0a5e34075",
    "8453": "https://base-mainnet.infura.io/v3/8fff52e813f44e2cbbb4e9d0a5e34075",
};

async function subscriber() {
    const lastBlocks = { "1": 21346912, "8453": 369415 };

    while (true) {
        for (let chainId in RPCs) {
            const provider = new ethers.JsonRpcProvider(RPCs[chainId]);
            const block = await provider.getBlock("finalized");

            if (block.number > lastBlocks[chainId]) {
                await triggerHandlers(provider, chainId, block.number);
                lastBlocks[chainId] = block.number; // Update last block number to
            }
        }
    }
}

async function triggerHandlers(provider, chainId, blockNumber) {
    const handlers = { "1": ["sample_handler.js", "sample_handler.js"] };

    if (!handlers[chainId]) return;

    for (const fileIndex in handlers[chainId]) {
        const file = handlers[chainId][fileIndex];
        const { handle } = require(`../handlers/handler_${fileIndex}/${file}`);
        console.log(await handle(provider, chainId, blockNumber));
    }
}

module.exports = {subscriber};
