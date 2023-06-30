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

const findAllProcesses = async () => {
  return Process.find({}).sort({ dateModified: -1 }).exec();
};

const findProcessById = async (id) => {
  return Process.findById(id).exec();
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

exports.getAll = async (req, res) => {
  try {
    const processes = await findAllProcesses();

    res.status(200).json({
      count: processes.length,
      processes: processes.map((process) => {
        return {
          id: process._id,
          name: process.name,
          description: process.description,
          fieldSet: process.fieldSet.map((field) => ({
            id: field._id,
            label: field.label,
            type: field.type,
          })),
          requestTree: process.requestTree.map((item) => ({
            userId: item.userId,
            reportsToId: item.reportsTo,
          })),
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
    const processId = new mongoose.Types.ObjectId(req.params.id);
    const process = await findProcessById(processId);

    if (process) {
      res.status(200).json({
        id: process._id,
        name: process.name,
        description: process.description,
        fieldSet: process.fieldSet.map((field) => ({
          id: field._id,
          label: field.label,
          type: field.type,
        })),
        requestTree: process.requestTree.map((item) => ({
          userId: item.userId,
          reportsToId: item.reportsTo,
        })),
      });

      return;
    }

    res.status(404).json({
      title: 'Process Not Found',
      message: 'The process you are looking for does not exist.',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
