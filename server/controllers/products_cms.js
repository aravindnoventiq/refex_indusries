const status = require('../helpers/response');
const db = require('../models');

function parseJson(value, fallback) {
  if (!value) return fallback;
  if (Array.isArray(value) || (typeof value === 'object' && value !== null)) return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function mapPage(row) {
  if (!row) return null;
  const data = typeof row.toJSON === 'function' ? row.toJSON() : row;
  return {
    ...data,
    bullets: parseJson(data.bulletsJson, []),
    images: parseJson(data.imagesJson, []),
    packaging: parseJson(data.packagingJson, []),
    properties: parseJson(data.propertiesJson, []),
    related: parseJson(data.relatedJson, []),
  };
}

const PRODUCT_SLUGS = [
  { slug: 'r22', name: 'R22' },
  { slug: 'r32', name: 'R32' },
  { slug: 'r290', name: 'R290' },
  { slug: 'r404a', name: 'R404A' },
  { slug: 'r407c', name: 'R407C' },
  { slug: 'r410a', name: 'R410A' },
  { slug: 'r600a', name: 'R600A' },
  { slug: 'hfc-134a', name: 'HFC 134A' },
  { slug: 'hydrocarbon', name: 'Hydrocarbon' },
  { slug: 'butane', name: 'Butane' },
  { slug: 'copper-tubes', name: 'Copper Tubes' },
];

const getHero = async (req, res) => {
  try {
    const hero = await db.ProductHero.findOne();
    return status.responseStatus(res, 200, 'OK', hero);
  } catch (err) {
    console.error('Get ProductHero error', err);
    return status.responseStatus(res, 500, 'Failed to load product hero');
  }
};

const upsertHero = async (req, res) => {
  try {
    const payload = req.body || {};
    const existing = await db.ProductHero.findOne();
    if (existing) {
      await existing.update(payload);
      return status.responseStatus(res, 200, 'Saved', existing);
    }
    const created = await db.ProductHero.create(payload);
    return status.responseStatus(res, 200, 'Saved', created);
  } catch (err) {
    console.error('Upsert ProductHero error', err);
    return status.responseStatus(res, 500, 'Failed to save product hero');
  }
};

const listPages = async (_req, res) => {
  try {
    const rows = await db.ProductPage.findAll({ order: [['name', 'ASC']] });
    const bySlug = Object.fromEntries(rows.map((row) => [row.slug, mapPage(row)]));
    const data = PRODUCT_SLUGS.map((item) => bySlug[item.slug] || { ...item, isActive: true, bullets: [], images: [], packaging: [], properties: [], related: [] });
    return status.responseStatus(res, 200, 'OK', data);
  } catch (err) {
    console.error('List product pages error', err);
    return status.responseStatus(res, 500, 'Failed to load product pages');
  }
};

const getPage = async (req, res) => {
  try {
    const slug = String(req.params.slug || '').trim();
    const meta = PRODUCT_SLUGS.find((item) => item.slug === slug);
    if (!meta) return status.responseStatus(res, 404, 'Not found');
    const row = await db.ProductPage.findOne({ where: { slug } });
    return status.responseStatus(res, 200, 'OK', mapPage(row) || { ...meta, isActive: true, bullets: [], images: [], packaging: [], properties: [], related: [] });
  } catch (err) {
    console.error('Get product page error', err);
    return status.responseStatus(res, 500, 'Failed to load product page');
  }
};

const upsertPage = async (req, res) => {
  try {
    const slug = String(req.params.slug || req.body.slug || '').trim();
    const meta = PRODUCT_SLUGS.find((item) => item.slug === slug);
    if (!meta) return status.responseStatus(res, 400, 'Invalid product slug');
    const body = req.body || {};
    const payload = {
      slug,
      name: body.name || meta.name,
      bulletsJson: JSON.stringify(body.bullets || parseJson(body.bulletsJson, [])),
      imagesJson: JSON.stringify(body.images || parseJson(body.imagesJson, [])),
      packagingJson: JSON.stringify(body.packaging || parseJson(body.packagingJson, [])),
      propertiesJson: JSON.stringify(body.properties || parseJson(body.propertiesJson, [])),
      propertiesNote: body.propertiesNote || '',
      msdsUrl: body.msdsUrl || '',
      description: body.description || '',
      relatedJson: JSON.stringify(body.related || parseJson(body.relatedJson, [])),
      isActive: body.isActive !== false,
    };
    const existing = await db.ProductPage.findOne({ where: { slug } });
    const saved = existing ? await existing.update(payload) : await db.ProductPage.create(payload);
    return status.responseStatus(res, 200, 'Saved', mapPage(saved));
  } catch (err) {
    console.error('Save product page error', err);
    return status.responseStatus(res, 500, 'Failed to save product page');
  }
};

module.exports = {
  hero: { get: getHero, upsert: upsertHero },
  pages: { list: listPages, get: getPage, upsert: upsertPage },
};
