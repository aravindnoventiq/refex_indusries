const axios = require("axios");

const KISSFLOW_WEBHOOK_URL =
  "https://refexgroup.kissflow.com/integration/2/AcCMptlq60zH/webhook/F51DqkQt8HoYqlSALpUWU8-uPOXxdSINKjZmtzXphM6Ujk-hJLw6lgZBW8NrIyyvXSmmZS9MwwaWdTmahBLNxQ";

const queue = [];
let isProcessing = false;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toWebsiteSlug(websiteName) {
  return String(websiteName || "website")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "website";
}

function generateSubmissionId(websiteName) {
  const websiteSlug = toWebsiteSlug(websiteName);
  const randomString = Math.random().toString(36).slice(2, 10);
  return `${websiteSlug}-${Date.now()}-${randomString}`;
}

async function processQueue() {
  if (isProcessing) return;
  isProcessing = true;

  while (queue.length > 0) {
    const { websiteName, formName, formData } = queue.shift();
    const submissionId = generateSubmissionId(websiteName);
    const websiteAndForm = `${websiteName} - ${formName}`;

    const payload = {
      ...(formData || {}),
      submissionId,
      websiteName,
      formName,
      "Website and form": websiteAndForm,
      Website_and_form: websiteAndForm,
    };

    try {
      await axios.post(KISSFLOW_WEBHOOK_URL, payload, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        timeout: 15000,
      });
      console.log(`[Kissflow] Submission sent: ${submissionId}`);
    } catch (error) {
      console.error(
        `[Kissflow] Submission failed: ${submissionId}`,
        error?.response?.data || error.message
      );
    }

    // Keep sequential pacing between webhook requests.
    await sleep(3500);
  }

  isProcessing = false;
}

function sendToKissflowWebhook(websiteName, formName, formData) {
  queue.push({ websiteName, formName, formData });
  processQueue().catch((error) => {
    // Never throw to callers; this integration must stay non-blocking.
    console.error("[Kissflow] Queue processor error:", error.message);
  });
}

module.exports = {
  sendToKissflowWebhook,
};

