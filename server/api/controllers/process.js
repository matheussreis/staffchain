const mongoose = require('mongoose');
const Process = require('../models/process');
const User = require('../models/user');
const Request = require('../models/request');

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

const removeProcessFromUsers = async (processId) => {
  return User.updateMany(
    { 'processes._id': processId },
    { $pull: { processes: { _id: processId } } },
  ).exec();
};

const deleteProcess = async (processId) => {
  return Process.deleteOne({ _id: processId });
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
  return Process.find({})
    .populate([
      {
        path: 'requestTree.userId',
        select: {
          firstName: 1,
          lastName: 1,
          department: 1,
          role: 1,
        },
      },
      {
        path: 'requestTree.reportsTo',
        select: {
          firstName: 1,
          lastName: 1,
        },
      },
    ])
    .sort({ dateModified: -1 })
    .exec();
};

const findProcessById = async (id) => {
  return Process.findById(id)
    .populate([
      {
        path: 'requestTree.userId',
        select: {
          firstName: 1,
          lastName: 1,
          department: 1,
          role: 1,
        },
      },
      {
        path: 'requestTree.reportsTo',
        select: {
          firstName: 1,
          lastName: 1,
        },
      },
    ])
    .exec();
};

const findRequestNode = (requestTree, userId) => {
  return requestTree.find((node) => node.userId.equals(userId));
};

const findReportees = (requestTree, userId) => {
  return requestTree.filter(
    (node) =>
      node.reportsTo.equals(userId) &&
      !node.reportsTo.equals(node.userId),
  );
};

const reporteeExists = (requestTree, reportsTo) => {
  const reportee = requestTree.find((node) =>
    node.userId.equals(reportsTo),
  );

  return !!reportee;
};

const addNewFieldsToRequest = async (process) => {
  const requests = await Request.find({
    process: process._id,
  }).exec();

  const processFields = process.fieldSet.map(
    (field) => `${field._id}`,
  );

  for (const request of requests) {
    const requestModel = new Request(request);
    const requestFieldIds = request.fields.map(
      (field) => `${field.fieldSetId}`,
    );

    const newFieldIds = processFields.filter(
      (id) => !requestFieldIds.includes(id),
    );

    newFieldIds.forEach((fieldId) => {
      requestModel.fields.push({
        fieldSetId: fieldId,
        value: '',
      });
    });

    requestModel.dateModified = new Date();
    await requestModel.save();
  }
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
            required: field.required,
            type: field.type,
          })),
          requestTree: process.requestTree.map((item) => {
            return {
              id: item.userId._id,
              name: `${item.userId.firstName} ${item.userId.lastName}`,
              department: item.userId.department,
              role: item.userId.role,
              reportsTo: {
                id: item.reportsTo._id,
                name: `${item.reportsTo.firstName} ${item.reportsTo.lastName}`,
              },
            };
          }),
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
          required: field.required,
          type: field.type,
        })),
        requestTree: process.requestTree.map((item) => {
          return {
            id: item.userId._id,
            name: `${item.userId.firstName} ${item.userId.lastName}`,
            department: item.userId.department,
            role: item.userId.role,
            reportsTo: {
              id: item.reportsTo._id,
              name: `${item.reportsTo.firstName} ${item.reportsTo.lastName}`,
            },
          };
        }),
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

exports.update = async (req, res) => {
  try {
    const processId = new mongoose.Types.ObjectId(req.params.id);
    const processData = req.body;

    const process = await findProcessById(processId);
    if (!process) {
      res.status(404).json({
        title: 'Process Not Found',
        message: 'The process you are looking for does not exist.',
      });

      return;
    }

    const fieldSet = processData['fieldSet'];
    if (fieldSet && Array.isArray(fieldSet)) {
      for (const field of fieldSet) {
        if (
          !field?.type ||
          !field?.label ||
          typeof field?.required !== 'boolean'
        ) {
          return res.status(400).json({
            title: 'Fieldset Validation Error',
            message: 'Invalid field provided.',
          });
        }
      }

      process.fieldSet = fieldSet;
    }

    const requestTree = processData['requestTree'];
    if (requestTree && Array.isArray(requestTree)) {
      let rootCount = 0;
      for (const requestNode of requestTree) {
        // check if the userId and reports to are set
        if (!requestNode?.userId || !requestNode?.reportsTo) {
          return res.status(400).json({
            title: 'Request Tree Validation Error',
            message: 'Invalid request node provided.',
          });
        }

        const userId = new mongoose.Types.ObjectId(
          requestNode.userId,
        );
        const reportsTo = new mongoose.Types.ObjectId(
          requestNode.reportsTo,
        );

        const { requestTree } = process;
        if (!reporteeExists(requestTree, reportsTo)) {
          return res.status(400).json({
            title: 'Request Tree Validation Error',
            message: "The reportee doesn't exist.",
          });
        }

        const isNodeRoot = reportsTo.equals(userId);
        if (isNodeRoot) {
          rootCount += 1;
        }

        if (rootCount > 1) {
          return res.status(400).json({
            title: 'Request Tree Validation Error',
            message: 'The tree cannot have more than one root.',
          });
        }

        const storedNode = findRequestNode(requestTree, userId);
        if (storedNode) {
          const reportees = findReportees(requestTree, userId);
          if (reportees) {
            const nodeReportsToReportees = reportees.some(
              (reportee) => reportee.userId.equals(reportsTo),
            );

            if (nodeReportsToReportees) {
              return res.status(400).json({
                title: 'Request Tree Validation Error',
                message:
                  'Node cannot report to one of its reportees.',
              });
            }
          }
        }
      }

      process.requestTree = requestTree;
    }

    const name = processData['name'];
    if (name) {
      process.name = name;
    }

    const description = processData['description'];
    if (description) {
      process.description = description;
    }

    process.dateModified = new Date();
    const processModel = new Process(process);
    await processModel.save();

    await addNewFieldsToRequest(process);

    res.status(200).json({
      message: 'Process Updated Successfully!',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const processId = new mongoose.Types.ObjectId(req.params.id);
    await removeProcessFromUsers(processId);
    await deleteProcess(processId);
    // add logic to change the status of all the open requests
    // that were created from the deleted process.

    res.status(200).json({
      message: 'Process Deleted Successfully!',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
