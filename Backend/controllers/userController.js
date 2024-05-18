const User = require('../model/userModel.js');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if username is present in the database
    const usernameCheck = await User.findOne({ username });

    if (usernameCheck) {
      return res.json({ msg: 'Username is already taken', status: false });
    }

    // Check if email is present
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.json({ msg: 'User already exists', status: false });
    }

    // If everything is correct, then save the user in the database.
    // Generate hashedPassword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    delete user.password;

    return res.json({
      status: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if user exists or not
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ msg: 'Invalid credentials', status: false });
    }

    // If user exists, then check the password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.json({ msg: 'Invalid credentials', status: false });
    }
    delete user.password;

    return res.json({ status: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      {
        new: true,
      },
    );

    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    // Find all users other than the current user, hence the 'ne' not equal operator is used, such that current user is excluded

    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      'email',
      'username',
      'avatarImage',
      '_id',
    ]);

    return res.json(users);
  } catch (error) {
    next(error);
  }
};

// module.exports.logOut = (req, res, next) => {
//   try {
//     if (!req.params.id) return res.json({ message: 'User id is required ' });
//     onlineUsers.delete(req.params.id);
//     return res.status(200).send();
//   } catch (error) {
//     next(error);
//   }
// };