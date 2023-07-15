const fs = require('fs');
const mongoose = require('mongoose');
const Request = require('../models/request');
const {
  getRequestTreeByProcessId,
  getfieldsByProcessId,
} = require('./process');
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
  {
    path: 'timeline.author',
    select: {
      firstName: 1,
      lastName: 1,
    },
  },
];

const ACTION_TEXT = {
  CREATE: 'created the request',
  UPDATE: 'updated the form',
  APPROVE: 'approved the request',
  MOREINFO: 'asked for more information',
  CLOSE: 'closed the request',
  RESEND: 'resent the request for approval',
  COMMENT: 'added a comment',
  COMPLETE: 'completed the request',
};

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

const INVALID_FIELD_RESPONSE = {
  title: 'Invalid Field',
  message: "The field you are trying to update doesn't exist.",
};

const createRequest = async (requestData) => {
  const { processId, fields, currentUserId, requestId } = requestData;
  const processFields = await getfieldsByProcessId(processId);

  const fieldsToCreate = [];
  for (const field of processFields) {
    let newFieldValue = fields[field.id];
    if (!newFieldValue && field.required) {
      throw new Error('Required Field Missing.');
    }

    if (field.type === 'file') {
      newFieldValue = newFieldValue[0]?.filename ?? '';
    }

    fieldsToCreate.push({
      fieldSetId: field.id,
      value: newFieldValue,
    });
  }

  const requestTree = await getRequestTreeByProcessId(processId);
  const starterNode = requestTree.find((requestNode) =>
    requestNode.userId.equals(currentUserId),
  );

  if (!starterNode) {
    throw new Error(
      'User cannot create an instance of this process.',
    );
  }

  const isStarterUserRoot = starterNode.reportsTo.equals(
    starterNode.userId,
  );

  const reviewer = isStarterUserRoot
    ? currentUserId
    : starterNode.reportsTo;

  const request = new Request({
    _id: requestId,
    process: new mongoose.Types.ObjectId(processId),
    starter: new mongoose.Types.ObjectId(currentUserId),
    reviewer: new mongoose.Types.ObjectId(reviewer),
    fields: fieldsToCreate,
    status: isStarterUserRoot ? 'done' : 'in-progress',
  });

  await request.save();
  return request.id;
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
    processId: request.process.id,
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
    timeline: request.timeline
      ? request.timeline
          .map((event) => ({
            id: event.id,
            author: {
              id: event.author.id,
              name: `${event.author.firstName || ''} ${
                event.author.lastName || ''
              }`,
            },
            date: event.date,
            action: event.action,
          }))
          .sort((a, b) => a.order - b.order)
      : [],
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

const removeUploadedFiles = (requestId) => {
  const folderPath = `uploads/${requestId}`;

  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true });
  }
};

const addTimelineEvent = async (timelineData) => {
  const { requestId, authorId, action } = timelineData;
  const request = await findRequestById(requestId);

  if (!request) {
    throw new Error(REQUEST_NOT_FOUND_RESPONSE.title);
  }

  const timeline = request.timeline;
  const eventOrder =
    request.timeline.length === 0 ? 0 : request.timeline.length;

  timeline.push({
    author: authorId,
    date: new Date(),
    action: action,
    order: eventOrder,
  });

  await Request.updateOne(
    { _id: requestId },
    { $set: { timeline: timeline } },
  );
};

const addComment = async (requestModel, data) => {
  requestModel.comments.push({
    authorId: `${data.authorId}`,
    comment: data.comment,
    publishDate: data.publishDate || new Date(),
  });

  await requestModel.save();

  await addTimelineEvent({
    requestId: requestModel.id,
    authorId: data.authorId,
    action: ACTION_TEXT.COMMENT,
  });
};

exports.add = async (req, res) => {
  try {
    const processId = req.params.processId;
    const fields = { ...req.body, ...req.files };
    const currentUserId = new mongoose.Types.ObjectId(
      req.userData.userId,
    );

    const requestId = await createRequest({
      processId,
      fields,
      currentUserId,
      requestId: req.requestId,
    });

    await addTimelineEvent({
      requestId: requestId,
      authorId: currentUserId,
      action: ACTION_TEXT.CREATE,
    });

    res.status(200).json({
      message: 'Request created successfully!',
    });
  } catch (error) {
    removeUploadedFiles(req.requestId);

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
      requests: requests
        .map((request) => getRequestResponse(request))
        .sort((a, b) => {
          const statusOrder = {
            'in-progress': 0,
            'waiting-for-review': 1,
            closed: 2,
            done: 3,
          };
          return statusOrder[a.status] - statusOrder[b.status];
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
    const currentUserId = req.userData.userId;
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

    await addTimelineEvent({
      requestId: requestId,
      authorId: currentUserId,
      action: ACTION_TEXT.UPDATE,
    });

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
    const currentUserId = req.userData.userId;
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

    const isStarterReSendingRequest = request.starter.equals(
      request.reviewer,
    );

    const requestModel = new Request(request);
    if (reviewerNode.reportsTo.equals(reviewer)) {
      requestModel.status = 'done';
    } else {
      requestModel.reviewer = reviewerNode.reportsTo;
      requestModel.status = 'in-progress';
    }

    requestModel.dateModified = new Date();
    await requestModel.save();

    const action = isStarterReSendingRequest
      ? ACTION_TEXT.RESEND
      : ACTION_TEXT.APPROVE;

    await addTimelineEvent({
      requestId: requestId,
      authorId: currentUserId,
      action: action,
    });

    if (requestModel.status === 'done') {
      await addTimelineEvent({
        requestId: requestId,
        authorId: currentUserId,
        action: ACTION_TEXT.COMPLETE,
      });
    }

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
    const reason = requestData?.reason || undefined;

    const request = await Request.findById(requestId).populate({
      path: 'process',
      select: { requestTree: 1 },
    });

    if (!request) {
      return res.status(404).json(REQUEST_NOT_FOUND_RESPONSE);
    }

    const requestModel = new Request(request);

    if (reason) {
      await addComment(requestModel, {
        authorId: currentUserId,
        comment: reason,
      });
    }

    requestModel.reviewer = requestModel.starter;
    requestModel.status = 'waiting-for-info';
    requestModel.dateModified = new Date();
    await requestModel.save();

    await addTimelineEvent({
      requestId: requestId,
      authorId: currentUserId,
      action: ACTION_TEXT.MOREINFO,
    });

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
      await addComment(requestModel, {
        authorId: currentUserId,
        comment: reason,
      });
    }

    requestModel.status = 'closed';
    requestModel.dateModified = new Date();
    await requestModel.save();

    await addTimelineEvent({
      requestId: requestId,
      authorId: currentUserId,
      action: ACTION_TEXT.CLOSE,
    });

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
    const currentUserId = req.userData.userId;
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
    await addComment(requestModel, {
      authorId: currentUserId,
      comment: comment,
      publishDate: publishDate,
    });

    res.status(200).json({
      message: 'Comment Added Successfully!',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
