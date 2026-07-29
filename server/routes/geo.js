const express = require('express');
const { getStatesOfCountry, getCitiesOfState } = require('@countrystatecity/countries');

const router = express.Router();

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
let cachedCities = null;
let cachedAt = 0;

/**
 * GET /api/geo/india-cities
 * Returns { cities: string[] } — each entry is "City, State" (India only).
 * Data from @countrystatecity/countries (ODbL). Cached in memory for 24 hours.
 */
router.get('/india-cities', async (req, res) => {
  try {
    if (cachedCities && Date.now() - cachedAt < CACHE_TTL_MS) {
      return res.json({ cities: cachedCities });
    }

    const states = await getStatesOfCountry('IN');
    const labelArrays = await Promise.all(
      states.map(async (state) => {
        const cities = await getCitiesOfState('IN', state.iso2);
        return cities.map((city) => `${city.name}, ${state.name}`);
      })
    );

    const merged = labelArrays.flat();
    merged.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));

    cachedCities = merged;
    cachedAt = Date.now();

    return res.json({ cities: cachedCities });
  } catch (error) {
    console.error('[geo] india-cities failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load city list',
    });
  }
});

module.exports = router;
