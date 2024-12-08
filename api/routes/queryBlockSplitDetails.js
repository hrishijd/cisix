const express = require("express");
const router = express.Router();
const blobs = require("../../models/blobs");
const { Sequelize } = require("sequelize");

// Route to get all blobs within a block range for walletAddress and executionId
router.get("/blocksplit", async (req, res) => {
  try {
    const { userWallet, executionId, blockStart, blockEnd } = req.query;

    if (!userWallet || !executionId || !blockStart || !blockEnd) {
      return res.status(400).json({
        error: {
          message:
            "userWallet, executionId, blockStart, and blockEnd are required.",
        },
      });
    }

    // Convert blockStart and blockEnd to integers, assuming they are numeric strings
    const blockStartInt = parseInt(blockStart, 10);
    const blockEndInt = parseInt(blockEnd, 10);

    if (isNaN(blockStartInt) || isNaN(blockEndInt)) {
      return res.status(400).json({
        error: {
          message: "blockStart and blockEnd must be valid numbers.",
        },
      });
    }

    // Fetch all blobs for the given walletAddress and executionId within the block range
    const blobsInRange = await blobs.findAll({
      where: {
        walletAddress: userWallet,
        executionId: executionId,
        BlockNo: {
          [Sequelize.Op.gte]: blockStartInt,
          [Sequelize.Op.lte]: blockEndInt,
        },
      },
      order: [["createdAt", "ASC"]], // Order by createdAt if needed
    });

    if (blobsInRange.length === 0) {
      return res.status(404).json({
        error: {
          message: "No blobs found within the given block range.",
        },
      });
    }

    // Send the found blobs as the response
    res.status(200).json(blobsInRange);
  } catch (error) {
    console.error("Error fetching blobs within block range:", error);
    res.status(500).json({
      error: {
        message: "Internal Server Error",
      },
    });
  }
});

module.exports = router;
