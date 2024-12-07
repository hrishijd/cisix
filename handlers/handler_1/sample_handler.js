const { ethers } = require('ethers');

async function handle(provider, chainId, blockNumber){
    return getPriceUniswapV2('0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc', provider, blockNumber);
}

const getPriceUniswapV2 = async (poolAddress, provider, blockNumber) => {
    // ABI for the Uniswap V2 Pair contract
    const UNISWAP_V2_PAIR_ABI = [
        "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)"
    ];

    // Create a contract instance for the pool
    const poolContract = new ethers.Contract(poolAddress, UNISWAP_V2_PAIR_ABI, provider);

    try {
        // Fetch the reserves
        const [reserve0, reserve1, blockTimestampLast] = await poolContract.getReserves({ blockTag: blockNumber });

        console.log(`Reserve0: ${reserve0.toString()}`);
        console.log(`Reserve1: ${reserve1.toString()}`);
        console.log(`Block Timestamp Last: ${blockTimestampLast}`);

        return { reserve0: reserve0.toString(), reserve1: reserve1.toString(), blockTimestampLast: blockTimestampLast.toString()};
    } catch (error) {
        console.error("Error fetching reserves:", error);
        throw error;
    }
};


module.exports = { handle };
