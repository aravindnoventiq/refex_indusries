const status = require("../helpers/response");
const { ReadyMixPage } = require("../models");

function asyncHandler(fn) {
  return (req, res) =>
    fn(req, res).catch((e) =>
      status.responseStatus(res, 500, "Internal error", { error: e.message }),
    );
}

function parseContent(value) {
  if (!value) return null;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

module.exports = {
  get: asyncHandler(async (_req, res) => {
    const row = await ReadyMixPage.findOne({ order: [["id", "DESC"]] });
    if (!row || row.isActive === false) {
      return status.responseStatus(res, 200, "OK", null);
    }
    return status.responseStatus(res, 200, "OK", parseContent(row.contentJson));
  }),
  upsert: asyncHandler(async (req, res) => {
    const content = parseContent(req.body?.content) || parseContent(req.body);
    if (!content || typeof content !== "object") {
      return status.responseStatus(res, 400, "Content is required");
    }
    const payload = {
      contentJson: JSON.stringify(content),
      isActive: req.body?.isActive !== false,
    };
    const existing = await ReadyMixPage.findOne({ order: [["id", "DESC"]] });
    const saved = existing ? await existing.update(payload) : await ReadyMixPage.create(payload);
    return status.responseStatus(res, 200, "Saved", parseContent(saved.contentJson));
  }),
};
