const status = require("../helpers/response");
const { Header } = require("../models");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => status.responseStatus(res, 500, "Internal error", { error: e.message }));
}

module.exports = {
  get: asyncHandler(async (req, res) => {
    const header = await Header.findOne({ order: [["id", "DESC"]] });
    return status.responseStatus(res, 200, "OK", header);
  }),
  upsert: asyncHandler(async (req, res) => {
    const payload = {
      logoUrl: req.body.logoUrl || "",
      logoAlt: req.body.logoAlt || null,
      showStockInfo: req.body.showStockInfo !== undefined ? !!req.body.showStockInfo : true,
      bsePrice: req.body.bsePrice || null,
      bseChange: req.body.bseChange || null,
      bseChangeIndicator: req.body.bseChangeIndicator || "down",
      nsePrice: req.body.nsePrice || null,
      nseChange: req.body.nseChange || null,
      nseChangeIndicator: req.body.nseChangeIndicator || "down",
      navigationItems: Array.isArray(req.body.navigationItems) ? req.body.navigationItems : [],
      contactButtonText: req.body.contactButtonText || "Contact Us",
      contactButtonHref: req.body.contactButtonHref || "/contact/",
      isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
    };
    const existing = await Header.findOne({ order: [["id", "DESC"]] });
    let saved;
    if (existing) {
      await existing.update(payload);
      saved = existing;
    } else {
      saved = await Header.create(payload);
    }
    return status.responseStatus(res, 200, "Saved", saved);
  }),
};

