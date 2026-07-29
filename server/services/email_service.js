const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    const smtpHost = process.env.SMTP_HOST || 'smtp.zoho.in';
    const smtpPort = Number(process.env.SMTP_PORT || 465);
    const smtpSecure =
      process.env.SMTP_SECURE !== undefined
        ? String(process.env.SMTP_SECURE).toLowerCase() === 'true'
        : smtpPort === 465; // SSL/TLS for 465
    const smtpUser = process.env.SMTP_USER || 'tech@helpdesksupport.co.in';
    const smtpPass = (process.env.SMTP_PASS || '').trim();

    // Create transporter using SMTP configuration
    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure, // Zoho recommended: true for 465
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    this.fromAddress = process.env.SMTP_FROM || smtpUser;
    console.log(`[EmailService] SMTP configured host=${smtpHost} port=${smtpPort} secure=${smtpSecure} user=${smtpUser}`);
  }

  // Send contact form email
  async sendContactFormEmail(formData) {
    try {
      const { name, email, phone, city, companyName, productServices, company, message, recaptchaToken } = formData;

      // Email content
      const mailOptions = {
        from: `Contact Form <${this.fromAddress}>`,
        to: 'info@refex.co.in',
        subject: 'Contact Form',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Phone: ${phone || 'Not provided'}</p>
            <p>City: ${city || 'Not provided'}</p>
            <p>Company Name: ${companyName || 'Not provided'}</p>
            <p>Product/Services: ${productServices || 'Not provided'}</p>
            <p>Sales/Support: ${company || 'Not specified'}</p>
            <p>Message: ${message}</p>
            <br>
            <p>This is a notification that a contact form was submitted on your website (${process.env.SITE_TITLE || 'Refex Industries'} ${process.env.SITE_URL || 'https://refex.co.in'}).</p>
          </div>
        `,
        text: `
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
City: ${city || 'Not provided'}
Company Name: ${companyName || 'Not provided'}
Product/Services: ${productServices || 'Not provided'}
Sales/Support: ${company || 'Not specified'}
Message: ${message}

This is a notification that a contact form was submitted on your website (${process.env.SITE_TITLE || 'Refex Industries'} ${process.env.SITE_URL || 'https://refex.co.in'}).
        `
      };

      // Send email
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      
      return {
        success: true,
        messageId: result.messageId,
        message: 'Email sent successfully'
      };

    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  // Send auto-reply to customer
  async sendAutoReply(customerEmail, customerName, options = {}) {
    try {
      const city = typeof options === 'object' && options !== null && 'city' in options
        ? String(options.city || '').trim()
        : '';

      const mailOptions = {
        from: `Contact Form <${this.fromAddress}>`,
        to: customerEmail,
        subject: 'Thank you for contacting Refex Industries Lt',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #2879b6, #7dc244); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h2 style="margin: 0; font-size: 28px;">Thank You!</h2>
              <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">We've received your message</p>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9;">
              <div style="background: white; padding: 25px; border-radius: 8px;">
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                  Dear ${customerName},
                </p>
                
                <p style="color: #666; font-size: 15px; line-height: 1.6;">
                  Thank you for reaching out to Refex Industries Ltd. We have received your inquiry, and our team will review it carefully.
                </p>
                ${city ? `<p style="color: #666; font-size: 15px; line-height: 1.6;"><strong>City:</strong> ${city}</p>` : ''}
                
                <p style="color: #666; font-size: 15px; line-height: 1.6;">
                  We typically respond to all inquiries within 24 hours during business days. If your inquiry is urgent, please call us directly at <strong>+91-44-43405900</strong>.
                </p>
                
                <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2879b6;">
                  <h4 style="color: #2879b6; margin-top: 0;">What happens next?</h4>
                  <ul style="color: #666; padding-left: 20px;">
                    <li>Our team will review your inquiry</li>
                    <li>We'll assign it to the appropriate department</li>
                    <li>You'll receive a detailed response within 24 hours</li>
                    <li>If needed, we'll schedule a follow-up call</li>
                  </ul>
                </div>
                
                <p style="color: #666; font-size: 15px; line-height: 1.6;">
                  In the meantime, we invite you to explore our website to learn more about our diversified businesses, including Ash Utilization, Green Mobility, Refrigerants, and Wind Energy solutions.
                </p>
                
                <p style="color: #333; font-size: 15px; line-height: 1.6;">
                  Best regards,<br>
                  <strong>The Refex Industries Ltd Team</strong>
                </p>
              </div>
            </div>
            
            <div style="text-align: center; padding: 20px; background: #f0f0f0; border-radius: 0 0 10px 10px;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                Refex Industries Ltd | Driving Sustainable Industrial Solutions
              </p>
              <p style="margin: 5px 0 0 0; color: #999; font-size: 12px;">
                2nd Floor, No.313, Refex Towers, Sterling Road, Valluvar Kottam High Road,<br>
                Nungambakkam, Chennai – 600034, Tamil Nadu, India
              </p>
            </div>
          </div>
        `,
        text: `
Dear ${customerName},

Thank you for reaching out to Refex Industries Ltd. We have received your inquiry, and our team will review it carefully.
${city ? `\nCity: ${city}\n` : ''}

We typically respond to all inquiries within 24 hours during business days. If your inquiry is urgent, please call us directly at +91-44-43405900.

Best regards,
The Refex Industries Ltd Team
        `.trim()
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Auto-reply sent successfully:', result.messageId);
      
      return {
        success: true,
        messageId: result.messageId,
        message: 'Auto-reply sent successfully'
      };

    } catch (error) {
      console.error('Error sending auto-reply:', error);
      throw new Error(`Failed to send auto-reply: ${error.message}`);
    }
  }

  async sendCareersTalentEmail(formData, resumeFile = null) {
    try {
      const { name, email, phone, experience, location, linkedin } = formData;

      const mailOptions = {
        from: `Careers Form <${this.fromAddress}>`,
        to: 'info@refex.co.in',
        subject: 'Careers — Talent Network Submission',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2d5016;">New Talent Network Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Experience:</strong> ${experience || 'Not provided'}</p>
            <p><strong>Location:</strong> ${location || 'Not provided'}</p>
            <p><strong>LinkedIn:</strong> ${linkedin || 'Not provided'}</p>
            <p><strong>Resume attached:</strong> ${resumeFile ? 'Yes' : 'No'}</p>
          </div>
        `,
        text: `
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Experience: ${experience || 'Not provided'}
Location: ${location || 'Not provided'}
LinkedIn: ${linkedin || 'Not provided'}
Resume attached: ${resumeFile ? 'Yes' : 'No'}
        `.trim(),
      };

      if (resumeFile?.buffer) {
        mailOptions.attachments = [
          {
            filename: resumeFile.originalname || 'resume',
            content: resumeFile.buffer,
            contentType: resumeFile.mimetype,
          },
        ];
      }

      const result = await this.transporter.sendMail(mailOptions);
      return {
        success: true,
        messageId: result.messageId,
        message: 'Email sent successfully',
      };
    } catch (error) {
      console.error('Error sending careers email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  // Test email configuration
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('Email service connection verified successfully');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

module.exports = new EmailService();
