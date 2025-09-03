import { NonRetriableError } from "inngest";
import { inngest } from "../client.inngest.js";

import User from "../../models/user.model.js";
import { sendMail } from "../../utils/nodemailer.js";

export const onUserSignup = inngest.createFunction(
    { id: "on-user-signup", retries: 2 },
    { event: "user/signup" },
    async ({ event, step }) => {
        try {
            const { email } = event.data;
            const user =await step.run("get-user-email", async () => {
                const userObject = await User.findOne({ email });
                if (!userObject) {
                    throw new NonRetriableError("User not found in database");
                }
                return userObject;
            });

            await step.run("send-welcome-email", async () => {
                const subject = `Welcome to App!`;
                const message = `Hi , 
                \n\n
                Thanks for signing up to App! We're excited to have you on board.`
                await sendMail(user.email, subject, message);
            });

            return { success: true };
        } catch (error) {
            console.error(`❌ Error while running step: ${error.message}`);
            return { success: false };
        }
    }
);