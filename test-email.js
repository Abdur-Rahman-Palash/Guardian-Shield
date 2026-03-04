import { Resend } from 'resend';

const resend = new Resend('re_iRUpnVwH_3LubFEZMNLUySxbHJFbF6zrM');

async function testEmail() {
  try {
    console.log('Sending test email...');
    
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'abdurrahmanpalashbd@gmail.com',
      subject: '🛡️ Guardian Shield - Test Email',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Guardian Shield Test</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px; text-align: center; }
            .content { padding: 20px; background: #f9f9f; border-radius: 8px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛡️ Guardian Shield</h1>
              <p>Email Service Test</p>
            </div>
            <div class="content">
              <h2>✅ Success!</h2>
              <p>Your Resend integration is working correctly.</p>
              <p>This is a test email to verify that the email service is functioning properly.</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <div class="footer">
              <p>Guardian Shield - Protecting Families Online</p>
              <p><em>This is an automated test email</em></p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Error sending email:', error);
      return;
    }

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', data.id);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testEmail();
