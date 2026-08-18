const status = require("../helpers/response");
const { LegalPage } = require("../models");

function asyncHandler(fn) {
  return (req, res) =>
    fn(req, res).catch((e) =>
      status.responseStatus(res, 500, "Internal error", { error: e.message }),
    );
}

const DEFAULTS = {
  "privacy-policy": {
    slug: "privacy-policy",
    title: "Privacy Policy",
    heroTitle: "Privacy Policy",
    contentHtml: "",
    isActive: true,
  },
  "terms-of-use": {
    slug: "terms-of-use",
    title: "Terms of Use",
    heroTitle: "Terms of Use",
    contentHtml: "",
    isActive: true,
  },
};

module.exports = {
  list: asyncHandler(async (_req, res) => {
    const rows = await LegalPage.findAll({ order: [["slug", "ASC"]] });
    const bySlug = Object.fromEntries(rows.map((row) => [row.slug, row.toJSON()]));
    const data = Object.keys(DEFAULTS).map((slug) => bySlug[slug] || DEFAULTS[slug]);
    return status.responseStatus(res, 200, "OK", data);
  }),
  getBySlug: asyncHandler(async (req, res) => {
    const slug = String(req.params.slug || "").trim();
    if (!DEFAULTS[slug]) return status.responseStatus(res, 404, "Not found");
    const row = await LegalPage.findOne({ where: { slug } });
    return status.responseStatus(res, 200, "OK", row ? row.toJSON() : DEFAULTS[slug]);
  }),
  upsert: asyncHandler(async (req, res) => {
    const slug = String(req.params.slug || req.body.slug || "").trim();
    if (!DEFAULTS[slug]) return status.responseStatus(res, 400, "Invalid legal page slug");
    const payload = {
      slug,
      title: req.body.title || DEFAULTS[slug].title,
      heroTitle: req.body.heroTitle || DEFAULTS[slug].heroTitle,
      contentHtml: req.body.contentHtml || "",
      isActive: req.body.isActive !== false,
    };
    const existing = await LegalPage.findOne({ where: { slug } });
    const saved = existing ? await existing.update(payload) : await LegalPage.create(payload);
    return status.responseStatus(res, 200, "Saved", saved);
  }),
};
