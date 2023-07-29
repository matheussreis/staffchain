const emailjs = require('@emailjs/nodejs');

const {
  CLIENT_URL,
  EMAILJS_PUBLIC_KEY,
  EMAILJS_PRIVATE_KEY,
  EMAIL_JS_SERVICE_ID,
  EMAIL_JS_REQUEST_TO_REVIEW_TEMPLATE_ID,
  EMAIL_JS_REQUEST_STATUS_CHANGE_TEMPLATE_ID,
} = process.env;

const sendEmail = async (templateId, templateParams) => {
  emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY,
    privateKey: EMAILJS_PRIVATE_KEY,
  });

  return emailjs.send(
    EMAIL_JS_SERVICE_ID,
    templateId,
    templateParams,
  );
};

const sendRequestToReviewEmail = async (templateParams) => {
  return sendEmail.call(
    this,
    EMAIL_JS_REQUEST_TO_REVIEW_TEMPLATE_ID,
    templateParams,
  );
};

const sendRequestStatusChangeEmail = async (templateParams) => {
  return sendEmail.call(
    this,
    EMAIL_JS_REQUEST_STATUS_CHANGE_TEMPLATE_ID,
    templateParams,
  );
};

exports.notifyRequestToReview = async (emailData) => {
  const { toEmail, toName, requestId } = emailData;
  return sendRequestToReviewEmail({
    to_email: toEmail,
    to_name: toName,
    request_url: `${CLIENT_URL}/request/${requestId}`,
  });
};

exports.notifyMoreInfoRequest = async (emailData) => {
  const { toEmail, toName, requestId } = emailData;
  return sendRequestStatusChangeEmail({
    to_email: toEmail,
    to_name: toName,
    request_url: `${CLIENT_URL}/request/${requestId}`,
    subject: 'Request Needs More Information',
    message:
      'Your request has been reviewed, and one of the reviewers would like you to add more details.',
  });
};

exports.notifyCloseRequest = async (emailData) => {
  const { toEmail, toName, requestId } = emailData;
  return sendRequestStatusChangeEmail({
    to_email: toEmail,
    to_name: toName,
    request_url: `${CLIENT_URL}/request/${requestId}`,
    subject: 'Request Closed',
    message: 'One of the reviewers closed your request.',
  });
};

exports.notifyDoneRequest = async (emailData) => {
  const { toEmail, toName, requestId } = emailData;
  return sendRequestStatusChangeEmail({
    to_email: toEmail,
    to_name: toName,
    request_url: `${CLIENT_URL}/request/${requestId}`,
    subject: 'Request Approved',
    message: 'Your request has been approved by the reviewers.',
  });
};
