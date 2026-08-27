// import useEmail from "../hooks/email/useEmail";
import { postEmail } from "../services/email/email_Service";
export async function emailSend (to, subject, proposalTitle, requestNo, requestorName, cc) {

    const emailJson = {
        // to  // uncomment this line in Live
        to: "sd1.aju@arkajainuniversity.ac.in",
        subject,
        proposalTitle,
        requestNo,
        requestorName,
        // cc,  // uncomment this line in Live
        cc: "rajnishkumarjsr@gmail.com",
      };

    const responseEmail = await postEmail(emailJson);
    return responseEmail;
};