const mongoose = require('mongoose');
const Request = require('../models/request');
const { getRequestTreeByProcessId } = require('./process');

const POPULATE_OPTIONS = [
  {
    path: 'starter',
    select: {
      firstName: 1,
      lastName: 1,
      department: 1,
      role: 1,
    },
  },
  {
    path: 'reviewer',
    select: {
      firstName: 1,
      lastName: 1,
      department: 1,
      role: 1,
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

const REQUEST_NOT_FOUND_RESPONSE = {
  title: 'Request Not Found',
  message: 'The request you are looking for does not exist.',
};

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
  const status = userHasNoBoss ? 'approved' : 'in-progress';

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

const findAllRequests = async () => {
  return Request.find({})
    .populate(POPULATE_OPTIONS)
    .sort({ dateModified: -1 })
    .exec();
};

const findRequestById = async (id) => {
  return Request.findById(id).populate(POPULATE_OPTIONS).exec();
};

const getRequestResponse = (request) => {
  return {
    id: request.id,
    name: request.process.name,
    description: request.process.description,
    status: request.status,
    comments: request.comments.map((comment) => ({
      authorId: comment.authorId,
      comment: comment.comment,
    })),
    fields: request.process.fieldSet.map((field) => ({
      id: field._id,
      label: field.label,
      required: field.required,
      type: field.type,
      value:
        request.fields.find((f) => f.fieldSetId.equals(field._id))
          ?.value || '',
    })),
    reviewer: {
      id: request.reviewer._id,
      name: `${request.reviewer.firstName} ${request.reviewer.lastName}`,
      department: request.reviewer.department,
      role: request.reviewer.role,
    },
    starter: {
      id: request.starter._id,
      name: `${request.starter.firstName} ${request.starter.lastName}`,
      department: request.starter.department,
      role: request.starter.role,
    },
  };
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

exports.getAll = async (req, res) => {
  try {
    const requests = await findAllRequests();

    res.status(200).json({
      count: requests.length,
      requests: requests.map((request) =>
        getRequestResponse(request),
      ),
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.get = async (req, res) => {
  try {
    const requestId = new mongoose.Types.ObjectId(req.params.id);
    const request = await findRequestById(requestId);
    const requestResponse = getRequestResponse(request);
    res.status(200).json(requestResponse);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getfieldsByRequestId = async (id) => {
  const request = await Request.findById(id, 'process').populate({
    path: 'process',
    select: { fieldSet: 1 },
  });

  if (!request) {
    throw new Error(REQUEST_NOT_FOUND_RESPONSE.title);
  }

  return request.process.fieldSet.map((field) => ({
    id: field.id,
    type: field.type,
  }));
};
