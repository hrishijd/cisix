const User = require("../models/RegistrationData");

const registerUser = async (req, res) => {
  try {
    const { fullName, email, walletAddress, role, password } = req.body;

    // Validate the input data
    if (!fullName || !email || !walletAddress || !role || !password) {
      return res.status(400).send("All fields are required");
    }

    // Check if the user already exists
    const exist = await User.findOne({ where: { email } });
    if (exist) {
      return res.status(409).send("User already exists");
    }

    // Create the user
    const user = await User.create({
      fullName,
      email,
      walletAddress,
      role,
      password: hashedPassword,
    });

    // Return the created user (excluding the password)
    return res.status(201).send("User Created");
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).send("An error occurred while registering the user");
  }
};

module.exports = registerUser;
