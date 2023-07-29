const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const Process = require('../models/process');
const Request = require('../models/request');

const REQUEST_POPULATE_OPTIONS = [
  {
    path: 'starter',
    select: {
      firstName: 1,
      lastName: 1,
    },
  },
  {
    path: 'reviewer',
    select: {
      firstName: 1,
      lastName: 1,
    },
  },
  {
    path: 'process',
    select: {
      name: 1,
      description: 1,
      fieldSet: 1,
    },
  },
];

const findUserByEmail = async (email) => {
  return User.find({ email: email }).exec();
};

const findAllUsers = async () => {
  return User.find({}).sort({ dateModified: -1 }).exec();
};

const findUserById = async (id) => {
  return User.findById(id).exec();
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
    phone,
    password,
    role,
    department,
    isAdmin,
  } = userData;

  const hashedPassword = await hashPassword(password);

  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    firstName: firstName,
    lastName: lastName,
    birthdate: new Date(birthdate),
    email: email,
    phone: phone,
    password: hashedPassword,
    department: department,
    role: role,
  });

  user.isAdmin ??= isAdmin;
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

const findUserProcesses = async (id, limit) => {
  return Process.find({
    requestTree: {
      $elemMatch: {
        userId: id,
      },
    },
  })
    .limit(limit)
    .select('id name description fieldSet')
    .sort({ dateModified: -1 })
    .exec();
};

const findUserStartedRequests = async (userId, limit) => {
  return Request.find({
    starter: userId,
  })
    .limit(limit)
    .populate(REQUEST_POPULATE_OPTIONS)
    .select('status starter reviewer process')
    .sort({ dateModified: -1 })
    .exec();
};

const findUserRequestsToReview = async (userId, limit) => {
  return Request.find({
    reviewer: userId,
    status: { $in: ['in-progress', 'waiting-for-info'] },
  })
    .limit(limit)
    .populate(REQUEST_POPULATE_OPTIONS)
    .select('status starter reviewer process')
    .sort({ dateModified: -1 })
    .exec();
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
      phone: req.body.phone,
      password: req.body.password,
      department: req.body.department,
      role: req.body.role,
      isAdmin: req.body.isAdmin,
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
          firstName: user.firstName,
          lastName: user.lastName,
          birthdate: user.birthdate.toISOString().substring(0, 10),
          phone: user.phone,
          email: user.email,
          department: user.department,
          role: user.role,
          isAdmin: user.isAdmin,
        };
      }),
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.get = async (req, res) => {
  try {
    const id = req.params.id ?? req.userData.userId;
    const userId = new mongoose.Types.ObjectId(id);
    const user = await findUserById(userId);

    if (user) {
      res.status(200).json({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        birthdate: user.birthdate.toISOString().substring(0, 10),
        email: user.email,
        phone: user.phone,
        department: user.department,
        role: user.role,
        isAdmin: user.isAdmin,
      });

      return;
    }

    res.status(404).json({
      title: 'User Not Found',
      message: 'The user you are looking for does not exist.',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.id);
    const userData = req.body;

    for (const field in userData) {
      if (field === 'id' || field === '_id') {
        delete userData[field];
      } else if (
        typeof userData[field] !== 'boolean' &&
        !userData[field]
      ) {
        delete userData[field];
      } else if (field === 'password') {
        userData[field] = await hashPassword(userData[field]);
      }
    }

    if (Object.keys(userData).length < 1) {
      return res.status(200).json({
        message: 'User updated successfully.',
      });
    }

    userData.dateModified = new Date();

    const user = await User.findByIdAndUpdate(userId, userData, {
      new: true,
    });

    if (user) {
      return res.status(200).json({
        message: 'User updated successfully.',
      });
    }

    res.status(404).json({
      message: 'User not found.',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.id);
    await User.deleteOne({ _id: userId }).exec();

    res.status(200).json({
      message: 'User deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.userExists = async (userId) => {
  const user = await findUserById(userId);
  return !!user;
};

exports.availableProcesses = async (req, res) => {
  try {
    const limit = req.query?.limit || undefined;
    const userId = new mongoose.Types.ObjectId(req.userData.userId);
    const processes = await findUserProcesses(userId, limit);

    res.status(200).json({
      count: processes.length,
      processes: processes.map((process) => ({
        id: process.id,
        name: process.name,
        description: process.description,
        fields: process.fieldSet
          ? process.fieldSet.map((field) => ({
              id: field._id,
              label: field.label,
              required: field.required,
              type: field.type,
            }))
          : [],
      })),
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.startedRequests = async (req, res) => {
  try {
    const limit = req.query?.limit || undefined;
    const userId = new mongoose.Types.ObjectId(req.userData.userId);
    const requests = await findUserStartedRequests(userId, limit);

    res.status(200).json({
      count: requests.length,
      requests: requests.map((request) => ({
        id: request.id,
        name: request.process.name,
        description: request.process.description,
        status: request.status,
        starter: {
          id: request.starter.id,
          name: `${request.starter.firstName} ${request.starter.lastName}`,
        },
        reviewer: {
          id: request.reviewer.id,
          name: `${request.reviewer.firstName} ${request.reviewer.lastName}`,
        },
      })),
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.requestsToReview = async (req, res) => {
  try {
    const limit = req.query?.limit || undefined;
    const userId = new mongoose.Types.ObjectId(req.userData.userId);
    const requests = await findUserRequestsToReview(userId, limit);

    res.status(200).json({
      count: requests.length,
      requests: requests.map((request) => ({
        id: request.id,
        name: request.process.name,
        status: request.status,
        description: request.process.description,
        starter: {
          id: request.starter.id,
          name: `${request.starter.firstName} ${request.starter.lastName}`,
        },
        reviewer: {
          id: request.reviewer.id,
          name: `${request.reviewer.firstName} ${request.reviewer.lastName}`,
        },
      })),
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getUserDetailsById = async (id) => {
  return User.findById(id).select('firstName lastName email').exec();
};
