const User = require('../models/RegistrationData');

const registerUser = async (req, res) => {
  try {
    const exist = await User.findAll({ where: { email: req.body.fullName } });
    if (exist.length === 0) {
      const data = {
        fullName: req.body.fullName,
        email: req.body.email,
        role: req.body.role,
      };
      const user = await User.create(data);
      if (user) {
        return res.status(201).send(user);
      }
    } else {
      res.status(401).send('User already exists');
    }
    return res.status(409).send('Details are not correct');
  } catch (error) {
    console.log(error);
  }
};

module.exports = registerUser;