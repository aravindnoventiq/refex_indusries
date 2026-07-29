const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const emailService = require('../services/email_service');
const { getRequestMeta, phoneToDigitsOnly } = require('../helpers/requestMeta');
const { sendToKissflowWebhook } = require('../helpers/kissflowWebhook');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error('Resume must be PDF, DOC, or DOCX'));
  },
});

router.post(
  '/talent-network',
  upload.single('resume'),
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('Please provide a valid phone number')
      .custom((value) => {
        const digits = String(value || '').replace(/\D/g, '');
        return digits.length >= 10 && digits.length <= 15;
      })
      .withMessage('Please provide a valid phone number'),
    body('experience')
      .trim()
      .isIn(['Less than 1 year', '1-3 years', '3-5 years', '5-10 years', '10+ years'])
      .withMessage('Invalid experience selection'),
    body('location')
      .trim()
      .isLength({ min: 2, max: 200 })
      .withMessage('Location is required'),
    body('linkedin')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 300 })
      .withMessage('LinkedIn URL is too long'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { name, email, phone, experience, location, linkedin } = req.body;
      const meta = getRequestMeta(req);
      const phoneDigits = phoneToDigitsOnly(phone);
      const websiteName = 'Refex Industries Limited';

      const payload = {
        name: String(name).trim(),
        email,
        phone: phoneDigits,
        experience: String(experience).trim(),
        location: String(location).trim(),
        linkedin: String(linkedin || '').trim(),
        ...meta,
      };

      sendToKissflowWebhook(websiteName, 'Careers talent network', payload);

      let emailResult = null;
      try {
        emailResult = await emailService.sendCareersTalentEmail(payload, req.file || null);
      } catch (emailError) {
        console.error('Careers email failed:', emailError.message);
      }

      return res.status(200).json({
        success: true,
        message:
          'Thank you for joining our talent community. We will reach out when a suitable opportunity opens up.',
        data: {
          messageId: emailResult?.messageId || null,
          timestamp: meta.timestamp,
        },
      });
    } catch (error) {
      console.error('Careers talent network submission error:', error);
      return res.status(500).json({
        success: false,
        message: 'Sorry, there was an error submitting your profile. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  },
);

module.exports = router;
