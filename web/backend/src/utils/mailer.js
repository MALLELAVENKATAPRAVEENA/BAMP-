const nodemailer = require('nodemailer');
require('dotenv').config();

const mailer = {
  sendOtpEmail: async (emailAddress, otp) => {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || '"BAMP AI System" <noreply@bamp-ai.org>';

    // Check if mailer is configured
    if (!host || !user || !pass) {
      console.log('==================================================');
      console.log(`[MAIL SYSTEM] Attempting automated SMTP dispatch to: ${emailAddress}`);
      try {
        const testAccount = await nodemailer.createTestAccount();
        const testTransporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });

        const htmlContent = `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #0ea5e9;">BAMP AI Verification Code</h2>
            <p>Your 6-digit verification security code for <strong>${emailAddress}</strong> is:</p>
            <h1 style="font-size: 32px; letter-spacing: 5px; color: #0284c7;">${otp}</h1>
            <p style="font-size: 12px; color: #64748b;">This code expires in 10 minutes.</p>
          </div>
        `;

        const info = await testTransporter.sendMail({
          from: '"BAMP AI Security" <noreply@bamp-ai.org>',
          to: emailAddress,
          subject: `[BAMP AI] Security OTP: ${otp}`,
          text: `Your BAMP AI verification OTP is: ${otp}`,
          html: htmlContent
        });

        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log(`[MAIL SYSTEM] Email dispatched to ${emailAddress}`);
        console.log(`[MAIL SYSTEM] Live Inbox Preview URL: ${previewUrl}`);
        console.log('==================================================');
        return true;
      } catch (err) {
        console.warn(`[MAIL SYSTEM] Ethereal fallback bypassed: ${err.message}`);
        console.warn(`[MAIL SYSTEM] Security OTP for ${emailAddress}: ${otp}`);
        console.log('==================================================');
        return false;
      }
    }

    try {
      const transporter = nodemailer.createTransport({
        host,
        port: parseInt(port) || 587,
        secure: parseInt(port) === 465, // true for port 465, false for other ports
        auth: { user, pass }
      });

      // Premium formatted HTML body
      const htmlContent = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 1px solid #edf2f7; padding-bottom: 20px;">
            <h1 style="color: #0c426e; margin: 0; font-size: 24px; font-weight: 700;">BAMP AI EVALUATION PLATFORM</h1>
            <p style="color: #475569; font-size: 13px; margin: 5px 0 0 0;">Secure Identity Verification Portal</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <p style="font-size: 15px; color: #1e293b; line-height: 1.6;">Hello,</p>
            <p style="font-size: 15px; color: #1e293b; line-height: 1.6;">A login or signup request was initiated for your doctor workstation profile. Please enter the following 6-digit verification code to authenticate your identity.</p>
          </div>
          
          <div style="text-align: center; margin: 35px 0; padding: 20px; background-color: #f0f7ff; border: 1px solid #bae2fd; border-radius: 12px;">
            <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; color: #0272c6; letter-spacing: 6px;">${otp}</span>
          </div>
          
          <div style="margin-bottom: 30px; font-size: 12px; color: #64748b; line-height: 1.6;">
            <p style="margin: 0;">* This security code is valid for <strong>10 minutes</strong> and can only be used once.</p>
            <p style="margin: 5px 0 0 0;">* If you did not initiate this request, please change your credentials immediately or contact clinic administration.</p>
          </div>
          
          <div style="border-t: 1px solid #edf2f7; padding-t: 20px; text-align: center; font-size: 11px; color: #94a3b8;">
            <p style="margin: 0;">BAMP AI Treatment Outcomes Evaluation Portal</p>
            <p style="margin: 5px 0 0 0;">Advanced Orthodontic Care & AI Research Center</p>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from,
        to: emailAddress,
        subject: `[BAMP AI] Identity Verification OTP: ${otp}`,
        text: `Your BAMP AI verification OTP is: ${otp}. Valid for 10 minutes.`,
        html: htmlContent
      });

      console.log(`[MAIL SYSTEM] Real OTP email successfully dispatched to: ${emailAddress}`);
      return true;
    } catch (error) {
      console.error('[MAIL SYSTEM] NodeMailer transport error:', error.message);
      return false;
    }
  }
};

module.exports = mailer;
