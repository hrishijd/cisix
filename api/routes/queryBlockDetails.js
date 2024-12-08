const express = require("express");
const router = express.Router();
const blobs = require("../../models/blobs");

// Route to get the latest blob data based on walletAddress and executionId
router.get("/latestblock", async (req, res) => {
  try {
    const { userWallet, executionId } = req.query;

    if (!userWallet || !executionId) {
      return res.status(400).json({
        error: {
          message: "Both userWallet and executionId are required.",
        },
      });
    }

    // Fetch the latest blob for the given walletAddress and executionId
    const latestBlob = await blobs.findOne({
      where: {
        walletAddress: userWallet,
        executionId: executionId,
      },
      order: [["createdAt", "DESC"]], // Get the most recent entry based on createdAt
    });

    if (!latestBlob) {
      return res.status(404).json({
        error: {
          message: "No data found for the given walletAddress and executionId.",
        },
      });
    }

    // Send the found blob data as the response
    res.status(200).json(latestBlob);
  } catch (error) {
    console.error("Error fetching latest blob:", error);
    res.status(500).json({
      error: {
        message: "Internal Server Error",
      },
    });
  }
});

module.exports = router;
