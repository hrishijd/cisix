const { subscriber } = require("./subscriber/subscriber");

// Wrap in an async IIFE
(async () => {
    try {
        await subscriber();
    } catch (error) {
        console.error("Error in subscriber:", error);
    }
})();
