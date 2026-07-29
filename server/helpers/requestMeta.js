function parseUserAgent(ua = "") {
  const source = String(ua || "");
  const lower = source.toLowerCase();

  let deviceType = "Desktop";
  if (/mobile|iphone|ipod|android/.test(lower)) deviceType = "Mobile";
  if (/ipad|tablet/.test(lower)) deviceType = "Tablet";

  let browser = "Unknown";
  if (lower.includes("edg/")) browser = "Edge";
  else if (lower.includes("opr/") || lower.includes("opera")) browser = "Opera";
  else if (lower.includes("chrome/")) browser = "Chrome";
  else if (lower.includes("safari/") && !lower.includes("chrome/")) browser = "Safari";
  else if (lower.includes("firefox/")) browser = "Firefox";
  else if (lower.includes("msie") || lower.includes("trident/")) browser = "Internet Explorer";

  return { deviceType, browser };
}

function phoneToDigitsOnly(phone) {
  return String(phone || "").replace(/\D/g, "");
}

function getRequestMeta(req) {
  const now = new Date();
  const timestamp = now.toISOString();
  const date = timestamp.slice(0, 10);
  const time = timestamp.slice(11, 19);
  const userAgent = req.headers["user-agent"] || "";
  const parsedUA = parseUserAgent(userAgent);
  const ipAddress =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.ip ||
    req.connection?.remoteAddress ||
    "Unknown";

  return {
    timestamp,
    dateTime: timestamp,
    date,
    time,
    ipAddress,
    userAgent,
    deviceType: parsedUA.deviceType,
    browser: parsedUA.browser,
    countryCode: req.headers["cf-ipcountry"] || req.headers["x-country-code"] || "Unknown",
    referer: req.headers.referer || req.headers.referrer || "",
    source: "website",
  };
}

module.exports = {
  getRequestMeta,
  phoneToDigitsOnly,
  parseUserAgent,
};

