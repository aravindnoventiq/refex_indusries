const { ContactForm } = require("../models");
const contactFormData = require("../seeds/contact_form.json");

async function seedContactForm() {
  try {
    console.log("Starting to seed Contact Form...");

    for (const data of contactFormData) {
      const [form, created] = await ContactForm.upsert(data, {
        returning: true,
      });
      if (created) {
        console.log(`✓ Contact Form seeded: ${form.title}`);
      } else {
        console.log(`✓ Contact Form updated: ${form.title}`);
      }
    }

    console.log("✓ Contact Form seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Contact Form:", error);
    process.exit(1);
  }
}

seedContactForm();

