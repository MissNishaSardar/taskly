type SendEmailParams = {
  to: string;
  subject: string;
  text: string;
};

const sendEmail = async ({ to, subject, text }: SendEmailParams) => {
  console.log("--- Email ---");
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body:\n${text}`);
  console.log("--- End Email ---");
};

export { sendEmail };
