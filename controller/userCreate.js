const User = require("../models/RegistrationData");

const registerUser = async (req, res) => {
  try {
    const { fwalletAddress } = req.body;

    // Validate the input data
    if (!walletAddress) {
      return res.status(400).send("Wallet Address field is required");
    }

    // Check if the user already exists
    const exist = await User.findOne({ where: { walletAddress } });
    if (exist) {
      return res.status(409).send("User already exists");
    }

    // Create the user
    const user = await User.create({
      walletAddress,
    });

    // Return the created user (excluding the password)
    return {
      success: true,
      message: "User Created Successfully",
      data: user,
    };
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).send("An error occurred while registering the user");
  }
};

module.exports = registerUser;
