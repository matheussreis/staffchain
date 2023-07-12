const fs = require('fs');
const mongoose = require('mongoose');
const Request = require('../models/request');
const { getRequestTreeByProcessId } = require('./process');
const { userExists } = require('./user');
const path = require('path');

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
  {
    path: 'comments.authorId',
    select: {
      firstName: 1,
      lastName: 1,
      department: 1,
      role: 1,
    },
  },
];

const REQUEST_NOT_FOUND_RESPONSE = {
  title: 'Request Not Found',
  message: 'The request you are looking for does not exist.',
};

const AUTHOR_NOT_FOUND_RESPONSE = {
  title: 'Author Not Found',
  message: 'The provided author does not exist.',
};

const INVALID_COMMENT_FIELDS_REPONSE = {
  title: 'Comment Validation Error',
  message: 'Invalid comment field provided.',
};

const FILE_NOT_FOUND_RESPONSE = {
  title: 'File not Found',
  message: 'The file you are looking for does not exist.',
};

const INVALID_FIELD_RESPONSE = {
  title: 'Invalid Field',
  message: "The field you are trying to update doesn't exist.",
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
    comments: request.comments
      .map((comment) => ({
        id: comment.id,
        author: {
          id: comment.authorId.id,
          name: `${comment.authorId.firstName} ${comment.authorId.lastName}`,
          department: comment.authorId.department,
          role: comment.authorId.role,
        },
        comment: comment.comment,
        publishDate: comment.publishDate,
      }))
      .sort(
        (a, b) => new Date(b.publishDate) - new Date(a.publishDate),
      ),
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

const getReviewerNode = (reviewer, requestTree) => {
  return requestTree.find(
    (node) => `${node.userId}` === `${reviewer}`,
  );
};

const getPreviousReviewerNode = (reviewer, requestTree) => {
  return requestTree.find(
    (node) => `${node.reportsTo}` === `${reviewer}`,
  );
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

exports.updateFields = async (req, res) => {
  try {
    const requestId = new mongoose.Types.ObjectId(req.params.id);
    const requestData = { ...req.body, ...req.files };

    const request = await findRequestById(requestId);
    if (!request) {
      return res.status(404).json(REQUEST_NOT_FOUND_RESPONSE);
    }

    const fieldsIds = request.fields.reduce(
      (previous, current, index) => ({
        ...previous,
        [current.fieldSetId]: { index: index },
      }),
      {},
    );

    const requestModel = new Request(request);
    for (const field in requestData) {
      const fieldId = fieldsIds[field];
      if (!fieldId) {
        return res.status(400).json(INVALID_FIELD_RESPONSE);
      }

      const fieldDefinition = request.process.fieldSet.find(
        (item) => item.id === field,
      );

      let value = requestData[field];

      if (fieldDefinition.type === 'file') {
        const isString = typeof value === 'string';
        const currentFile = isString ? value : value[0]?.filename;
        const previousFile = request.fields[fieldId.index].value;

        if (isString && currentFile === '' && previousFile !== '') {
          fs.unlinkSync(`uploads/${field}/${previousFile}`);
        } else if (!isString && currentFile && previousFile !== '') {
          const currentExtension = path.extname(currentFile);
          const previousExtension = path.extname(previousFile);
          if (currentExtension !== previousExtension) {
            fs.unlinkSync(`uploads/${field}/${previousFile}`);
          }
        }
      }

      if (Array.isArray(value)) {
        value = requestData[field][0]?.originalname;
      }

      requestModel.fields[fieldId.index].value = value;
    }

    requestModel.dateModified = new Date();
    await requestModel.save();

    res.status(200).json({
      message: 'Request Updated Successfully!',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.approve = async (req, res) => {
  try {
    const requestId = new mongoose.Types.ObjectId(req.params.id);
    const request = await Request.findById(requestId).populate({
      path: 'process',
      select: { requestTree: 1 },
    });

    if (!request) {
      return res.status(404).json(REQUEST_NOT_FOUND_RESPONSE);
    }

    const reviewer = request.reviewer;
    const requestTree = request.process.requestTree;
    const reviewerNode = getReviewerNode(reviewer, requestTree);

    const requestModel = new Request(request);
    if (reviewerNode.reportsTo.equals(reviewer)) {
      requestModel.status = 'done';
    } else {
      requestModel.reviewer = reviewerNode.reportsTo;
      requestModel.status = 'in-progress';
    }

    requestModel.dateModified = new Date();
    await requestModel.save();
    res.status(200).json({
      message: 'Request Updated Successfully!',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.moreInfo = async (req, res) => {
  try {
    const currentUserId = req.userData.userId;
    const requestId = new mongoose.Types.ObjectId(req.params.id);
    const requestData = req.body;
    const askStarter = requestData?.askStarter || false;
    const reason = requestData?.reason || undefined;

    const request = await Request.findById(requestId).populate({
      path: 'process',
      select: { requestTree: 1 },
    });

    if (!request) {
      return res.status(404).json(REQUEST_NOT_FOUND_RESPONSE);
    }

    const reviewerNode = getPreviousReviewerNode(
      request.reviewer,
      request.process.requestTree,
    );

    const requestModel = new Request(request);

    if (reason) {
      requestModel.comments.push({
        authorId: `${currentUserId}`,
        comment: reason,
      });
    }

    if (askStarter) {
      requestModel.reviewer = requestModel.starter;
    } else {
      requestModel.reviewer = reviewerNode.userId;
    }

    requestModel.status = 'waiting-for-info';
    requestModel.dateModified = new Date();
    await requestModel.save();
    res.status(200).json({
      message: 'Request Updated Successfully!',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.close = async (req, res) => {
  try {
    const currentUserId = req.userData.userId;
    const requestId = new mongoose.Types.ObjectId(req.params.id);
    const reason = req.body?.reason || undefined;

    const request = await Request.findById(requestId).populate({
      path: 'process',
      select: { requestTree: 1 },
    });

    if (!request) {
      return res.status(404).json(REQUEST_NOT_FOUND_RESPONSE);
    }

    const requestModel = new Request(request);

    if (reason) {
      requestModel.comments.push({
        authorId: currentUserId,
        comment: reason,
      });
    }

    requestModel.status = 'closed';
    requestModel.dateModified = new Date();
    await requestModel.save();
    res.status(200).json({
      message: 'Request Updated Successfully!',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.addComment = async (req, res) => {
  try {
    const requestId = new mongoose.Types.ObjectId(req.params.id);

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json(REQUEST_NOT_FOUND_RESPONSE);
    }

    const authorId = new mongoose.Types.ObjectId(req.body.authorId);
    if (userExists(authorId) === false) {
      return res.status(404).json(AUTHOR_NOT_FOUND_RESPONSE);
    }

    const comment = req.body.comment;
    const publishDate = req.body.publishDate;
    if (!comment || !publishDate) {
      return res.status(400).json(INVALID_COMMENT_FIELDS_REPONSE);
    }

    const requestModel = new Request(request);
    requestModel.comments.push({
      authorId: authorId,
      comment: comment,
      publishDate: publishDate,
    });

    await requestModel.save();
    res.status(200).json({
      message: 'Comment Added Successfully!',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
