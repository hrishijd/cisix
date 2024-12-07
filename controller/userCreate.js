const bcrypt = require("bcrypt");
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

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      fullName,
      email,
      walletAddress,
      role,
      password: hashedPassword,
    });

    // Return the created user (excluding the password)
    const { password: _, ...userWithoutPassword } = user.toJSON();
    return res.status(201).send(userWithoutPassword);
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).send("An error occurred while registering the user");
  }
};

module.exports = registerUser;
