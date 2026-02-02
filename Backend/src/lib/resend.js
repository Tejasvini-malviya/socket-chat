const { Resend } = require("resend");
const env = require("./env.js");

const resendClient = new Resend(env.RESEND_API_KEY);

const sender = {
  email: env.EMAIL_FROM,
  name: env.EMAIL_FROM_NAME,
};

module.exports = { resendClient, sender };
