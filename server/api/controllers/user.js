const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');

const findUserByEmail = async (email) => {
  return User.find({ email: email }).exec();
};

const findAllUsers = async () => {
  return User.find({}).exec();
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const createUser = async (userData) => {
  const {
    firstName,
    lastName,
    birthdate,
    email,
    password,
    type,
    role,
    department,
  } = userData;

  const hashedPassword = await hashPassword(password);

  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    firstName: firstName,
    lastName: lastName,
    birthdate: new Date(birthdate),
    email: email,
    password: hashedPassword,
    department: department,
    role: role,
  });

  user.type ??= type;
  await user.save();
};

const getSignedToken = (userId, userEmail) => {
  const { JWT_SECRET, JWT_TOKEN_DURATION } = process.env;

  const token = jwt.sign(
    {
      email: userEmail,
      userId: userId,
    },
    JWT_SECRET,
    { expiresIn: `${JWT_TOKEN_DURATION || 10}h` },
  );

  return token;
};

exports.signup = async (req, res) => {
  try {
    const users = await findUserByEmail(req.body.email);

    if (users.length > 0) {
      res.status(409).json({
        message: 'Account already exists.',
      });

      return;
    }

    await createUser({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      birthdate: req.body.birthdate,
      email: req.body.email,
      password: req.body.password,
      department: req.body.department,
      role: req.body.role,
      type: req.body.type,
    });

    res.status(201).json({
      mesage: 'User created successfully!',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const users = await findUserByEmail(req.body.email);

    if (users.length < 1) {
      res.status(401).json({
        message: 'Please, ensure your credentials are correct.',
      });

      return;
    }

    const passwordDidMatch = await bcrypt.compare(
      req.body.password,
      users[0].password,
    );

    if (passwordDidMatch) {
      const token = getSignedToken(users[0]._id, users[0].email);
      res.status(200).json({
        mesage: 'Auth successful',
        token: token,
      });

      return;
    }

    res.status(401).json({
      message: 'Please, ensure your credentials are correct.',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const users = await findAllUsers();

    res.status(200).json({
      count: users.length,
      users: users.map((user) => {
        return {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          bithdate: user.birthdate,
          email: user.email,
          department: user.department,
          role: user.role,
          type: user.type,
          processes: user.processes.map((process) => process._id),
        };
      }),
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
