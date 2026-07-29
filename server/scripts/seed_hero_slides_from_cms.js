/**
 * Seed Hero Slides from CMS Data
 * Run this with: node server/scripts/seed_hero_slides_from_cms.js
 */

require("dotenv").config();
const { HeroSlide } = require("../models");

const slides = [
  {
    title: 'Ash Utilization And Coal Handling',
    image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/0c27f725583f8aa18523ff9ba98c7283.png',
    order: 1,
    isActive: true
  },
  {
    title: 'Green Mobility',
    image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/5e71896259f48aee41bb484bef88a501.png',
    order: 2,
    isActive: true
  },
  {
    title: 'Venwind Refex',
    image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/d1f932b601a9dab855d409f970966b38.png',
    order: 3,
    isActive: true
  },
  {
    title: 'Refrigerant Gas',
    image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/09e6f2b1e185a6c3f96a07b03bf381bc.png',
    order: 4,
    isActive: true
  }
];

async function seedHeroSlides() {
  try {
    console.log('🌱 Starting to seed hero slides...\n');

    for (const slideData of slides) {
      // Check if slide already exists
      const existing = await HeroSlide.findOne({ 
        where: { title: slideData.title } 
      });

      if (existing) {
        console.log(`⏭️  Slide already exists: ${slideData.title}`);
        continue;
      }

      // Create new slide
      const slide = await HeroSlide.create(slideData);
      console.log(`✅ Created slide: ${slideData.title} (ID: ${slide.id})`);
    }

    console.log('\n✨ Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding hero slides:', error);
    process.exit(1);
  }
}

// Run the seed function
seedHeroSlides();

