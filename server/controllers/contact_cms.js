const status = require("../helpers/response");
const { ContactHero, OfficeAddress, ContactForm } = require("../models");

const DEFAULT_REFEX_TOWERS_MAP_EMBED_URL =
  "https://maps.google.com/maps?q=Refex+Towers,+313+Sterling+Road,+Nungambakkam,+Chennai,+Tamil+Nadu+600034&hl=en&z=17&output=embed";

function normalizeMapEmbedUrl(url) {
  const trimmed = (url || "").trim();
  if (!trimmed || !/^https?:\/\/.+(maps|google\.com)/i.test(trimmed)) {
    return DEFAULT_REFEX_TOWERS_MAP_EMBED_URL;
  }
  return trimmed.replace(/&amp;/g, "&");
}

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => status.responseStatus(res, 500, "Internal error", { error: e.message }));
}

function buildCrud(Model, mapIn, mapOut) {
  return {
    list: asyncHandler(async (req, res) => {
      const rows = await Model.findAll({ order: [["isTopOffice", "DESC"], ["order", "ASC"]] });
      return status.responseStatus(res, 200, "OK", rows.map((r) => (mapOut ? mapOut(r.toJSON()) : r)));
    }),
    create: asyncHandler(async (req, res) => {
      const row = await Model.create(mapIn ? mapIn(req.body || {}) : req.body || {});
      return status.responseStatus(res, 201, "Created", mapOut ? mapOut(row.toJSON()) : row);
    }),
    update: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const row = await Model.findByPk(id);
      if (!row) return status.responseStatus(res, 404, "Not found");
      await row.update(mapIn ? mapIn(req.body || {}) : req.body || {});
      return status.responseStatus(res, 200, "Updated", mapOut ? mapOut(row.toJSON()) : row);
    }),
    remove: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const row = await Model.findByPk(id);
      if (!row) return status.responseStatus(res, 404, "Not found");
      await row.destroy();
      return status.responseStatus(res, 200, "Deleted");
    }),
  };
}

module.exports = {
  hero: {
    get: asyncHandler(async (req, res) => {
      const hero = await ContactHero.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", hero);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "",
        description: req.body.description || null,
        backgroundImage: req.body.backgroundImage || null,
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await ContactHero.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await ContactHero.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  officeAddresses: buildCrud(
    OfficeAddress,
    (b) => ({
      title: b.title || "",
      details: Array.isArray(b.details) ? b.details : [],
      image: b.image || null,
      isTopOffice: b.isTopOffice === true,
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
  form: {
    get: asyncHandler(async (req, res) => {
      const form = await ContactForm.findOne({ order: [["id", "DESC"]] });
      if (!form) return status.responseStatus(res, 200, "OK", null);
      const json = form.toJSON();
      json.mapEmbedUrl = normalizeMapEmbedUrl(json.mapEmbedUrl);
      return status.responseStatus(res, 200, "OK", json);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "",
        subtitle: req.body.subtitle || null,
        mapEmbedUrl: normalizeMapEmbedUrl(req.body.mapEmbedUrl),
        formEndpointUrl: req.body.formEndpointUrl || "",
        successMessage: req.body.successMessage || null,
        errorMessage: req.body.errorMessage || null,
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await ContactForm.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await ContactForm.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
};

