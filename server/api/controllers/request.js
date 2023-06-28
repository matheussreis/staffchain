const mongoose = require('mongoose');
const Request = require('../models/request');
const { getRequestTreeByProcessId } = require('./process');

const createRequest = async (requestData) => {
  const { processId, starterId, fieldSet } = requestData;

  if (!Array.isArray(fieldSet)) {
    throw new Error('Field set must be an array.');
  }

  const requestTree = await getRequestTreeByProcessId(processId);
  const starterNode = requestTree.find(
    (requestLeaf) => requestLeaf.userId === starterId,
  );

  const userHasNoBoss = starterNode.reportsTo === '';
  const reviewer = userHasNoBoss ? starterId : starterNode.reportsTo;
  const status = userHasNoBoss ? 'approved' : 'to-do';

  const request = new Request({
    _id: new mongoose.Types.ObjectId(),
    process: new mongoose.Types.ObjectId(processId),
    starter: new mongoose.Types.ObjectId(starterId),
    reviewer: new mongoose.Types.ObjectId(reviewer),
    fieldSet: fieldSet,
    status: status,
  });

  await request.save();
};

exports.add = async (req, res) => {
  try {
    await createRequest(req.body);

    res.status(200).json({
      message: 'Request created successfully!',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
