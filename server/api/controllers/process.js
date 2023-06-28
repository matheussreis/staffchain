const mongoose = require('mongoose');
const Process = require('../models/process');
const User = require('../models/user');

const assignProcessToUsersInTree = async (requestTree, processId) => {
  const users = requestTree.map(
    (user) => new mongoose.Types.ObjectId(user.userId),
  );

  users.forEach(async (userId) => {
    await User.findByIdAndUpdate(userId, {
      $push: { processes: processId },
    }).populate('processes');
  });
};

const createProcess = async (requestData) => {
  const { name, description, fieldSet, requestTree } = requestData;

  const process = new Process({
    _id: new mongoose.Types.ObjectId(),
    name: name,
    description: description,
    fieldSet: fieldSet,
    requestTree: requestTree,
  });

  await process.save();
  return process._id;
};

exports.add = async (req, res) => {
  try {
    const processId = await createProcess(req.body);
    await assignProcessToUsersInTree(req.body.requestTree, processId);

    res.status(200).json({
      message: 'Process created successfully!',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getRequestTreeByProcessId = async (processId) => {
  const process = await Process.findById(processId)
    .select('requestTree')
    .exec();

  if (!process.requestTree) {
    throw new Error('No request tree for the given process.');
  }

  return process.requestTree;
};
