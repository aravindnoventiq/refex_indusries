const status = require("../helpers/response");
const { CareersPage } = require("../models");

function asyncHandler(fn) {
  return (req, res) =>
    fn(req, res).catch((e) =>
      status.responseStatus(res, 500, "Internal error", { error: e.message }),
    );
}

function parseJson(value, fallback) {
  if (!value) return fallback;
  if (Array.isArray(value) || typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function mapOut(row) {
  if (!row) return null;
  const data = typeof row.toJSON === "function" ? row.toJSON() : row;
  return {
    ...data,
    whyCards: parseJson(data.whyCardsJson, []),
    whyValues: parseJson(data.whyValuesJson, []),
  };
}

const DEFAULTS = {
  heroEyebrow: "Careers",
  heroTitle: "Ready to Make Your Mark?",
  heroSubtitle:
    "Build a meaningful career with a purpose-driven organization shaping a cleaner, greener tomorrow across India.",
  heroBackground: "/careers/hero-bg.png",
  heroCtaText: "Join Our Talent Community",
  lifeEyebrow: "Our Culture",
  lifeTitle: "Life as A #Refexian",
  lifeSubtitle: "Diverse Perspectives. Shared Purpose. Limitless Possibilities.",
  lifeImage: "/careers/life-as-refexian-gallery.png",
  whyTitle: "Why Choose Refex",
  whySubtitle:
    "Discover a workplace where purpose, growth, and innovation come together to build a cleaner, stronger, and more sustainable future.",
  whyBackground: "/careers/why-choose-refex-bg.png",
  talentEyebrow: "Join Our Talent Network",
  talentTitle: "Stay connected with opportunities.",
  talentBackground: "/careers/hero-bg.png",
  formTitle: "Share Your Information",
  formSubtitle: "Help us get to know you better.",
  isActive: true,
};

module.exports = {
  get: asyncHandler(async (_req, res) => {
    const row = await CareersPage.findOne({ order: [["id", "DESC"]] });
    return status.responseStatus(res, 200, "OK", mapOut(row) || DEFAULTS);
  }),
  upsert: asyncHandler(async (req, res) => {
    const body = req.body || {};
    const payload = {
      heroEyebrow: body.heroEyebrow || "",
      heroTitle: body.heroTitle || DEFAULTS.heroTitle,
      heroSubtitle: body.heroSubtitle || "",
      heroBackground: body.heroBackground || "",
      heroCtaText: body.heroCtaText || "",
      lifeEyebrow: body.lifeEyebrow || "",
      lifeTitle: body.lifeTitle || "",
      lifeSubtitle: body.lifeSubtitle || "",
      lifeImage: body.lifeImage || "",
      whyTitle: body.whyTitle || "",
      whySubtitle: body.whySubtitle || "",
      whyBackground: body.whyBackground || "",
      whyCardsJson: JSON.stringify(body.whyCards || parseJson(body.whyCardsJson, [])),
      whyValuesJson: JSON.stringify(body.whyValues || parseJson(body.whyValuesJson, [])),
      talentEyebrow: body.talentEyebrow || "",
      talentTitle: body.talentTitle || "",
      talentBackground: body.talentBackground || "",
      formTitle: body.formTitle || "",
      formSubtitle: body.formSubtitle || "",
      isActive: body.isActive !== false,
    };

    const existing = await CareersPage.findOne({ order: [["id", "DESC"]] });
    const saved = existing ? await existing.update(payload) : await CareersPage.create(payload);
    return status.responseStatus(res, 200, "Saved", mapOut(saved));
  }),
};
