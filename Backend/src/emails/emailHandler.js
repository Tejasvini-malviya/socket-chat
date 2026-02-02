const { resendClient, sender } = require("../lib/resend.js");
const { emailTemplate } = require("./emailTemplate.js");

const sendWelcomeEmail = async (email, name, clientURL) => {
  try {
    const { data, error } = await resendClient.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to: email,
      subject: "Welcome to Socket Chat",
      html: emailTemplate(name, clientURL),
    });

    if (error) {
      console.error("Error sending welcome email:", error);
      return { success: false, error };
    }

    console.log("Welcome email sent successfully to:", email);
    return { success: true, data };
  } catch (error) {
    console.error("Error in sendWelcomeEmail:", error.message);
    throw error;
  }
};

module.exports = { sendWelcomeEmail };
