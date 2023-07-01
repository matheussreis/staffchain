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
  return Process.find({}).sort({ dateModified: -1 }).exec();
};

const findProcessById = async (id) => {
  return Process.findById(id).exec();
};

const requestTreeHasRoot = (requestTree) => {
  const rootNode = requestTree.find(
    (node) => node.userId === node.reportsTo,
  );

  return !!rootNode;
};

const findRequestNode = (requestTree, userId) => {
  return requestTree.find((node) => node.userId === userId);
};

const findReportees = (requestTree, userId) => {
  return requestTree.filter(
    (node) =>
      node.reportsTo === userId && node.reportsTo !== node.userId,
  );
};

const reporteeExists = (requestTree, reportsTo) => {
  const reportee = requestTree.find(
    (node) => node.userId === reportsTo,
  );

  return !!reportee;
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
            reportsTo: item.reportsTo,
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
          reportsTo: item.reportsTo,
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
        if (!field?.id) {
          // === START === CHECK FIELD PARAMETERS, CREATE FIELD, AND APPEND IT TO THE FIELDSET ===
          if (!field?.type || !field?.label) {
            // return 400 error saying the fieldset object contains invalid values.
            return res.status(400).json({
              title: 'Fieldset Validation Error',
              message: 'Invalid field provided.',
            });
          } else {
            // create the field and append it to the fieldset
            process.fieldSet.push({
              type: field.type,
              label: field.label,
            });
          }
          // === END === CHECK FIELD PARAMETERS, CREATE FIELD, AND APPEND IT TO THE FIELDSET ===
        } else {
          // check field id, check field type and label and update the field values
          const storedField = process.fieldSet.find(
            (f) => f.id === field.id,
          );
          if (storedField) {
            // check field label and field type
            if (storedField.type !== field.type) {
              storedField.type = field.type;
            }

            if (storedField.label !== field.label) {
              storedField.label = field.label;
            }
          }
        }
      }
    }

    const requestTree = processData['requestTree'];
    if (requestTree && Array.isArray(requestTree)) {
      for (const requestNode of requestTree) {
        // check if the userId and reports to are set
        if (!requestNode?.userId || !requestNode?.reportsTo) {
          return res.status(400).json({
            title: 'Request Tree Validation Error',
            message: 'Invalid request node provided.',
          });
        } else {
          const { userId, reportsTo } = requestNode;
          const { requestTree } = process;

          // find the stored request node by the user id
          const storedNode = findRequestNode(requestTree, userId);

          if (!reporteeExists(requestTree, reportsTo)) {
            return res.status(400).json({
              title: 'Request Tree Validation Error',
              message: "The reportee doesn't exist.",
            });
          }

          // does the user in the node report to itself?
          const rootExists = requestTreeHasRoot(requestTree);
          const isNodeRoot = reportsTo === userId;
          if (rootExists && isNodeRoot) {
            return res.status(400).json({
              title: 'Request Tree Validation Error',
              message: 'The tree cannot have more than one root.',
            });
          }

          // If the given node exists, check if the given node reports to one of its reportees.
          if (storedNode) {
            // find the given node's reportees
            const reportees = findReportees(requestTree, userId);
            if (reportees) {
              const nodeReportsToReportees = reportees.some(
                (reportee) => reportee.userId === reportsTo,
              );

              // does the user in the node report to one of its reportees?
              if (nodeReportsToReportees) {
                return res.status(400).json({
                  title: 'Request Tree Validation Error',
                  message:
                    'Node cannot report to one of its reportees.',
                });
              }
            }

            storedNode.reportsTo = requestNode.reportsTo;
          } else {
            process.requestTree.push({
              userId: requestNode.userId,
              reportsTo: requestNode.reportsTo,
            });
          }
        }
      }
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
