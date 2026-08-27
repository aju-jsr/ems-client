// import useEmail from "../hooks/email/useEmail";
import { postEmail } from "../services/email/email_Service";
export async function emailSend (eventType, to, subject, proposalTitle, requestNo, requestorName, cc, comments) {

    const emailJson = {
        eventType,
        // to  // uncomment this line in Live
        to: "sd1.aju@arkajainuniversity.ac.in",
        subject,
        proposalTitle,
        requestNo,
        requestorName,
        // cc,  // uncomment this line in Live
        cc: [
            "rajnishkumarjsr@gmail.com",
        ],
        comments,
      };

    const responseEmail = await postEmail(emailJson);
    return responseEmail;
};