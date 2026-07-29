const status = require("../helpers/response");
const { GreenMobilityHero, GreenMobilityWhoWeAre, GreenMobilityBrandValue, GreenMobilityWhyChooseUs, GreenMobilityService, GreenMobilityImpact, GreenMobilityOurService, GreenMobilityClient, GreenMobilitySustainability, GreenMobilityTestimonial } = require("../models");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => status.responseStatus(res, 500, "Internal error", { error: e.message }));
}

function buildCrud(Model, mapIn, mapOut) {
  return {
    list: asyncHandler(async (req, res) => {
      const rows = await Model.findAll({ order: [["order", "ASC"]] });
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
      const hero = await GreenMobilityHero.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", hero);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "",
        subtitle: req.body.subtitle || null,
        slides: Array.isArray(req.body.slides) ? req.body.slides : (req.body.slides ? (() => { try { return JSON.parse(req.body.slides); } catch { return []; } })() : []),
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await GreenMobilityHero.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await GreenMobilityHero.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  whoWeAre: {
    get: asyncHandler(async (req, res) => {
      const section = await GreenMobilityWhoWeAre.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", section);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "",
        content: req.body.content || "",
        slides: Array.isArray(req.body.slides) ? req.body.slides : (req.body.slides ? (() => { try { return JSON.parse(req.body.slides); } catch { return []; } })() : []),
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await GreenMobilityWhoWeAre.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await GreenMobilityWhoWeAre.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  brandValues: buildCrud(
    GreenMobilityBrandValue,
    (b) => ({
      title: b.title || "",
      icon: b.icon || null,
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
  whyChooseUs: buildCrud(
    GreenMobilityWhyChooseUs,
    (b) => ({
      title: b.title || "",
      icon: b.icon || null,
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
  services: buildCrud(
    GreenMobilityService,
    (b) => ({
      title: b.title || "",
      image: b.image || null,
      imagePosition: b.imagePosition === 'right' ? 'right' : 'left',
      subtitle: b.subtitle || null,
      pointsJson: Array.isArray(b.pointsJson) ? b.pointsJson : (b.pointsJson ? (() => { try { return JSON.parse(b.pointsJson); } catch { return []; } })() : []),
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
  impacts: buildCrud(
    GreenMobilityImpact,
    (b) => ({
      number: b.number || "",
      label: b.label || "",
      icon: b.icon || null,
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
  ourServices: buildCrud(
    GreenMobilityOurService,
    (b) => ({
      title: b.title || "",
      image: b.image || null,
      description: b.description || null,
      additionalText: b.additionalText || null,
      featuresJson: Array.isArray(b.featuresJson) ? b.featuresJson : (b.featuresJson ? (() => { try { return JSON.parse(b.featuresJson); } catch { return null; } })() : null),
      rideTypesJson: Array.isArray(b.rideTypesJson) ? b.rideTypesJson : (b.rideTypesJson ? (() => { try { return JSON.parse(b.rideTypesJson); } catch { return null; } })() : null),
      citiesJson: Array.isArray(b.citiesJson) ? b.citiesJson : (b.citiesJson ? (() => { try { return JSON.parse(b.citiesJson); } catch { return null; } })() : null),
      buttonsJson: Array.isArray(b.buttonsJson) ? b.buttonsJson : (b.buttonsJson ? (() => { try { return JSON.parse(b.buttonsJson); } catch { return null; } })() : null),
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
  clients: buildCrud(
    GreenMobilityClient,
    (b) => ({
      image: b.image || "",
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
  sustainability: {
    get: asyncHandler(async (req, res) => {
      const section = await GreenMobilitySustainability.findOne({ order: [["id", "DESC"]] });
      return status.responseStatus(res, 200, "OK", section);
    }),
    upsert: asyncHandler(async (req, res) => {
      const payload = {
        title: req.body.title || "",
        description: req.body.description || null,
        additionalText: req.body.additionalText || null,
        backgroundImage: req.body.backgroundImage || null,
        buttonText: req.body.buttonText || null,
        buttonLink: req.body.buttonLink || null,
        isActive: req.body.isActive !== undefined ? !!req.body.isActive : true,
      };
      const existing = await GreenMobilitySustainability.findOne({ order: [["id", "DESC"]] });
      let saved;
      if (existing) {
        await existing.update(payload);
        saved = existing;
      } else {
        saved = await GreenMobilitySustainability.create(payload);
      }
      return status.responseStatus(res, 200, "Saved", saved);
    }),
  },
  testimonials: buildCrud(
    GreenMobilityTestimonial,
    (b) => ({
      text: b.text || "",
      name: b.name || "",
      title: b.title || null,
      image: b.image || null,
      order: b.order || 0,
      isActive: b.isActive !== false,
    }),
    undefined
  ),
};

