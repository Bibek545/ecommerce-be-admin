import { emailTransporter } from "./transport.js";
import { userActivationTemplate } from "./emailTemplates.js";

export const userActivationEmail = async (obj) => {
    const transport = emailTransporter();
    const info = await transport.sendMail(userActivationTemplate(obj));
    console.log(info.messageId);
    return info.messageId;
    
};