import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

export enum EMAIL_TYPE {
  FORGOT_PASSWORD = "forgotPassword",
  VERIFY_EMAIL = "verifyEmail",
}

export const sendEmail = async ({
  email,
  emailType,
  userId,
  name,
  domain,
}: {
  email: string;
  emailType: EMAIL_TYPE;
  userId: string;
  name: string;
  domain: string;
}) => {
  try {
    if (!emailType) {
      throw new Error("Email type is required");
    }

    if (!userId) {
      throw new Error("User Id is required");
    }

    if (!email) {
      throw new Error("Email is required");
    }

    if (!name) {
      throw new Error("Name is required");
    }

    if (!domain) {
      throw new Error("Domain is required");
    }

    const isForgotPassword = emailType === EMAIL_TYPE.FORGOT_PASSWORD;

    // create a hased token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (isForgotPassword) {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          forgotPasswordToken: hashedToken,
          forgotPasswordExpiry: Date.now() + 60 * 60 * 1000,
        },
        { new: true, runValidators: true }
      );
    } else {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 60 * 60 * 1000,
        },
        { new: true, runValidators: true }
      );
    }

    const mailerSend = new MailerSend({
      apiKey: process.env.MAILER_API_KEY as string,
    });

    const sentFrom = new Sender(
      `quizzle@${process.env.MAILER_DOMAIN}`,
      process.env.PRODUCT_NAME as string
    );

    const recipients = [new Recipient(email, name)];

    const url = `${domain}/${
      isForgotPassword ? "forgotpassword" : "verifyemail"
    }?token=${hashedToken}`;

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(
        `${process.env.PRODUCT_NAME}: ${isForgotPassword ? "Forgot Password" : " Verify Email"}`
      )
      .setHtml(
        `<p>Click <a href="${url}">HERE</a> to ${
          isForgotPassword ? "reset your password" : "verify your"
        }.</p>`
      );
    // .setText("This is the text content");

    return await mailerSend.email.send(emailParams);
  } catch (err: any) {
    console.log(JSON.stringify(err), "error");
    throw new Error(err.body.message);
  }
};
