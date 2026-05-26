import { Resend } from "resend";
import { registerEmail } from "./emailTemplates/registerEmail.js";
import { passwordChangeEmail } from "./emailTemplates/passwordChangeEmail.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendRegisterMail(email, username) {
    const { data, error } = await resend.emails.send({
        from: "PulseML.js <noreply@gorillahub.dk>",
        to: email,
        subject: "Welcome to PulseML.js",
        html: registerEmail(username),
    });

    if (error)
        throw new Error(`Failed to send registration email: ${error.message}`);
    return data;
}

export async function sendPasswordChangedMail(email, username) {
    const { data, error } = await resend.emails.send({
        from: "PulseML.js <noreply@gorillahub.dk>",
        to: email,
        subject: "Your password has been changed",
        html: passwordChangeEmail(username),
    });

    if (error)
        throw new Error(
            `Failed to send password changed email: ${error.message}`,
        );
    return data;
}
