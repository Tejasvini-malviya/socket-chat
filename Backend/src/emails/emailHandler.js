import { resendClient, sender } from "../lib/resend.js";
import { emailTemplate } from "./emailTemplate.js"; 

export const sendWelcomeEmail = async (email, name, clientURL) => {
  try {
    const { data, error } = await resendClient.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to: email,
      subject: "Welcome to My Chat App",
      html: emailTemplate(name,clientURL),
    });

    if (error) {
      console.error("Error sending welcome email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in sendWelcomeEmail:", error);
    throw error;
  }
};
