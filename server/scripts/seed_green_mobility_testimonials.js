const { GreenMobilityTestimonial } = require("../models");
const testimonialsData = require("../seeds/green_mobility_testimonials.json");

async function seedTestimonials() {
  try {
    console.log("Starting to seed green mobility testimonials...");

    for (const testimonialData of testimonialsData) {
      const [testimonial, created] = await GreenMobilityTestimonial.findOrCreate({
        where: { 
          name: testimonialData.name,
          text: testimonialData.text.substring(0, 100) // Use first 100 chars as unique identifier
        },
        defaults: testimonialData,
      });

      if (!created) {
        await testimonial.update(testimonialData);
      }

      console.log(`✓ ${testimonial.name} - ${testimonial.text.substring(0, 50)}...`);
    }

    console.log("✓ Green mobility testimonials seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding testimonials:", error);
    process.exit(1);
  }
}

seedTestimonials();

